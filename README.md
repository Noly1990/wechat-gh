# 微信公众号后台开发（node-koa2版本）

列一些关键的点，项目内为测试公众号，仅供学习交流

结合微信公众平台技术文档和项目代码，慢慢解析一些自己遇到的困惑点

尽量一步一步的把每个过程的实现点指出来，便于大家自己学习跟进

吐槽一点，微信相关开发的文档只能打65分，刚及格，所有很多还要自己领会

## 第一步：接入指南

- [接入指南](https://mp.weixin.qq.com/wiki?t=resource/res_main&id=mp1421135319)

## 第二步：简单的信息回复

- 公众号的消息接收和回复，关键点是query中的signature的验证，以及xml的解析（使用xml2js做response的解析，request的xml解析使用的是koa-xml-body，目前看来效果可以），首次配置服务器的地址时，微信服务器会GET在服务器的根目录下'/'的，其他的消息都是POST在服务器的根目录'/'下的，都会携带signature信息

## 第三步：微信内网页开发

- 在微信页面授权的时候，redirect_uri 授权后重定向的回调链接地址， 请使用 urlEncode 对链接进行处理
- 微信的jssdk的验证中签名的难点是在wx.config的签名信息的计算上，可以用网上现成的，也可以自己写，我自己是找了一个网上的sign.js做签名的计算，其他部分自己实现了，后面重写了sign.js，整合在wxKits里

## 第四步：实现用户信息及状态

- 对于公众号内的网页，如果需要微信登陆的，通过outh页面统一授权验证获取用户信息，并在获取用户信息的时候，对用户进行使用cookies标记会话信息，目前只是简单的openid的加密用作鉴别信息
- 难点在公众号中，下面的自定义菜单，点击跳转页面之后，如何自动获取用户信息，目前采用一个中间跳转页outhpage来完成，思考了下，应该还有其他方式，再尝试，目前这种实现稳定
- 上述一点，不再有中间页，采用了302重定向的功能，进行用户的授权（原authpage的page不删除，供大家进行参考，同样实现没有问题）,没有了中间跳转页

## 微信支付的开发

- 很多支付都使用第三方的SDK进行支付，这里自己做一个支付流程的处理，写一些相关的要点
- 微信支付的前提第一个是微信jssdk安全域名，第二个就是微信商户平台公众号支付设置下的支付目录
- 微信支付相关的签名，这里有2个，一个是统一下单api的签名sign，第二个是微信内调起支付的签名paySign（wx.chooseWXPay)的签名，签名都需要微信商户平台的key，签名算法在utils里的wxPayTools.js
- 上述签名的关键点不在于有什么难度，而在于检查签名算法里参数的值和参数名及其大小写，坑了我比较久的是，wx.chooseWXPay里的timestamp名是小写，而进行签名的timeStamp是驼峰，S是大写，微信文档里似是而非的说了一句（支付签名时间戳，注意微信jssdk中的所有使用timestamp字段均为小写。但最新版的支付后台生成签名使用的timeStamp字段名需大写其中的S字符），根本不让人明白是什么意思

## 整个业务逻辑的整理

- 2018-4-24的一次重构，把微信相关的接口提取出来，把service相关的东西聚合在一起,一个是utils里的wxKits,一个是services
- 目前的页面授权机制保证了部分网页只能在微信内浏览器打开，提高安全性
- 本意想做个通用的微信签名工具的，但是看到微信文档有太多不统一的地方，签名的参数名和参数数量太乱，通用的签名工具还不如每个签名写一个，也就3，5个，不算多

## 合并了实际开发

请学习交流的亲，使用base.config.js(请用自己的参数)代替danger.config.js(未上传)