const Message = require('../../models/message'),
    Response = require('../../utils/response');

module.exports = {
    /**
     * @description 获取当前用户的信息列表
     * @param {Request} req 
     * @param {Response} res 
     */
    async list(req, res) {
        let { page, pageSize } = req.query;
        page = Number(page)
        pageSize = Number(pageSize)
        let uid = req.user.data._id;
        let list = await Message.find({ to: uid })
            .sort({ createTime: -1 })
            .skip((page - 1) * pageSize).limit(pageSize)
            .populate('from', 'nickname avatar')

        let total = await Message.count({ to: uid })
        let unread = await Message.count({ to: uid , read: 0 })

        res.status(200).send(Response.success('获取信息列表成功', {
            list, page, total, unread
        }))
    },
    /**
     * @description 标记信息已读
     * @param {Request} req 
     * @param {Response} res 
     */
    async setRead(req, res) {
        let {id} = req.body;
        await Message.findByIdAndUpdate(id,{
            $set:{
                read: 1
            }
        })
        res.status(200).send(Response.success('信息标记已读成功'))
    }
}