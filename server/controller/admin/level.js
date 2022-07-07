const Level = require('../../models/level'),
    Response = require('../../utils/response')

/**
 * @description 用户等级
 */
 const level = {
    /**
    * @description 获取等级列表
    * @param {Request} req 
    * @param {Response} res 
    */
    async list(req, res) {
        let data = await Level.find().lean();
        res.status(200).send(Response.success('获取等级列表成功', data));
    },
    /**
    * @description 添加等级 参数：title-等级称号, level-等级, startExp-开始经验, endExp-结束经验
    * @param {Request} req 
    * @param {Response} res 
    */
    async add(req, res) {
        let { title, level, startExp, endExp } = req.body;
        let lv = new Level({ title, level, startExp, endExp })
        lv.save(err => {
            if (err) {
                console.log('添加等级失败', err)
                res.status(500).send(Response.error.SERVER);
            } else {
                res.status(200).send(Response.success('添加等级成功', lv))
            }
        })
    },
    async del(req, res) {
        let { id } = req.body;
        await Level.deleteOne({_id: id})
        res.status(200).send(Response.success('删除等级成功'))
    },
    /**
    * @description 编辑等级 参数：_id, title-等级称号, level-等级, startExp-开始经验, endExp-结束经验
    * @param {Request} req 
    * @param {Response} res 
    */
    async edit(req, res) {
        let { _id, title, level, startExp, endExp } = req.body;
        let data = await Level.findById(_id).lean();
        if (!data) return res.status(400).send(Response.error.NOTDATA);
        await Level.updateOne({ _id }, {
            $set: {  title, level, startExp, endExp  }
        })
        res.status(200).send(Response.success('保存等级成功'))
    }
}

module.exports = level;