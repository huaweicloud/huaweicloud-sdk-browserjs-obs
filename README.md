
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

修复问题
