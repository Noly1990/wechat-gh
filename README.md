## 微信公众号后台开发（node-koa2版本）

列一些关键的点，项目内为测试公众号，仅供学习交流
结合微信公众平台技术文档和项目代码，慢慢解析一些自己遇到的困惑点
尽量一步一步的把每个过程的实现点指出来，便于大家自己学习跟进

#### 第一步：接入指南
- [接入指南](https://mp.weixin.qq.com/wiki?t=resource/res_main&id=mp1421135319)

#### 第二步：简单的信息回复

#### 第三步：微信内网页开发
- 在微信页面授权的时候，redirect_uri	授权后重定向的回调链接地址， 请使用 urlEncode 对链接进行处理
