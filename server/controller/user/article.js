const { Article, Tags: ArticleTags, Sort: ArticleSort } = require('../../models/article'),
    Comment = require('../../models/comment'),
    Response = require('../../utils/response'),
    { getId } = require('../../utils/db'),
    xssFilter = require('../../utils/xssFilter'),
    mongoose = require('mongoose'),
    User = require('../../models/user'),
    mint = require('../../utils/wordFilter'),
    { setting } = require('../../config');

module.exports = {
    /**
     * @description 获取当前用户的文章 参数：page
     * @param {Request} req 
     * @param {Response} res 
     */
    async myArticle(req, res) {
        let { page, status, sort } = req.query,
            pageSize = 10,
            uid = req.user.data._id;
        if (page < 1) page = 1;
        let condition = { author: uid, status: { $ne: -1 } };
        if (status != null && !isNaN(status)) condition.status = Number(status);
        if (sort != null && !isNaN(sort)) condition.sort = Number(sort);


        let list = await Article.find(condition, { content: 0 })
            .sort({ createTime: -1 })
            .skip((Number(page) - 1) * pageSize)
            .limit(pageSize)
            .populate('sort')
            .lean()
        let total = await Article.count({ author: uid })
        res.status(200).send(Response.success('获取我的文章列表成功', { list, total, page }));
    },
    /**
     * @description 切换文章显示/隐藏
     * @param {Request} req 
     * @param {Response} res 
     */
    async toggle(req, res) {
        let { id } = req.body,
            uid = req.user.data._id;
        let article = await Article.findOne({ _id: id, author: uid });
        if (!article) return res.status(403).send(Response.error.USER_ARTICLE_EDIT);
        // 审核中/已删除/审核不通过文章不能切换
        if (article.status <= 0 || article.status == 2) return res.status(403).send(Response.error.USER_ARTICLE_TOGGLE);

        await Article.updateOne({ _id: id }, {
            $set: {
                status: article.status == 1 ? 3 : 1
            }
        })

        res.status(200).send(Response.success(`切换文章显示状态成功:${article.status == 1 ? '隐藏' : '显示'}`));
    },
    /**
     * @description 获取用户文章 用于预览/编辑
     * @param {Request} req 
     * @param {Response} res 
     */
    async get(req, res) {
        let { id } = req.query,
            uid = req.user.data._id;
        let data = await Article.findOne({ author: uid, _id: id, status: { $ne: -1 } }).populate('sort').lean();
        if (!data) return res.status(403).send(Response.error.USER_ARTICLE_GET);
        res.status(200).send(Response.success('获取文章详细成功', data))
    },
    /**
    * @description 发布文章 参数：title-标题, content-文章内容, desc-文章摘要, sort-文章分类, tag-文章标签, coverImg-封面图
    * @param {Request} req 
    * @param {Response} res 
    */
    async add(req, res) {
        let { title, content, desc, sort, tag, coverImg } = req.body;
        let uid = req.user.data._id,
            isAdmin = req.user.data.roles.find(item => item.name == 'admin'); // 管理员发布文章不需要审核

        let sortName = await ArticleSort.findById(sort);
        if (!isAdmin && sortName && sortName.name == '公告') return res.status(403).send(Response.error.NOTAUTH);

        let data = await new Article({ _id: await getId('article'), title, content:xssFilter(content), desc, sort, tag, coverImg, status: isAdmin ? 1 : 0, author: uid }).save();

        res.status(200).send(Response.success('保存文章成功，将在审核通过后发布', data))

        if (isAdmin) {
            // 保存标签
            tag.forEach(async (item) => {
                await ArticleTags.findOneAndUpdate({ name: item }, {
                    $inc: {
                        total: 1
                    }
                }, { upsert: true, new: true, setDefaultsOnInsert: true })
            })
        }
    },
    /**
     * @description 删除文章
     * @param {Request} req 
     * @param {Response} res 
     */
    async del(req, res) {
        let { id } = req.body, uid = req.user.data._id;
        let result = await Article.findOneAndUpdate({ _id: id, author: uid }, {
            $set: {
                status: -1
            }
        })
        if (!result) return res.status(403).send(Response.error.USER_ARTICLE_DEL);
        // 删除标签
        await ArticleTags.updateMany({ name: { $in: result.tag } }, {
            $inc: {
                total: -1
            }
        })
        res.status(200).send(Response.success('删除文章成功', result))
    },
    /**
     * @description 编辑文章
     * @param {Request} req 
     * @param {Response} res 
     */
    async edit(req, res) {
        let { _id, title, content, desc, sort, tag, coverImg } = req.body,
            uid = req.user.data._id,
            isAdmin = req.user.data.roles.find(item => item.name == 'admin');
        let data = await Article.findOneAndUpdate({ _id, author: uid }, {
            $set: {
                title, desc, sort, tag, coverImg,
                updateTime: Math.ceil(Date.now() / 1000),
                content: xssFilter(content),
                status: isAdmin ? 1 : 0
            }
        })

        if (!data) return res.status(403).send(Response.error.USER_ARTICLE_EDIT);
        res.status(200).send(Response.success('保存文章成功，将在审核通过后发布', data))

    },
    /**
     * @description 获取用户的回复 包括文章、评论回复
     * @param {Request} req 
     * @param {Response} res 
     */
    async replyList(req, res) {
        let { page, pageSize } = req.query;
        page = Number(page)
        pageSize = Number(pageSize)
        if (page < 1) page = 1;
        let uid = req.user.data._id;
        // let list = await Comment.populate('article',{ author: 1 }).find({ article: '$article.author' })

        // 查询回复用户的消息列表  两个表 article-文章表 comment-评论
        // 条件1 在用户发布的文章下的评论 comment.article = 文章(article.author = uid) 
        // 条件2 回复用户发布的评论 comment.comment = 评论(comment.from = uid)
        // 条件3 楼中楼里的回复 comment.comment = 评论(comment.reply.from = uid)

        // 先筛选出用户发表过的文章和评论
        let userArticle = await Article.find({ author: uid }, { _id: 1 }).lean();
        let userComment = await Comment.find({ from: uid }, { _id: 1 }).lean();
        let commentIds = userComment.map(item => item._id)

        let list = await Comment.find({
            $or:
                [
                    {
                        article: { $in: userArticle.map(item => item._id) }
                    },
                    {
                        comment: { $in: commentIds }
                    },
                    {
                        comment: { $nin: commentIds },
                        reply: { $in: commentIds }
                    }
                ],
            from: { $ne: uid },
            status: 1
        })
            .sort({ createTime: -1 })
            .skip((page - 1) * pageSize).limit(pageSize)
            .populate('from', 'nickname avatar')
            .populate('comment', 'content')
            .populate('reply', 'content')
            .populate('article', 'title coverImg')


        res.status(200).send(Response.success('获取全部评论成功', {
            total: 0,
            page,
            list
        }))
    },
    /**
     * @description 获取用户发表的评论
     * @param {Request} req 
     * @param {Response} res 
     */
    async commentList(req, res) {
        let { page, pageSize } = req.query;
        page = Number(page)
        pageSize = Number(pageSize)
        if (page < 1) page = 1;
        let uid = req.user.data._id;
        let list = await Comment
            .find({ from: uid, status: 1 })
            .sort({ createTime: -1 })
            .skip((page - 1) * pageSize).limit(pageSize)
            .populate('comment', 'content')
            .populate('reply', 'content')
            .populate('article', 'title coverImg')
            .lean();

        let total = await Comment.count({ from: uid });

        res.status(200).send(Response.success('获取全部评论成功', {
            total,
            list,
            page
        }))
    },
    /**
     * 
     * @description 发表评论 参数：articleId-文章id, commentId-顶级评论id, replyId-回复的评论id, content-评论内容
     * @param {Request} req 
     * @param {Response} res 
     */
    async commentAdd(req, res) {
        if(!setting.site.allowComment) return res.status(503).send(Response.error.CLOSED_COMMENT);
        let { articleId, commentId, replyId, content } = req.body,
            uid = req.user.data._id;
        let temp = {
            article: articleId,
            from: uid,
            content
        }
        // 回复楼中楼必须要顶级评论ID
        if (replyId && !commentId) return res.status(500).send(Response.error.MISPARAM)
        let wordCheck = mint.filterSync(content)
        if (!wordCheck.pass) {
            return res.status(422).send(Response.error.msg(422, `发布评论失败，存在违规词：${wordCheck.words.toString()}`))
        }
        if (commentId) temp.comment = new mongoose.Types.ObjectId(commentId);
        if (replyId) temp.reply = new mongoose.Types.ObjectId(replyId);
        let c = await new Comment(temp).save()
        let co = await Comment
            .findById(c._id)
            .populate({
                path: 'reply',
                populate: { path: 'from', select: 'nickname avatar' }
            })
            .populate('from', 'nickname avatar')
        res.status(200).send(Response.success('发表评论成功', co))

        await User.updateOne({ _id: uid }, {
            $inc: {
                exp: 10
            }
        })
    },
    /**
     * @description 删除评论 假删除
     * @param {Request} req 
     * @param {Response} res 
     */
    async commentDel(req, res) {
        let { id } = req.body;
        let data = await Comment.findByIdAndUpdate(id, {
            $set: {
                status: 0
            }
        });
        if (!data) res.status(400).send(Response.error.NOTDATA);
        res.status(200).send(Response.success('删除评论成功', data))
    }
}