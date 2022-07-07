const mongoose = require("mongoose");

// 文章模型
const ArticleScheam = new mongoose.Schema({
    _id: { type: Number, unique: true, index: true, required: true },
    title: { type: String, trim: true, required: true }, // 标题
    content: { type: String, required: true },// 内容
    desc: { type: String, required: true },// 描述
    author: { type: Number, required: true, ref:'User' }, //作者id
    createTime: { type: Number , default: () => Math.ceil(Date.now() / 1000) },// 创建时间
    updateTime: { type: Number },// 编辑时间
    deleteTime: {type:Number},// 删除时间
    sort: { type: Number, default: 0 ,ref: 'Article_Sort' },// 分类id
    views: { type: Number, default: 0 },// 浏览数
    tag: { type: Array },// 标签
    coverImg: { type: String  }, // 封面图
    status: { type: Number, default: 0 },// -1：已删除 0：待审核 1：审核通过 2：审核未通过 3：隐藏
    order: { type: Number, default: 0 }, // 排序 越大越靠前
    goods: { type: Number, default: 0 },// 点赞
    allowComment:{ type:Number,default: 1 }, // 允许评论
    type:{ type:Number,default: 1 }, // 文章类型 默认1 - HTML 2 - MARKDOWN
},{ _id: false, autoIndex: false , versionKey: false})

// 文章分类模型
const SortScheam = new mongoose.Schema({
    _id: { type: Number, require: true  , index: true},
    name: { type: String, require: true , index: true},
    desc: { type: String, require: true },
    order: { type: Number, default: 0 }, // 排序 
},{ _id: false, autoIndex: false ,versionKey: false})

// 文章标签模型
const TagsScheam = new mongoose.Schema({
    name: { type: String, require: true },
    total: { type: Number, default: 1 }
},{ versionKey: false}) 

module.exports = {
    Article: mongoose.model('Article', ArticleScheam),
    Sort: mongoose.model('Article_Sort', SortScheam),
    Tags: mongoose.model('Article_Tags', TagsScheam),
}