Verison 3.24.3

新特性：

1. 【功能】 ObsClient.uploadFile接口新增取消上传任务功能；
2. 【功能】 增加对象标签API 适配；

-----------------------------------------------------------------------------------
Verison 3.20.1

新特性：

1. 【功能】 增加跨区复制API 适配；

-----------------------------------------------------------------------------------
Verison 3.19.9

新特性：

资料&demo：

修复问题：
1. 【功能】修复axios在处理以"//"开头的URL时，会丢失域名的问题；

-----------------------------------------------------------------------------------

Verison 3.19.7

新特性：
1. 【功能】ObsClient初始化参数新增useRawXhr，支持选择axios或者原生XHR执行ajax请求；

资料&demo：

修复问题：
1. 【安全】升级axios到0.19.0，解决CVE-2019-10742；

-----------------------------------------------------------------------------------

Version 3.19.5

新特性：
1. ObsClient.uploadFile接口新增VerifyMd5字段，用于启用上传分段时校验每个分段的MD5值；
2. 升级第三方依赖urijs到1.19.1版本；

资料&demo：

修复问题：
1. 【功能】修复ObsClient.copyObject/ObsClient.copyPart报错"not a function"的问题；

-----------------------------------------------------------------------------------

Version 3.1.4

新特性：
1. 所有接口请求对象新增RequestDate字段（Date|String），用于自定义请求时间；
2. 所有响应公共结果对象中新增Id2和Indicator字段，用于问题定位；
3. 升级底层依赖，对于不支持window.FileReader的浏览器也可以正常上传；

资料&demo：
1. 接口参考所有接口新增RequestDate字段的介绍；

修复问题：

1. 【功能】对必选字段增加非空字符串/非null/非undefined的校验；
2. 【性能】修复ObsClient.uploadFile/ObsClient.uploadPart上传大文件时，内存占用过高导致浏览器崩溃的问题；
3. 【功能】使用ObsClient.putObject/ObsClient.uploadFile/ObsClient.uploadPart上传文件时对于不支持window.Blob和window.File的浏览器直接返回错误；
4. 【功能】修复ObsClient.putObject/ObsClient.appendObject/ObsClient.InitiateMultipartUpload设置StorageClass参数报错的问题；

-----------------------------------------------------------------------------------

Version 3.1.3

新特性：

资料&demo：

修复问题：
1. 修复ObsClient.listObjects/ObsClient.listVersions/ObsClient.getObject/ObsClient.getObjectMetadata/ObsClient.copyObject/ObsClient.listParts/ObsClient.copyPart接口响应中返回的LastModified字段不是UTC标准格式的问题；

-----------------------------------------------------------------------------------

Version 3.1.2

新特性：
1. 桶事件通知接口（ObsClient.setBucketNotification/ObsClient.getBucketNotification）新增对函数工作流服务配置和查询的支持；

资料&demo：
1. 开发指南事件通知章节，新增对函数工作流服务配置的介绍；
2. 接口参考设置/获取桶的时间通知配置章节，新增函数工作流服务配置的参数描述；

修复问题：

--------------------------------------------------------------

Version 3.1.1

新特性：
1. 上传对象（ObsClient.putObject）/下载对象（ObsClient.getObject）/上传段（ObsClient.uploadPart）/追加上传（ObsClient.appendObject）新增支持设置进度回调函数；
2. 新增断点续传上传接口（ObsClient.uploadFile），支持设置进度回调函数和事件回调函数，并支持取消上传任务；
	
资料&demo：
1. 开发指南新增获取上传进度章节、断点续传上传章节和获取下载进度章节；
2. 接口参考新增断点续传上传章节；
3. 接口参考修改上传对象、追加上传、下载对象和上传段章节，新增进度回调函数参数；

修复问题：
