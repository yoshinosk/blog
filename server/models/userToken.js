const mongoose = require("mongoose"),
    { TOKEN_EFFECTIVE,REFRESH_TOKEN_EFFECTIVE } = require('../config')
/**
 * @description access_token
 */
const AccessTokenSchema = new mongoose.Schema({
    uid: { type: Number, required: true, unique: true ,index: true }, // 用户id
    token: { type: String, required: true }, 
    ip: { type: String },
    createTime: { type: Date, default: Date.now, index: {
        expires: TOKEN_EFFECTIVE
    } } // 过期时间
}, {versionKey: false})

const RefreshTokenSchema = new mongoose.Schema({
    uid: { type: Number, required: true, unique: true ,index: true }, // 用户id
    token: { type: String, required: true }, 
    ip: { type: String },
    createTime: { type: Date, default: Date.now, index: {
        expires: REFRESH_TOKEN_EFFECTIVE
    } } // 过期时间
}, {versionKey: false})

module.exports = {
    AccessToken: mongoose.model('AccessToken', AccessTokenSchema, 'access_token'),
    RefreshToken: mongoose.model('RefreshToken', RefreshTokenSchema, 'refresh_token')
}