const router = require('koa-router')();
const { apiPrefix } = require('../config/index');
const category = require('./category');
const blog = require('./blog');

router.prefix(apiPrefix);

router.use('/categories', category.routes(), category.allowedMethods());
router.use('/blog', blog.routes(), blog.allowedMethods());

module.exports = router;