const mongoose = require("mongoose");
/**
 * @description 用户签到记录
 */
const Schema = new mongoose.Schema({
    uid: { type: Number, required: true, index: true , unique: true }, // 用户id
    lastSignIn: { type: Number, required: true }, // 上一次签到时间
    continuity: { type: Number, default: 1 } // 连续签到
}, {versionKey: false})

Schema.virtual('user',{
    ref: 'User',
    localField: 'uid',
    foreignField: '_id',
    justOne: true,
})


module.exports = mongoose.model('SignInLog', Schema, 'signIn_log');