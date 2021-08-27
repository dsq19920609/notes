const path = require('path');
const Koa = require('koa');
const koaBody = require('koa-body');
const json = require('koa-json');
const onerror = require('koa-onerror');
const logger = require('koa-logger');

const app = new Koa();

const { apiPrefix, port } = require('./config/index');
const router = require('./routers/index');
const responseFormatter = require('./middleware/response_formatter');


// mongoDB连接
require('./dbhelper/db');

// koa的错误处理程序hack
onerror(app);

app.use(koaBody({
  multipart: true, // 支持文件上传
  formidable: { formidable: { uploadDir: path.join(__dirname, 'public/upload') } }, // 设置文件上传目录
  keepExtensions: true, //保持文件的后缀
  maxFieldsSize: 2 * 1024 * 1024, // 上传文件最大多大
  onFileBegin: (name, file) => { // 文件上传前的设置
    console.log(`name: ${name}`);
    console.log(file);
  }
}));

app.use(json());
app.use(logger());
app.use(responseFormatter(apiPrefix));


app.use(router.routes()).use(router.allowedMethods());

app.on('error', (err, ctx) => {
  // 在这里可以对错误信息进行一些处理，生成日志等。
  console.error('server error', err, ctx);
});

app.listen(port);
