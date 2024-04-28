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

import URI from 'urijs';
import axios from 'axios';
import SHA from 'jssha';
import { Base64 } from 'js-base64';
import md5 from 'blueimp-md5';
import xml2js from './xml2js';
import obsModel from './obsModel';
import v2Model from './v2Model';
import { ContentMD5, ContentSHA256 } from './enums';

const crypto = {
		createHmac : function(algorithm, key){
			let algorithmKey;
			if(algorithm === 'sha1'){
				algorithmKey = 'SHA-1';
			}else if(algorithm === 'sha512'){
				algorithmKey = 'SHA-512';
			}else{
				algorithmKey = 'SHA-256';
			}
			let shaObj = new SHA(algorithmKey, 'TEXT');
			shaObj.setHMACKey(key, (key instanceof ArrayBuffer) ? 'ARRAYBUFFER' : 'TEXT');
			return {
				update : function(message){
					shaObj.update(message);
					return this;
				},

				digest : function(type){
					if(type === 'hex'){
						return shaObj.getHMAC('HEX');
					}
					if(type === 'base64'){
						return shaObj.getHMAC('B64');
					}
					return shaObj.getHMAC('ARRAYBUFFER');
				}
			};
		},

		createHash : function(algorithm){
			if(algorithm === 'md5'){
				return {
					update : function(message){
						if(!this.message){
							this.message = message;
						}else{
							this.message += message;
						}
						return this;
					},

					digest : function(type){
						if(type === 'hex'){
							return md5(this.message);
						}
						if(type === 'base64'){
							let encodeFunc = window.btoa ? window.btoa : Base64.encode;
							return encodeFunc(md5(this.message, false, true));
						}
						if(type === 'rawbase64'){
							let encodeFunc = window.btoa ? window.btoa : Base64.encode;
							return encodeFunc(md5(this.message, false, true));
						}
						return md5(this.message, false, true);
					}
				};
			}

			let algorithmKey;
			if(algorithm === 'sha1'){
				algorithmKey = 'SHA-1';
			}else if(algorithm === 'sha512'){
				algorithmKey = 'SHA-512';
			}else{
				algorithmKey = 'SHA-256';
			}
			let shaObj = new SHA(algorithmKey, 'TEXT');

			return {
				update : function(message){
					shaObj.update(message);
					return this;
				},

				digest : function(type){
					if(type === 'hex'){
						return shaObj.getHash('HEX');
					}
					if(type === 'base64'){
						return shaObj.getHash('B64');
					}
					return shaObj.getHash('ARRAYBUFFER');
				}
			};
		}
};

const urlLib = {
		parse : function(url){
			let uri = URI.parse(url);
			return {
				hostname : uri.hostname,

				port : uri.port,

				host : uri.hostname,

				protocol : uri.protocol ? uri.protocol + ':' : '',

				query : uri.query,

			    path : uri.path + (uri.query ? '?' + uri.query : ''),

			    pathname :uri.path,

			    search : uri.query ? '?' + uri.query : ''
			};
		}
};

const CONTENT_SHA256 = 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855';
const OBS_SDK_VERSION = '3.22.3';

const mimeTypes = {
    '7z' : 'application/x-7z-compressed',
    'aac' : 'audio/x-aac',
    'ai' : 'application/postscript',
    'aif' : 'audio/x-aiff',
    'asc' : 'text/plain',
    'asf' : 'video/x-ms-asf',
    'atom' : 'application/atom+xml',
    'avi' : 'video/x-msvideo',
    'bmp' : 'image/bmp',
    'bz2' : 'application/x-bzip2',
    'cer' : 'application/pkix-cert',
    'crl' : 'application/pkix-crl',
    'crt' : 'application/x-x509-ca-cert',
    'css' : 'text/css',
    'csv' : 'text/csv',
    'cu' : 'application/cu-seeme',
    'deb' : 'application/x-debian-package',
    'doc' : 'application/msword',
    'docx' : 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'dvi' : 'application/x-dvi',
    'eot' : 'application/vnd.ms-fontobject',
    'eps' : 'application/postscript',
    'epub' : 'application/epub+zip',
    'etx' : 'text/x-setext',
    'flac' : 'audio/flac',
    'flv' : 'video/x-flv',
    'gif' : 'image/gif',
    'gz' : 'application/gzip',
    'htm' : 'text/html',
    'html' : 'text/html',
    'ico' : 'image/x-icon',
    'ics' : 'text/calendar',
    'ini' : 'text/plain',
    'iso' : 'application/x-iso9660-image',
    'jar' : 'application/java-archive',
    'jpe' : 'image/jpeg',
    'jpeg' : 'image/jpeg',
    'jpg' : 'image/jpeg',
    'js' : 'text/javascript',
    'json' : 'application/json',
    'latex' : 'application/x-latex',
    'log' : 'text/plain',
    'm4a' : 'audio/mp4',
    'm4v' : 'video/mp4',
    'mid' : 'audio/midi',
    'midi' : 'audio/midi',
    'mov' : 'video/quicktime',
    'mp3' : 'audio/mpeg',
    'mp4' : 'video/mp4',
    'mp4a' : 'audio/mp4',
    'mp4v' : 'video/mp4',
    'mpe' : 'video/mpeg',
    'mpeg' : 'video/mpeg',
    'mpg' : 'video/mpeg',
    'mpg4' : 'video/mp4',
    'oga' : 'audio/ogg',
    'ogg' : 'audio/ogg',
    'ogv' : 'video/ogg',
    'ogx' : 'application/ogg',
    'pbm' : 'image/x-portable-bitmap',
    'pdf' : 'application/pdf',
    'pgm' : 'image/x-portable-graymap',
    'png' : 'image/png',
    'pnm' : 'image/x-portable-anymap',
    'ppm' : 'image/x-portable-pixmap',
    'ppt' : 'application/vnd.ms-powerpoint',
    'pptx' : 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'ps' : 'application/postscript',
    'qt' : 'video/quicktime',
    'rar' : 'application/x-rar-compressed',
    'ras' : 'image/x-cmu-raster',
    'rss' : 'application/rss+xml',
    'rtf' : 'application/rtf',
    'sgm' : 'text/sgml',
    'sgml' : 'text/sgml',
    'svg' : 'image/svg+xml',
    'swf' : 'application/x-shockwave-flash',
    'tar' : 'application/x-tar',
    'tif' : 'image/tiff',
    'tiff' : 'image/tiff',
    'torrent' : 'application/x-bittorrent',
    'ttf' : 'application/x-font-ttf',
    'txt' : 'text/plain',
    'wav' : 'audio/x-wav',
    'webm' : 'video/webm',
    'wma' : 'audio/x-ms-wma',
    'wmv' : 'video/x-ms-wmv',
    'woff' : 'application/x-font-woff',
    'wsdl' : 'application/wsdl+xml',
    'xbm' : 'image/x-xbitmap',
    'xls' : 'application/vnd.ms-excel',
    'xlsx' : 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'xml' : 'application/xml',
    'xpm' : 'image/x-xpixmap',
    'xwd' : 'image/x-xwindowdump',
    'yaml' : 'text/yaml',
    'yml' : 'text/yaml',
    'zip' : 'application/zip',
};


const allowedResourceParameterNames = [
	'inventory',
	'acl',
	'backtosource',
    'policy',
    'torrent',
    'logging',
    'location',
    'storageinfo',
    'quota',
    'storageclass',
    'storagepolicy',
    'mirrorbacktosource',
    'requestpayment',
    'versions',
    'versioning',
    'versionid',
    'uploads',
    'uploadid',
    'partnumber',
    'website',
    'notification',
    'replication',
    'lifecycle',
    'deletebucket',
    'delete',
    'cors',
    'restore',
    'tagging',
    'append',
    'position',
    'response-content-type',
    'response-content-language',
    'response-expires',
    'response-cache-control',
    'response-content-disposition',
    'response-content-encoding',
    'x-image-process',
	'x-image-save-object',
    'x-image-save-bucket',
    'x-oss-process',
	'encryption',
	'obsworkflowtriggerpolicy',
	'x-workflow-limit',
	'x-workflow-prefix',
	'x-workflow-start',
	'x-workflow-template-name',
	'x-workflow-graph-name',
	'x-workflow-execution-state',
	'x-workflow-category',
	'x-workflow-prefix',
	'x-workflow-create',
	'directcoldaccess',
	'customdomain',
	'cdnnotifyconfiguration',
	'metadata',
	'dispolicy',
	'obscompresspolicy',
	'template_name',
	'template_name_prefix',
	'x-workflow-status',
	'x-workflow-type',
	'x-workflow-forbid',
	'sfsacl',
	'obsbucketalias',
	'obsalias',
	'rename',
    'name',
    'modify',
	'attname',
	'inventory',
	'truncate',
	'object-lock',
	"retention",
	'x-obs-security-token',
];


const allowedResponseHttpHeaderMetadataNames = [
    'content-type',
    'content-md5',
    'content-length',
    'content-language',
    'expires',
    'origin',
    'cache-control',
    'content-disposition',
    'content-encoding',
    'x-default-storage-class',
    'location',
    'date',
    'etag',
    'host',
    'last-modified',
    'content-range',
    'x-reserved',
    'access-control-allow-origin',
    'access-control-allow-headers',
    'access-control-max-age',
    'access-control-allow-methods',
    'access-control-expose-headers',
	'connection',
	'x-obs-location-clustergroup-id'
];

const commonHeaders = {
	'content-length' : 'ContentLength',
	'date' : 'Date',
	'x-reserved' : 'Reserved'
};

const obsAllowedStorageClass = ['STANDARD', 'WARM', 'COLD', 'DEEP_ARCHIVE', 'INTELLIGENT_TIERING'];

const v2AllowedStorageClass = ['STANDARD', 'STANDARD_IA', 'GLACIER', 'DEEP_ARCHIVE', 'INTELLIGENT_TIERING'];

const obsAllowedAcl = ['private', 'public-read', 'public-read-write', 'public-read-delivered', 'public-read-write-delivered'];

const v2AllowedAcl = ['private', 'public-read', 'public-read-write', 'authenticated-read', 'bucket-owner-read', 'bucket-owner-full-control', 'log-delivery-write'];

const obsAllowedUri = ['Everyone', 'LogDelivery'];

const v2AllowedUri = ['http://acs.amazonaws.com/groups/global/AllUsers', 'http://acs.amazonaws.com/groups/global/AuthenticatedUsers', 'http://acs.amazonaws.com/groups/s3/LogDelivery'];

const obsAllowedEvent = ['ObjectCreated', 'ObjectCreated:*', 'ObjectCreated:Put', 'ObjectCreated:Post', 'ObjectCreated:Copy', 'ObjectCreated:CompleteMultipartUpload', 
	'ObjectRemoved', 'ObjectRemoved:*', 'ObjectRemoved:Delete', 'ObjectRemoved:DeleteMarkerCreated',
	'ObjectChanged:*', 'ObjectChanged:Rename', 'ObjectChanged:Truncate', 'ObjectChanged:Modify'];
const v2AllowedEvent = ['ObjectCreated',  's3:ObjectCreated:*', 's3:ObjectCreated:Put', 's3:ObjectCreated:Post', 's3:ObjectCreated:Copy','s3:ObjectCreated:CompleteMultipartUpload', 
	'ObjectRemoved', 's3:ObjectRemoved:*', 's3:ObjectRemoved:Delete', 's3:ObjectRemoved:DeleteMarkerCreated', 'ObjectRemoved:*', 'ObjectRemoved:Delete', 'ObjectRemoved:DeleteMarkerCreated',
    'ObjectChanged:*', 'ObjectChanged:Rename', 'ObjectChanged:Truncate', 'ObjectChanged:Modify'];

const ignoreNegotiationMethod =['CreateBucket','SetBucketAlias','BindBucketAlias','UnbindBucketAlias','DeleteBucketAlias','GetBucketAlias'];
const negotiateMethod = 'HeadApiVersion';

const obsSignatureContext = {
	signature :	'obs',
	headerPrefix : 'x-obs-',
	headerMetaPrefix : 'x-obs-meta-',
	authPrefix : 'OBS'
};

const v2SignatureContext = {
	signature :	'v2',
	headerPrefix : 'x-amz-',
	headerMetaPrefix : 'x-amz-meta-',
	authPrefix : 'AWS'
};

function encodeURIWithSafe(str, safe, skipEncoding){
	str = String(str);
	if(str.length === 0){
		return '';
	}
	if(skipEncoding){
		return str;
	}
	let ret;
	if (safe) {
		ret = [];
		for (const element of str) {
			ret.push(safe.indexOf(element) >= 0 ? element : encodeURIComponent(element));
		}
		ret = ret.join('');
	}else{
		ret = encodeURIComponent(str);
	}
	return ret.replace(/!/g, '%21')
			  .replace(/\*/g, '%2A')
			  .replace(/'/g, '%27')
			  .replace(/\(/g, '%28')
			  .replace(/\)/g, '%29');
}

function headerTostring(obj){
	return JSON ? JSON.stringify(obj) : '';
}

function parseObjectFromHeaders(sentAs, headers){
	let metadata = {};
	for(let key in headers){
		if ({}.hasOwnProperty.call(headers, key)) {
			let k = String(key).toLowerCase();
			if (k.indexOf(sentAs) === 0) {
				metadata[k.slice(sentAs.length)] = headers[key];
			}
		}
	}
	return metadata;
}

function isArray(obj){
	return Object.prototype.toString.call(obj) === '[object Array]';
}

function isFunction(obj){
	return Object.prototype.toString.call(obj) === '[object Function]';
}

function isObject(obj){
	return Object.prototype.toString.call(obj) === '[object Object]';
}


function makeObjFromXml(xml, bc){
	if (typeof xml === 'object') {
		return bc(null, xml);
	}
	try{
		return bc(null, xml2js.parseString(xml));
	}catch(err){
		return bc(err, null);
	}
}

function getExpireDate(utcDateStr){
	let date = new Date(Date.parse(utcDateStr));
	let hour = date.getUTCHours();
	let min = date.getUTCMinutes();
	let sec = date.getUTCSeconds();
	let day = date.getUTCDate();
	let moth = date.getUTCMonth() + 1;
	let year = date.getUTCFullYear();
	let expireDate = '';
	expireDate += year + '-';

	if(moth < 10){
		expireDate += '0';
	}
	expireDate += moth + '-';

	if(day < 10){
		expireDate += '0';
	}
	expireDate += day + 'T';

	if(hour < 10){
		expireDate += '0';
	}
	expireDate += hour + ':';

	if(min < 10){
		expireDate += '0';
	}
	expireDate += min + ':';

	if(sec < 10){
		expireDate += '0';
	}
	expireDate += sec + 'Z';
	return expireDate;
}

function getDates(utcDateStr){
	let date = new Date(Date.parse(utcDateStr));
	let hour = date.getUTCHours();
	let min = date.getUTCMinutes();
	let sec = date.getUTCSeconds();
	let day = date.getUTCDate();
	let moth = date.getUTCMonth() + 1;
	let year = date.getUTCFullYear();
	let shortDate = '';
	let longDate = '';
	shortDate += year;

	if(moth < 10){
		shortDate += '0';
	}
	shortDate += moth;

	if(day < 10){
		shortDate += '0';
	}
	shortDate += day;

	longDate += shortDate + 'T';
	if(hour < 10){
		longDate += '0';
	}
	longDate +=  hour;

	if(min < 10){
		longDate += '0';
	}
	longDate +=  min;

	if(sec < 10){
		longDate += '0';
	}
	longDate +=  sec + 'Z';
	return [shortDate, longDate];
}

function getSignedAndCanonicalHeaders(header){
	let arrheadKey = [];
	let arrhead = {};
	for(let key in header){
		if ({}.hasOwnProperty.call(header, key)) {
			arrheadKey.push(key.toLowerCase());
			arrhead[key.toLowerCase()] = header[key];
		}
	}
	arrheadKey = arrheadKey.sort();
	let signedHeaders = '';
	let canonicalHeaders = '';
	for(let i = 0; i < arrheadKey.length; i++){
		if(i !== 0){
			signedHeaders += ';';
		}
		signedHeaders += arrheadKey[i];
		canonicalHeaders += arrheadKey[i] + ':' + arrhead[arrheadKey[i]] + '\n';
	}
	return [signedHeaders, canonicalHeaders];
}

function createV4Signature(shortDate, sk, region, stringToSign){
	let dateKey = crypto.createHmac('sha256', 'AWS4' + sk).update(shortDate).digest();
	let dateRegionKey = crypto.createHmac('sha256', dateKey).update(region).digest();
	let dateRegionServiceKey = crypto.createHmac('sha256', dateRegionKey).update('s3').digest();
	let signingKey = crypto.createHmac('sha256', dateRegionServiceKey).update('aws4_request').digest();
	let signature = crypto.createHmac('sha256', signingKey).update(stringToSign).digest('hex');
	return signature;
}

function getV4Signature(shortDate,longDate, sk, region, canonicalRequest){
	let scop = shortDate + '/' + region + '/s3/aws4_request';
	let stringToSign = 'AWS4-HMAC-SHA256\n';
	stringToSign += longDate + '\n';
	stringToSign += scop + '\n';
	stringToSign += crypto.createHash('sha256').update(canonicalRequest).digest('hex');
	return createV4Signature(shortDate, sk, region, stringToSign);
}

function Utils(log_in) {
	this.log = log_in;
	this.ak = null;
	this.sk = null;
	this.securityToken = null;
	this.isSecure = true;
	this.server = null;
	this.pathStyle = false;
	this.signatureContext = null;
	this.isSignatureNegotiation = true;
	this.bucketSignatureCache = {};
	this.region = 'region';
	this.port = null;
	this.timeout = 300;
	this.obsSdkVersion = OBS_SDK_VERSION;
	this.isCname = false;
	this.bucketEventEmitters = {};
	this.useRawXhr = false;
}

Utils.prototype.encodeURIWithSafe = encodeURIWithSafe;

Utils.prototype.mimeTypes = mimeTypes;

Utils.prototype.refresh = function(ak, sk, securityToken){
	this.ak = ak ? String(ak).trim() : null;
	this.sk = sk ? String(sk).trim(): null;
	this.securityToken = securityToken ? String(securityToken).trim() : null;
};

Utils.prototype.initFactory = function(ak, sk, isSecure,
		server, pathStyle, signature, region, port, timeout, securityToken, isSignatureNegotiation,
		isCname, urlPrefix, regionDomains, setRequestHeaderHook, useRawXhr, checksumAlgorithm){

	this.refresh(ak, sk, securityToken);

    this.urlPrefix = urlPrefix || '';
    this.regionDomains = regionDomains || null;
    this.setRequestHeaderHook = setRequestHeaderHook || null;
	this.checkAlgorithm = ContentMD5;

	if (typeof checksumAlgorithm === 'string' && checksumAlgorithm.toLowerCase() === 'sha256') {
		this.checkAlgorithm = ContentSHA256;
	}
	
	if (!server) {
		throw new Error('Server is not set');
	}

	server = String(server).trim();

	if(server.indexOf('https://') === 0){
		server = server.slice('https://'.length);
		isSecure = true;
	}else if(server.indexOf('http://') === 0){
		server = server.slice('http://'.length);
		isSecure = false;
	}

	let index = server.lastIndexOf('/');
	while(index >= 0){
		server = server.slice(0, index);
		index = server.lastIndexOf('/');
	}

	index = server.indexOf(':');
	if(index >= 0){
		port = server.slice(index + 1);
		server = server.slice(0, index);
	}
	this.server = server;

	if(/^[0-9]+\.[0-9]+\.[0-9]+\.[0-9]+$/.test(this.server)){
		pathStyle = true;
	}

	if (isSecure !== undefined) {
		this.isSecure = isSecure;
	}
	if (pathStyle !== undefined) {
		this.pathStyle = pathStyle;
	}

	if (signature !== undefined) {
		signature = String(signature).trim().toLowerCase();
	}else{
		signature = 'obs';
	}

	if(isSignatureNegotiation !== undefined){
		this.isSignatureNegotiation = isSignatureNegotiation;
	}

	this.isCname = isCname;

	if(this.pathStyle || this.isCname){
		this.isSignatureNegotiation = false;
		if(signature === 'obs'){
			signature = 'v2';
		}
	}

	this.signatureContext = signature === 'obs' ? obsSignatureContext : v2SignatureContext;

	if(region !== undefined){
		this.region = String(region);
	}

	this.port = port ? parseInt(port, 10) : (this.isSecure ? 443 : 80);

	if(timeout !== undefined){
		this.timeout = parseInt(timeout, 10);
	}

	if(useRawXhr !== undefined){
		this.useRawXhr = useRawXhr;
	}
};

Utils.prototype.SseKmsAdapter = function(value, signatureContext){
	value = value || '';
	value = String(value);
	let index = value.indexOf('aws:');
	if(signatureContext.signature === 'obs'){
		return index === 0 ? value.slice(4) : value;
	}
	return index === 0 ? value : 'aws:' + value;
};

Utils.prototype.SseModeAdapter = function(value, signatureContext){
	value = value || '';
	value = String(value);
	let index = value.indexOf('aws:');
	if(signatureContext.signature === 'obs'){
		return index === 0 ? value.slice(4) : value;
	}
	return index === 0 ? value : 'aws:' + value;
};

Utils.prototype.BucketAdapter = function(value, signatureContext){
	value = value || '';
	value = String(value);
	let index = value.indexOf('arn:aws:s3:::');
	if(signatureContext.signature === 'obs'){
		return index === 0 ? value.slice('arn:aws:s3:::'.length) : value;
	}
	return index === 0 ? value : 'arn:aws:s3:::' + value;
};

Utils.prototype.EventAdapter = function(value, signatureContext){
	value = value || '';
	value = String(value);
	if(signatureContext.signature === 'obs'){
		if(obsAllowedEvent.indexOf(value) >= 0){
			return value;
		}
		if(v2AllowedEvent.indexOf(value) >= 0){
			return value.substring(3);
		}
		return '';
	}
	if(v2AllowedEvent.indexOf(value) >= 0){
		return value;
	}
	if(obsAllowedEvent.indexOf(value) >= 0){
		return 's3:' + value;
	}
	return '';
};

Utils.prototype.EventsAdapter = function(value, signatureContext){
	return this.EventAdapter(value, signatureContext);
};


Utils.prototype.URIAdapter = function(value, signatureContext){
	value = value || '';
	value = String(value);
	if(signatureContext.signature === 'obs'){
		if(obsAllowedUri.indexOf(value) >= 0){
			return value;
		}
		if(value === 'AllUsers' || value === 'http://acs.amazonaws.com/groups/global/AllUsers'){
			return 'Everyone';
		}
		return '';
	}
	if(v2AllowedUri.indexOf(value) >= 0){
		return value;
	}
	if(value === 'Everyone' || value === 'AllUsers'){
		return 'http://acs.amazonaws.com/groups/global/AllUsers';
	}
	if(value === 'AuthenticatedUsers'){
		return 'http://acs.amazonaws.com/groups/global/AuthenticatedUsers';
	}
	if(value === 'LogDelivery'){
		return 'http://acs.amazonaws.com/groups/s3/LogDelivery';
	}
	return '';
};


Utils.prototype.StorageClassAdapter = function(value, signatureContext){
	value = value || '';
	value = String(value).toUpperCase();
	if(signatureContext.signature === 'obs'){
		if(obsAllowedStorageClass.indexOf(value) >= 0){
			return value;
		}
		if(value === 'STANDARD_IA'){
			return 'WARM';
		}
		if(value === 'GLACIER'){
			return 'COLD';
		}
		return '';
	}
	if(v2AllowedStorageClass.indexOf(value) >= 0){
		return value;
	}
	if(value === 'WARM'){
		return 'STANDARD_IA';
	}
	if(value === 'COLD'){
		return 'GLACIER';
	}
	return '';
};

Utils.prototype.ACLAdapter = function(value, signatureContext){
	value = value || '';
	value = String(value).toLowerCase();
	if(signatureContext.signature === 'obs'){
		if(obsAllowedAcl.indexOf(value) >= 0){
			return value;
		}
		return '';
	}
	if(value === 'public-read-delivered'){
		value = 'public-read';
	}else if(value === 'public-read-write-delivered'){
		value = 'public-read-write';
	}

	if(v2AllowedAcl.indexOf(value) >= 0){
		return value;
	}
	return '';
};

Utils.prototype.doExec = function(funcName, param, callback){
	let opt = this.makeParam(funcName, param);
	if('err' in opt){
		return callback(opt.err, null);
	}
	this.sendRequest(funcName, opt, callback);
};

Utils.prototype.doNegotiation = function(funcName, param, callback, checkBucket, checkCache, setCache){
	let o = null;
	let that = this;
	if(checkCache && param.Bucket){
		let item = this.bucketSignatureCache[param.Bucket];
		if(item && item.signatureContext && item.expireTime > new Date().getTime()){
			param.signatureContext = item.signatureContext;
			let opt = this.makeParam(funcName, param);
			if('err' in opt){
				return callback(opt.err, null);
			}
			opt.signatureContext = item.signatureContext;
			return this.sendRequest(funcName, opt, callback);
		}

		o = this.bucketEventEmitters[param.Bucket];
		if(!o){
			o = {
				s : 0,
				n : function(){
					while(this.e && this.e.length > 0){
						this.e.shift()();
					}
				}
			};
			this.bucketEventEmitters[param.Bucket] = o;
		}

		if(o.s){
			o.e.push(function(){
				that.doNegotiation(funcName, param, callback, checkBucket, checkCache, setCache);
			});
			return;
		}

		o.e = [];
		o.s = 1;
	}

	this.doExec(negotiateMethod, checkBucket ? {Bucket:param.Bucket, hasRegion: param.hasRegion} : {},  function(err, result){
		if(err){
			callback(err, null);
			if(o){
				o.s = 0;
				o.n();
			}
			return;
		}
		if((checkBucket && result.CommonMsg.Status === 404) || result.CommonMsg.Status >= 500){
			callback(err, result);
			if(o){
				o.s = 0;
				o.n();
			}
			return;
		}

		let signatureContext = v2SignatureContext;
		if(result.CommonMsg.Status < 300 && result.InterfaceResult && result.InterfaceResult.ApiVersion >= '3.0'){
			signatureContext = obsSignatureContext;
		}
		if(setCache){
			that.bucketSignatureCache[param.Bucket] = {
				signatureContext : signatureContext,
				expireTime : new Date().getTime() + 15 + (Math.ceil(Math.random()*5)) * 60 * 1000
			};
		}

		if(o){
			o.s = 0;
			o.n();
		}
		param.signatureContext = signatureContext;
		let opt = that.makeParam(funcName, param);
		if('err' in opt){
			return callback(opt.err, null);
		}
		opt.signatureContext = signatureContext;
		that.sendRequest(funcName, opt, callback);
	});
};

Utils.prototype.exec = function(funcName, param, callback){
	let that = this;
	if(that.isSignatureNegotiation && funcName !== negotiateMethod){
		if (funcName === 'ListBuckets') {
			that.doNegotiation(funcName, param, callback, false, false, false);
		} else if (ignoreNegotiationMethod.indexOf(funcName) > -1) {
			let _callback = function(err, result){
				if(!err && result.CommonMsg.Status === 400 &&
						result.CommonMsg.Message === 'Unsupported Authorization Type' &&
						param.signatureContext &&
						param.signatureContext.signature === 'v2'){
					param.signatureContext = v2SignatureContext;
					let opt = that.makeParam(funcName, param);
					if('err' in opt){
						return callback(opt.err, null);
					}
					opt.signatureContext = param.signatureContext;
					that.sendRequest(funcName, opt, callback);
					return;
				}
				callback(err, result);
			};

			that.doNegotiation(funcName, param, _callback, false, true, false);
		}else{
			that.doNegotiation(funcName, param, callback, true, true, true);
		}
		return;
	}
	that.doExec(funcName, param, callback);
};


Utils.prototype.sliceBlob = function (blob, start, end, type) {
  type = type || blob.type;
  if (blob.mozSlice) {
      return blob.mozSlice(start, end, type);
  }
  if (blob.webkitSlice) {
      return blob.webkitSlice(start, end, type);
  }
  return blob.slice(start, end, type);
};


Utils.prototype.toXml = function(mXml, xmlMeta, root, sentAs, signatureContext){
	let xml = '';
	if(root !== null){
		xml += this.buildXml(mXml, xmlMeta, root, sentAs, signatureContext);
		return xml;
	}
	for (let key in xmlMeta){
		if(key in mXml){
			let _sentAs = xmlMeta[key].sentAs || key;
			xml += this.buildXml(mXml, xmlMeta[key], key, _sentAs, signatureContext);
		}
	}
	return xml;
};

Utils.prototype.buildXml = function(mXml, xmlMeta, key, sentAs, signatureContext){
	let xml = '';
	let type = xmlMeta.type;
	if(type === 'array'){
		for(let i = 0; i < mXml[key].length; i++){
			if(xmlMeta.items.type === 'object'){
				if (!mXml[key][i]) {
					return xml;
				}
				let result = this.toXml(mXml[key][i], xmlMeta.items.parameters, null, null, signatureContext);
				if(result !== ''){
					xml += '<'+sentAs +'>'+ result + '</'+sentAs +'>';
				}
			}else if(xmlMeta.items.type === 'adapter'){
				xml += '<' + sentAs + '>' + String(this[key + 'Adapter'](mXml[key][i], signatureContext)).replace(/&/g, '&amp;').replace(/'/g, '&apos;').replace(/"/g, '&quot;') + '</' + sentAs + '>';
			}else if(xmlMeta.items.type !== 'array'){
				xml += '<' + sentAs + '>'+ String(mXml[key][i]).replace(/&/g, '&amp;').replace(/'/g, '&apos;').replace(/"/g, '&quot;') + '</' + sentAs +'>';
			}
		}
	}else if(type === 'object'){
		if (!mXml[key]) {
			return xml;
		}
		let result = this.toXml(mXml[key], xmlMeta.parameters, null, null, signatureContext);
		if(result !== ''){
			xml += '<'+sentAs;
			if('data' in xmlMeta){
				if('xsiNamespace' in xmlMeta.data){
					xml += ' xmlns:xsi="' +  xmlMeta.data.xsiNamespace + '"';
				}
				if('xsiType' in xmlMeta.data){
					xml += ' xsi:type="' + mXml[key][xmlMeta.data.xsiType] + '"';
				}
			}
			xml += '>';
			xml += result + '</'+sentAs +'>';
		}

	}else if(type === 'adapter'){
		xml += '<' + sentAs + '>' + String(this[key + 'Adapter'](mXml[key], signatureContext)).replace(/&/g, '&amp;').replace(/'/g, '&apos;').replace(/"/g, '&quot;') + '</' + sentAs + '>';
	}else if(type !== 'ignore'){
		xml += '<'+ sentAs + '>' + String(mXml[key]).replace(/&/g, '&amp;').replace(/'/g, '&apos;').replace(/"/g, '&quot;') + '</'+sentAs+'>';
	}
	if(xml && xmlMeta.wrapper){
		let _wrapper = xmlMeta.wrapper;
		xml = '<' + _wrapper + '>' + xml + '</' + _wrapper + '>';
	}
	return xml;
};

Utils.prototype.jsonToObject = function(model, obj, root, ifRootXMlDecode){
	let opt = {};
	if(root !== null){
		this.buildObject(model, obj, root, opt, ifRootXMlDecode);
	}else{
		for(let key in model){
			if ({}.hasOwnProperty.call(model, key)) {
				this.buildObject(model, obj, key, opt, ifRootXMlDecode);
			}
		}
	}
	return opt;
};

Utils.prototype.buildObject = function(model, obj, key, opt, ifRootXMlDecode){

	let setValue = function (value) {
		if(value === undefined) {
			return "";
		}
		return value && model[key].decode && ifRootXMlDecode
		? decodeURIComponent(value.replace(/\+/g, '%20'))
		: value;
	}

	if(isObject(obj)){
		let flag = true;
		let wrapper = model[key].wrapper;
		if(wrapper && wrapper in obj){
			obj = obj[wrapper];
			flag = isObject(obj);
		}
		if(flag){
			let sentAs = model[key].sentAs || key;
			if(sentAs in obj){
				if(model[key].type === 'object'){
					opt[key] = this.jsonToObject(model[key].parameters, obj[sentAs], null, ifRootXMlDecode);
				}else if(model[key].type === 'array'){
					let arr = [];
					if(!isArray(obj[sentAs])){
						arr[0] = model[key].items.type === 'object' ? this.jsonToObject(model[key].items.parameters, obj[sentAs], null, ifRootXMlDecode) : setValue(obj[sentAs]['#text'] || '');
					}else{
						for (let i = 0; i < obj[sentAs].length; i++ ){
							arr[i] = model[key].items.type === 'object' ? this.jsonToObject(model[key].items.parameters, obj[sentAs][i], null, ifRootXMlDecode) : setValue(obj[sentAs][i]['#text']);
						}
					}
					opt[key] = arr;
				}else{
					opt[key] = setValue(obj[sentAs]['#text']);
				}
			}
		}
	}

	if(opt[key] === undefined){
		if(model[key].type === 'object'){
			opt[key] = model[key].parameters ? this.jsonToObject(model[key].parameters,null,null,ifRootXMlDecode) : {};
		}else if(model[key].type === 'array'){
			opt[key] = [];
		}
	}

};

Utils.prototype.makeParam = function(methodName, param){
	let signatureContext = param.signatureContext || this.signatureContext;
	let model = signatureContext.signature === 'obs' ? obsModel[methodName] : v2Model[methodName];
	let method = model.httpMethod;
	let uri = '/';
	let urlPath = '';
	let xml = '';
	let exheaders = {};
	let opt = {};
	opt.$requestParam = param;

	if ('urlPath' in model){
		urlPath += '?';
		urlPath += model.urlPath;
	}
	for (let key in model.parameters){
		if ({}.hasOwnProperty.call(model.parameters, key)) {
			let meta = model.parameters[key];
			if (key === 'Bucket' && this.isCname) {
				continue;
			}

			let _value = param[key];

			if (meta.type === 'callback' && _value === undefined && meta.parameters && (param['CallbackUrl'] !== undefined || param['CallbackBody'] !== undefined)) {
				_value = {};
				for (let _key of Object.keys(meta.parameters)) {
					const _meta = meta.parameters[_key];
					const _keyValue = param[_key];
					if (_meta.required && (_keyValue === null || _keyValue === undefined || (Object.prototype.toString.call(_keyValue) === '[object String]' && _keyValue === ''))) {
						opt.err = _key + ' is a required element!';
						this.log.runLog('error', methodName, opt.err);
						return opt;
					}
					const newKey = _key.slice(0, 1).toLowerCase() + _key.slice(1); 
					_value[newKey] = _keyValue;
				}
			}

			if (meta.required && (_value === null || _value === undefined || (Object.prototype.toString.call(_value) === '[object String]' && _value === ''))) {
				opt.err = key + ' is a required element!';
				this.log.runLog('error', methodName, opt.err);
				return opt;
			}

			if (_value !== null && _value !== undefined) {
				if (meta.type === 'srcFile' || meta.type === 'dstFile') {
					opt[meta.type] = _value;
					continue;
				}

				if (meta.type === 'plain') {
					opt[key] = _value;
				}

				let sentAs = meta.sentAs || key;

				if (meta.withPrefix) {
					sentAs = signatureContext.headerPrefix + sentAs;
				}

				if (meta.location === 'uri') {
					if (uri !== '/') {
						uri += '/';
					}
					uri += _value;
				} else if (meta.location === 'header') {
					let safe = meta.encodingSafe || ' ;/?:@&=+$,';
					if (meta.type === 'object') {
						if (signatureContext.headerMetaPrefix === sentAs) {
							for (let item in _value) {
								if ({}.hasOwnProperty.call(_value, item)) {
									let value = _value[item];
									item = String(item).trim().toLowerCase();
									exheaders[item.indexOf(sentAs) === 0 ? item : sentAs + item] = encodeURIWithSafe(value, safe);
								}
							}
						}
					} else if (meta.type === 'array') {
						let arr = [];
						for (let item in _value) {
							if ({}.hasOwnProperty.call(_value, item)) {
								arr[item] = encodeURIWithSafe(_value[item], safe);
							}
						}
						exheaders[sentAs] = arr;
					} else if (meta.type === 'password') {
						let encodeFunc = window.btoa ? window.btoa : Base64.encode;
						exheaders[sentAs] = encodeFunc(_value);
						let pwdSentAs = meta.pwdSentAs || (sentAs + '-MD5');
						exheaders[pwdSentAs] = this.rawBufMD5(_value);
					} else if (meta.type === 'number' && Number(_value)) {
						exheaders[sentAs] = encodeURIWithSafe(String(_value), safe);
					} else if (meta.type === 'boolean') {
						exheaders[sentAs] = encodeURIWithSafe(_value ? 'true' : 'false', safe);
					} else if (meta.type === 'callback') {
						exheaders[sentAs] = Base64.encode(JSON.stringify(_value))
					} else if (meta.type === 'adapter') {
						let val = this[key + 'Adapter'](_value, signatureContext);
						if (val) {
							exheaders[sentAs] = encodeURIWithSafe(String(val), safe);
						}
					} else {
						exheaders[sentAs] = encodeURIWithSafe(String(_value), safe, meta.skipEncoding);
					}
				} else if (meta.location === 'urlPath') {
					let sep = urlPath === '' ? '?' : '&';
					let value = _value;
					if (meta.type !== 'number' || (meta.type === 'number' && Number(value) >= 0)) {
						urlPath += sep + encodeURIWithSafe(sentAs, '/') + '=' + encodeURIWithSafe(String(value), '/');
					}
				} else if (meta.location === 'xml') {
					let mxml = this.toXml(param, meta, key, sentAs, signatureContext);
					if (mxml) {
						xml += mxml;
					}
				} else if (meta['location'] === 'body') {
					xml = _value;
				}
			}
		}
	}

	let isFile = opt.dstFile === 'file';

	if(!('Content-Type' in exheaders) && !isFile){
		exheaders['Content-Type'] = 'binary/octet-stream';
	}

	if('data' in model  && 'xmlRoot' in model.data){
		if(xml || model.data.xmlAllowEmpty){
			let xmlRoot = model.data.xmlRoot;
			xml = '<' + xmlRoot + '>' + xml + '</' + xmlRoot + '>';
			exheaders['Content-Type'] = 'application/xml';
		}
	}
	if(isFile){
		opt.rawUri = uri;
	}

	exheaders.Host = this.server + ((this.port === 80 || this.port === 443) ? '' : ':' + this.port);

	if(!this.pathStyle && !this.isCname){
		let uriList = uri.split('/');
		if(uriList.length >= 2 && uriList[1]){
			exheaders.Host = uriList[1] + '.' + exheaders.Host;
			let requestUri = uri.replace(uriList[1], '');
			if(requestUri.indexOf('//') === 0){
				requestUri = requestUri.slice(1);
			}
			if(signatureContext.signature === 'v4'){
				uri = requestUri;
			}else if(requestUri === '/'){
				uri += '/';
			}
			opt.requestUri = encodeURIWithSafe(requestUri, '/');
		}
	}
	opt.method = method;
	opt.uri = encodeURIWithSafe(uri, '/');
	opt.urlPath = urlPath;
	if(xml){
		if(model.data && model.data.md5){
			this.checkAlgorithm === ContentSHA256 
				? exheaders[`${signatureContext.headerPrefix}${ContentSHA256.toLowerCase()}`] = this.bufSHA256(xml, 'hex')
				: exheaders[ContentMD5] = this.bufMD5(xml);
			exheaders['Content-Length'] = xml.length === 0 ? '0' : String(xml.length);
		}
		opt.xml = xml;
		this.log.runLog('debug', methodName, 'request content:' + xml);
	}

	opt.headers = exheaders;

	if('srcFile' in opt){
		if((opt.srcFile instanceof window.File) || (opt.srcFile instanceof window.Blob)){
			let fileSize = opt.srcFile.size;
			if ('Content-Length' in opt.headers || 'PartSize' in opt || 'Offset' in opt) {
				let offset = opt.Offset;
				offset = (offset && offset >= 0 && offset < fileSize) ? offset : 0;
				let partSize;
				if('PartSize' in opt){
					partSize = opt.PartSize;
				}else if('Content-Length' in opt.headers){
					partSize = parseInt(opt.headers['Content-Length'], 10);
				}else{
					partSize = fileSize;
				}
				partSize = (partSize && partSize > 0 && partSize <= fileSize - offset) ? partSize : fileSize - offset;
				opt.PartSize = partSize;
				opt.Offset = offset;
				opt.headers['Content-Length'] = String(opt.PartSize);
			}
		}
	}
	return opt;
};

Utils.prototype.parseCommonHeaders = function(opt, headers, signatureContext){
	for(let key in commonHeaders){
		if ({}.hasOwnProperty.call(commonHeaders, key)) {
			opt.InterfaceResult[commonHeaders[key]] = headers[key];
		}
	}
	opt.InterfaceResult.RequestId = headers[signatureContext.headerPrefix + 'request-id'];
	opt.InterfaceResult.Id2 = headers[signatureContext.headerPrefix + 'id-2'];
	opt.CommonMsg.RequestId = opt.InterfaceResult.RequestId;
	opt.CommonMsg.Id2 = opt.InterfaceResult.Id2;
};

Utils.prototype.contrustCommonMsg = function(opt, obj, headers, signatureContext){
	opt.InterfaceResult = {};
	this.parseCommonHeaders(opt, headers, signatureContext);
	for (let key in obj){
		if(obj[key].location !== 'header'){
			continue;
		}
		let sentAs = obj[key].sentAs || key;

		if(obj[key].withPrefix){
			sentAs = signatureContext.headerPrefix + sentAs;
		}

		if(obj[key].type === 'object'){
			opt.InterfaceResult[key] = parseObjectFromHeaders(sentAs, headers);
		}else{
			let val = null;
			if(sentAs in headers){
				val = headers[sentAs];
			}else if(sentAs.toLowerCase() in headers){
				val = headers[sentAs.toLowerCase()];
			}
			if(val !== null){
				opt.InterfaceResult[key] = val;
			}
		}
	}
};


Utils.prototype.getRequest = function(methodName, serverback, signatureContext, retryCount, params, bc){
    let regionDomains = this.regionDomains;
	let opt = {};
	let log = this.log;
	let model = signatureContext.signature === 'obs' ? obsModel[methodName + 'Output'] : v2Model[methodName + 'Output'];
	model = model || {};
	let obj = model.parameters || {};
	opt.CommonMsg = {
		Status : serverback.status,
		Code : '',
		Message : '',
		HostId : '',
		RequestId : '',
		InterfaceResult : null
	};

	let headers = serverback.headers;
	let headersStr = headerTostring(headers);

	log.runLog('info', methodName, 'get response start, statusCode:' + serverback.status);
	log.runLog('debug', methodName, 'response msg :statusCode:' + serverback.status + ', headers:' + headersStr);

	let doLog = function(){
		let logMsg = 'Status:' + opt.CommonMsg.Status + ', Code:' + opt.CommonMsg.Code + ', Message:' + opt.CommonMsg.Message;
		log.runLog('debug', methodName, 'exec interface ' + methodName + ' finish, ' + logMsg);
		bc(null, opt);
	};

	if(serverback.status >= 300 && serverback.status < 400 && serverback.status !== 304 && retryCount <= 5){
        let location = headers.location || headers.Location;
		if(location){
			let err = 'http code is 3xx, need to redirect to ' + location;
			log.runLog('warn', methodName, err);
			let redirectErr = new Error('redirect');
			redirectErr.location = location;
			redirectErr.bucketLocation = headers['x-amz-bucket-region'] || headers['x-obs-bucket-region'];
			return bc(redirectErr);
		}
		let bucketLocation = headers['x-amz-bucket-region'] || headers['x-obs-bucket-location'];
		if (bucketLocation && regionDomains[bucketLocation]) {
            let regionServer = (this.isSecure ? 'https://' : 'http://') + regionDomains[bucketLocation];
			if (isFunction(this.setRequestHeaderHook)) {
				this.setRequestHeaderHook(headers, params, methodName, regionDomains[bucketLocation]);
			}
            let err = 'get redirect code 3xx, need to redirect to' + regionServer;
            log.runLog('error', methodName, err);
            let redirectErr = new Error('redirect');
			redirectErr.location = regionServer;
            return bc(redirectErr);
        }
		log.runLog('error', methodName, 'get redirect code 3xx, but no location in headers');
	}

	if(serverback.status < 300){
		let body = serverback.data;
		this.contrustCommonMsg(opt, obj, headers, signatureContext);
		let respMsg = 'Status: ' + opt.CommonMsg.Status + ', headers: ' +  headersStr;
		if(body){
			respMsg += 'body length: ' + body.length;
			log.runLog('debug', methodName, 'response body length:' + body.length);
		}
		log.runLog('debug', methodName, respMsg);

		if(body && ('data' in model)){
			if (params.CallbackUrl && model.CallbackResponse) {
				opt.InterfaceResult[model.CallbackResponse.sentAs] = body;
				doLog();
				return;
			}

			if(model.data.type === 'xml'){
				let that = this;
				return makeObjFromXml(body, function(err, result){
					if(err){
						log.runLog('error', methodName, 'change xml to json err [' + headerTostring(err) + ']' );
						return bc(err, null);
					}

					let tempResult = result;
					if(model.data.xmlRoot && (model.data.xmlRoot in tempResult)){
						tempResult = result[model.data.xmlRoot];
					}
					let ifRootXMlDecode = tempResult.EncodingType ? true : false;
					if(isObject(tempResult)){
						for (let key in obj){
							if(obj[key].location === 'xml'){
								opt.InterfaceResult[key] = that.jsonToObject(obj,tempResult,key,ifRootXMlDecode)[key];
							}
						}
					}

					doLog();
				});
			}

			if(model.data.type === 'body'){
				for (let key in obj){
					if(obj[key].location === 'body'){
						opt.InterfaceResult[key] = body;
						break;
					}
				}
			}
		}
		return doLog();
	}

	let body = serverback.data;
	let respMsg = 'Status: ' + opt.CommonMsg.Status + ', headers: ' +  headersStr;
	if(body !== ''){
		respMsg += 'body: ' + body;
		log.runLog('debug', methodName, 'response body :' + body);
	}
	opt.CommonMsg.RequestId = headers[signatureContext.headerPrefix + 'request-id'];
	opt.CommonMsg.Id2 = headers[signatureContext.headerPrefix + 'id2'];
	opt.CommonMsg.Indicator = headers['x-reserved-indicator'];

	log.runLog('info', methodName, 'request finished with request id:' + opt.CommonMsg.RequestId);
	log.runLog('debug', methodName, respMsg);

	if(!body){
		return doLog();
	}

	return makeObjFromXml(body, function(err, re){
		if(err){
			log.runLog('error', methodName, 'change xml to json err [' + headerTostring(err) + ']' );
			opt.CommonMsg.Message = err.message;
		}else if(re){
			if ('Error' in re) {
				let errMsg = re.Error;
				for(let param in errMsg) {
					if (errMsg[param] && errMsg[param]['#text']) {
						opt.CommonMsg[param] = errMsg[param]['#text'];
					}
				}
			} else {
				let errMsg = re;
				if('code' in errMsg){
					opt.CommonMsg.Code = errMsg.code;
				}
				if('message' in errMsg){
					opt.CommonMsg.Message = errMsg.message;
				}
				if('hostId' in errMsg){
					opt.CommonMsg.HostId = errMsg.hostId;
				}
				if(('request_id' in errMsg) && errMsg.request_id){
					opt.CommonMsg.RequestId = errMsg.request_id;
				}
			}

			log.runLog('error', methodName, 'request error with error code:' + opt.CommonMsg.Code + ', error message:' + opt.CommonMsg.Message + ', request id:' + opt.CommonMsg.RequestId);
		}
		doLog();
	});
};

Utils.prototype.makeRequest = function(methodName, opt, retryCount, bc){
	let log = this.log;
	let body = opt.xml || null;
	let signatureContext = opt.signatureContext || this.signatureContext;
	delete opt.headers.Authorization; // retry bug fix

	if(opt.dstFile === 'file'){
		let queryParams = {};
		if(opt.urlPath){
			let path = opt.urlPath.slice(1);
			let arrPath = path.split('&');
			for(let i=0;i<arrPath.length;i++){
				if(arrPath[i].indexOf('=') === -1){
					queryParams[arrPath[i]] = '';
				}else{
					let temp = arrPath[i].split('=');
					queryParams[temp[0]] = temp[1];
				}
			}
		}

		let rawUri = opt.rawUri.split('/');
		let bucketName = rawUri[1];
		let objectKey = opt.rawUri.slice(('/' + bucketName + '/').length);
		
		if (this.isCname) {
			objectKey = opt.rawUri.slice(1);
			bucketName = ''
		}

		let ret = {};
		ret.CommonMsg = {
			Status : 0,
			Code : '',
			Message : '',
			HostId : ''
		};
		ret.InterfaceResult = {};
		let model = signatureContext.signature === 'obs' ? obsModel[methodName + 'Output'] : v2Model[methodName + 'Output'];
		let obj = model.parameters;
		for (let key in obj){
			if(obj[key].location === 'body'){
				ret.InterfaceResult[key] = this.createSignedUrlSync({
					Method : opt.method,
					Bucket : bucketName,
					Key : objectKey,
					Expires : 3600,
					Headers : opt.headers,
					QueryParams : queryParams,
					signatureContext : signatureContext
				});
				break;
			}
		}
		return bc(null, ret);
	}

	let requestDate = opt.$requestParam.RequestDate;
	let nowDate;
	let requestDateType = Object.prototype.toString.call(requestDate);
	if(requestDateType === '[object Date]'){
		nowDate = requestDate;
	}else if(requestDateType === '[object String]'){
		try{
			nowDate = new Date();
			nowDate.setTime(Date.parse(requestDate));
		}catch(e){
			// ignore
		}
	}

	if(!nowDate){
		nowDate = new Date();
	}

	let utcDateStr = nowDate.toUTCString();
	let isV4 = signatureContext.signature.toLowerCase() === 'v4';
	opt.headers[signatureContext.headerPrefix + 'date'] = isV4 ? getDates(utcDateStr)[1] : utcDateStr;
	let path = (opt.requestUri ? opt.requestUri : opt.uri) + opt.urlPath;

	if(this.ak && this.sk && methodName !== negotiateMethod){
		if(this.securityToken){
			opt.headers[signatureContext.headerPrefix + 'security-token'] = this.securityToken;
		}
		if(isV4){
			this.v4Auth(opt, methodName, signatureContext);
		}else{
			this.doAuth(opt, methodName, signatureContext);
		}
	}

	let ex = opt.headers;
    if (isFunction(this.setRequestHeaderHook)) {
        this.setRequestHeaderHook(ex, opt.$requestParam, methodName);
    }
	let host = ex.Host;
	let method = opt.method;
	let header_msg = {};
	for (let key in ex){
		if ({}.hasOwnProperty.call(ex, key)) {
			header_msg[key] = ex[key];
		}
	}
	header_msg.Authorization = '****';
	let msg = 'method:' + method + ', path:' + path + 'headers:' + headerTostring(header_msg);
	if (body) {
		msg += 'body:' + body;
	}
	log.runLog('info', methodName, 'prepare request parameters ok,then Send request to service start');
	log.runLog('debug', methodName, 'request msg:' + msg);

	let _isSecure = opt.protocol ? opt.protocol.toLowerCase().indexOf('https') === 0 : this.isSecure;
	let port = opt.port || this.port;

	// avoid to set unsafe headers
	delete ex.Host;
	delete ex['Content-Length'];

	let responseType = 'text';
	if(opt.dstFile && opt.dstFile !== 'file' && (opt.dstFile === 'arraybuffer' || opt.dstFile === 'blob')){
		responseType = String(opt.dstFile);
	}

	let start = nowDate.getTime();
	let that = this;

	let dealingError = function(err) {
		// with angular, headerTostring may lead to exception.
		try {
			let headerStr = headerTostring(err);
			log.runLog('error', methodName, 'Send request to service error [' + headerStr + ']');
		} catch(e) {
			if (err.toString) {
				log.runLog('error', methodName, 'Send request to service error [' + err.toString() + ']');
			}
		}
		log.runLog('info', methodName, 'http cost ' +  (new Date().getTime()-start) + ' ms');
		bc(err, null);
	}

	if(!this.useRawXhr){
		let onUploadProgress = null;
		let onDownloadProgress = null;
		if(isFunction(opt.ProgressCallback)){
			let progressListener = function(event){
				if(event.lengthComputable){
					opt.ProgressCallback(event.loaded, event.total, (new Date().getTime() - start) / 1000);
				}
			};
			if(method === 'GET'){
				onDownloadProgress = progressListener;
			}else if(method === 'PUT' || method === 'POST'){
				onUploadProgress = progressListener;
			}
		}
		let portInfo = ':' + port;
		if (host.indexOf(':') >=0 ) {
			portInfo = '';
		}
		// 适配cf2,在请求中增加通配符
		let baseUrl='';
		let httpPrefix = _isSecure ? 'https://' : 'http://';
		if (this.urlPrefix && isFunction(this.setRequestHeaderHook) && methodName !== 'UploadPart') {
			let defaultRegion = true;
			if(opt.$requestParam['hasRegion']||opt.$requestParam['redirectRegion']){
				defaultRegion = false;
			}

			let portFlag='';
			if(port === 5443){
				portFlag='-5443';
			}

			if (defaultRegion) {
				if (opt.$requestParam['Bucket']) {
					if(opt.$requestParam['Bucket'].indexOf('.') !== -1){
						baseUrl = httpPrefix + this.urlPrefix + '/bucket'+ portFlag;
					}
					baseUrl = httpPrefix + this.urlPrefix + '/bucket'+ portFlag;
				} else {
					if (path.split('?')[0] === '/') {
						baseUrl = httpPrefix + this.urlPrefix + portFlag;
					} else {
						baseUrl = httpPrefix + this.urlPrefix + '/place' + portFlag;
					}
				}
			} else {
				if (opt.$requestParam['Bucket']) {
					baseUrl = httpPrefix + this.urlPrefix + '/region-bucket'+ portFlag;
				} else {
					baseUrl = httpPrefix + this.urlPrefix + '/region'+ portFlag;
				}
			}
		} else {
			baseUrl = httpPrefix + host + portInfo;
		}

		let reopt = {
			method : method,
			// fix bug, axios will abandon the base url if the request url starts with '//', so use the completed url to avoid it
			url : baseUrl + path,
			withCredentials: false,
			headers : ex,
			validateStatus: function(status){
				return status >= 200;
			},
			maxRedirects : 0,
			responseType : responseType,
			data : body,
			timeout : this.timeout * 1000,
			onUploadProgress : onUploadProgress,
			onDownloadProgress : onDownloadProgress,
			cancelToken : new axios.CancelToken(function(cancelHook){
				opt.$requestParam.cancelHook = cancelHook;
			})
		};
		if(opt.srcFile){
			if(!(opt.srcFile instanceof window.File) && !(opt.srcFile instanceof window.Blob)){
				return bc(new Error('source file must be an instance of window.File or window.Blob'), null);
			}

			let srcFile = opt.srcFile;
			try{
				if(opt.Offset >= 0 && opt.PartSize > 0){
					srcFile = this.sliceBlob(srcFile, opt.Offset, opt.Offset + opt.PartSize);
				}else if('ContentLength' in opt){
					let contentLength = parseInt(opt.ContentLength, 10);
					if(contentLength > 0){
						srcFile = this.sliceBlob(srcFile, 0, contentLength);
					}
				}
			}catch (e) {
				return bc(e);
			}

			reopt.data = srcFile;
		}
		axios.request(reopt).then(function (response) {
			log.runLog('info', methodName, 'http cost ' +  (new Date().getTime()-start) + ' ms');
			that.getRequest(methodName, response, signatureContext, retryCount, opt.$requestParam, bc);
		}).catch(function (err) {
			dealingError(err);
		});
		return;
	}

	let xhr = null;
	// Firefox, Opera 8.0+, Safari
	try {
		xhr = new XMLHttpRequest();
	} catch (e) {
		try { // InternetExplorer
			xhr = new ActiveXObject('Msxml2.XMLHTTP');
		} catch (e1) {
			try {
				xhr = new ActiveXObject('Microsoft.XMLHTTP');
			} catch (e2) {
			}
		}
	}

 	if(xhr === null){
 		return bc(new Error('XHR is not available'), null);
 	}

	if(opt.srcFile){
		if(!(opt.srcFile instanceof window.File) && !(opt.srcFile instanceof window.Blob)){
			return bc(new Error('source file must be an instance of window.File or window.Blob'), null);
		}

		try{
			let srcFile = opt.srcFile;
			if(opt.Offset >= 0 && opt.PartSize > 0){
				srcFile = this.sliceBlob(srcFile, opt.Offset, opt.Offset + opt.PartSize);
			}else if('ContentLength' in opt){
				let contentLength = parseInt(opt.ContentLength, 10);
				if(contentLength > 0){
					srcFile = this.sliceBlob(srcFile, 0, contentLength);
				}
			}
			body = srcFile;
		}catch (e) {
			return bc(e);
		}
	}
	xhr.open(method, (_isSecure ? 'https://' + this.urlPrefix + host : 'http://' + this.urlPrefix + host) + path);
	xhr.withCredentials = false;
	for(let key in ex){
		if ({}.hasOwnProperty.call(ex, key)) {
			xhr.setRequestHeader(key, ex[key]);
		}
	}
	xhr.timeout = that.timeout * 1000;
	xhr.responseType = responseType;
	opt.$requestParam.cancelHook = function(){
		xhr.abort();
	};
	xhr.onreadystatechange = function(){
		if(xhr.readyState === 4 && xhr.status >= 200) {
			log.runLog('info', methodName, 'http cost ' +  (new Date().getTime()-start) + ' ms');
			let headers = xhr.getAllResponseHeaders();
		    let arr = headers.trim().split(/[\r\n]+/);
		    let headerMap = {};
		    for(let i=0;i<arr.length;i++){
		    	let line = arr[i];
		    	let parts = line.split(': ');
			    let header = parts.shift();
			    let value = parts.join(': ');
			    headerMap[header.toLowerCase()] = value;
		    }
		    let data = xhr.response;
		    if(!data && (responseType === '' || responseType === 'text')){
		    	data = xhr.responseText;
		    }
			let response = {
				status : xhr.status,
				headers : headerMap,
				data : data
			};
			that.getRequest(methodName, response, signatureContext, retryCount, opt.$requestParam, bc);
		}
	};

	let handled = false;
	let errHandler = function(err){
		if(handled){
			return;
		}
		handled = true;
		dealingError(err);
	};

	// For the compatibility with Axios
	xhr.ontimeout = function(){
		errHandler(new Error('timeout of ' + xhr.timeout + 'ms exceed'));
	};

	// For the compatibility with Axios
	xhr.onerror = function(){
		errHandler(new Error('Network Error'));
	};

	// For the compatibility with Axios
	xhr.onabort = function(){
		errHandler(new Error('Cancel'));
	};

	if(xhr.upload){
		// For the compatibility with Axios
		xhr.upload.ontimeout = function(){
			errHandler(new Error('timeout of ' + xhr.timeout + 'ms exceed'));
		};

		// For the compatibility with Axios
		xhr.upload.onerror = function(){
			errHandler(new Error('Network Error'));
		};

		// For the compatibility with Axios
		xhr.upload.onabort = function(e){
			errHandler(new Error('Cancel'));
		};
	}

	if(isFunction(opt.ProgressCallback)){
		if(method === 'GET' || !xhr.upload){
			xhr.onprogress = function(event){
				if(event.lengthComputable){
					opt.ProgressCallback(event.loaded, event.total, (new Date().getTime() - start) / 1000);
				}
			};
		}else if(method === 'PUT' || method === 'POST'){
			xhr.upload.onprogress = function(event){
				if(event.lengthComputable){
					opt.ProgressCallback(event.loaded, event.total, (new Date().getTime() - start) / 1000);
				}
			};
		}
	}
	xhr.send(body);
};

Utils.prototype.sendRequest = function(funcName, opt, backcall, retryCount){
	if(retryCount === undefined){
		retryCount = 1;
	}
	let uploadPartRetry = false
	if(retryCount <= opt.$requestParam.maxPartRetryCount){
		uploadPartRetry = true
	}
	const host = opt.headers.Host
	let that = this;
	that.makeRequest(funcName, opt, retryCount, function(err, msg){
		if(err && err.message === 'redirect'){
			let uri = urlLib.parse(err.location);
			if(err.bucketLocation && uri.hostname.indexOf(opt.$requestParam['Bucket']) !== -1){
				opt.$requestParam.redirectRegion =err.bucketLocation;
			}
			opt.headers.Host = uri.hostname;
			opt.protocol = uri.protocol;
			opt.port = uri.port || ((opt.protocol && opt.protocol.toLowerCase().indexOf('https') === 0) ? 443 : 80);
			that.sendRequest(funcName, opt, backcall, retryCount + 1);
		}else if(funcName === 'UploadPart' && uploadPartRetry && (err || msg.CommonMsg.Status > 300)){
			opt.headers.Host = host
			that.sendRequest(funcName, opt, backcall, retryCount + 1);
		}else{
			backcall(err, msg);
		}
	});
};


Utils.prototype.doAuth = function(opt, methodName, signatureContext) {
	let interestHeader = ['Content-MD5', 'Content-Type'];
	let stringToSign = opt.method + '\n';
	for(let i=0;i<interestHeader.length;i++){
		if(interestHeader[i] in opt.headers){
			stringToSign += opt.headers[interestHeader[i]];
		}
		stringToSign += '\n';
	}
	if (!((signatureContext.headerPrefix + 'date') in opt.headers)){
		stringToSign += opt.headers.Date;
	}
	stringToSign += '\n';

	let temp = [];
	for(let originKey in opt.headers){
		if ({}.hasOwnProperty.call(opt.headers, originKey)) {
			let lowerKey = originKey.toLowerCase();
			if (lowerKey.indexOf(signatureContext.headerPrefix) === 0) {
				temp.push({
					key: lowerKey,
					value: opt.headers[originKey]
				});
			}
		}
	}
	temp = temp.sort(function (obj1, obj2) {
		if (obj1.key < obj2.key) {
			return -1;
		}
		if (obj1.key > obj2.key) {
			return 1;
		}
		return 0;
	});
	for(let i=0;i<temp.length;i++){
		let key = temp[i].key;
		let val = key.indexOf(signatureContext.headerMetaPrefix) === 0  ? temp[i].value.trim() : temp[i].value;
		stringToSign += key + ':' + val + '\n';
	}

	let path = opt.uri;
	if(this.isCname){
		if(path === '/'){
			path += opt.headers.Host + '/';
		}else if(path.indexOf('/') === 0){
			path = '/' + opt.headers.Host + path;
		}
	}
	if(opt.urlPath){
		let _path = opt.urlPath.slice(1);
		let arrPath = _path.split('&').sort();
		let urlPath = '';
		for(let i=0;i<arrPath.length;i++){
			let listvar = arrPath[i].split('=');
			let key = decodeURIComponent(listvar[0]);
			if(allowedResourceParameterNames.indexOf(key.toLowerCase()) >= 0){
				urlPath += urlPath === '' ?  '?' : '&';
				urlPath += key;
				if(listvar.length === 2 && listvar[1]){
					urlPath += '=' + decodeURIComponent(listvar[1]);
				}
			}
		}
		path += urlPath;
	}
	stringToSign += path;
	this.log.runLog('debug', methodName, 'stringToSign:' + stringToSign);
	opt.headers.Authorization = signatureContext.authPrefix + ' ' + this.ak + ':' + crypto.createHmac('sha1', this.sk).update(stringToSign).digest('base64');
};

Utils.prototype.v4Auth = function(opt, methodName, signatureContext){
	opt.headers[signatureContext.headerPrefix + 'content-sha256'] = CONTENT_SHA256;
	let header = opt.headers;
	let log = this.log;
	let shortDate = null;
	let longDate = null;

	if((signatureContext.headerPrefix + 'date') in header){
		longDate = header[signatureContext.headerPrefix + 'date'];
		shortDate = longDate.slice(0, longDate.indexOf('T'));
	}else{
		let dates = getDates(header.Date);
		shortDate = dates[0];
		longDate = dates[1];
	}

	let credenttial = this.ak + '/' + shortDate + '/' + this.region + '/s3/aws4_request';

	let signedAndCanonicalHeaders = getSignedAndCanonicalHeaders(header);

	let signedHeaders = signedAndCanonicalHeaders[0];
	let canonicalHeaders = signedAndCanonicalHeaders[1];

	let canonicalQueryString = '';
	if(opt.urlPath){
		let path = opt.urlPath.slice(1);
		let arrPath = path.split('&');
		arrPath = arrPath.sort();
		for(let i=0;i<arrPath.length;i++){
			canonicalQueryString += arrPath[i];
			if(arrPath[i].indexOf('=') === -1){
				canonicalQueryString += '=';
			}
			if(i !== arrPath.length -1){
				canonicalQueryString += '&';
			}
		}
	}
	let canonicalRequest = opt.method + '\n';
	canonicalRequest += opt.uri +  '\n';
	canonicalRequest += canonicalQueryString + '\n';
	canonicalRequest += canonicalHeaders + '\n';
	canonicalRequest += signedHeaders + '\n';
	canonicalRequest += CONTENT_SHA256;
	log.runLog('debug', methodName, 'canonicalRequest:' + canonicalRequest);

	let signature = getV4Signature(shortDate, longDate, this.sk, this.region, canonicalRequest);

	opt.headers.Authorization = 'AWS4-HMAC-SHA256 Credential=' + credenttial + ',SignedHeaders=' + signedHeaders + ',Signature=' + signature;
};


Utils.prototype.bufMD5 = function(buf) {
	return crypto.createHash('md5').update(buf).digest('base64');
};

Utils.prototype.bufSHA256 = function(buf, type = 'base64') {
	return crypto.createHash('sha256').update(buf).digest(type);
};

Utils.prototype.rawBufMD5 = function(buf) {
	return crypto.createHash('md5').update(buf).digest('rawbase64');
};

Utils.prototype.createSignedUrl = function(param){
	let signatureContext = param.signatureContext || this.signatureContext;
	return signatureContext.signature.toLowerCase() === 'v4' ? this.createV4SignedUrlSync(param) : this.createV2SignedUrl(param);
};

Utils.prototype.createSignedUrlSync = function(param){
	let signatureContext = param.signatureContext || this.signatureContext;
	return signatureContext.signature.toLowerCase() === 'v4' ? this.createV4SignedUrlSync(param) : this.createV2SignedUrlSync(param);
};

Utils.prototype.getStringToSign = function(opt, param) {
	let {isShareFolder, queryParams, queryParamsKeys} = opt
	let signatureContext = param.signatureContext || this.signatureContext;
	let method = param.Method ? String(param.Method) : 'GET';
	let bucketName = param.Bucket ? String(param.Bucket) : null;
	let objectKey = param.Key ? String(param.Key) : null;
	let policy = param.Policy ? String(param.Policy) : null;
	let expires = param.Expires ? parseInt(param.Expires, 10) : 300;
	if(expires < 0){
		expires = 300;
	}
	expires = parseInt(new Date().getTime() / 1000, 10) + expires;
	
	let headers = {};
	if(param.Headers && (param.Headers instanceof Object) && !(param.Headers instanceof Array)){
		for(let key in param.Headers) {
			if ({}.hasOwnProperty.call(param.Headers, key)) {
				headers[key] = param.Headers[key];
			}
		}
	}

	let interestHeaders = {};
	for(let name in headers){
		if ({}.hasOwnProperty.call(headers, name)) {
			let key = String(name).toLowerCase();
			if (key === 'content-type' || key === 'content-md5' || key.length > signatureContext.headerPrefix.length && key.slice(0, signatureContext.headerPrefix.length) === signatureContext.headerPrefix) {
				interestHeaders[key] = headers[name];
			}
		}
	}

	let resource = '';
	let host = this.server;
	if(this.isCname){
		resource += '/' + host + '/';
	}else if(bucketName){
		resource += '/' + bucketName;
		if(!this.pathStyle){
			host = bucketName + '.' + host;
			resource += '/';
		}
	}

	if(objectKey){
		if(resource.lastIndexOf('/') !== resource.length - 1){
			resource += '/';
		}
		objectKey = encodeURIWithSafe(objectKey, '/');
		resource += objectKey;
	}

	if(resource === ''){
		resource = '/';
	}

	// 拼接查询参数
	queryParamsKeys.sort();
	let flag = false;
	let _resource = [];
	let safeKey = isShareFolder ? '': '/';
	for(let i=0;i<queryParamsKeys.length;i++){
		let key = queryParamsKeys[i];
		let val = queryParams[key];
		key = encodeURIWithSafe(key, safeKey);
		val = encodeURIWithSafe(val, safeKey);
		// 分享文件夹不需要query信息不需要增加 policy
		if((!isShareFolder || key.toLowerCase() !== 'policy') && (allowedResourceParameterNames.indexOf(key.toLowerCase())>=0 || key.toLowerCase().indexOf(signatureContext.headerPrefix) === 0)){
			flag = true;
			let _val = val ? key + '=' + decodeURIComponent(val) : key;
			_resource.push(_val);
		}
	}
	_resource = _resource.join('&');
	if(flag){
		_resource = '?' + _resource;
	}
	resource += _resource;
	let stringToSign = [method];
	stringToSign.push('\n');

	if('content-md5' in interestHeaders){
		stringToSign.push(interestHeaders['content-md5']);
	}
	stringToSign.push('\n');

	if('content-type' in interestHeaders){
		stringToSign.push(interestHeaders['content-type']);
	}
	stringToSign.push('\n');
	if(isShareFolder) {
		stringToSign.push(policy);
	} else {
		stringToSign.push(String(expires));
	}

	stringToSign.push('\n');

	if(!isShareFolder){
		let temp = [];
		let i = 0;
		for(let key in interestHeaders){
			if (key.length > signatureContext.headerPrefix.length && key.slice(0, signatureContext.headerPrefix.length) === signatureContext.headerPrefix){
				temp[i++] = key;
			}
		}
		temp = temp.sort();
		for(let j=0;j<temp.length;j++){
			stringToSign.push(temp[j]);
			stringToSign.push(':');
			stringToSign.push(interestHeaders[temp[j]]);
			stringToSign.push('\n');
		}

		stringToSign.push(resource);
	}else {
		stringToSign.push(_resource);
	}
	return {
		stringToSign: stringToSign.join(''),
		headers,
		host
	};
};

function covertStorageClass(storageClass, signature) {
	if (!['storageClass', 'storagePolicy'].includes(storageClass)) {
		return
	}
	if (signature === 'obs') {
		return 'storageClass';
	}
	if (signature === 'v2') {
		return 'storagePolicy';
	}
};

Utils.prototype.getQueryParams = function(param){
	let policy = param.Policy ? String(param.Policy) : null;
	let prefix = param.Prefix ? String(param.Prefix) : null;
	let expires = param.Expires ? parseInt(param.Expires, 10) : 300;
	// 循环获取参数中的queryParams
	let queryParams = {};
	if(param.QueryParams && (param.QueryParams instanceof Object) && !(param.QueryParams instanceof Array)){
		for(let key of Object.keys(param.QueryParams)){
			queryParams[key] = param.QueryParams[key];
		}
	}
	let specialParam = param.SpecialParam ? String(param.SpecialParam) : null;

	// 添加specialParam
	let signatureContext = param.signatureContext || this.signatureContext;
	let sc = covertStorageClass(specialParam, signatureContext.signature.toLowerCase());
	if (sc) {
		specialParam = sc;
	}
	if(specialParam){
		queryParams[specialParam] = '';
	}
	if(param.AfterStringToSign){
		const pre = '$';
		queryParams[signatureContext.headerPrefix + 'security-token'] = pre + '{hws:security-token}';
	}else if(this.securityToken && !queryParams[signatureContext.headerPrefix + 'security-token']){
		queryParams[signatureContext.headerPrefix + 'security-token'] = this.securityToken;
	}

	if(expires < 0){
		expires = 300;
	}
	expires = parseInt(new Date().getTime() / 1000, 10) + expires;

	let isShareFolder = policy && prefix; 
	// 添加policy、prefix、expires
	if(isShareFolder) {
		queryParams.Policy = policy;
		queryParams.prefix = prefix;
	} else {
		queryParams.Expires = String(expires);
	}

	let queryParamsKeys = [];
	Object.keys(queryParams).forEach(e => {
		queryParamsKeys.push(e);
	})

	queryParamsKeys.sort();

	return {isShareFolder, queryParams, queryParamsKeys}
}

Utils.prototype.getSignResult = function(opt, ak, stsToken) {
	// 获取计算签名时的resulet
	let {bucketName, objectKey, signatureContext, isShareFolder, queryParams, queryParamsKeys} = opt
	// 为queryParams添加钩子函数获取到的ak和token
	if(stsToken){
		queryParams[signatureContext.headerPrefix + 'security-token'] = stsToken;
	}

	if(signatureContext.signature.toLowerCase() === 'v2'){
		queryParams.AWSAccessKeyId = ak;
		queryParamsKeys.push('AWSAccessKeyId')
	}else{
		queryParams.AccessKeyId = ak;
		queryParamsKeys.push('AccessKeyId')
	}

	let result = '';
	if(bucketName && this.pathStyle){
		result += '/' + bucketName;
	}
	if(objectKey){
		objectKey = encodeURIWithSafe(objectKey, '/');
		result += '/' + objectKey;
	}
	result += '?';
	
	queryParamsKeys.sort();
	let safeKey = isShareFolder ? '': '/';
	for(let i=0;i<queryParamsKeys.length;i++){
		let key = queryParamsKeys[i];
		let val = queryParams[key];
		key = encodeURIWithSafe(key, safeKey);
		val = encodeURIWithSafe(val, safeKey);
		result += key;
		if(val){
			result += '=' + val;
		}
		result += '&';
	}
	return result
}

Utils.prototype.createV2SignedUrl = function(param){
	const isSecure = this.isSecure
	const port = this.port
	let {isShareFolder, queryParams, queryParamsKeys} = this.getQueryParams(param)

	let {stringToSign, headers, host} = this.getStringToSign({isShareFolder, queryParams, queryParamsKeys}, param)
	let getSignResultOpt = {
		bucketName : param.Bucket ? String(param.Bucket) : null,
		objectKey : param.Key ? String(param.Key) : null,
		signatureContext : param.signatureContext || this.signatureContext,
		isShareFolder,
		queryParams, 
		queryParamsKeys, 
	}

	if (isFunction(param.AfterStringToSign)) {
		return Promise.resolve(param.AfterStringToSign(stringToSign))
			.then(({signature, ak, stsToken}) => {
				let result = this.getSignResult(getSignResultOpt, ak, stsToken)
				return getSignedUrl(signature, result)
			})
	}

	function getSignedUrl(signature, result){
		if(isShareFolder) {
			result += 'Signature=' + encodeURIWithSafe(signature);
		} else {
			result += 'Signature=' + encodeURIWithSafe(signature, '/');
		}
		return {
			ActualSignedRequestHeaders : headers,
			SignedUrl : (isSecure ? 'https' : 'http') + '://' + host + ':' + port + result
		};
	}

};

Utils.prototype.createV2SignedUrlSync = function(param){
	let {isShareFolder, queryParams, queryParamsKeys} = this.getQueryParams(param)

	let {stringToSign, headers, host} = this.getStringToSign({isShareFolder, queryParams, queryParamsKeys}, param)
	let getSignResultOpt = {
		bucketName : param.Bucket ? String(param.Bucket) : null,
		objectKey : param.Key ? String(param.Key) : null,
		signatureContext : param.signatureContext || this.signatureContext,
		isShareFolder,
		queryParams, 
		queryParamsKeys, 
	}
	
	let result = this.getSignResult(getSignResultOpt, this.ak, this.securityToken)

	let hmac = crypto.createHmac('sha1', this.sk);
	hmac.update(stringToSign);
	if(isShareFolder) {
		result += 'Signature=' + encodeURIWithSafe(hmac.digest('base64'));
	} else {
		result += 'Signature=' + encodeURIWithSafe(hmac.digest('base64'), '/');
	}

	return {
		ActualSignedRequestHeaders : headers,
		SignedUrl : (this.isSecure ? 'https' : 'http') + '://' + host + ':' + this.port + result
	};
};

Utils.prototype.createV4SignedUrlSync = function(param){
	param = param || {};
	let signatureContext = param.signatureContext || this.signatureContext;
	let method = param.Method ? String(param.Method) : 'GET';
	let bucketName = param.Bucket ? String(param.Bucket) : null;
	let objectKey = param.Key ? String(param.Key) : null;
	let specialParam = param.SpecialParam ? String(param.SpecialParam) : null;

	if(specialParam === 'storageClass'){
		specialParam = 'storagePolicy';
	}

	let expires = param.Expires ? parseInt(param.Expires, 10) : 300;
	let headers = {};
	if(param.Headers && (param.Headers instanceof Object) && !(param.Headers instanceof Array)){
		for(let key in param.Headers){
			if ({}.hasOwnProperty.call(param.Headers, key)) {
				headers[key] = param.Headers[key];
			}
		}
	}

	let queryParams = {};
	if(param.QueryParams && (param.QueryParams instanceof Object) && !(param.QueryParams instanceof Array)){
		for(let key in param.QueryParams){
			if ({}.hasOwnProperty.call(param.QueryParams, key)) {
				queryParams[key] = param.QueryParams[key];
			}
		}
	}

	if(this.securityToken && !queryParams[signatureContext.headerPrefix + 'security-token']){
		queryParams[signatureContext.headerPrefix + 'security-token'] = this.securityToken;
	}

	let result = '';
	let resource = '';
	let host = this.server;
	if(bucketName){
		if(this.pathStyle){
			result += '/' + bucketName;
			resource += '/' + bucketName;
		}else{
			host = bucketName + '.' + host;
		}
	}

	if(objectKey){
		objectKey = encodeURIWithSafe(objectKey, '/');
		result += '/' + objectKey;
		resource += '/' + objectKey;
	}

	if(resource === ''){
		resource = '/';
	}

	result += '?';

	if(specialParam){
		queryParams[specialParam] = '';
	}

	if(expires < 0){
		expires = 300;
	}

	let utcDateStr = headers['date'] || headers['Date'] || new Date().toUTCString();

	let dates = getDates(utcDateStr);
	let shortDate = dates[0];
	let longDate = dates[1];

	headers.Host = host + ((this.port === 80 || this.port === 443) ? '' : ':' + this.port);

	queryParams['X-Amz-Algorithm'] = 'AWS4-HMAC-SHA256';
	queryParams['X-Amz-Credential'] = this.ak + '/' + shortDate + '/' + this.region + '/s3/aws4_request';
	queryParams['X-Amz-Date'] = longDate;
	queryParams['X-Amz-Expires'] = String(expires);

    let signedAndCanonicalHeaders = getSignedAndCanonicalHeaders(headers);

	queryParams['X-Amz-SignedHeaders'] = signedAndCanonicalHeaders[0];

	let _queryParams = {};
	let queryParamsKeys = [];
	for(let key in queryParams) {
		if ({}.hasOwnProperty.call(queryParams, key)) {
			let val = queryParams[key];
			key = encodeURIWithSafe(key, '/');
			val = encodeURIWithSafe(val);
			_queryParams[key] = val;
			queryParamsKeys.push(key);
			result += key;
			if (val) {
				result += '=' + val;
			}
			result += '&';
		}
	}

	let canonicalQueryString = '';

	queryParamsKeys.sort();

	for(let i=0;i<queryParamsKeys.length;){
		canonicalQueryString += queryParamsKeys[i] + '=' + _queryParams[queryParamsKeys[i]];
		if(++i !== queryParamsKeys.length){
			canonicalQueryString += '&';
		}
	}

	let canonicalRequest = method + '\n';
	canonicalRequest += resource +  '\n';
	canonicalRequest += canonicalQueryString + '\n';
	canonicalRequest += signedAndCanonicalHeaders[1] + '\n';
	canonicalRequest += signedAndCanonicalHeaders[0] + '\n';
	canonicalRequest += 'UNSIGNED-PAYLOAD';

	let signature = getV4Signature(shortDate, longDate, this.sk, this.region, canonicalRequest);
	result += 'X-Amz-Signature=' + encodeURIWithSafe(signature);
	return {
		ActualSignedRequestHeaders : headers,
		SignedUrl : (this.isSecure ? 'https' : 'http') + '://' + host + ':' + this.port + result
	};

};

Utils.prototype.createPostSignatureSync = function(param){
	let signatureContext = param.signatureContext || this.signatureContext;
	if(signatureContext.signature === 'v4'){
		return this.createV4PostSignatureSync(param);
	}

	param = param || {};
	let bucketName = param.Bucket ? String(param.Bucket) : null;
	let objectKey = param.Key ? String(param.Key) : null;
	let expires = param.Expires ? parseInt(param.Expires, 10) : 300;
	let formParams = {};

	if(param.FormParams && (param.FormParams instanceof Object) && !(param.FormParams instanceof Array)){
		for(let key in param.FormParams){
			if ({}.hasOwnProperty.call(param.FormParams, key)) {
				formParams[key] = param.FormParams[key];
			}
		}
	}

	if(this.securityToken && !formParams[signatureContext.headerPrefix + 'security-token']){
		formParams[signatureContext.headerPrefix + 'security-token'] = this.securityToken;
	}

	let expireDate = new Date();
	expireDate.setTime(parseInt(new Date().getTime(), 10) + expires * 1000);
	expireDate = getExpireDate(expireDate.toUTCString());

	if(bucketName){
		formParams.bucket = bucketName;
	}

	if(objectKey){
		formParams.key = objectKey;
	}

	let policy = [];
	policy.push('{"expiration":"');
	policy.push(expireDate);
	policy.push('", "conditions":[');

	let matchAnyBucket = true;
	let matchAnyKey = true;

	let conditionAllowKeys = ['acl', 'bucket', 'key', 'success_action_redirect', 'redirect', 'success_action_status'];

	for(let key in formParams){
		if(!key){
			continue;
		}
		let val = formParams[key];
		key = String(key).toLowerCase();

		if(key === 'bucket'){
			matchAnyBucket = false;
		}else if(key === 'key'){
			matchAnyKey = false;
		}
		if(allowedResponseHttpHeaderMetadataNames.indexOf(key) < 0 && conditionAllowKeys.indexOf(key) < 0 && key.indexOf(signatureContext.headerPrefix) !== 0){
			continue;
		}

		policy.push('{"');
		policy.push(key);
		policy.push('":"');
		policy.push(val !== null ? String(val) : '');
		policy.push('"},');
	}


	if(matchAnyBucket){
		policy.push('["starts-with", "$bucket", ""],');
	}

	if(matchAnyKey){
		policy.push('["starts-with", "$key", ""],');
	}

	policy.push(']}');

	let originPolicy = policy.join('');

	if(window.btoa){
		policy = window.btoa(originPolicy);
	}else{
		policy = Base64.encode(originPolicy);
	}
	let signature = crypto.createHmac('sha1', this.sk).update(policy).digest('base64');

	return {
		OriginPolicy : originPolicy,
		Policy : policy,
		Signature : signature,
		Token : this.ak + ':' + signature + ':' + policy
	};
};

Utils.prototype.createV4PostSignatureSync = function(param){
	param = param || {};
	let signatureContext = param.signatureContext || this.signatureContext;
	let bucketName = param.Bucket ? String(param.Bucket) : null;
	let objectKey = param.Key ? String(param.Key) : null;
	let expires = param.Expires ? parseInt(param.Expires, 10) : 300;
	let formParams = {};

	if(param.FormParams && (param.FormParams instanceof Object) && !(param.FormParams instanceof Array)){
		for(let key in param.FormParams){
			if ({}.hasOwnProperty.call(param.FormParams, key)) {
				formParams[key] = param.FormParams[key];
			}
		}
	}

	if(this.securityToken && !formParams[signatureContext.headerPrefix + 'security-token']){
		formParams[signatureContext.headerPrefix + 'security-token'] = this.securityToken;
	}

	let utcDateStr = new Date().toUTCString();
	let dates = getDates(utcDateStr);
	let shortDate = dates[0];
	let longDate = dates[1];

	let credential = this.ak + '/' + shortDate + '/' + this.region + '/s3/aws4_request';

	let expireDate = new Date();
	expireDate.setTime(parseInt(new Date().getTime(), 10) + expires * 1000);

	expireDate = getExpireDate(expireDate.toUTCString());

	formParams['X-Amz-Algorithm'] = 'AWS4-HMAC-SHA256';
	formParams['X-Amz-Date'] = longDate;
	formParams['X-Amz-Credential'] = credential;

	if(bucketName){
		formParams.bucket = bucketName;
	}

	if(objectKey){
		formParams.key = objectKey;
	}

	let policy = [];
	policy.push('{"expiration":"');
	policy.push(expireDate);
	policy.push('", "conditions":[');

	let matchAnyBucket = true;
	let matchAnyKey = true;

	let conditionAllowKeys = ['acl', 'bucket', 'key', 'success_action_redirect', 'redirect', 'success_action_status'];

	for(let key in formParams){
		if(!key){
			continue;
		}
		let val = formParams[key];
		key = String(key).toLowerCase();

		if(key === 'bucket'){
			matchAnyBucket = false;
		}else if(key === 'key'){
			matchAnyKey = false;
		}

		if(allowedResponseHttpHeaderMetadataNames.indexOf(key) < 0 && conditionAllowKeys.indexOf(key) < 0 && key.indexOf(signatureContext.headerPrefix) !== 0){
			continue;
		}

		policy.push('{"');
		policy.push(key);
		policy.push('":"');
		policy.push(val !== null ? String(val) : '');
		policy.push('"},');
	}

	if(matchAnyBucket){
		policy.push('["starts-with", "$bucket", ""],');
	}

	if(matchAnyKey){
		policy.push('["starts-with", "$key", ""],');
	}

	policy.push(']}');

	let originPolicy = policy.join('');

	if(window.btoa){
		policy = window.btoa(originPolicy);
	}else{
		policy = Base64.encode(originPolicy);
	}

	let signature = createV4Signature(shortDate, this.sk, this.region, policy);

	return {
		OriginPolicy : originPolicy,
		Policy : policy,
		Algorithm : formParams['X-Amz-Algorithm'],
		Credential : formParams['X-Amz-Credential'],
		Date : formParams['X-Amz-Date'],
		Signature : signature
	};
};

export default Utils;


