/**
 * Copyright 2019 Huawei Technologies Co.,Ltd.
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use
 * this file except in compliance with the License.  You may obtain a copy of the
 * License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed
 * under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR
 * CONDITIONS OF ANY KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations under the License.
 *
 */
(function (root, factory) {
  'use strict';
  if(typeof define === 'function' && define.amd){
	  define('posix', [], factory);
  }else{
	  root['posix'] = factory();
  }
})(this ? this : window, function(){
	'use strict';
	
	var wrapCallback = function(callback, log, methodName){
		callback = callback || function(){};
		var start = new Date().getTime();
		return function(err, result){
			log.runLog('info', methodName, 'ObsClient cost ' +  (new Date().getTime() - start) + ' ms');
			if(Object.prototype.toString.call(err) === '[object String]'){
				return callback(new Error(err), result);
			}
			
			return callback(err, result);
		};
	};
	
	
	var wrapEventCallback = function(eventCallback){
		eventCallback = eventCallback || function(){};
		return function(t, key, result){
			if(Object.prototype.toString.call(result) === '[object Error]'){
				return eventCallback(t, key, result);
			}
			
			if(Object.prototype.toString.call(result) === '[object String]'){
				return eventCallback(t, key, new Error(result));
			}
			
			if(!result){
				return;
			}
			
			if(result.CommonMsg.Status > 300){
				return eventCallback(t, key, new Error('status:' + result.CommonMsg.Status + ', code:' + result.CommonMsg.Code + ', message:' + result.CommonMsg.Message));
			}
			
			eventCallback(t, key, result);
		};
	};
	
	var checkPrefix = function(prefix){
		if(Object.prototype.toString.call(prefix) === '[object String]' && prefix.lastIndexOf('/') !== prefix.length - 1){
			prefix += '/';
		}
		return prefix;
	};
	
	var posix = {};
	posix.extend = function(ObsClient){
		ObsClient.prototype.dropFile = function(param, callback){
			this.deleteObject(param, callback);
		};
		
		ObsClient.prototype.dropFolder = function(param, callback){
			var that = this;
			param = param || {};
			var _callback = wrapCallback(callback, that.log, 'dropFolder');
			var eventCallback = wrapEventCallback(param.EventCallback);
			var taskNum = param.TaskNum || 1;
			var runningTask = 0;
			var taskQueue = [];
			
			var doNext = function(){
				while(runningTask < taskNum && taskQueue.length > 0){
					taskQueue.shift()();
				}
			};
			
			var doDropOne = function(key, ctx, done, dryRun){
				if(dryRun){
					ctx.finished++;
					done(ctx);
					return;
				}
				
				var task = function(){
					runningTask++;
					that.dropFile({
						Bucket : ctx.bucket,
						Key : key,
					}, function(err, result){
						runningTask--;
						ctx.finished++;
						doNext();
						if(err){
							eventCallback('dropFileFailed', key, err);
							ctx.subDeleted = false;
						}else if(result.CommonMsg.Status >= 300){
							eventCallback('dropFileFailed', key, result);
							ctx.subDeleted = false;
						}else{
							eventCallback('dropFileSucceed', key, result);
						}
						done(ctx);
					});
				};
				
				if(runningTask < taskNum){
					task();
				}else{
					taskQueue.push(task);
				}
			};
			
			var delimiter = '/';
			
			var createDone = function(subFolder, ctx, done){
				return function(subCtx){
					if(!subCtx.isTruncated && subCtx.finished === subCtx.total && subCtx.subDeleted){
						doDropOne(subFolder, ctx, done, false);
					}
				};
			};
			
			var recursiveDropByFolder = function(ctx, bucket, prefix, marker, done){
				runningTask++;
				that.listObjects({
					Bucket : bucket,
					Prefix : prefix,
					Delimiter : delimiter,
					Marker : marker,
				}, function(err, result){
					runningTask--;
					if(err){
						return _callback(err);
					}
					
					if(result.CommonMsg.Status >= 300){
						return _callback(null, result);
					}
					
					ctx.total += result.InterfaceResult.Contents.length;
					ctx.total += result.InterfaceResult.CommonPrefixes.length;
					if(ctx.total === 0){
						done(ctx);
						return;
					}
					
					ctx.isTruncated = result.InterfaceResult.IsTruncated === 'true';
					
					var createRecursiveDropByFolderTask = function(subFolder){
						return function(){
							recursiveDropByFolder({total : 0, finished : 0, isTruncated : false, bucket : bucket, subDeleted : true}, bucket, subFolder, null, createDone(subFolder, ctx, done));
						};
					};
					
					for(let j=0;j<result.InterfaceResult.CommonPrefixes.length;j++){
						let subFolder = checkPrefix(result.InterfaceResult.CommonPrefixes[j]['Prefix']);
						if(runningTask < taskNum){
							recursiveDropByFolder({total : 0, finished : 0, isTruncated : false, bucket : bucket, subDeleted : true}, bucket, subFolder, null, createDone(subFolder, ctx, done));
						}else{
							taskQueue.push(createRecursiveDropByFolderTask(subFolder));
						}
					}
					
					for(let j=0;j<result.InterfaceResult.Contents.length;j++){
						let key = result.InterfaceResult.Contents[j]['Key'];
						doDropOne(key, ctx, done, key.lastIndexOf(delimiter) === key.length - 1);
					}
					
					if(ctx.isTruncated){
						if(runningTask < taskNum){
							recursiveDropByFolder(ctx, bucket, prefix, result.InterfaceResult.NextMarker, done);
						}else{
							taskQueue.push(function(){
								recursiveDropByFolder(ctx, bucket, prefix, result.InterfaceResult.NextMarker, done);
							});
						}
					}
				});
			};
			
			var folder = checkPrefix(param.Prefix);
			recursiveDropByFolder({total : 0, finished : 0, isTruncated : false, bucket : param.Bucket, subDeleted : true}, param.Bucket, folder, null, function(ctx){
				if(ctx.isTruncated || ctx.finished !== ctx.total){
					return;
				}
				
				if(ctx.subDeleted){
					that.dropFile({
						Bucket : ctx.bucket,
						Key : folder
					}, function(err, result){
						if(err){
							eventCallback('dropFileFailed', folder, err);
							return _callback(err);
						}
						
						if(result.CommonMsg.Status >= 300){
							eventCallback('dropFileFailed', folder, result);
							return _callback(null, result);
						}
						eventCallback('dropFileSucceed', folder, result);
						return _callback(null, result);
					});
					return;
				}
				let errMessage = 'drop folder ' + folder + ' failed due to child file deletion failed';
				eventCallback('dropFileFailed', folder, new Error(errMessage));
				_callback(errMessage);
			});
			
		};
	};
	
	return posix;
});


