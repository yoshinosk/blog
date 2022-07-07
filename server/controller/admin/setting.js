const Setting = require('../../models/setting'),
    Response = require('../../utils/response'),
    { loadSetting, setting } = require('../../config')

/**
 * @description 网站设置
 */
const settingController = {
    /**
     * @description 获取网站设定 
     * @param {Request} req 
     * @param {Response} res 
     */
    async get(req, res) {
        res.status(200).send(Response.success('获取设定列表成功', setting));
    },
    /**
     * @description 获取设定列表 
     * @param {Request} req 
     * @param {Response} res 
     */
    async list(req, res) {
        let data = await Setting.find().lean();
        res.status(200).send(Response.success('获取设定列表成功', data));
    },
    /**
     * @description 添加设定 
     * @param {Request} req 
     * @param {Response} res 
     */
    async add(req, res) {
        let { name, type, data } = req.body;
        try {
            JSON.parse(data)
        } catch (e) {
            return res.status(422).send(Response.error.PARAMSERR)
        }
        let st = new Setting({ name, type, data })
        st.save(err => {
            if (err) {
                console.log('添加设定失败', err)
                res.status(500).send(Response.error.SERVER);
            } else {
                res.status(200).send(Response.success('添加设定成功', st))
                loadSetting()
            }
        })
    },
    /**
     * @description 删除设定 
     * @param {Request} req 
     * @param {Response} res 
     */
    async del(req, res) {
        let { id } = req.body;
        await Setting.deleteOne({ _id: id })
        res.status(200).send(Response.success('删除设定成功'))
        loadSetting()
    },
    /**
     * @description 编辑设定 
     * @param {Request} req 
     * @param {Response} res 
     */
    async edit(req, res) {
        let { name, type, data } = req.body;
        try {
            JSON.parse(data)
        } catch (e) {
            return res.status(422).send(Response.error.PARAMSERR)
        }
        let st = await Setting.find({ type });
        if (!st) return res.status(400).send(Response.error.NOTDATA);
        await Setting.updateOne({ type }, {
            $set: { name: name || st.name, type, data }
        })
        res.status(200).send(Response.success('保存设定成功'))
        loadSetting()
    }
}

module.exports = settingController;