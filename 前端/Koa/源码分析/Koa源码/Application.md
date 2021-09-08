
### application.js
~~~js
const isGeneratorFunction = require('is-generator-function');
const debug = require('debug')('koa:application');
const onFinished = require('on-finished');
const response = require('./response');
const compose = require('koa-compose');
const context = require('./context');
const request = require('./request');
const statuses = require('statuses');
const Emitter = require('events');
const util = require('util');
const Stream = require('stream');
const http = require('http');
const only = require('only');
const convert = require('koa-convert');
const deprecate = require('depd')('koa');
const { HttpError } = require('http-errors');

// 继承node的events模块, 这样就可以通过on()和emit()添加一些事件
module.exports = class Application extends Emitter {

  /*
    app.env: development
    app.keys: undefined
    app.proxy: false
    app.subdomainOffset: 2
    app.proxyIpHeader: X-Forwarded-For
    app.maxIpsCount: 0 
  */
  constructor(options) {
    super(); // 因为继承Emitter, 所以调用
    options = options || {};
    // 可以参考request中如何获取客户端ip
    this.proxy = options.proxy || false; // 代理设置，为ture时标识获取真正的客户都ip地址
    this.subdomainOffset = options.subdomainOffset || 2; // 表示子域名是从第几级开始的，这个参数决定了request.subdomains的返回结果，默认值为2
    this.proxyIpHeader = options.proxyIpHeader || 'X-Forwarded-For'; // proxy ip header默认值是X-Forwarded-For
    this.maxIpsCount = options.maxIpsCount || 0; //从proxy ip header读取的最大ip个数，默认值是0表示无限制。
    this.env = options.env || process.env.NODE_ENV || 'development'; // 环境变量默认值是NODE_ENV或者development
    if (options.keys) this.keys = options.keys; // app.keys 为cookie签名的keys
    this.middleware = []; // 根据app.use(fn)的顺序，存放所有中间件
    this.context = Object.create(context); // app.context上下文对象
    this.request = Object.create(request); // app.request对象
    this.response = Object.create(response); // app.response对象
   
  }

  // 创建并启动服务器
  listen(...args) {
    debug('listen');
    // this.callback()返回http.createServer()的回调函数(req, res) => {}
    const server = http.createServer(this.callback());
    return server.listen(...args);
  }

  // app.use(fn) 向middleware中push中间件
  // 1、async/await的async (ctx, next) => {next()} 异步函数直接返回
  // 2、function *() {yield ..} 通过convert转换成(ctx, next) => { co... } 转换成标准形式，内部通过co模块执行生成器
  use(fn) {
    if (typeof fn !== 'function') throw new TypeError('middleware must be a function!');
    if (isGeneratorFunction(fn)) {
      deprecate('Support for generators will be removed in v3. ' +
                'See the documentation for examples of how to convert old middleware ' +
                'https://github.com/koajs/koa/blob/master/docs/migration.md');
      fn = convert(fn);
    }
    debug('use %s', fn._name || fn.name || '-');
    this.middleware.push(fn);
    return this;
  }

  
  callback() {
    // 通过koa-compose转换中间件
    const fn = compose(this.middleware);

    // 如果没有自定义app.on('error', (error, ctx) => {})则使用koa默认的错误处理
    if (!this.listenerCount('error')) this.on('error', this.onerror);

    const handleRequest = (req, res) => {
      // 封装ctx对象
      const ctx = this.createContext(req, res);
      // 传入ctx和合并的中间件
      return this.handleRequest(ctx, fn);
    };

    return handleRequest;
  }

  handleRequest(ctx, fnMiddleware) {
    const res = ctx.res;
    // 默认statusCode = 404
    res.statusCode = 404;
    const onerror = err => ctx.onerror(err); // 错误处理
    const handleResponse = () => respond(ctx); // 响应处理
    // 为res 对象添加错误处理响应，当res响应结束时，执行context中的onerror函数
    // 这里需要注意区分 context 与 koa 实例中的onerror
    onFinished(res, onerror);
    // 执行中间件中的所有函数，并在结束时调用respond(ctx)方法
    return fnMiddleware(ctx).then(handleResponse).catch(onerror);
  }

  // 封装ctx.req, ctx.res, ctx.request, ctx.response
  // ctx.app, ctx.request.app, ctx.response.app 获取应用实例
  // 可以在app.state上挂载自己的应用数据
  createContext(req, res) {
    const context = Object.create(this.context);
    const request = context.request = Object.create(this.request);
    const response = context.response = Object.create(this.response);
    context.app = request.app = response.app = this;
    context.req = request.req = response.req = req;
    context.res = request.res = response.res = res;
    request.ctx = response.ctx = context;
    request.response = response;
    response.request = request;
    context.originalUrl = request.originalUrl = req.url;
    context.state = {};
    return context;
  }

  // koa默认的错误处理
  onerror(err) {
    // When dealing with cross-globals a normal `instanceof` check doesn't work properly.
    // See https://github.com/koajs/koa/issues/1466
    // We can probably remove it once jest fixes https://github.com/facebook/jest/issues/2549.
    const isNativeError =
      Object.prototype.toString.call(err) === '[object Error]' ||
      err instanceof Error;
    if (!isNativeError) throw new TypeError(util.format('non-error thrown: %j', err));
    // 如果状态码是404 或者 err.expose = true 则直接返回
    if (404 === err.status || err.expose) return;
    // 通过设置app.silent 则不抛出错误
    if (this.silent) return;

    // 将错误信息输出到控制台
    const msg = err.stack || err.toString();
    console.error(`\n${msg.replace(/^/gm, '  ')}\n`);
  }


  static get default() {
    return Application;
  }
};

// 处理http响应
function respond(ctx) {
  // 允许绕过koa
  if (false === ctx.respond) return;

  // writable 是原生的node的response对象上的 writable 属性，其作用是用于检查是否是可写流
  if (!ctx.writable) return;

  const res = ctx.res;
  // 获取到body和status
  let body = ctx.body;
  const code = ctx.status;

  // statuses是一个模块方法，用于判断响应的 statusCode是否属于body为空的类型。
  // 例如：204,205,304，此时将body置为null
  if (statuses.empty[code]) {
    // strip headers
    ctx.body = null;
    return res.end();
  }
  // 如果是HEAD方法
  if ('HEAD' === ctx.method) {
    // headersSent 属性是Node原生的 response对象上的，用于检查 http 响应头不是否已经被发送
    // 如果没有被发送，那么添加 length 头部
    if (!res.headersSent && !ctx.response.has('Content-Length')) {
      const { length } = ctx.response;
      if (Number.isInteger(length)) ctx.length = length;
    }
    return res.end();
  }

  // 如果body为null时
  if (null == body) {
    if (ctx.response._explicitNullBody) {
      ctx.response.remove('Content-Type');
      ctx.response.remove('Transfer-Encoding');
      return res.end();
    }
    // httpVersionMajor是node原生对象response上的一个属性，用于返回当前http的版本，这里是对http2版本以上做的一个兼容
    if (ctx.req.httpVersionMajor >= 2) {
      body = String(code);
    } else {
      body = ctx.message || String(code);
    }
    if (!res.headersSent) {
      ctx.type = 'text';
      ctx.length = Buffer.byteLength(body);
    }
    return res.end(body);
  }

  // 对 body 为Buffer类型的进行处理
  if (Buffer.isBuffer(body)) return res.end(body);
  if ('string' === typeof body) return res.end(body);
  // 流类型
  if (body instanceof Stream) return body.pipe(res);

  // 最后将为Json格式的body进行字符串处理，将其转化成字符串
  // 同时添加length头部信息
  body = JSON.stringify(body);
  if (!res.headersSent) {
    ctx.length = Buffer.byteLength(body);
  }
  res.end(body);
}

/**
 * Make HttpError available to consumers of the library so that consumers don't
 * have a direct dependency upon `http-errors`
 */

module.exports.HttpError = HttpError;
~~~

<br/>

### koa-compose

将多个`(ctx, next) => {}`形式的中间件函数合并成一个大的中间件函数`(ctx, next) => {}`

~~~js
function compose (middleware) {
  // middleware 要为数组
  if (!Array.isArray(middleware)) throw new TypeError('Middleware stack must be an array!')
  // middleware 成员要都为函数
  for (const fn of middleware) {
    if (typeof fn !== 'function') throw new TypeError('Middleware must be composed of functions!')
  }

  return function (context, next) {
    // last called middleware #
    let index = -1
    return dispatch(0)
    function dispatch (i) {
      // 每次调用时index比i小1, 因为第一个调用后 index = i, 第二次调用时 i = index 就会报错
      if (i <= index) return Promise.reject(new Error('next() called multiple times'))
      index = i
      let fn = middleware[i]
      if (i === middleware.length) fn = next // 判断是否为最后一个中间件 fn = undefined 直接返回
      if (!fn) return Promise.resolve()
      try {
        // dispatch.bind(null, i + 1) 其实就是next
        // 下面的形式更直观些，每个中间件的第二个参数就是next，直到最后一个中间件调用promise.resolve()
       // promise.resolve(async logger(cxt, promise.resolve(async resTime(ctx, promise.resolve()))))
        return Promise.resolve(fn(context, dispatch.bind(null, i + 1)));
      } catch (err) {
        return Promise.reject(err)
      }
    }
  }
}
~~~