const Role = require('../../models/role'),
    { getId } = require('../../utils/db'),
    Response = require('../../utils/response')

/**
 * @description 角色管理
 */
 const role = {
    /**
     * @description 获取角色列表 
     * @param {Request} req 
     * @param {Response} res 
     */
    async list(req, res) {
        let data = await Role.find().lean();
        res.status(200).send(Response.success('获取角色列表成功', data));
    },
    /**
     * @description 添加角色 
     * @param {Request} req 
     * @param {Response} res 
     */
    async add(req, res) {
        let { name, title, rights } = req.body;
        let role = new Role({ _id: await getId('role'), name, title, rights });
        role.save(err => {
            if (err) {
                console.log('添加角色错误', err)
                res.status(500).send(Response.error.SERVER);
            } else {
                res.status(200).send(Response.success('添加角色成功', role));
            }
        })
    },
    /**
     * @description 编辑角色 
     * @param {Request} req 
     * @param {Response} res 
     */
    async edit(req, res) {
        let { _id, name, title, rights } = req.body;
        Role.updateOne({ _id }, {
            $set: {
                name, title, rights
            }
        }).then(data => {
            res.status(200).send(Response.success('编辑角色成功', data));
        }).catch(err => {
            console.log(err)
            res.status(500).send(Response.error.SERVER);
        })
    }
}

module.exports = role;