const mongoose = require("mongoose");
/**
 * @description 用户权限模型
 */
const RightsScheam = new mongoose.Schema({
    _id: { type: Number, unique: true, index: true, required: true },
    name: { type: String, trim: true, unique: true, required: true }, // 权限名
    field: { type: String, unique: true, index: true }, // 列名
    pid: { type: Number, default: null }, // 父级
    isRights: { type: Number, default: 0, set(val){ // 是否为权限菜单
        if(typeof val == 'boolean'){
            return val ? 1 : 0
        }else return val ;
    } }
}, { _id: false, autoIndex: false ,versionKey: false})

module.exports = mongoose.model('Rights', RightsScheam);