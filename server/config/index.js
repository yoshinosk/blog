const Setting = require('../models/setting');
const config = {
    db: {
        username: '',
        password: '',
        host: '127.0.0.1',
        port: 27017,
        dbname: 'blog'
    },
    redis:{
        username: '',
        password: '',
        host: '127.0.0.1',
        port: 6379,
    },
    email: {
        host: '',
        port: 465,
        auth: {
            user: '',
            pass: '' 
        }
    },
    SECRET_PWD: 'SECRET_PWD',
    SECRET_SESSION: 'SECRET_SESSION',
    SECRET_TOKEN: 'SECRET_TOKEN',
    TOKEN_EFFECTIVE: 60 * 60 * 12,
    REFRESH_TOKEN_EFFECTIVE: 60 * 60 * 24 * 30,
    get_token_effective:() => Math.floor(Date.now() / 1000) + (60 * 60 * 12), // 获取token过期时间 
    get_refresh_token_effective:() => Math.floor(Date.now() / 1000) + (60 * 60 * 24 * 30) ,// 获取refresh token过期时间
    setting:{
        site: {
            allowRegister: true,// 允许注册用户
            allowComment: true, // 允许评论
            allowBoard: true,// 允许发布留言
            status: 1, //网站状态 0 关闭 1开启
            bg: '', // 网站默认背景
            articleCover: '', // 文章默认封面
            callName: '主人', // 称呼
            siteName: '四糸乃赛高的小窝' // 网站名
        }
    },
    async loadSetting(){
        let stList = await Setting.find();
        stList.forEach(item=>{
            let st = JSON.parse(item.data);
            if(!config.setting[item.type]) config.setting[item.type] = {};
            for(let key in st){
                config.setting[item.type][key] = st[key]
            }
        })
    }
}




module.exports = config;