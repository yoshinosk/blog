const express = require('express'),
  router = express.Router(),
  api = require('../controller/api'),
  rank = require('../controller/rank'),
  article = require('../controller/article'),
  { checkSchema } = require('express-validator'),
  { validator, auth } = require('../utils/middlewares')


router.get('/', function (req, res, next) {
  req.session.count ? (req.session.count++) : (req.session.count = 1)
  res.send({ c: req.session.count })
})
  .post('/test', api.test)
  .get('/article', checkSchema({
    id: { isNumeric: true, errorMessage: '参数格式错误' },
  }), validator, article.get)
  .get('/article/random', article.random)
  .get('/article/list', checkSchema({
    page: { isNumeric: true, errorMessage: '参数格式错误' },
    pageSize: { isNumeric: true, errorMessage: '参数格式错误' }
  }), validator, article.list)
  .get('/article/sort/list', article.sortList)
  .post('/article/goodUp', checkSchema({
    id: { isNumeric: true, errorMessage: '参数格式错误' }
  }), validator, article.goodUp)
  .get('/article/tags/list', article.tagsList)
  .get('/article/rank/views', article.viewsRank)
  .get('/article/comment', checkSchema({
    articleId: { isNumeric: true, errorMessage: '参数格式错误' }
  }), validator, article.commentList)

  .get('/setting', api.getSetting)
  .get('/infoBlock', checkSchema({
    name: { notEmpty: true, errorMessage: '缺少参数' }
  }), validator, api.getInfoBlock)
  .get('/infoBlock/list', api.infoBlockList)
  .get('/article/test/list', article.testFieldList)
  .get('/board/list', checkSchema({
    page: { isNumeric: true, errorMessage: '参数格式错误' },
    pageSize: { isNumeric: true, errorMessage: '参数格式错误' }
  }), validator, api.boardList)
  .post('/board/add', auth, checkSchema({
    content: { notEmpty: true, errorMessage: '请输入留言内容' }
  }), validator, api.addMsg)
  .get('/rank/signInTol', rank.signInTolRank)
  .get('/rank/signInCon', rank.signInConRank)

module.exports = router;
