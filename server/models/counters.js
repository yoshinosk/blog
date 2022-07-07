const mongoose = require("mongoose");
/**
 * @description 计数器集合 用于记录每个表的id自增长数据
 */
const CountersScheam = new mongoose.Schema({
    table: { type: String, trim: true, unique: true, required: true, index: true }, // 集合名
    value: { type: Number,default: 0} // 计数器
}, {versionKey: false})

module.exports = mongoose.model('Counters', CountersScheam);