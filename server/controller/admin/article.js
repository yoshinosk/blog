const { Article, Sort: ArticleSort, Tags: ArticleTags } = require('../../models/article'),
    User = require('../../models/user'),
    Comment = require('../../models/comment'),
    Msg = require('../../models/message'),
    { getId } = require('../../utils/db'),
    Response = require('../../utils/response'),
    { isNumber } = require('../../utils/regexp'),
    { setting } = require('../../config'),
    { setCoin } = require('../../utils/user')

/**
 * @description 文章管理
 */
const article = {
    /**
    * @description 获取文章详细内容 参数：id-文章ID
    * @param {Request} req 
    * @param {Response} res 
    */
    async get(req, res) {
        let { id } = req.query;
        let data = await Article.findById(id).lean();
        data ? res.status(200).send(Response.success('获取文章内容成功', data)) : res.status(400).send(Response.error.NOTDATA);
    },
    /**
    * @description 获取全部文章 参数：page-页码, pageSize-页数大小, searchKey-搜索关键字, status-文章状态, sort-文章分类, tags-文章标签
    * @param {Request} req 
    * @param {Response} res 
    */
    async list(req, res) {
        let { page, pageSize, searchKey, status, sort, tags } = req.query;
        if (page < 1) page = 1;
        if (pageSize < 1) pageSize = 10;
        page = Number(page);
        pageSize = Number(pageSize);
        // 筛选文章状态和分类
        let condition = {}
        status != '' && (condition.status = Number(status));
        sort != '' && (condition.sort = Number(sort));
        tags instanceof Array && (condition.tag = {
            $elemMatch: { $in: tags }
        })
        let query = Article.find(condition, { content: 0 })
        let total = 0;
        // 模糊搜索
        if (searchKey) {
            let orArr = [{ title: new RegExp(String(searchKey), 'i') }] // 标题
            let users = await User.find({ nickname: new RegExp(String(searchKey), 'i') }, { _id: 1 }).lean() // 作者名
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
            .sort({ order: -1, createTime: -1 })
            .skip((page - 1) * pageSize).limit(pageSize)
            .populate('sort', 'name')
            .populate('author', 'nickname avatar')

            ;
        res.status(200).send(Response.success('获取文章列表成功', { list, total, page }));
    },
    /**
    * @description 发布文章 参数：title-标题, content-文章内容, desc-文章摘要, sort-文章分类, tag-文章标签, coverImg-封面图
    * @param {Request} req 
    * @param {Response} res 
    */
    async add(req, res) {
        let { title, content, desc, sort, tag, coverImg } = req.body;
        let uid = req.user.data._id;
        let data = await new Article({ _id: await getId('article'), title, content, desc, sort, tag, coverImg, status: 1, author: uid }).save();

        res.status(200).send(Response.success('发布文章成功', data))
        // 保存标签
        tag.forEach(async (item) => {
            await ArticleTags.findOneAndUpdate({ name: item }, {
                $inc: {
                    total: 1
                }
            }, { upsert: true, new: true, setDefaultsOnInsert: true })
        })
    },
    /**
    * @description 删除文章 假删除 参数：id-文章id
    * @param {Request} req 
    * @param {Response} res 
    */
    async del(req, res) {
        let { id } = req.body;
        let result = await Article.findByIdAndUpdate(id, {
            $set: {
                status: -1,
                deleteTime: Math.ceil(Date.now() / 1000)
            }
        })
        if (!result) return await res.status(400).send(Response.error.NOTDATA);
        // 删除标签
        await ArticleTags.updateMany({ name: { $in: result.tag } }, {
            $inc: {
                total: -1
            }
        })

        res.status(200).send(Response.success('删除文章成功'))
    },
    /**
     * @description 文章审核 参数：id-文章id,result-1=审核通过 2=不通过,remark-审核不通过的原因
     * @param {Request} req 
     * @param {Response} res 
     */
    async approval(req, res) {
        let { id, result, remark } = req.body;
        if (result == 2 && !remark) return res.status(422).send(Response.error.MISPARAM);
        let article = await Article.findOneAndUpdate({ _id: id }, { $set: { status: result == 1 ? 1 : 2 } })
        if (!article) return res.status(400).send(Response.error.NOTDATA);

        // 发送消息通知用户
        await new Msg({
            from: req.user.data._id,
            to: article.author,
            content: result == 1 ? `${setting.site.callName}发布的文章【${article.title}】审核已通过` : `${setting.site.callName}发布的文章【${article.title}】审核未通过，原因：${remark}`
        }).save()

        // 审核通过后的操作 无更新日期表示该文章是第一次审核通过
        if (result == 1 && !article.updateTime) {
            // 保存标签
            article.tag.forEach(async (item) => {
                await ArticleTags.findOneAndUpdate({ name: item }, {
                    $inc: {
                        total: 1
                    }
                }, { upsert: true, new: true, setDefaultsOnInsert: true })
            })
            // 用户奖励
            await User.updateOne({ _id: article.author }, {
                $inc: {
                    exp: 200
                }
            })
            await setCoin(article.author, 50, '发布文章奖励')
        }

        res.status(200).send(Response.success('保存文章审核结果成功'))
    },
    /**
     * @description 文章编辑
     * @param {Request} req 
     * @param {Response} res 
     */
    async edit(req, res) {
        let { _id, title, content, desc, sort, tag, coverImg, status } = req.body;

        let article = await Article.findOneAndUpdate({ _id }, {
            $set: {
                title, content, desc, sort, tag, coverImg, status,
                updateTime: Math.ceil(Date.now() / 1000)
            }
        }).lean();

        if (!article) return res.status(400).send(Response.error.NOTDATA);

        res.status(200).send(Response.success('保存文章成功', article))
    },
    /**
     * @description 设置文章排序
     * @param {Request} req 
     * @param {Response} res 
     */
     async setOrder(req, res) {
        let { aid, order } = req.body;

        let art = await Article.findByIdAndUpdate(aid , {
            $set: {
                order: Number(order)
            }
        })

        if(!art) return res.status(400).send(Response.error.NOTDATA);
        res.status(200).send(Response.success('设置排序成功', art));
    },
    /**
     * @description 设置分类排序
     * @param {Request} req 
     * @param {Response} res 
     */
     async sortOrder(req, res) {
        let { sid, order } = req.body;

        let data = await ArticleSort.findByIdAndUpdate(sid , {
            $set: {
                order: Number(order)
            }
        })

        if(!data) return res.status(400).send(Response.error.NOTDATA);
        res.status(200).send(Response.success('设置排序成功', data));
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
    * @description 添加文章分类 参数： name-分类名, desc-分类描述
    * @param {Request} req 
    * @param {Response} res 
    */
    async sortAdd(req, res) {
        let { name, desc } = req.body;
        let data = await new ArticleSort({ _id: await getId('sort'), name, desc }).save();
        res.status(200).send(Response.success('添加文章分类成功', data));

    },
    /**
    * @description 删除文章分类 参数： id-分类id，name-分类名, desc-分类描述
    * @param {Request} req 
    * @param {Response} res 
    */
    async sortDel(req, res) {
        let { id } = req.body;
        let count = await Article.count({ sort: id });
        if(count) return res.status(400).send(Response.error.BEINGUSED);
        await ArticleSort.deleteOne({ _id: id });
        res.status(200).send(Response.success('删除文章分类成功'));
    },
    /**
    * @description 编辑文章分类 参数： id-分类id
    * @param {Request} req 
    * @param {Response} res 
    */
    async sortEdit(req, res) {
        let { _id, name, desc } = req.body;
        let data = await ArticleSort.updateOne({ _id }, {
            $set: {
                name, desc
            }
        })

        res.status(200).send(Response.success('编辑文章分类成功', data));
    },
    /**
    * @description 获取全部评论列表 参数：page-页数, pageSize, article-文章标题搜索, nickname-作者昵称搜索
    * @param {Request} req 
    * @param {Response} res 
    */
    async commentList(req, res) {
        let { page, pageSize, article, nickname } = req.query;
        // 默认页数
        if (page < 1) page = 1;
        if (pageSize < 1) pageSize = 10;
        page = Number(page);
        pageSize = Number(pageSize);
        

        let query = Comment.find()
        let total = 0;
        // 模糊搜索
        if (article || nickname) {
            let orArr = []
            if (article) {
                let articles = await Article.find({ title: new RegExp(String(article), 'i') }).lean()
                articles.length && orArr.push({
                    article: {
                        $in: articles.map(item => item._id)
                    }
                })
            }
            if (nickname) {
                let users = await User.find({ nickname: new RegExp(String(nickname), 'i') }, { _id: 1 }).lean()
                users.length && orArr.push({
                    from: {
                        $in: users.map(item => item._id)
                    }
                })
            }
            query.or(orArr)
            total = await Comment.count({ $or: orArr })
        } else {
            total = await Comment.count()
        }

        let list = await query
            .sort({ createTime: -1 })
            .skip((page - 1) * pageSize).limit(pageSize)
            .populate('from', 'nickname avatar')
            .populate('article', 'title')
            .populate('comment')
            .populate('reply')

        res.status(200).send(Response.success('获取全部评论成功', {
            total,
            list,
            page
        }))
    },
    async commentAdd(req, res) {
        let { articleId, commentId, replyId, content } = req.body;
        let c = await new Comment({
            article: articleId,
            comment: commentId,
            reply: replyId,
            from: req.user.data._id,
            content
        }).save()
        res.status(200).send(Response.success('发表评论成功', c))

    },
    /**
    * @description 删除评论 参数：id-评论id 可传数组
    * @param {Request} req 
    * @param {Response} res 
    */
    async commentDel(req, res) {
        let { id } = req.body;
        if (id instanceof Array) {
            let data = await Comment.deleteMany({ _id: { $in: id } })
            res.status(200).send(Response.success(`成功删除${data.modifiedCount}条评论`))
        } else {
            await Comment.deleteOne({ _id: id })
            res.status(200).send(Response.success(`删除评论成功`))
        }
    },
}

module.exports = article;