

let wrapCallback = function(callback, log, methodName){
	callback = callback || function(){};
	let start = new Date().getTime();
	return function(err, result){
		log.runLog('info', methodName, 'ObsClient cost ' +  (new Date().getTime() - start) + ' ms');
		if(Object.prototype.toString.call(err) === '[object String]'){
			return callback(new Error(err), result);
		}
		
		return callback(err, result);
	};
};


let wrapEventCallback = function(eventCallback){
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

let checkPrefix = function(prefix){
	if(Object.prototype.toString.call(prefix) === '[object String]' && prefix.lastIndexOf('/') !== prefix.length - 1){
		prefix += '/';
	}
	return prefix;
};

let posix = {};
posix.extend = function(ObsClient){
	ObsClient.prototype.dropFile = function(param, callback){
		this.deleteObject(param, callback);
	};
	
	ObsClient.prototype.dropFolder = function(param, callback){
		let that = this;
		param = param || {};
		let _callback = wrapCallback(callback, that.log, 'dropFolder');
		let eventCallback = wrapEventCallback(param.EventCallback);
		let taskNum = param.TaskNum || 1;
		let runningTask = 0;
		let taskQueue = [];

		let doNext = function(){
			while(runningTask < taskNum && taskQueue.length > 0){
				taskQueue.shift()();
			}
		};
		
		let doDropOne = function(key, ctx, done, dryRun){
			if(dryRun){
				ctx.finished++;
				done(ctx);
				return;
			}
			
			let task = function(){
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
		
		let delimiter = '/';
		
		let createDone = function(subFolder, ctx, done){
			return function(subCtx){
				if(!subCtx.isTruncated && subCtx.finished === subCtx.total && subCtx.subDeleted){
					doDropOne(subFolder, ctx, done, false);
				}
			};
		};
		
		let recursiveDropByFolder = function(ctx, bucket, prefix, marker, done){
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
				
				let createRecursiveDropByFolderTask = function(subFolder){
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
		
		let folder = checkPrefix(param.Prefix);
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

export default posix;