const User = require('../models/user'),
    CoinLog = require('../models/coinLog'),
    jwt = require('jsonwebtoken'),
    Level = require('../models/level'),
    { SECRET_TOKEN, TOKEN_EFFECTIVE, REFRESH_TOKEN_EFFECTIVE } = require('../config'),
    md5 = require('md5'),
    { AccessToken, RefreshToken } = require('../models/userToken'),
    SignIn = require('../models/signIn');

// { client: redisClient } = require('./redis'),


// REDIS版本
// exports.makeToken = async function(user){
//     // 查找redis里是否存在刷新token 没有则生成
//     let rt = await redisClient.get(`user:rt:${user._id}`);
//     if(!rt){
//         rt = jwt.sign({ exp: Math.floor(Date.now() / 1000) + REFRESH_TOKEN_EFFECTIVE}, SECRET_TOKEN);
//         await redisClient.set(`user:rt:${user._id}`,rt,{
//             EX: REFRESH_TOKEN_EFFECTIVE
//         })
//     }

//     let token = jwt.sign({
//         exp: Math.floor(Date.now() / 1000) + TOKEN_EFFECTIVE,
//         rt,
//         data: user
//     }, SECRET_TOKEN);

//     await redisClient.set(`user:token:${user._id}`, md5(token),{
//         EX: TOKEN_EFFECTIVE
//     })

//     return token;
// }

/**
 * @description 生成AccessToken
 * @param {Document} user 用户信息
 * @param {Response} res 响应
 * @returns {String} token
 */
exports.makeToken = async function (user, res) {
    // 查找数据库里是否存在刷新token 没有则生成
    let uid = user._id;
    let rt = await RefreshToken.findOne({ uid })
    if (!rt) {
        rt = jwt.sign({ exp: Math.floor(Date.now() / 1000) + REFRESH_TOKEN_EFFECTIVE, uid }, SECRET_TOKEN);
        rt = await new RefreshToken({ uid, token: rt }).save();
    }

    let token = jwt.sign({
        exp: Math.floor(Date.now() / 1000) + TOKEN_EFFECTIVE,
        data: user
    }, SECRET_TOKEN);

    await AccessToken.findOneAndUpdate({ uid }, {
        token: md5(token),
        createTime: Date.now()
    }, { upsert: true, new: true, setDefaultsOnInsert: true })

    res.cookie('rt', rt.token, {
        httpOnly: true,// 防止js脚本窃取cookie
        maxAge: REFRESH_TOKEN_EFFECTIVE * 1000,
        signed: true,
        secure: true, // 仅在HTTPS生效
    })

    return token;
}

/**
 * @description 获取用户信息
 * @param {String} value 需要匹配的值 默认为id
 * @param {String} field 需要匹配的字段 默认为_id
 * @param {String} pwd 是否需要密码 
 * @returns {Document} Document
 */
exports.getUser = async function (value, field = '_id', pwd = false) {
    let condition = {}
    condition[field] = value;
    let aggregate = User.aggregate([
        { $match: condition },
        // { $project: { password: 0 } },
        {
            $lookup: {
                from: "roles",
                localField: "roles",
                foreignField: "name",
                as: "roles",
            }
        },
        {
            $lookup: {
                from: "levels",
                let: { exp: "$exp" },
                pipeline: [
                    {
                        $match: {
                            $expr: {
                                $and: [
                                    { $gte: ["$$exp", "$startExp"] },
                                    { $lt: ["$$exp", "$endExp"] }
                                ]
                            }
                        }
                    },
                    {
                        $project: {
                            _id: 0
                        }
                    }
                ],
                as: "level"
            }
        },
        {
            $unwind: {
                path: '$level',
                preserveNullAndEmptyArrays: true,
            }
        }

    ])
    let data = await aggregate.exec();
    let user = data[0];
    if (user) {
        if (!pwd) delete user.password;
        let signInLog = await SignIn.findOne({ uid: user._id }).lean();
        user.signInCtn = signInLog ? signInLog.continuity : 0;
        user.avatar = new URL(user.avatar, HOST).toString();
        return user;
    } else null;

}

/**
 * @description 获取用户对应等级
 * @param {Number} exp 用户经验值
 * @returns {Number} 等级
 */
exports.getLevel = async function (exp) {
    let lv = await Level.findOne({
        startExp: { $lte: exp },
        endExp: { $gt: exp }
    })
    return lv;
}

/**
 * @description 改变用户的硬币
 * @param {Number} uid 用户id
 * @param {Number} value 需要变更的数值
 * @param {String} msg 备注
 * @param {Number} type 类型 默认为1-增加 2-减少
 * @returns {Boolean} 变更结果
 */
exports.setCoin = async function (uid, value, msg, type = 1) {
    if (type == 1) {
        await User.findByIdAndUpdate(uid, {
            $inc: {
                coin: value
            }
        }).lean()
        await new CoinLog({ uid, type, msg, value }).save();
        return true;
    } else {
        let data = await User.findOneAndUpdate({ _id: uid, coin: { $gte: value } }, {
            $inc: {
                coin: value * -1
            }
        })
        data && await new CoinLog({ uid, type, msg, value }).save();
        return data ? true : false;
    }

}