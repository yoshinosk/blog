const mongoose = require("mongoose");
/**
 * @description 文章评论模型
 */
const Schema = new mongoose.Schema({
    article: { type: Number, required: true, ref: "Article" }, // 文章id
    from: { type: Number, required: true, ref: "User" }, // 用户id
    comment: { type: mongoose.Types.ObjectId, ref: "Comment" }, // 顶级评论id 
    reply: { type: mongoose.Types.ObjectId, ref: "Comment" }, // 回复的楼中楼id 
    content: { type: String, required: true, trim: true},
    createTime: { type: Number, default: () => Math.ceil(Date.now() / 1000) },// 创建时间
    goods: { type:Number, default: 0 }, //点赞数
    bads: { type:Number, default: 0 }, // 踩
    status: { type: Number, default: 1 } // 1 正常 0 已删除
}, {versionKey: false})

module.exports = mongoose.model('Comment', Schema);