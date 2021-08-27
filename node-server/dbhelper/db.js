const mongoose = require('mongoose');
const config = require('../config/index');

// 加上这个是因为：mongoose 的所有查询操作返回的结果都是 query ，mongoose 封装的一个对象，并非一个完整的 promise，
// 而且与 ES6 标准的 promise 有所出入，因此在使用 mongoose 的时候，一般加上这句 mongoose.Promise = global.Promise。
mongoose.Promise = global.Promise;

const is_prod = ['production', 'prod'].includes(process.env.NODE_ENV);

const databaseUrl = is_prod ? config.databaseProd : config.database;

mongoose.connect(databaseUrl, {
  useUnifiedTopology: true,
  useNewUrlParser: true,
  useFindAndModify: false,
  useCreateIndex: true,
  config: { autoIndex: false,
  },
})

/**
 * 连接成功
 */
mongoose.connection.on('connected', () => {
  console.log(`Mongoose 连接成功: ${databaseUrl}`);
});

/**
 *  连接失败
 */
mongoose.connection.on('error', (err) => {
  console.log(`Mongoose 连接出错: ${err}`);
});

/**
 * 关闭连接
 */
mongoose.connection.on('disconnected', () => {
  console.log('mongodb 连接关闭');
});

module.exports = mongoose;