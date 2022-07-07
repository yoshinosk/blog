const express = require('express'),
    router = express.Router(),
    user = require('../controller/user'),
    { checkSchema } = require('express-validator'),
    { validator, permission } = require('../utils/middlewares'),
    { setting } = require('../config'),
    callName = setting.site.callName;

router
    .post('/upload/avatar', permission('user.uploadAvatar'), user.upload.uploadAvatar)
    .post('/upload/image', permission('user.uploadImg'), user.upload.uploadImg)
    .post('/sendEmailCode', checkSchema({
        email: {
            isEmail: true,
            errorMessage: `请${callName}输入正确的邮箱`
        }
    }), validator, user.sendEmailCode)
    .post('/register', checkSchema({
        email: {
            isEmail: true,
            errorMessage: `请${callName}输入正确的邮箱`
        },
        nickname: {
            isLength: {
                options: { min: 1, max: 20 },
                errorMessage: '昵称格式不正确,长度必须在1至20位间'
            }
        },
        password: {
            isLength: {
                options: { min: 6, max: 32 },
                errorMessage: '密码长度限制6~32位字符'
            }
        },
        mailCode: {
            notEmpty: true,
            errorMessage: `请输入邮箱验证码`
        }
    }), validator, user.register)
    .post('/retrieve', checkSchema({
        email: {
            isEmail: true,
            errorMessage: `请${callName}输入正确的邮箱`
        },
        password: {
            isLength: {
                options: { min: 6, max: 32 },
                errorMessage: '密码长度限制6~32位字符'
            }
        },
        mailCode: {
            notEmpty: true,
            errorMessage: `请输入邮箱验证码`
        }
    }), validator, user.retrieve)
    .post('/login', checkSchema({
        account: {
            notEmpty: true,
            errorMessage: `请输入${callName}您的账号`
        },
        password: {
            notEmpty: true,
            errorMessage: `请输入${callName}您的密码`
        }
    }), validator, user.login)
    .post('/logout', user.logout)
    .post('/signIn', user.signIn)
    .post('/refreshToken', user.refreshToken)
    .get('/myArticle', checkSchema({
        page: {
            isNumeric: true,
            errorMessage: `参数格式错误`
        }
    }), validator, user.article.myArticle)
    .post('/article/toggle', permission('user.article'), checkSchema({
        id: {
            isNumeric: true,
            errorMessage: `参数格式错误`
        }
    }), validator, user.article.toggle)
    .delete('/article/del', permission('user.article'), checkSchema({
        id: {
            isNumeric: true,
            errorMessage: `参数格式错误`
        }
    }), validator, user.article.del)
    .get('/article/get', checkSchema({
        id: {
            isNumeric: true,
            errorMessage: `参数格式错误`
        }
    }), validator, user.article.get)
    .post('/article/add', permission('user.article'), checkSchema({
        title: {
            notEmpty: { errorMessage: '请输入文章标题' },
            isLength: {
                max: 50,
                min: 1,
                errorMessage: '文章标题过长'
            }
        },
        content: { notEmpty: true, errorMessage: '文章内容不能为空' },
        sort: {
            notEmpty: { errorMessage: '文章分类不能为空' },
            isNumeric: { errorMessage: '文章分类格式错误' },
        },
        tag: { isArray: true, errorMessage: '标签格式错误' }
    }), validator, user.article.add)
    .post('/article/edit', permission('user.article'), checkSchema({
        _id: {
            notEmpty: { errorMessage: '缺少参数' },
            isNumeric: { errorMessage: '参数格式错误' }
        },
        title: {
            notEmpty: { errorMessage: '请输入文章标题' },
            isLength: {
                max: 50,
                min: 1,
                errorMessage: '文章标题过长'
            }
        },
        content: {
            notEmpty: { errorMessage: '文章内容不能为空' },
        },
        sort: {
            notEmpty: { errorMessage: '文章分类不能为空' },
            isNumeric: { errorMessage: '文章分类格式错误' },
        },
        tag: { isArray: true, errorMessage: '标签格式错误' }
    }), validator, user.article.edit)
    .post('/comment/add', permission('user.comment'), checkSchema({
        articleId: { isNumeric: { errorMessage: '文章ID格式错误' } },
        content: {
            notEmpty: { errorMessage: '请输入评论内容' },
            isLength: {
                errorMessage: '评论内容过长',
                options: { max: 500 },
            }
        }
    }), validator, user.article.commentAdd)
    .get('/comment/list', checkSchema({
        page: { isNumeric: true, errorMessage: '参数格式错误' },
        pageSize: { isNumeric: true, errorMessage: '参数格式错误' }
    }), validator, user.article.commentList)
    .delete('/comment/del', checkSchema({
        id: { notEmpty: { errorMessage: '缺少参数' }, }
    }), validator, user.article.commentDel)
    .get('/comment/reply', checkSchema({
        page: { isNumeric: true, errorMessage: '参数格式错误' },
        pageSize: { isNumeric: true, errorMessage: '参数格式错误' }
    }), validator, user.article.replyList)
    .post('/profile/edit', checkSchema({
        nickname: {
            notEmpty: { errorMessage: '缺少昵称参数' },
            isLength: {
                max: 20,
                min: 1,
                errorMessage: `昵称太长啦,请${callName}换一个昵称`
            }
        },
        usersign: {
            notEmpty: { errorMessage: '缺少签名参数' },
            isLength: {
                max: 50,
                min: 1,
                errorMessage: `签名太长啦,请${callName}换一个签名`
            }
        },
    }), validator, user.profileEdit)
    .post('/profile/avatar', checkSchema({
        url: {
            notEmpty: { errorMessage: '缺少参数' }
        },
    }), validator, user.setAvatar)
    .get('/message/list', checkSchema({
        page: { isNumeric: true, errorMessage: '参数格式错误' },
        pageSize: { isNumeric: true, errorMessage: '参数格式错误' }
    }), validator, user.message.list)
    .post('/message/read', checkSchema({
        id: { notEmpty: { errorMessage: '缺少参数' }, }
    }), validator, user.message.setRead)
    .get('/log/coin', checkSchema({
        page: { isNumeric: true, errorMessage: '参数格式错误' },
        pageSize: { isNumeric: true, errorMessage: '参数格式错误' }
    }), validator, user.log.coin)


module.exports = router;
