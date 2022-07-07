const Response = require('../utils/response'),
    { setting } = require('../config/index'),
    InfoBlock = require('../models/infoBlock'),
    MsgBoard = require('../models/msgBoard'),
    mint = require('../utils/wordFilter');

module.exports = {
    async test(req, res) {
        res.status(200).send(Response.success(''));
    },
    /**
     * @description 获取网站设定
     * @param {Request} req 
     * @param {Response} res 
     */
    getSetting(req, res) {
        res.status(200).send(Response.success('获取配置成功', setting))
    },
    /**
     * @description 获取网站首页右侧信息块 参数：name-信息块标识符
     * @param {Request} req 
     * @param {Response} res 
     */
    async getInfoBlock(req, res) {
        let { name } = req.query;
        let data = await InfoBlock.findOne({ name }).lean();
        res.status(200).send(Response.success('获取信息块成功', data ? data.list : []))
    },
    /**
     * @description 获取网站首页右侧信息块列表
     * @param {Request} req 
     * @param {Response} res 
     */
    async infoBlockList(req, res) {
        let data = await InfoBlock.find();
        res.status(200).send(Response.success('获取信息块列表成功', data))
    },
    /**
     * @description 获取留言板列表
     * @param {Request} req 
     * @param {Response} res 
     */
    async boardList(req, res) {
        let { page, pageSize } = req.query;
        pageSize = Number(pageSize)
        page = Number(page)
        let list = await MsgBoard.find()
            .sort({ createTime: -1 })
            .skip((page - 1) * pageSize).limit(pageSize)
            .populate('from', 'nickname avatar')

        let total = await MsgBoard.count();
        res.status(200).send(Response.success('获取留言板成功', {
            list,
            total,
            page
        }))
    },
    /**
     * @description 添加留言
     * @param {Request} req 
     * @param {Response} res 
     */
    async addMsg(req, res) {
        if(!setting.site.allowBoard) return res.status(503).send(Response.error.CLOSED_BOARD);
        let { email, nickname, content } = req.body,
            { ip } = req,
            data = { email, nickname, content, ip };

        if (req.user) data.from = req.user.data._id;
        else {
            if (!nickname || !email) return res.status(422).send(Response.error.MISPARAM);

            let wordCheck = mint.filterSync(nickname);
            if (!wordCheck.pass) return res.status(422).send(Response.error.msg(422, `发布失败，昵称存在违规词：${wordCheck.words.toString()}`));
        }

        let wordCheck = mint.filterSync(content);
        if (!wordCheck.pass) return res.status(422).send(Response.error.msg(422, `发布失败，内容存在违规词：${wordCheck.words.toString()}`));

        let msg = await new MsgBoard(data).save();
        if (req.user) {
            msg = await MsgBoard.findById(msg._id).populate('from', 'avatar nickname')
        }
        res.status(200).send(Response.success('发布留言成功', msg))
    }
}