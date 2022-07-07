const mongoose = require("mongoose");
/**
 * @description 通知模型
 */
const MessageScheam = new mongoose.Schema({
    from: { type: Number, required: true, ref: 'User' },// 发送消息的用户
    to: { type: Number, require: true, ref:'User' },// 接受消息的用户
    content: { type: String, required: true }, // 内容
    createTime: { type: Number, default: () => Math.ceil(Date.now() / 1000) },// 创建时间
    read: { type: Number, default: 0 },// 是否为已读
    type: { type: Number, default: 1 } // 消息类型 待定
},{versionKey: false})

module.exports = mongoose.model('Message', MessageScheam);