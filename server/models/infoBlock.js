const mongoose = require("mongoose");
/**
 * @description 资讯块
 */
const Schema = new mongoose.Schema({
    name: { type: String, required: true, index: true, unique: true }, // 标识符
    title: { type: String, required: true },// 信息标题
    list: { type: Array, default: [] },// 信息集合
    status: { type: Number, default: 1 } // 状态 1-显示，0-隐藏
}, { versionKey: false })


module.exports = mongoose.model('infoBlock', Schema);