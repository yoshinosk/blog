const MsgBoard = require('../../models/msgBoard'),
    Response = require('../../utils/response')

module.exports = {
    /**
    * @description 获取全部留言列表
    * @param {Request} req 
    * @param {Response} res 
    */
    async list(req,res){
        let { page, pageSize } = req.query;
        page = Number(page);
        pageSize = Number(pageSize);

        let list = await MsgBoard.find()
        .sort({ createTime: -1 })
        .skip((page - 1) * pageSize).limit(pageSize).populate('from','nickname avatar email');

        let total = await MsgBoard.count();

        res.status(200).send(Response.success('获取留言列表成功',{
            list,
            total,
            page
        }))
    },
    async del(req, res){
        let { id } = req.body;
        if (id instanceof Array) {
            let data = await MsgBoard.deleteMany({ _id: { $in: id } })
            res.status(200).send(Response.success(`成功删除${data.modifiedCount}条留言`))
        } else {
            await MsgBoard.deleteOne({ _id: id })
            res.status(200).send(Response.success(`删除留言成功`))
        }
    }
}