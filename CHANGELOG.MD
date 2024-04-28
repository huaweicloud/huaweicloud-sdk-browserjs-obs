Verison 3.24.3

New features:

1. [Function]  Added the abort upload to the ObsClient.uploadFile API.
2. [Function]  Function adaptation for object label.

-----------------------------------------------------------------------------------
Verison 3.20.1

New features:

1. [Function]  Function adaptation for cross-region replications.

-----------------------------------------------------------------------------------

Version 3.19.9

New features:

Documentation & Demo:

Resolved issues:
1. [Function] Fixed the issue that the domain name is lost when Axios deals with a URL starts with //.

-----------------------------------------------------------------------------------

Version 3.19.7

New features:
1. [Function] Added useRawXhr as an ObsClient initialization parameter, supporting the selection of Axios or the execution of Ajax requests by the native XHR.

Documentation & Demo:

Resolved issues:
1. [Security] Upgraded the third-party dependency axios to 0.19.0 to fix issue CVE-2019-10742.

-----------------------------------------------------------------------------------

Version 3.19.5

New features:
1. Added the VerifyMd5 field to the ObsClient.uploadFile API to verify the MD5 value of each part in the multipart upload.
2. Upgraded the third-party dependency URI.js to 1.19.1.

Documentation & Demo:

Resolved issues:
1. [Function] Fixed the issue of "not a function" reported by ObsClient.copyObject and ObsClient.copyPart.

-----------------------------------------------------------------------------------

Version 3.1.4

New features:
1. Added the RequestDate field (Date|String) to all API request objects for defining the request time.
2. Added the Id2 and Indicator fields to all response common result objects for fault locating.
3. Upgraded the underlying dependency. Browsers that do not support window.FileReader can support object upload.

Documentation & Demo:
1. Added the description of the RequestDate fields to all APIs.

Resolved issues:

1. [Function] Added non-empty character string, non-null, or non-undefined verification for mandatory fields.
2. [Performance] Fixed the issue that the browser breaks down because the memory usage is too high during large file upload using ObsClient.uploadFile or ObsClient.uploadPart.
3. [Function] Fixed the issue that an error is returned directly for browsers that do not support window.Blob or window.File during file upload using ObsClient.putObject, ObsClient.uploadFile, or ObsClient.uploadPart.
4. [Function] Fixed the issue that an error occurs when setting the StorageClass parameter using ObsClient.putObject, ObsClient.appendObject, or ObsClient.InitiateMultipartUpload.

-----------------------------------------------------------------------------------

Version 3.1.3

New features:

Documentation & Demo:

Resolved issues:
1. Fixed the issue that the LastModified field is not in the UTC format in the responses returned by the following APIs: ObsClient.listObjects, ObsClient.listVersions, ObsClient.getObject, ObsClient.getObjectMetadata, ObsClient.copyObject, ObsClient.listParts, and ObsClient.copyPart.

-----------------------------------------------------------------------------------

Version 3.1.2

New features:
1. FunctionGraph configuration and query are supported in the bucket event notification APIs: ObsClient.setBucketNotification and ObsClient.getBucketNotification.

Documentation & Demo:
1. Added the description of FunctionGraph configuration in the section about event notification in the Developer Guide.
2. Added the parameter description of FunctionGraph configuration in sections related to configuring and obtaining bucket notification in the API Reference.

Resolved issues:

--------------------------------------------------------------

Version 3.1.1

New features:
1. Added support for setting the progress callback function in the following APIs: ObsClient.putObject, ObsClient.getObject, ObsClient.uploadPart, and ObsClient.appendObject.
2. Added the resumable upload API ObsClient.uploadFile which supports the setting of the progress callback function and event callback function, as well as canceling uploading tasks.
	
Documentation & Demo:
1. Added the sections about obtaining upload progress, resumable upload, and obtaining download progress in the Developer Guide.
2. Added the section about resumable upload in the API Reference.
3. Modified the sections about uploading an object, appendable upload, downloading an object, and uploading a part in the API Reference. Added the parameter of progress callback function.

Resolved issues:
