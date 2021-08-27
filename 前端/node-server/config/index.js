module.exports = {
  port: process.env.PORT || 3000, // 项目启动端口
  apiPrefix: '/api', // 配置接口的统一请求前缀
  database: 'mongodb://localhost:27017/test', // 开发环境
  databaseProd: 'mongodb://localhost:27017/test', // 生成环境需要提供mongodb的用户名和密码
}