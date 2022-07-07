/**
 * 中间件模块
 */

const { validationResult } = require('express-validator'),
    Rights = require('../models/rights'),
    Response = require('../utils/response')
jwt = require("express-jwt"),
    { SECRET_TOKEN, setting } = require('../config'),
    // { client: redisClient } = require('../utils/redis'),
    { AccessToken } = require('../models/userToken')
md5 = require('md5')



// 验证参数
exports.validator = function (req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).send(Response.error.msg(422, errors.array()[0].msg))
    }
    next();
}

/**
 * @description 判断用户是否拥有指定权限
 * @param {String} field 权限别名
 * @returns function
 */
exports.permission = function (field) {
    return async function (req, res, next) {
        if (!req.user) return res.status(403).send(Response.error.NOTAUTH)
        // 是管理员则放行
        if (req.user.data.roles.find(item => item.name == 'admin')) return next();
        let hasRights = [].concat(...req.user.data.roles.map(item => item.rights))
        let right = await Rights.findOne({ field })
        if (right) {
            if (hasRights.includes(right._id)) next()
            else return res.status(403).send(Response.error.NOTAUTH)
        }
        else return res.status(403).send(Response.error.NOTAUTH)
    }
}

// 不需要授权的页面
const AUTH_UNLESS_USER = [
    '/api/user/login',
    '/api/user/register',
    '/api/user/retrieve',
    '/api/user/sendEmailCode',
    '/api/user/refreshToken',
    '/api/user/rank/signInTol',
    '/api/user/rank/signInCon'
],
    AUTH_UNLESS_ADMIN = ['/api/admin/user/login'],
    AUTH_UNLESS_CHECKTOKEN = AUTH_UNLESS_USER.concat(AUTH_UNLESS_ADMIN)


/**
 * @description 获取token
 * @param {Request} req 
 * @returns {String} token 
 */
const getToken = function (req) {
    if (
        req.headers.authorization &&
        req.headers.authorization.split(" ")[0] === "Bearer"
    ) {
        return req.headers.authorization.split(" ")[1];
    }
    // else if (req.cookies.token) {
    //     return req.cookies.token;
    // }
    else return null;
}

exports.getToken = getToken;

/**
 * @description 检查token是否匹配
 * @param {Request} req 
 * @param {Response} res 
 * @param {NextFunction} next 
 * @returns 
 */
exports.checkToken = async function (req, res, next) {
    if (AUTH_UNLESS_CHECKTOKEN.includes(req.baseUrl + req.url) || req.method === 'OPTIONS') return next();
    else if (!req.user) return res.status(500).send(Response.error.SERVER)
    else {
        let token = getToken(req)
        // redis版本
        // let ut = await redisClient.get(`user:token:${req.user.data._id}`);
        let { token: ut } = await AccessToken.findOne({ uid: req.user.data._id }).lean()
        if (md5(token) != ut) res.status(401).send(Response.error.USER_EXPIRED)
        else next()
    }
}

// 用户鉴权
exports.authUser = jwt({ secret: SECRET_TOKEN, algorithms: ["HS256"], getToken }).unless({
    path: AUTH_UNLESS_USER
})

// 管理员验证
exports.authAdmin = jwt({ secret: SECRET_TOKEN, algorithms: ["HS256"], getToken }).unless({
    path: AUTH_UNLESS_ADMIN
})

// 用户验证 允许未登录用户进入
exports.auth = jwt({ secret: SECRET_TOKEN, algorithms: ["HS256"], getToken, credentialsRequired: false }).unless({
    path: AUTH_UNLESS_USER
})

// 全局错误捕获
exports.errorHandle = function (err, req, res, next) {
    console.log('errorHandle', err, err._message)
    if (err.inner) {
        let errMsg = err.inner.toString()
        if (errMsg.includes('expired')) {
            res.status(401).send(Response.error.USER_EXPIRED);
        } else {
            res.status(401).send(Response.error.USER_NOTLOGGEDIN);
        }
    } else res.status(500).send(Response.error.SERVER)

}

/**
 * @description 全局中间件
 * @param {Request} req 
 * @param {Response} res 
 * @param {NextFunction} next 
 * @returns 
 */
exports.serverSetting = function(req,res,next){
    if(setting.site.status || req.url.indexOf('/admin') > -1) next();
    else return res.status(503).send(Response.error.CLOSED);
}