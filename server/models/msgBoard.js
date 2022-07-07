const mongoose = require("mongoose");
/**
 * @description 留言板
 */
const Schema = new mongoose.Schema({
    from: { type: Number, ref: "User" }, // 用户id
    email: { type: String },
    nickname: { type: String },
    content: { type: String, required: true, trim: true },
    createTime: { type: Number, default: () => Math.ceil(Date.now() / 1000) },// 创建时间
    ip: { type: String }
}, { versionKey: false })


module.exports = mongoose.model('msgBoard', Schema, 'msg_board');