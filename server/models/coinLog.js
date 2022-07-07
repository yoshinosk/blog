const mongoose = require("mongoose");
/**
 * @description 用户硬币变化记录
 */
const Schema = new mongoose.Schema({
    uid: { type: Number, required: true, index: true }, // 用户id
    type: { type: Number, default: 1 }, // 变化类型 1-增加 2-减少
    value: { type: Number, default: 0 }, // 变化的值
    msg: { type: String },// 备注
    createTime: { type: Number, default: () => Math.ceil(Date.now() / 1000) },// 创建时间
}, { versionKey: false })

Schema.virtual('user', {
    ref: 'User',
    localField: 'uid',
    foreignField: '_id',
    justOne: true,
})


module.exports = mongoose.model('CoinLog', Schema, 'coin_log');