const mongoose = require("mongoose");
/**
 * @description 用户等级模型
 */
const LevelScheam = new mongoose.Schema({
    level: { type: Number, unique: true, required: true, index: true },
    title: { type: String, default: '' }, // 称号
    startExp: { type: Number },
    endExp: { type: Number }
},{ versionKey: false })

module.exports = mongoose.model('Level', LevelScheam);