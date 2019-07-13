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
	  define('resumable', ['md5', 'Base64'], factory);
  }else{
	  root['resumable'] = factory(root['md5'], root['Base64']);
  }
})(this ? this : window, function(md5, Base64){
	'use strict';
	
	const defaultPartSize = 9 * 1024 * 1024;
	const maxPartSize = 5 * 1024 * 1024 * 1024;
	
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
	
	var isFunction = function(obj){
		return Object.prototype.toString.call(obj) === '[object Function]';
	};
	
	var wrapEventCallback = function(eventCallback){
		eventCallback = eventCallback || function(){};
		return function(t, eventParam, result){
			if(Object.prototype.toString.call(result) === '[object Error]'){
				return eventCallback(t, eventParam, result);
			}
			
			if(Object.prototype.toString.call(result) === '[object String]'){
				return eventCallback(t, eventParam, new Error(result));
			}
			
			if(!result){
				return;
			}
			
			if(result.CommonMsg.Status > 300){
				return eventCallback(t, eventParam, new Error('status:' + result.CommonMsg.Status + ', code:' + result.CommonMsg.Code + ', message:' + result.CommonMsg.Message));
			}
			
			eventCallback(t, eventParam, result);
		};
	};
	
	var calculateUploadCheckpointMD5 = function(uploadCheckpoint){
		let data = [];
		data.push(uploadCheckpoint.bucket);
		data.push(uploadCheckpoint.key);
		data.push(uploadCheckpoint.sourceFile.name);
		data.push(String(uploadCheckpoint.partSize));
		data.push(String(uploadCheckpoint.partCount));
		data.push(String(uploadCheckpoint.fileStat.fileSize));
		data.push(String(uploadCheckpoint.fileStat.lastModified));
		
		if(uploadCheckpoint.uploadId){
			data.push(uploadCheckpoint.uploadId);
		}
		
		if(uploadCheckpoint.sseC){
			data.push(uploadCheckpoint.sseC);
		}
		
		if(uploadCheckpoint.sseCKey){
			data.push(uploadCheckpoint.sseCKey);
		}
		
		if(uploadCheckpoint.parts){
			for(let i=0;i<uploadCheckpoint.parts.length;i++){
				let part = uploadCheckpoint.parts[i];
				if(!part){
					continue;
				}
				data.push(String(part.partNumber));
				data.push(String(part.offset));
				data.push(String(part.partSize));
				data.push(String(part.isCompleted));
				if(part.etag){
					data.push(String(part.etag));
				}
			}
		}
		return window.btoa(md5.MD5(data.join(''), false, true));
	};
	
	var abortRequest = function(uploadCheckpoint, funcName, that){
		if(uploadCheckpoint && uploadCheckpoint.uploadId){
			that.abortMultipartUpload({
				Bucket:uploadCheckpoint.bucket,
				Key:uploadCheckpoint.key,
				RequestDate : uploadCheckpoint.requestDate,
				UploadId:uploadCheckpoint.uploadId,
			},function(err, result){
				if(err){
					that.log.runLog('warn', funcName, 'abort multipart upload failed, bucket:' + uploadCheckpoint.bucket + ', key:' + uploadCheckpoint.key + ', uploadId:' + uploadCheckpoint.uploadId + ', err:' + err);
					return;
				}
				if(result.CommonMsg.Status >= 300){
					that.log.runLog('warn', funcName, 'abort multipart upload failed, bucket:' + uploadCheckpoint.bucket + 
							', key:' + uploadCheckpoint.key + ', uploadId:' + uploadCheckpoint.uploadId + ', status:' + result.CommonMsg.Status + ', code:' + result.CommonMsg.Code + ', message:' + result.CommonMsg.Message);
					return;
				}
				delete uploadCheckpoint.uploadId;
				that.log.runLog('warn', funcName, 'abort multipart upload succeed, bucket:' + uploadCheckpoint.bucket + ', key:' + uploadCheckpoint.key + ', uploadId:' + uploadCheckpoint.uploadId);
			});
		}
	};
	
	var completedRequest = function(ctx){
		if(ctx.finishedCount < ctx.uploadCheckpoint.partCount){
			return;
		}
		
		if(ctx.isAbort){
			abortRequest(ctx.uploadCheckpoint, ctx.funcName, ctx.that);
			return ctx.callback('uploadFile failed the upload task is aborted');
		}
		
		if(ctx.isSuspend){
			return ctx.callback('the process of uploadFile is suspened, you can retry with the uploadCheckpoint');
		}
		
		if(ctx.hasError){
			return ctx.callback('uploadFile finished with error, you can retry with the uploadCheckpoint');
		}
		
		let parts = [];
		for(let i=0;i<ctx.uploadCheckpoint.partCount;i++){
			let part = ctx.uploadCheckpoint.parts[i];
			parts.push({
				PartNumber : part.partNumber,
				ETag : part.etag
			});
		}
		
		ctx.that.completeMultipartUpload({
			Bucket: ctx.uploadCheckpoint.bucket,
			Key : ctx.uploadCheckpoint.key,
			RequestDate : ctx.uploadCheckpoint.requestDate,
			UploadId : ctx.uploadCheckpoint.uploadId,
			Parts: parts
		}, function(err, result){
			let eventParam = {bucket : ctx.uploadCheckpoint.bucket, key : ctx.uploadCheckpoint.key, uploadId : ctx.uploadCheckpoint.uploadId};
			if(err){
				ctx.eventCallback('completeMultipartUploadFailed', eventParam, err);
				return ctx.callback(err);
			} 
				
			if(result.CommonMsg.Status >= 500){ 
				ctx.eventCallback('completeMultipartUploadFailed', eventParam, result);
				return ctx.callback(null, result);
			} 
				
			if(result.CommonMsg.Status >= 300 && result.CommonMsg.Status < 500){
				ctx.eventCallback('completeMultipartUploadAborted', eventParam, result);
				abortRequest(ctx.uploadCheckpoint, ctx.funcName, ctx.that);
				return ctx.callback(null, result);
			}
			
			ctx.eventCallback('completeMultipartUploadSucceed', eventParam, result);
			ctx.callback(null, result);
		});
	};
	
	var startToUploadFile = function(ctx){
		ctx.resumeCallback({
			cancel : function(){
				ctx.isSuspend = true;
				for(let i=0;i<ctx.uploadPartParams.length;i++){
					let cancelHook = ctx.uploadPartParams[i].cancelHook;
					if(isFunction(cancelHook)){
						cancelHook();
					}
				}
			}
		}, ctx.uploadCheckpoint);
		
		var taskQueue = [];
		var doNext = function(){
			while(ctx.runningTask < ctx.taskNum && taskQueue.length > 0){
				taskQueue.shift()();
			}
			if(taskQueue.length === 0){
				completedRequest(ctx);
			}
		};
		
		var createProgressCallbackByPartNumber = function(partNumber){
			return function(loaded, total, cost){
				ctx.progressCallback(partNumber, loaded);
			};
		};
		
		var sliceBlob = function(blob, start, end, type) {
			type = type || blob.type;  
			if (blob.mozSlice) {  
			    return blob.mozSlice(start, end, type);  
			} 
			if (blob.webkitSlice) {  
			    return blob.webkitSlice(start, end, type);
			}
			return blob.slice(start, end, type);
		};
		
		var encodeFunc = window.btoa ? window.btoa : Base64.encode;
		
		var transArrayBufferToBinaryString = function(buf){
			let readSize = 16 * 1024;
			buf = new Uint8Array(buf);
			let start = 0;
			let data;
			while(start < buf.length){
				let end = start + readSize;
				end = end <= buf.length ? end : buf.length;
				if(!data){
					data = String.fromCharCode.apply(null, buf.slice(start, end));
				}else{
					data += String.fromCharCode.apply(null, buf.slice(start, end)); 
				}
				start = end;
			}
			buf = null;
			return data;
		}
		
		var createUploadPartTask = function(part){
			return function(){
				ctx.runningTask++;
				if(ctx.isSuspend || ctx.isAbort){
					ctx.runningTask--;
					ctx.finishedCount++;
					ctx.finishedCount += taskQueue.length;
					taskQueue = [];
					return doNext();
				}
				var started = 0;
				var doUploadPart = function(contentMd5){
					if(started){
						return;
					}
					started = 1;
					var uploadPartParam = {
						Bucket : ctx.uploadCheckpoint.bucket,
						Key: ctx.uploadCheckpoint.key,
						RequestDate : ctx.uploadCheckpoint.requestDate,
						PartNumber: part.partNumber,
						UploadId : ctx.uploadCheckpoint.uploadId,
						SourceFile: ctx.uploadCheckpoint.sourceFile,
						Offset : part.offset,
						PartSize : part.partSize,
						SseC : ctx.uploadCheckpoint.sseC,
						SseCKey : ctx.uploadCheckpoint.sseCKey,
						ProgressCallback : createProgressCallbackByPartNumber(part.partNumber),
						ContentMD5 : contentMd5
					};
					ctx.uploadPartParams.push(uploadPartParam);
					
					ctx.that.uploadPart(uploadPartParam, function(err, result) {
						ctx.runningTask--;
						ctx.finishedCount++;
						if(ctx.isSuspend){
							return doNext();
						}
						
						let eventParam = {partNumber : part.partNumber, bucket : ctx.uploadCheckpoint.bucket, key : ctx.uploadCheckpoint.key, uploadId : ctx.uploadCheckpoint.uploadId};
						if(err){
							ctx.eventCallback('uploadPartFailed', eventParam, err);
							ctx.hasError = true;
						}else if(result.CommonMsg.Status >= 500 || (result.CommonMsg.Status === 400 && result.CommonMsg.Code === 'BadDigest')){
							ctx.eventCallback('uploadPartFailed', eventParam, result);
							ctx.hasError = true;
						}else if(result.CommonMsg.Status >= 300 && result.CommonMsg.Status < 500){
							ctx.isAbort = true;
							ctx.hasError = true;
							ctx.eventCallback('uploadPartAborted', eventParam, result);
						}else{
							part.etag = result.InterfaceResult.ETag;
							part.isCompleted = true;
							eventParam.etag = part.etag;
							ctx.uploadCheckpoint.md5 = calculateUploadCheckpointMD5(ctx.uploadCheckpoint);
							ctx.eventCallback('uploadPartSucceed', eventParam, result);
							ctx.that.log.runLog('debug', ctx.funcName, 'Part ' + String(part.partNumber) + ' is finished, uploadId ' + ctx.uploadCheckpoint.uploadId);
						}
						doNext();
					});
				};
				
				
				if(ctx.verifyMd5 && window.FileReader && ((ctx.uploadCheckpoint.sourceFile instanceof window.File) || (ctx.uploadCheckpoint.sourceFile instanceof window.Blob))){
					let _sourceFile = sliceBlob(ctx.uploadCheckpoint.sourceFile, part.offset, part.offset + part.partSize);
					let fr = new window.FileReader();
					fr.onload = function(e){	
						let data = transArrayBufferToBinaryString(e.target.result);
						let contentMd5 = encodeFunc(md5.RawMD5(data, false, true));
						data = null;
						doUploadPart(contentMd5);
					};
					
					fr.onerror = function(ex){
						ctx.that.log.runLog('error', ctx.funcName, 'Caculate md5 for part ' + String(part.partNumber) + ' failed');
						doUploadPart();
					};
					fr.readAsArrayBuffer(_sourceFile);
					return;
				}
				
				doUploadPart();
			};
			
		};
		
		if(!ctx.isSuspend){
			for(let i=0;i<ctx.uploadCheckpoint.partCount;i++){
				let part = ctx.uploadCheckpoint.parts[i];
				if(part.isCompleted){
					ctx.finishedCount++;
					ctx.finishedBytes += part.partSize;
				}else{
					taskQueue.push(createUploadPartTask(part));
				}
			}
			if(taskQueue.length === 0){
				return completedRequest(ctx);
			}
			return doNext();
		}
		ctx.callback('the process of uploadFile is suspened, you can retry with the uploadCheckpoint');
	};
	
	var resumable = {};
	resumable.extend = function(ObsClient){
		ObsClient.prototype.uploadFile = function(param, callback){
			var that = this;
			param = param || {};
			var funcName = 'uploadFile';
			var _callback = wrapCallback(callback, that.log, funcName);
			var eventCallback = wrapEventCallback(param.EventCallback);
			var taskNum = param.TaskNum || 1;
			var progressCallback = param.ProgressCallback || function(){};
			var resumeCallback = param.ResumeCallback || function(){};
			var verifyMd5 = param.VerifyMd5 || false;
			
			that.log.runLog('info', funcName, 'enter ' + funcName + '...' );
			
			var uploadCheckpoint = null;
			if(param.UploadCheckpoint && param.UploadCheckpoint.sourceFile && param.UploadCheckpoint.fileStat && param.UploadCheckpoint.uploadId && param.UploadCheckpoint.md5 === calculateUploadCheckpointMD5(param.UploadCheckpoint)){
				uploadCheckpoint = param.UploadCheckpoint;
			}else{
				abortRequest(param.UploadCheckpoint, funcName, that);
			}
			
			if(!uploadCheckpoint){
				let sourceFile = param.SourceFile;
				if(!(sourceFile instanceof window.File) && !(sourceFile instanceof window.Blob)){
					return _callback('source file is not valid, must be an instanceof [File | Blob]');
				}
				
				that.log.runLog('debug', funcName, 'Begin to uploadFile to OBS from file:' + sourceFile.name);
				
				let fileSize = sourceFile.size;
				let partSize = parseInt(param.PartSize);
				let partCount = 0;
				
				let parts = [];
				if(fileSize === 0){
					partSize = 0;
					partCount = 1;
					parts.push({partNumber : 1, offset : 0, partSize : 0, isCompleted : false});
				}else{
					partSize = isNaN(partSize) ? defaultPartSize : (partSize < defaultPartSize ? defaultPartSize : (partSize > maxPartSize ? maxPartSize : partSize));
					partCount = Math.floor(fileSize / partSize);
					if(partCount >= 10000){
						partSize = Math.floor(fileSize / 10000);
						if(fileSize % 10000 !== 0){
							partSize += 1;
						} 
						partCount = Math.floor(fileSize / partSize);
					}
					
					if(partSize > maxPartSize){
						return _callback('The source file ' + sourceFile.name + ' is too large');
					}
					
					let lastPartSize = fileSize % partSize;
					if(lastPartSize !== 0){
						partCount ++;
					}
					
					for(let i=0;i<partCount;i++){
						parts.push({
							partNumber : i+1,
							offset : i * partSize,
							partSize : partSize, 
							isCompleted : false
						});
					}
					if(lastPartSize !== 0){
						parts[partCount-1].partSize = lastPartSize;
					}
				}
				
				that.log.runLog('debug', funcName, 'Total parts count ' + partCount);
				
				uploadCheckpoint = {bucket : param.Bucket, key : param.Key, sourceFile : sourceFile, partSize : partSize, partCount : partCount, parts : parts};
				uploadCheckpoint.fileStat = {
					fileSize : fileSize,
					lastModified : sourceFile.lastModified
				};
				
				if(param.SseC && param.SseCKey){
					uploadCheckpoint.sseC = param.SseC;
					uploadCheckpoint.sseCKey = param.SseCKey;
				}
				
				uploadCheckpoint.md5 = calculateUploadCheckpointMD5(uploadCheckpoint);
			}
			
			uploadCheckpoint.requestDate = param.RequestDate;
			
			var ctx = {
				start : new Date().getTime(),
				uploadCheckpoint : uploadCheckpoint,
				funcName : funcName, 
				taskNum : taskNum,
				callback : _callback,
				that : that,
				runningTask : 0,
				finishedCount : 0,
				hasError : false,
				finishedBytes: 0,
				isAbort : false,
				resumeCallback : resumeCallback,
				isSuspend : false,
				partsLoaded : {},
				requestDate : param.RequestDate,
				uploadPartParams : [],
				verifyMd5 : verifyMd5
			};
			
			ctx.eventCallback = function(t, eventParam, result){
				if(ctx.isSuspend){
					return;
				}
				eventCallback(t, eventParam, result);
			};
			
			ctx.progressCallback = function(partNumber, loaded){
				if(ctx.isSuspend){
					return;
				}
				ctx.finishedBytes += loaded;
				if(ctx.partsLoaded[partNumber]){
					ctx.finishedBytes -= ctx.partsLoaded[partNumber];
				}
				ctx.partsLoaded[partNumber] = loaded;
				progressCallback(ctx.finishedBytes, ctx.uploadCheckpoint.fileStat.fileSize, (new Date().getTime() - ctx.start) / 1000);
			};
			
			if(!uploadCheckpoint.uploadId){
				let contentType = param.ContentType;
				if(!contentType && uploadCheckpoint.key){
					contentType = that.util.mimeTypes[uploadCheckpoint.key.substring(uploadCheckpoint.key.lastIndexOf('.') + 1)];
				}
				
				if(!contentType && uploadCheckpoint.sourceFile.name){
					contentType = that.util.mimeTypes[uploadCheckpoint.sourceFile.name.substring(uploadCheckpoint.sourceFile.name.lastIndexOf('.') + 1)];
				}
				
				that.initiateMultipartUpload({
					Bucket : param.Bucket,
					Key : param.Key,
					RequestDate : param.RequestDate,
					ACL : param.ACL,
					Metadata : param.Metadata,
					WebsiteRedirectLocation : param.WebsiteRedirectLocation,
					StorageClass : param.StorageClass,
					ContentType : contentType,
					Expires : param.Expires,
					SseKms : param.SseKms,
					SseKmsKey : param.SseKmsKey,
					SseC : param.SseC,
					SseCKey : param.SseCKey
				}, function(err, result){
					let eventParam = {bucket : param.Bucket, key : param.Key};
					if(err){
						ctx.eventCallback('initiateMultipartUploadFailed', eventParam, err);
						return _callback(err);
					}
					
					if(result.CommonMsg.Status >= 300){
						ctx.eventCallback('initiateMultipartUploadFailed', eventParam, result);
						return _callback(null, result);
					}
					let uploadId = result.InterfaceResult.UploadId;
					uploadCheckpoint.uploadId = uploadId;
					uploadCheckpoint.md5 = calculateUploadCheckpointMD5(uploadCheckpoint);
					ctx.uploadCheckpoint = uploadCheckpoint;
					
					eventParam.uploadId = uploadId;
					that.log.runLog('info', funcName, 'Claim a new upload id ' + uploadId);
					ctx.eventCallback('initiateMultipartUploadSucceed', eventParam, result);
					startToUploadFile(ctx);
				});
				return;
			}
			startToUploadFile(ctx);
		};
	};
	return resumable;
});
