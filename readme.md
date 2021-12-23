# 微信云托管·微信支付演示DEMO

## 项目介绍
此示例使用「微信云托管」微信支付实现了从付款到退款的整个闭环基础操作流程。

## 部署步骤
- 将项目下载，使用小程序开发者工具导入，appid填写已认证的非个人小程序
- 按照[此指引](https://developers.weixin.qq.com/miniprogram/dev/wxcloudrun/src/guide/weixin/pay.html)将微信支付商户号授权给小程序，然后获得小程序绑定的子商户号。
- 将子商户号写入 `/server/index.php` 第2行 `$mchid` 中。
- 在「微信云托管控制台」云调用打开开放接口服务，参照[此指引](https://developers.weixin.qq.com/miniprogram/dev/wxcloudrun/src/guide/weixin/open.html)。
- 将项目下 `/server` 文件部署到微信云托管中，具体可以参照[此指引](https://developers.weixin.qq.com/miniprogram/dev/wxcloudrun/src/quickstart/custom/)中的部署步骤。
- 获取上一步部署的微信云托管服务名称，以及环境ID，填入 `/miniprogram/pages/index/index.js` 的154、158行。
- 完成。

## 技术原理
- 服务端使用微信云托管开放接口服务，免令牌
- 客户端使用本地存储来维护订单的持久性
- 支付相关的接口都是使用最简易的输入，扩展数据需要自行开发
- 为了防止用户恶意请求，使用header头 `x-wx-source` 来判断微信真实来源

## 注意事项
- 本项目只是用于演示，所以接口直接对应支付事项，仅用于代码交流
- 如果你要开发业务，请结合自身业务逻辑自行拼接订单业务

## 作者信息
- zirali