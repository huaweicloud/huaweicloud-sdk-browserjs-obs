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
	  define('ObsClient', ['utils', 'log', 'enums', 'posix', 'resumable'], factory);
  }else{
	  root['obs'] = factory(root['utils'], root['log'], root['enums'], root['posix'], root['resumable']);
	  root['ObsClient'] = root['obs'];
  }
})(this ? this : window, function(Utils, LogUtil, enums, posix, resumable){

'use strict';

function ObsClient(param){
	this.factory(param);
}

function capitalize(key){
	return key.slice(0,1).toUpperCase() + key.slice(1);
}

const methods = [
	'getBucketMetadata',
	'headBucket',
	'deleteBucket',
	'setBucketQuota',
	'getBucketQuota',
	'getBucketStorageInfo',
	'setBucketPolicy',
	'getBucketPolicy',
	'deleteBucketPolicy',
	'setBucketVersioningConfiguration',
	'getBucketVersioningConfiguration',
	'getBucketLocation',
	'listVersions',
	'listObjects',
	'setBucketLifecycleConfiguration',
	'getBucketLifecycleConfiguration',
	'deleteBucketLifecycleConfiguration',
	'setBucketAcl',
	'getBucketAcl',
	'setBucketLoggingConfiguration',
	'getBucketLoggingConfiguration',
	'setBucketWebsiteConfiguration',
	'getBucketWebsiteConfiguration',
	'deleteBucketWebsiteConfiguration',
	'setBucketNotification',
	'getBucketNotification',
	'setBucketTagging',
	'getBucketTagging',
	'deleteBucketTagging',
	'getBucketCors',
	'deleteBucketCors',
	'setBucketStoragePolicy',
	'getBucketStoragePolicy',
	'getObject',
	'getObjectMetadata',
    'setObjectMetadata',
    'setObjectAcl',
	'getObjectAcl',
	'deleteObject',
	'deleteObjects',
	'listMultipartUploads',
	'listParts',
	'abortMultipartUpload',
	'completeMultipartUpload',
	'getBucketInventory',
	'setBucketInventory',
	'deleteBucketInventory',
	'getBucketEncryption',
	'setBucketEncryption',
	'deleteBucketEncryption'
];

function createAction(method){
	return function(param, callback){
		this.exec(capitalize(method), param, callback);
	};
}

for(let i=0;i<methods.length;i++){
	let method = methods[i];
	ObsClient.prototype[method] = createAction(method);
}

ObsClient.prototype.getBucketDisPolicy = function(param, callback) {
	param.ApiPath = 'v1/dis_policies';
	param.OEFMarker = 'yes';
    this.exec('GetBucketDisPolicy', param, callback);

};

ObsClient.prototype.setBucketDisPolicy = function(param, callback) {
	param.ApiPath = 'v1/dis_policies';
	param.OEFMarker = 'yes';
    this.exec('SetBucketDisPolicy', param, callback);

};

ObsClient.prototype.deleteBucketDisPolicy = function(param, callback) {
	param.ApiPath = 'v1/dis_policies';
	param.OEFMarker = 'yes';
    this.exec('DeleteBucketDisPolicy', param, callback);

};


ObsClient.prototype.putObject = function(param, callback){
	if(('Body' in param) && ('SourceFile' in param)){
		let err = 'the input body and sourcefile exist at same time,please specify one of eigther a string or file to be send!';
		this.log.runLog('error', 'PutObject', err);
		return callback(new Error(err), null);
	}
	
	if(!('ContentType' in param)){
		if('Key' in param){
			param.ContentType = this.util.mimeTypes[param.Key.substring(param.Key.lastIndexOf('.') + 1)];
		}
		
		if(!param.ContentType && ('SourceFile' in param)){
			let fileName = param.SourceFile.name;
			param.ContentType = this.util.mimeTypes[fileName.substring(fileName.lastIndexOf('.') + 1)];
		}
	}
	
	this.exec('PutObject', param, callback);
};

ObsClient.prototype.appendObject = function(param, callback){
	if(('Body' in param) && ('SourceFile' in param)){
		let err = 'the input body and sourcefile exist at same time,please specify one of eigther a string or file to be send!';
		if(this.log.isLevelEnabled('error')){
			this.log.runLog('error', 'PutObject', err);
		}
		return callback(new Error(err), null);
	}
	
	if(!('ContentType' in param)){
		if('Key' in param){
			param.ContentType = this.util.mimeTypes[param.Key.substring(param.Key.lastIndexOf('.') + 1)];
		}
		if(!param.ContentType && ('SourceFile' in param)){
			param.ContentType = this.util.mimeTypes[param.SourceFile.substring(param.SourceFile.lastIndexOf('.') + 1)];
		}
	}
	
	this.exec('AppendObject', param, callback);
};

ObsClient.prototype.copyObject = function(param, callback){
	let key = 'CopySource';
	if(key in param){
		let val = param[key];
		let index = val.lastIndexOf('?versionId=');
		if(index > 0){
			param[key] = this.util.encodeURIWithSafe(val.slice(0, index)) + val.slice(index);
		}else{
			param[key] = this.util.encodeURIWithSafe(val);
		}
	}
	this.exec('CopyObject', param, callback);
};

ObsClient.prototype.copyPart = function(param, callback){
	let key = 'CopySource';
	if(key in param){
		let val = param[key];
		let index = val.lastIndexOf('?versionId=');
		if(index > 0){
			param[key] = this.util.encodeURIWithSafe(val.slice(0, index)) + val.slice(index);
		}else{
			param[key] = this.util.encodeURIWithSafe(val);
		}
	}
	this.exec('CopyPart', param, callback);
};

ObsClient.prototype.restoreObject = function(param, callback){
	this.exec('RestoreObject', param, function(err, result){
		if(!err && result.InterfaceResult && result.CommonMsg.Status < 300){
			result.InterfaceResult.RestoreStatus = result.CommonMsg.Status === 200 ? 'AVALIABLE' : 'INPROGRESS';
		}
		callback(err, result);
	});
	
};

ObsClient.prototype.initiateMultipartUpload = function(param, callback){
	if(!('ContentType' in param)){
		if('Key' in param){
			param.ContentType = this.util.mimeTypes[param.Key.substring(param.Key.lastIndexOf('.') + 1)];
		}
	}
	this.exec('InitiateMultipartUpload', param, callback);
};

ObsClient.prototype.uploadPart = function(param, callback){
	if(('Body' in param) && ('SourceFile' in param)){
		let err = 'the input body and sourcefile exist at same time, please specify one of eigther a string or file to be send!';
		this.log.runLog('error', 'UploadPart', err);
		return callback(new Error(err), null);
	}
	this.exec('UploadPart', param, callback);
};

posix.extend(ObsClient);
resumable.extend(ObsClient);

function isFunction(obj){
	return Object.prototype.toString.call(obj) === '[object Function]';
}

function createPromise(current){
	return function(param, callback){
		if(isFunction(param)){
			current.call(this, null, param);
			return;
		}
		if(isFunction(callback)){
			current.call(this, param, callback);
			return;
		}
		
		let that = this;
		return new Promise(function(resolve, reject) {
			current.call(that, param, function(err, result){
				if(err){
					return reject(err);
				}
				resolve(result);
			});
		});
	};
}

if(isFunction(Promise)){
	for(let key in ObsClient.prototype){
		let current = ObsClient.prototype[key];
		ObsClient.prototype[key] = createPromise(current);
	}
}


ObsClient.prototype.exec = function(funcName, param, callback){
	var _log = this.log;
	_log.runLog('info', funcName, 'enter ' + funcName + '...' );
	var start = new Date().getTime();
	param = param || {};
	callback = callback || function(){};
	var _callback = function(err, msg){
		if(_callback.$called){
			return;
		}
		_callback.$called = true;
		
		if(err && !(err instanceof Error)){
			err = new Error(err);
		}
		
		_log.runLog('debug', funcName, 'ObsClient cost ' +  (new Date().getTime() - start) + ' ms');
		callback(err, msg);
	};
	this.util.exec(funcName, param , _callback);
};

ObsClient.prototype.initLog = function(param){
	param = param || {};
	this.log.setLevel(param.level);
	var msg = ['[OBS SDK Version=' + this.util.obsSdkVersion];
	if(this.util.server){
		var port = this.util.port ? ':' + this.util.port : '';
		msg.push('Endpoint=' + (this.util.is_secure? 'https' : 'http') + '://' + this.util.server + port);
	}
	msg.push('Access Mode=' + (this.util.path_style ? 'Path' : 'Virtual Hosting') + ']');
	this.log.runLog('warn', 'init', msg.join('];['));
};

ObsClient.prototype.factory = function(param){
	this.log = new LogUtil();
	this.util = new Utils(this.log);
	param = param || {};
	this.util.initFactory(param.access_key_id, param.secret_access_key, param.is_secure,
			param.server, param.path_style, param.signature, param.region, param.port, param.timeout, param.security_token, param.is_signature_negotiation, param.is_cname, param.url_prefix, param.region_domains,param.setRequestHeaderHook);
};

ObsClient.prototype.refresh = function(access_key_id, secret_access_key, security_token){
	this.util.refresh(access_key_id, secret_access_key, security_token);
};

ObsClient.prototype.createSignedUrlSync = function(param){
	return this.util.createSignedUrlSync(param);
};

ObsClient.prototype.createV2SignedUrlSync = function(param){
	return this.util.createV2SignedUrlSync(param);
};

ObsClient.prototype.createV4SignedUrlSync = function(param){
	return this.util.createV4SignedUrlSync(param);
};

ObsClient.prototype.createPostSignatureSync = function(param){
	return this.util.createPostSignatureSync(param);
};

ObsClient.prototype.createV4PostSignatureSync = function(param){
	return this.util.createV4PostSignatureSync(param);
};

ObsClient.prototype.enums = enums;

for(let key in ObsClient.prototype){
	ObsClient.prototype[capitalize(key)] = ObsClient.prototype[key];
}

for(let key in ObsClient.prototype){
	let index = key.indexOf('Configuration');
	if(index > 0 && index + 'Configuration'.length === key.length){
		ObsClient.prototype[key.slice(0, index)] = ObsClient.prototype[key];
	}
}

return ObsClient;
});

