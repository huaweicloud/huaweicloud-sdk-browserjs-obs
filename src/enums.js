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
exports.StorageClassDeepArchive = 'DEEP_ARCHIVE';

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

exports.ContentMD5 = 'Content-MD5';
exports.ContentSHA256 = 'Content-SHA256';