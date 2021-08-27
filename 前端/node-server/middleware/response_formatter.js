// 用来处理格式化响应数据
const ApiError = require('../error/api_error');
const ApiErrorNames = require('../error/api_error_name');

const responseFormatter  = (apiPrefix) => async (ctx, next) => {
  if (ctx.request.path.startsWith(apiPrefix)) {
    try {
      await next();
      if (ctx.response.status === 404) {
        throw new ApiError(ApiErrorNames.NOT_FOUND);
      } else {
        ctx.body = {
          resultCode: '200',
          resultMsg: 'success',
          resultData: ctx.body,
        }
      } 
    } catch (error) {
      if (error instanceof ApiError) {
        ctx.body = { resultCode: error.code, resultMsg: error.message, resultData: null }
      } else {
        ctx.status = 500;
        ctx.response.body = { code: error.name, message: error.message, };
      }
    }
  } else {
    await next();
  }
};

module.exports = responseFormatter;