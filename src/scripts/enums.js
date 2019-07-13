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
	  define('enums', [], factory);
  }else{
	  root['enums'] = factory();
  }
})(this ? this : window,  function () {
	'use strict';
	var exports = {};
	exports.AclPrivate = 'private';
	exports.AclPublicRead = 'public-read';
	exports.AclPublicReadWrite = 'public-read-write';
	exports.AclPublicReadDelivered = 'public-read-delivered';
	exports.AclPublicReadWriteDelivered = 'public-read-write-delivered';
	exports.AclAuthenticatedRead = 'authenticated-read';
	exports.AclBucketOwnerRead = 'bucket-owner-read';
	exports.AclBucketOwnerFullControl = 'bucket-owner-full-control';
	exports.AclLogDeliveryWrite = 'log-delivery-write';

	exports.StorageClassStandard = 'STANDARD';
	exports.StorageClassWarm = 'WARM';
	exports.StorageClassCold = 'COLD';

	exports.PermissionRead = 'READ';
	exports.PermissionWrite = 'WRITE';
	exports.PermissionReadAcp = 'READ_ACP';
	exports.PermissionWriteAcp = 'WRITE_ACP';
	exports.PermissionFullControl = 'FULL_CONTROL';

	exports.GroupAllUsers = 'AllUsers';
	exports.GroupAuthenticatedUsers = 'AuthenticatedUsers';
	exports.GroupLogDelivery = 'LogDelivery';

	exports.RestoreTierExpedited = 'Expedited';
	exports.RestoreTierStandard = 'Standard';
	exports.RestoreTierBulk = 'Bulk';

	exports.GranteeGroup = 'Group';
	exports.GranteeUser = 'CanonicalUser';

	exports.CopyMetadata = 'COPY';
	exports.ReplaceMetadata = 'REPLACE';
	
	exports.EventObjectCreatedAll = 'ObjectCreated:*';
	exports.EventObjectCreatedPut = 'ObjectCreated:Put';
	exports.EventObjectCreatedPost = 'ObjectCreated:Post';
	exports.EventObjectCreatedCopy = 'ObjectCreated:Copy';
	exports.EventObjectCreatedCompleteMultipartUpload = 'ObjectCreated:CompleteMultipartUpload';
	exports.EventObjectRemovedAll = 'ObjectRemoved:*';
	exports.EventObjectRemovedDelete = 'ObjectRemoved:Delete';
	exports.EventObjectRemovedDeleteMarkerCreated = 'ObjectRemoved:DeleteMarkerCreated';
	
	return exports;
});