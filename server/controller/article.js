const { Article, Sort: ArticleSort, Tags: ArticleTags } = require('../models/article'),
    Response = require('../utils/response'),
    User = require('../models/user'),
    Comment = require('../models/comment'),
    { getLevel } = require('../utils/user'),
    { getArticleCover } = require('../utils/tools');


module.exports = {
    /**
     * @description 获取文章详细内容 参数：id-文章ID
     * @param {Request} req 
     * @param {Response} res 
     */
    async get(req, res) {
        let { id } = req.query;
        let article = await Article.findByIdAndUpdate(id, {
            $inc: {
                views: 1
            }
        })
            .populate('sort', 'name')
            .populate('author', 'nickname avatar usersign exp')
        if (!article) return res.status(400).send(Response.error.NOTDATA);
        if (article.status != 1) return res.status(400).send(Response.error.NOTDATA);
        // await redisClient.ZADD(`rank:article:views`, [{ score: article.views + 1, value: id }])
        article = article.toJSON();
        article.author.level = await getLevel(article.author.exp)

        res.status(200).send(Response.success('获取文章成功', article));

    },
    /**
     * @description 获取展示的文章列表 参数：page-页码, pageSize-页数, searchKey-搜索关键字,sort-文章分类, tags-搜索文章标签, order-时间排序方式
     * @param {Request} req 
     * @param {Response} res 
     */
    async list(req, res) {
        let { page, pageSize, searchKey, sort, tags, order, ne } = req.query;
        if (page < 1) page = 1;
        if (pageSize < 1) pageSize = 10;
        if (isNaN(order)) order = -1;

        // 筛选文章状态和分类
        let condition = { status: 1 }
        page = Number(page)
        pageSize = Number(pageSize)
        sort && (condition.sort = Number(sort));
        ne && (condition._id = { $ne: ne });
        tags instanceof Array && (condition.tag = {
            $elemMatch: { $in: tags }
        })
        let query = Article.find(condition, { content: 0 })
        let total = 0;
        // 模糊搜索
        if (searchKey) {
            let orArr = [{ title: new RegExp(String(searchKey), 'i') }] // 标题
            let users = await User.find({ nickname: new RegExp(String(searchKey), 'i') },{_id: 1}).lean() // 作者名
            users.length && orArr.push({
                author: {
                    $in: users.map(item => item._id)
                }
            })
            query.or(orArr)
            total = await Article.count({ ...condition, $or: orArr })
        } else {
            total = await Article.count(condition)
        }
        let list = await query
            .sort({ order: -1 , createTime: parseInt(order) })
            .skip((page - 1) * pageSize).limit(pageSize)
            .populate('sort', 'name')
            .populate('author', 'nickname avatar');

        for(let item of list){
            item.coverImg = getArticleCover(item.coverImg);
        }
        res.status(200).send(Response.success('获取文章列表成功', { list, total, page }));
    },
    /**
     * @description 获取随机文章
     * @param {Request} req 
     * @param {Response} res 
     */
    async random(req, res){
        let list = await Article.aggregate().sample(5)
        res.status(200).send(Response.success('获取随机文章成功', list));
    },
    /**
     * @description 获取文章分类列表
     * @param {Request} req 
     * @param {Response} res 
     */
    async sortList(req, res) {
        let list = await ArticleSort.find().sort({ order: -1 }).lean();
        res.status(200).send(Response.success('获取文章分类成功', list));
    },
    /**
     * @description 获取文章评论列表 参数：articleId-文章ID
     * @param {Request} req 
     * @param {Response} res 
     */
    async commentList(req, res) {
        let { articleId } = req.query;
        let list = await Comment
            .find({ article: parseInt(articleId), status: 1 })
            .sort({ createTime: 1 })
            .populate({
                path: 'reply',
                populate: { path: 'from', select: 'nickname avatar' }
            })
            .populate('from', 'nickname avatar')
            .lean()
            
        // 先筛选出顶级楼层
        let baseList = list.filter(item=> !item.comment && !item.reply);
        for(let item of list){
            if(!item.comment ) continue;
            let parent = baseList.find(p=>p._id.toString() == item.comment.toString() );
            if(parent){
                if(!parent.children) parent.children = [];
                parent.children.push(item);
            }
        }
        
        res.status(200).send(Response.success('获取评论列表成功', {
            list: baseList,
            total: list.length
        }))
    },
    /**
     * @description 获取文章标签列表
     * @param {Request} req 
     * @param {Response} res 
     */
    async tagsList(req, res) {
        let data = await ArticleTags.find({ total: { $gt: 0 } });
        res.status(200).send(Response.success('获取文章标签列表成功', data))
    },
    /**
     * @description 获取文章阅读排行榜
     * @param {Request} req 
     * @param {Response} res 
     */
    async viewsRank(req, res) {
        // redis版
        // let rank = await redisClient.sendCommand(['ZREVRANGE', 'rank:article:views', '0', '4'])
        let data = await Article.find({
            status: 1,
        }, { content: 0 })
            .sort({ views: -1 })
            .limit(5)
            .populate('sort', 'name')
            .populate('author', 'nickname avatar')
            

        res.status(200).send(Response.success('获取文章阅读排行榜成功', data))
    },
    /**
     * @description 文章点赞
     * @param {Request} req 
     * @param {Response} res 
     */
    async goodUp(req, res) {
        let { gl } = req.cookies,// 已点赞列表
            { id } = req.body; // 文章id
        if (!gl) {
            res.cookie('gl', `${id};`, {
                httpOnly: true,
                expires: new Date('2099-12-31')
            })
            await Article.updateOne({ _id: id }, {
                $inc: { goods: 1 }
            })
            res.status(200).send(Response.success('点赞成功', 1))
        } else {
            let arr = gl.split(';');
            let goods = 1;
            if (arr.find(item => item == id)) {
                res.cookie('gl', gl.replace(`${id};`, ''), {
                    httpOnly: true,
                    expires: new Date('2099-12-31')
                })
                goods = -1;
            } else {
                res.cookie('gl', gl + `${id};`, {
                    httpOnly: true,
                    expires: new Date('2099-12-31')
                })
            }
            await Article.updateOne({ _id: id }, {
                $inc: { goods }
            })
            res.status(200).send(Response.success(goods == 1 ? '点赞成功' : '取消点赞', goods))
        }

    },
    /**
     * @description 试验田列表
     * @param {Request} req 
     * @param {Response} res 
     */
    async testFieldList(req, res) {
        let list = await Article.find({ sort: 2 }).sort({ createTime: -1 }).lean();
        let total = await Article.count({ sort: 2 });

        res.status(200).send(Response.success('获取试验田列表成功', {
            list,
            total
        }))
    }
}