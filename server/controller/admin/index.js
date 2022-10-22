const article = require('./article'),
    user = require('./user'),
    level = require('./level'),
    role = require('./role'),
    rights = require('./right'),
    setting = require('./setting'),
    infoBlock = require('./infoBlock'),
    Response = require('../../utils/response'),
    User = require('../../models/user'),
    board = require('./msgBoard'),
    links = require('./links'),
    { Article } = require('../../models/article')


module.exports = {
    article,
    user,
    level,
    role,
    rights,
    setting,
    infoBlock,
    board,
    links,
    /**
    * @description 获取基础信息
    * @param {Request} req 
    * @param {Response} res 
    */
    async baseInfo(req,res){
        try{
            let userCount = await User.count();
            let articleCount = await Article.count();
            let waitForApproveArticle = await  Article.count({ status: 0 });
            res.status(200).send(Response.success('获取基础数据成功',{
                userCount,
                articleCount,
                waitForApproveArticle
            }))
        }catch(err){
            res.status(500).send(Response.error.SERVER)
        }
    }
}