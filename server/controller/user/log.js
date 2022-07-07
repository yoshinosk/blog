const CoinLog = require('../../models/coinLog'),
    Response = require('../../utils/response');

module.exports = {
    /**
     * @description 获取当前用户的信息列表
     * @param {Request} req 
     * @param {Response} res 
     */
    async coin(req, res) {
        let { page, pageSize, type } = req.query;
        page = Number(page)
        pageSize = Number(pageSize),
        uid = req.user.data._id,
        where = { uid };
        
        if(type && !isNaN(type)) where.type = Number(type);

        let list = await CoinLog.find(where)
            .sort({ createTime: -1 })
            .skip((page - 1) * pageSize).limit(pageSize)
            .lean()

        let total = await CoinLog.count({ uid })

        res.status(200).send(Response.success('获取硬币记录成功', {
            list, page, total
        }))
    },
}