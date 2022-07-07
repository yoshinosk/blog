const InfoBlock = require('../../models/infoBlock'),
    Response = require('../../utils/response')

const infoBlock = {
    /**
     * @description 获取信息块列表
     * @param {Request} req 
     * @param {Response} res 
     */
    async list(req, res) {
        let data = await InfoBlock.find();
        res.status(200).send(Response.success('获取信息块列表成功', data))
    },
    /**
     * @description 添加信息块 参数：name-标识符, title-标题, list-数据 
     * @param {Request} req 
     * @param {Response} res 
     */
    async add(req, res) {
        let { name, title, list, status } = req.body;
        let data = await new InfoBlock({
            name,
            title,
            list,
            status
        }).save();
        res.status(200).send(Response.success('添加信息块成功', data))
    },
    /**
     * @description 编辑信息块 参数：name-标识符, title-更新后的标题, list-更新后的数据 
     * @param {Request} req 
     * @param {Response} res 
     */
    async edit(req, res) {
        let { _id, name, title, list, status } = req.body;
        let data = await InfoBlock.updateOne({ _id }, {
            name,
            title,
            list,
            status
        })
        res.status(200).send(Response.success('编辑信息块成功', data))
    },
    /**
     * @description 删除信息块 参数：name-标识符
     * @param {Request} req 
     * @param {Response} res 
     */
    async del(req, res) {
        let { id } = req.body;
        await InfoBlock.deleteOne({ _id: id })
        res.status(200).send(Response.success('删除信息块成功', null))
    }
}

module.exports = infoBlock;