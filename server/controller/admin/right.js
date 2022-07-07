const Rights = require('../../models/rights'),
    { getId } = require('../../utils/db'),
    Response = require('../../utils/response')

/**
 * @description 权限管理
 */
 const rights = {
    /**
     * @description 获取权限列表
     * @param {Request} req 
     * @param {Response} res 
     */
    async list(req, res) {
        let data = await Rights.find().lean();
        let menu = data.filter(item => !item.isRights);// 权限分类
        let items = data.filter(item => item.isRights);// 权限项目
        items.forEach(item => {
            let p = menu.find(m => m._id == item.pid);
            if (p.children) p.children.push(item)
            else p.children = [item];
        })
        menu.forEach(item => {
            let p = menu.find(m => m._id == item.pid);
            if (p) {
                if (p.children) p.children.push(item)
                else p.children = [item];
            }
        })
        for (let index = 0; index < menu.length; index++) {
            const item = menu[index];
            if (item.pid) {
                menu.splice(index, 1);
                index--;
            }
        }
        res.status(200).send(Response.success('获取权限列表成功', menu));
    },
    /**
     * @description 添加权限 
     * @param {Request} req 
     * @param {Response} res 
     */
    async add(req, res) {
        let { name, field, pid, isRights } = req.body;
        // 为权限时 其他参数为必填项
        if (isRights && (!name || !pid || !field)) return res.status(422).send(Response.error.MISPARAM);
        // 排除顶级菜单 后续权限需要跟上一级的列
        if (!(!pid && !isRights)) {
            let p = await Rights.findOne({ _id: pid });
            field = p.field + '.' + field;
        }
        let r = new Rights({ _id: await getId('rights'), name, field, pid, isRights });
        r.save(err => {
            if (err) {
                console.log(err)
                res.status(500).send(Response.error.SERVER);
            } else {
                res.status(200).send(Response.success('添加权限成功', r));
            }
        })
    },
    /**
     * @description 编辑权限 
     * @param {Request} req 
     * @param {Response} res 
     */
    edit(req, res) {
        let { name, field, pid, isRights, _id } = req.body;
        Rights.updateOne({ _id }, {
            $set: {
                name, field, pid, isRights
            }
        }).then(data => {
            res.status(200).send(Response.success('编辑权限成功', data));
        }).catch(err => {
            console.log(err)
            res.status(500).send(Response.error.SERVER);
        })
    },
    /**
     * @description 删除权限 
     * @param {Request} req 
     * @param {Response} res 
     */
    async del(req, res) {
        let { id } = req.body;
        let rights = await Rights.findOne({ _id: id }).lean();
        if (!rights) return res.status(412).send(Response.error.RIGHTS_NOTFOUND);

        if (await Role.findOne({ rights: new RegExp(`"${id}"`) })) return res.status(412).send(Response.error.RIGHTS_REJECTDEL);// 角色依赖
        if (await Rights.findOne({ pid: id })) return res.status(412).send(Response.error.RIGHTS_REJECTDEL);// 权限集依赖

        await Rights.deleteOne({ _id: id });
        res.status(200).send(Response.success('删除权限成功'));
    }
}

module.exports = rights;