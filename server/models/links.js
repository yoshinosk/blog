const mongoose = require("mongoose");
/**
 * @description 友情链接模块
 */
const Schema = new mongoose.Schema({
    name: { type: String, required: true },
    url: { type: String, required: true },
    icon: { type: String }, 
    createTime: { type: Number , default: () => Math.ceil(Date.now() / 1000) },// 创建时间
}, {versionKey: false})


module.exports = mongoose.model('Link', Schema);