const mongoose = require("mongoose"),
    md5 = require('md5'),
    { SECRET_PWD } = require('../config'),
    HOST = global.HOST;

/**
 * @description 用户模型
 */
const UserScheam = new mongoose.Schema({
    _id: { type: Number, unique: true, index: true },
    nickname: { type: String, trim: true, required: true, unique: true },// 昵称
    password: {
        type: String, trim: true, required: true, set(val) {
            return md5(val + SECRET_PWD)
        }
    },
    ip: { type: String },
    email: {
        type: String, trim: true, required: true, unique: true, index: true, set(val) {
            return String(val).toLowerCase()
        }
    },
    avatar: {
        type: String, default: () => `/static/img/default_avatar.png`, get: (val) => {
            return new URL(val, HOST).toString()
        }
    }, // 头像
    registerTime: { type: Number, default: () => Math.ceil(Date.now() / 1000) }, // 注册时间
    roles: { type: Array, default: ['user'] }, // 角色组
    lastLoginTime: { type: Number },// 最后登录日期 
    exp: { type: Number, default: 0 }, // 经验
    coin: { type: Number, default: 0 },// 积分
    signInTol: { type: Number, default: 0 }, // 累计签到
    usersign: { type: String }, // 用户签名
    status: { type: Number, default: 1 } // 状态 0-封禁 1-正常
}, { _id: false, autoIndex: false, versionKey: false, toJSON: { virtuals: true, getters: true }, toObject: { getters: true } })

UserScheam.virtual('role', {
    ref: 'Role',
    localField: 'roles',
    foreignField: 'name',
    justOne: false,
})


module.exports = mongoose.model('User', UserScheam);