const Response = require('../utils/response'),
    SignIn = require('../models/signIn'),
    User = require('../models/user');


module.exports = {
    /**
     * @description 获取用户签到排行榜
     * @param {Request} req 
     * @param {Response} res 
     */
    async signInTolRank(req, res) {
        let list = await User.find({}, { nickname: 1, avatar: 1, signInTol: 1 })
            .sort({ signInTol: -1 })
            .limit(10);
        res.status(200).send(Response.success('获取用户签到总榜成功', list));
    },
    /**
     * @description 获取用户连续签到排行榜
     * @param {Request} req 
     * @param {Response} res 
     */
    async signInConRank(req, res) {
        let list = await SignIn.find()
            .sort({ continuity: -1 })
            .limit(10)
            .populate('user', 'nickname avatar');
        res.status(200).send(Response.success('获取用户连续签到榜成功', list))
    },
}