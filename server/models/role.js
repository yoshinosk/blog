const mongoose = require("mongoose");
/**
 * @description 用户角色模型
 */
const RoleScheam = new mongoose.Schema({
    _id: { type: Number, unique: true, index: true, required: true },
    name: { type: String, trim: true, unique: true, required: true }, // 角色名
    title: { type: String, default: '' }, // 称号
    rights: { type: Array, default: [] } // 权限数组
},{ _id: false, autoIndex: false ,versionKey: false})

module.exports = mongoose.model('Role', RoleScheam);