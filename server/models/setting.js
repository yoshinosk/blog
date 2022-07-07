const mongoose = require("mongoose");
/**
 * @description 网站设定
 */
const Schema = new mongoose.Schema({
    name: { type: String, trim: true, required: true}, // 设定名
    type: { type: String, trim: true, required: true, unique: true }, // 设定类型
    data: { type: String, required: true } // 设定数据 
}, {versionKey: false})

module.exports = mongoose.model('Setting', Schema);