# 使用指南
## Nodejs 安装
```
npm install esdk-obs-browserjs
```

## 浏览器端安装
```
<script src="@/dist/esdk-obs-browserjs.x.x.x.min.js"></script>
<script src="@/dist/esdk-obs-browserjs-without-polyfill.x.x.x.min.js"></script>
```

## 使用方法及代码示例

### 初始化 OBS 客户端

向OBS发送任一HTTP/HTTPS请求之前，必须先创建一个ObsClient实例：
```
// 创建ObsClient实例
const obsClient = new ObsClient({
    access_key_id: '*** Provide your Access Key ***',
    secret_access_key: '*** Provide your Secret Key ***',
    server : 'https://your-endpoint'
});
```

更多用例参考[官网文档](https://support.huaweicloud.com/api-obs_browserjs_sdk_api_zh/obs_34_0001.html)