const express = require('express'),
    router = express.Router(),
    admin = require('../controller/admin'),
    { checkSchema } = require('express-validator'),
    { validator, permission } = require('../utils/middlewares'),
    { setting } = require('../config'),
    callName = setting.site.callName;

router
    .get('/baseInfo', permission('admin.getBaseInfo'), admin.baseInfo)
    .post('/user/login', checkSchema({
        account: {
            notEmpty: true,
            errorMessage: `请输入${callName}的登录账号`
        },
        password: {
            notEmpty: true,
            errorMessage: `请输入${callName}的登录密码`
        }
    }), validator, admin.user.login)
    // ** 用户管理 start **
    .get('/user/list', permission('admin.user.list'), checkSchema({
        page: { isNumeric: true, errorMessage: '参数格式错误' },
        pageSize: { isNumeric: true, errorMessage: '参数格式错误' }
    }), validator, admin.user.list)
    .post('/user/edit', permission('admin.user.edit'), checkSchema({
        _id: { notEmpty: true, errorMessage: '缺少用户ID参数' },
        exp: { isNumeric: true, errorMessage: '参数格式错误' },
        coin: { isNumeric: true, errorMessage: '参数格式错误' },
        status: { isNumeric: true, errorMessage: '参数格式错误' },
        roles: { isArray: true, errorMessage: '角色组参数格式错误' }
    }), validator, admin.user.edit)
    .get('/level/list', permission('admin.level'), admin.level.list)
    .post('/level/add', permission('admin.level'), checkSchema({
        startExp: { isNumeric: true, errorMessage: '开始经验必须为整数' },
        endExp: { isNumeric: true, errorMessage: '结束经验必须为整数' }

    }), validator, admin.level.add)
    .post('/level/edit', permission('admin.level'), checkSchema({
        _id: {
            notEmpty: { errorMessage: '缺少参数' },
        },
        startExp: { isNumeric: true, errorMessage: '开始经验必须为整数' },
        endExp: { isNumeric: true, errorMessage: '结束经验必须为整数' }

    }), validator, admin.level.edit)
    .delete('level/del', permission('admin.level'), checkSchema({
        id: {
            notEmpty: { errorMessage: '缺少参数' },
        }
    }), validator, admin.level.del)
    // ** 用户管理 end **
    // ** 权限管理 start **
    .get('/rights/list', permission('admin.rights'), admin.rights.list)
    .post('/rights/add', permission('admin.rights'), checkSchema({
        name: {
            notEmpty: true,
            errorMessage: `输入权限名称`
        },
        field: {
            notEmpty: true,
            errorMessage: `输入权限名称`
        }
    }), validator, admin.rights.add)
    .post('/rights/edit', permission('admin.rights'), checkSchema({
        name: {
            notEmpty: true,
            errorMessage: `输入权限名称`
        }
    }), validator, admin.rights.edit)
    .delete('/rights/del', permission('admin.rights'), checkSchema({
        id: {
            notEmpty: true,
            errorMessage: `缺少参数`
        }
    }), validator, admin.rights.del)
    // ** 权限管理 end **
    // ** 角色管理 start **
    .get('/role/list', permission('admin.roles'), admin.role.list)
    .post('/role/add', permission('admin.roles'), checkSchema({
        name: {
            notEmpty: true,
            errorMessage: `输入角色名称`
        },
        rights: {
            isArray: true,
            errorMessage: `权限格式不正确`
        }
    }), validator, admin.role.add)
    .post('/role/edit', permission('admin.roles'), checkSchema({
        _id: {
            notEmpty: true,
            errorMessage: `缺少参数`
        },
        name: {
            notEmpty: true,
            errorMessage: `输入角色名称`
        },
        rights: {
            isArray: true,
            errorMessage: `权限格式不正确`
        }
    }), validator, admin.role.edit)
    // ** 角色管理 end **
    // ** 文章管理 start **
    .get('/article', permission('admin.article'), checkSchema({
        id: {
            notEmpty: { errorMessage: '缺少参数' },
            isNumeric: { errorMessage: '参数格式错误' }
        },
    }), validator, admin.article.get)
    .get('/article/list', permission('admin.article.list'), checkSchema({
        page: { isNumeric: true, errorMessage: '参数格式错误' },
        pageSize: { isNumeric: true, errorMessage: '参数格式错误' }
    }), validator, admin.article.list)
    .post('/article/add', permission('admin.article.create'), checkSchema({
        title: { notEmpty: true, errorMessage: '请输入文章标题' },
        content: { notEmpty: true, errorMessage: '文章内容不能为空' },
        sort: {
            notEmpty: { errorMessage: '文章分类不能为空' },
            isNumeric: { errorMessage: '文章分类格式错误' },
        },
        tag: { isArray: true, errorMessage: '标签格式错误' }
    }), validator, admin.article.add)
    .post('/article/edit', permission('admin.article.edit'), checkSchema({
        _id: {
            notEmpty: { errorMessage: '缺少参数' },
            isNumeric: { errorMessage: '参数格式错误' }
        },
        title: { notEmpty: true, errorMessage: '请输入文章标题' },
        content: { notEmpty: true, errorMessage: '文章内容不能为空' },
        sort: {
            notEmpty: { errorMessage: '文章分类不能为空' },
            isNumeric: { errorMessage: '文章分类格式错误' },
        },
        status: {
            notEmpty: { errorMessage: '文章状态不能为空' },
            isNumeric: { errorMessage: '文章状态格式错误' }
        },
        tag: { isArray: true, errorMessage: '标签格式错误' }

    }), validator, admin.article.edit)
    .delete('/article/del', permission('admin.article.delete'), checkSchema({
        id: {
            notEmpty: { errorMessage: '缺少参数' },
            isNumeric: { errorMessage: '参数格式错误' }
        },
    }), validator, admin.article.del)
    .post('/article/approval', permission('admin.article.approval'), checkSchema({
        id: {
            notEmpty: { errorMessage: '缺少参数' },
            isNumeric: { errorMessage: '参数格式错误' }
        },
        result: {
            notEmpty: { errorMessage: '缺少参数' },
            isNumeric: { errorMessage: '参数格式错误' }
        }
    }), validator, admin.article.approval)
    .post('/article/order', checkSchema({
        aid: {
            notEmpty: { errorMessage: '缺少参数' },
            isNumeric: { errorMessage: '参数格式错误' }
        },
        order: {
            notEmpty: { errorMessage: '缺少参数' },
            isNumeric: { errorMessage: '参数格式错误' }
        }
    }), validator, permission('admin.article.order'), admin.article.setOrder)
    // 文章分类部分
    .get('/article/sort/list', permission('admin.articleSort'), admin.article.sortList)
    .post('/article/sort/add', permission('admin.articleSort'), checkSchema({
        name: { notEmpty: true, errorMessage: '请输入分类名' },
        desc: { notEmpty: true, errorMessage: '请输入分类描述' }
    }), validator, admin.article.sortAdd)
    .post('/article/sort/edit', permission('admin.articleSort'), checkSchema({
        _id: {
            notEmpty: { errorMessage: '缺少参数' },
            isNumeric: { errorMessage: '参数格式错误' }
        },
        name: { notEmpty: true, errorMessage: '请输入分类名' },
        desc: { notEmpty: true, errorMessage: '请输入分类描述' }

    }), validator, admin.article.sortEdit)
    .post('/article/sort/order', checkSchema({
        sid: {
            notEmpty: { errorMessage: '缺少参数' },
            isNumeric: { errorMessage: '参数格式错误' }
        },
        order: {
            notEmpty: { errorMessage: '缺少参数' },
            isNumeric: { errorMessage: '参数格式错误' }
        }
    }), validator, permission('admin.article.order'), admin.article.sortOrder)
    .delete('/article/sort/del', permission('admin.articleSort'), checkSchema({
        id: { notEmpty: true, errorMessage: '缺少参数' },

    }), validator, admin.article.sortDel)
    // 文章评论部分
    .get('/article/comment/list', permission('admin.comment'), checkSchema({
        // articleId: { notEmpty: true, errorMessage: '缺少参数：文章id' },
        page: { isNumeric: { errorMessage: '参数格式错误' } },
        pageSize: { isNumeric: true, errorMessage: '参数格式错误' }
    }), validator, admin.article.commentList)
    .post('/article/comment/add', permission('admin.comment'), checkSchema({
        articleId: { isNumeric: { errorMessage: '文章ID格式错误' } },
        content: { notEmpty: { errorMessage: '请输入评论内容' } }
    }), validator, admin.article.commentAdd)
    .delete('/article/comment/del', permission('admin.comment'), checkSchema({
        id: { notEmpty: true, errorMessage: '缺少参数：评论id' }
    }), validator, admin.article.commentDel)
    // ** 文章管理 end **
    // ** 网站设定 start **
    .get('/setting', permission('admin.setting'), admin.setting.get)
    .get('/setting/list', permission('admin.setting'), admin.setting.list)
    .post('/setting/add', permission('admin.setting'), checkSchema({
        name: { notEmpty: true, errorMessage: '请输入设定名' },
        type: { notEmpty: true, errorMessage: '请输入设定类型' },
        data: { isString: true, errorMessage: '数据格式错误' }
    }), validator, admin.setting.add)
    .post('/setting/edit', permission('admin.setting'), checkSchema({
        type: { notEmpty: true, errorMessage: '请输入设定类型' },
        data: { isString: true, errorMessage: '数据格式错误' }
    }), validator, admin.setting.edit)
    .delete('/setting/del', permission('admin.setting'), checkSchema({
        id: { notEmpty: true, errorMessage: '缺少参数' },
    }), validator, admin.setting.del)
    // ** 网站设定 end **
    // ** 信息块 start ** 
    .get('/infoBlock/list', permission('admin.infoBlock'), admin.infoBlock.list)
    .post('/infoBlock/add', permission('admin.infoBlock'), checkSchema({
        list: { isArray: true, errorMessage: '数据格式错误' },
        name: { notEmpty: true, errorMessage: '缺少参数' },
        title: { notEmpty: true, errorMessage: '缺少参数' },
        status: { isNumeric: true, errorMessage: '状态格式错误' }
    }), validator, admin.infoBlock.add)
    .post('/infoBlock/edit', permission('admin.infoBlock'), checkSchema({
        _id: { notEmpty: true, errorMessage: '缺少参数' },
        list: { isArray: true, errorMessage: '数据格式错误' },
        name: { notEmpty: true, errorMessage: '缺少参数' },
        title: { notEmpty: true, errorMessage: '缺少参数' },
        status: { isNumeric: true, errorMessage: '状态格式错误' },
    }), validator, admin.infoBlock.edit)
    .delete('/infoBlock/del', permission('admin.infoBlock'), checkSchema({
        id: { notEmpty: true, errorMessage: '缺少参数' },
    }), validator, admin.infoBlock.del)
    // ** 信息块 end ** 
    // ** 留言板 start **
    .get('/board/list', permission('admin.board'), checkSchema({
        page: { isNumeric: { errorMessage: '参数格式错误' } },
        pageSize: { isNumeric: true, errorMessage: '参数格式错误' }
    }), validator, admin.board.list)
    .delete('/board/del', permission('admin.board'), checkSchema({
        id: { notEmpty: true, errorMessage: '缺少参数：留言id' }
    }), validator, admin.board.del)
    // ** 留言板 end **
    // ** 友情链接 start ** 
    .get('/links/list', permission('admin.setting'), admin.links.list)
    .post('/links/add', permission('admin.setting'), checkSchema({
        name: { notEmpty: { errorMessage: '缺少参数' } },
        url: { notEmpty: { errorMessage: '缺少参数' } }
    }), validator, admin.links.add)
    .post('/links/edit', permission('admin.setting'), checkSchema({
        _id: {
            notEmpty: { errorMessage: '缺少参数' },
        },
        name: { notEmpty: { errorMessage: '缺少参数' } },
        url: { notEmpty: { errorMessage: '缺少参数' } }

    }), validator, admin.links.edit)
    .delete('/links/del', permission('admin.setting'), checkSchema({
        id: {
            notEmpty: { errorMessage: '缺少参数' },
        }
    }), validator, admin.links.del)
// ** 友情链接 end **
module.exports = router;
