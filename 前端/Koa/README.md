### koa

[官网](https://koajs.com/)

[中文文档](https://koa.bootcss.com/)

[awesome-koa](https://github.com/ellerbrock/awesome-koa)

[github仓库](https://github.com/koajs/koa)

`Koa2`内部是由`ES6`编写，利用了`async/await`处理异步操作。

`Koa1`是的异步操作是基于`Generator`和自动执行生成器的`co`模块。

`Koa2`内部没有绑定任何插件, 而是跟`express`一样，使用一系列`中间件`提供各种功能。

`Egg`框架基于`Koa2`提供了企业级的应用框架。

`Express`是扩展了Node `http`模块的`req`和`res`, `Koa`同时也提供了请求级别的`ctx`上下文对象。



