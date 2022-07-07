const Counters = require('../models/counters'),
    mongoose = require("mongoose"), 
    { db } = require('../config')

/**
 * @description 获取自增长id 每次调用会更新id
 * @param {String} table 需要获取的表名
 * @returns {Number} id
 */
exports.getId = async function(table){
    let data = await Counters.findOneAndUpdate({table},{$inc:{
        value: 1
    }})
    // 有数据则返回 无则创建
    if(data) return data.value;
    else {
        let counters = new Counters({
            table,
            value: 1
        })
        await counters.save();
        return 1;
    }
    
}

/**
 * @description 连接数据库
 * @returns {Promise} Promise
 */
exports.connect = function(){
    return new Promise((resolve)=>{
        mongoose.connect(
            `mongodb://${db.username}:${db.password}@${db.host}/${db.dbname}`,
            { useNewUrlParser: true, useUnifiedTopology: true },
            (err) => {
                if (err) {
                    console.log('数据库连接失败', err)
                    resolve(err)
                } else {
                    resolve(null)
                    console.log(`已连接到数据库：${db.dbname}`);
                }
            }
        )
    })
}