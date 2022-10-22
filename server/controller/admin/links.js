const Links = require('../../models/links'),
    Response = require('../../utils/response')

const links = {
    /**
     * @description 获取友情链接列表
     * @param {Request} req 
     * @param {Response} res 
     */
    async list(req, res) {
        let data = await Links.find();
        res.status(200).send(Response.success('获取友情链接列表成功', data))
    },
    /**
     * @description 添加友情链接 参数：name-标识符, title-标题, list-数据 
     * @param {Request} req 
     * @param {Response} res 
     */
    async add(req, res) {
        let { name, url, icon } = req.body;
        let data = await new Links({ name, url, icon }).save();
        res.status(200).send(Response.success('添加友情链接成功', data))
    },
    /**
     * @description 编辑友情链接 参数：name-标识符, title-更新后的标题, list-更新后的数据 
     * @param {Request} req 
     * @param {Response} res 
     */
    async edit(req, res) {
        let { _id, name, url, icon} = req.body;
        let data = await Links.updateOne({ _id }, { name, url, icon })
        res.status(200).send(Response.success('编辑友情链接成功', data))
    },
    /**
     * @description 删除友情链接 参数：name-标识符
     * @param {Request} req 
     * @param {Response} res 
     */
    async del(req, res) {
        let { id } = req.body;
        await Links.deleteOne({ _id: id })
        res.status(200).send(Response.success('删除友情链接成功', null))
    }
}

module.exports = links;