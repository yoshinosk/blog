const User = require('../../models/user'),
    Rights = require('../../models/rights'),
    Response = require('../../utils/response'),
    { isNumber } = require('../../utils/regexp'),
    { makeToken, getUser } = require('../../utils/user'),
    { SECRET_PWD } = require('../../config')


/**
 * @description 用户管理
 */
const user = {
    async login(req, res) {
        let { password, account } = req.body;
        let user = await getUser(account, 'email',true)
        if (!user) return res.status(403).send(Response.error.NOTAUTH);
        if (md5(password + SECRET_PWD) != user.password) return res.status(403).send(Response.error.NOTAUTH);
        // 检查是否拥有登录后台权限
        let hasRights = [].concat(...user.roles.map(item => item.rights))
        let right = await Rights.findOne({ field: 'admin.login' })
        if (!hasRights.includes(right._id)) return res.status(403).send(Response.error.NOTAUTH);
        delete user.password;
        user.token = await makeToken(user, res);
        res.status(200).send(Response.success('登录成功', user));
        await User.updateOne({ email: account }, { $set: { lastLoginTime: Math.floor(Date.now() / 1000) } }) // 更新最后登录时间
    },
    // async list(req, res) {
    //     let { page, pageSize, searchKey, status } = req.body;
    //     // 默认页数
    //     if (isNaN(page) || page < 1) page = 1;
    //     if( pageSize < 1 ) pageSize = 10;
    //     let condition = {}
    //     status != '' && isNumber(status) && (condition.status = Number(status))
    //     searchKey && (condition.nickname = searchKey)
    //     let query = User.find(condition, { password: 0 })
    //     let total = await User.count(condition);

    //     let list = await query
    //         .sort({ createTime: -1 })
    //         .skip((page - 1) * pageSize).limit(pageSize)
    //         .populate('role','title -_id -name')
    //         .lean();
    //     res.status(200).send(Response.success('获取用户列表成功', { list: 
    //         list.map(item=>{
    //             delete item.roles; 
    //         return item;
    //     }), total }));
    // },
    async list(req, res) {
        let { page, pageSize, searchKey, status } = req.query;
        if (page < 1) page = 1;
        if (pageSize < 1) pageSize = 10;
        page = Number(page);
        pageSize = Number(pageSize);
        let condition = {}
        status != '' && isNumber(status) && (condition.status = Number(status))
        searchKey && (condition.nickname = new RegExp(searchKey, 'i'))
        let aggregate = User.aggregate([
            { $match: condition },
            { $project: { password: 0 } },
            { $sort: { createTime: -1 } },
            { $skip: (page - 1) * pageSize },
            { $limit: pageSize },
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
        let total = await User.count(condition);
        let list = await aggregate.exec();
        for(let item of list){
            item.avatar = new URL(item.avatar,global.HOST).toString();
        }
        res.status(200).send(Response.success('获取用户列表成功', {
            list,
            total
        }))

    },
    async add(req, res) {

    },
    async del(req, res) {

    },
    async edit(req, res) {
        let { _id, roles, nickname, exp, coin, status } = req.body;
        let data = await User.updateOne({ _id }, {
            $set: { roles, exp, coin, status }
        })
        res.status(200).send(Response.success(`编辑用户资料成功`))

    }
}

module.exports = user;