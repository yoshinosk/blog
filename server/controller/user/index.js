const md5 = require('md5');
const User = require('../../models/user'),
    jwt = require('jsonwebtoken'),
    { getId } = require('../../utils/db'),
    nodemailer = require('../../utils/nodemailer'),
    { SECRET_PWD, SECRET_TOKEN, setting } = require('../../config'),
    Response = require('../../utils/response'),
    // { client: redisClient } = require('../utils/redis'),
    { makeToken, getUser, setCoin } = require('../../utils/user'),
    moment = require('moment'),
    SignIn = require('../../models/signIn'),
    article = require('./article'),
    upload = require('./upload'),
    message = require('./message'),
    log = require('./log'),
    mint = require('../../utils/wordFilter'),
    { nicknameCheck } = require('../../utils/regexp');


module.exports = {
    upload,
    article,
    message,
    log,
    /**
    * @description 用户登录 account-邮箱,  password-密码
    * @param {Request} req 
    * @param {Response} res 
    */
    async login(req, res) {
        let { account, password } = req.body;
        account = account.toLowerCase();
        let user = await getUser(account, 'email', true)
        if (!user) return res.status(412).send(Response.error.USER_NOTFOUND);
        if (!user.status) return res.status(403).send(Response.error.USER_BAN);
        if (md5(password + SECRET_PWD) == user.password) {
            delete user.password;
            user.token = await makeToken(user, res);
            res.status(200).send(Response.success('登录成功', user));
            await User.updateOne({ email: account }, { $set: { lastLoginTime: Math.floor(Date.now() / 1000), ip: req.ip } }) // 更新最后登录时间
        } else {
            return res.status(412).send(Response.error.USER_PWDERR);
        }
    },
    /**
    * @description 登出
    * @param {Request} req 
    * @param {Response} res 
    */
    async logout(req, res) {
        res.clearCookie('rt')
        res.status(200).send(Response.success('登出成功'))
    },
    /**
     * @description 用户注册 参数：email-邮箱, nickname-昵称, password-密码, mailCode-邮箱验证码
     * @param {Request} req 
     * @param {Response} res 
     */
    async register(req, res) {
        // 是否开启网站注册
        if (!setting.site.allowRegister) return res.status(403).send(Response.error.SITE_REGISTER);
        // 是否发送邮箱验证码
        if (!req.session.mailCode) return res.status(412).send(Response.error.USER_NOTCODE);

        let { email, nickname, password, mailCode } = req.body;
        // 邮箱验证码是否匹配
        if (email != req.session.email) return res.status(422).send(Response.error.EMAIL_MISMATCH);
        if (mailCode != req.session.mailCode) return res.status(422).send(Response.error.EMAIL_CODEERR);

        if (await User.findOne({ nickname })) return res.status(422).send(Response.error.USER_NAMEUSED);
        if (await User.findOne({ email })) return res.status(422).send(Response.error.USER_EMAILUSED);
        
        if(!nicknameCheck(nickname)) return res.status(412).send(Response.error.USER_NICKNAMEERR);

        let wordCheck = mint.filterSync(nickname)
        if (!wordCheck.pass) return res.status(422).send(Response.error.msg(422, `注册失败，昵称存在违规词：${wordCheck.words.toString()}`))
        let user = new User({ _id: await getId('users'), nickname, password, email, ip: req.ip });
        user.save(err => {
            if (err) {
                console.log(err)
                res.status(500).send(Response.error.SERVER);
            } else {
                req.session.mailCode = null;
                res.status(200).send(Response.success('注册成功', user));
            }
        })
    },
    /**
     * @description 找回密码
     * @param {Request} req 
     * @param {Response} res 
     */
    async retrieve(req, res) {
        let { password, email, mailCode } = req.body;
        
        if (!req.session.mailCode) return res.status(412).send(Response.error.USER_NOTCODE);
        if (!req.session.reqCount) req.session.reqCount = 1;
        req.session.reqCount++;
        if (req.session.reqCount > 5) return res.status(400).send(Response.error.USER_CODELIMIT);
        if (mailCode != req.session.mailCode || email != req.session.email) return res.status(400).send(Response.error.USER_AUTHFAIL);

        let u = await User.findOne({ email }).lean();
        if(!u) res.status(400).send(Response.error.USER_NOTFOUND)
        if(u.roles.find(item => item == 'admin'))  return res.status(403).send(Response.error.NOTAUTH);
        await User.updateOne({ email }, {
            $set: {
                password
            }
        })
        req.session.reqCount = 0;
        req.session.mailCode = null;
        res.status(200).send(Response.success(`已重置密码，${setting.site.callName}可以去登录啦~`));
    },
    /**
     * @description 发送邮箱验证码 参数：email-邮箱
     * @param {Request} req 
     * @param {Response} res 
     */
    async sendEmailCode(req, res) {
        let { email } = req.body;
        if (req.session.sendDate && Date.now() - parseInt(req.session.sendDate) < (1000 * 60)) {
            return res.status(412).send(Response.error.EMAIL_SENDTIME);
        }
        let code = Math.random().toString(32).substring(2).slice(0, 6);
        let sendResult = await nodemailer({
            from: '四糸乃赛高 <Yoshino@111.com>',
            to: `${email}`,
            subject: '四糸乃赛高的博客验证码',
            html: `${setting.site.callName}的验证码为：<b>${code}</b>，请在十分钟内使用`
        })
        if (sendResult) {
            req.session.reqCount = 0;
            req.session.mailCode = code;// 生成的验证码
            req.session.email = email; // 接收验证码的邮箱
            req.session.sendDate = Date.now();
            res.status(200).send(Response.success('已发送邮箱验证码，请在十分钟内使用'));
        } else {
            res.status(500).send(Response.error.SERVER);
        }
    },

    // REDIS版签到
    // async signIn(req, res) {
    //     let { user } = req,
    //         day = new Date().getDate(),
    //         key = `user:sign:${user.data._id}:${moment().format('YYYYMM')}`;
    //     let checkSignIn = await redisClient.getBit(key, day - 1, 1)
    //     if (!checkSignIn) {
    //         await redisClient.setBit(key, day - 1, 1);

    //         res.status(200).send(Response.success('签到成功'))
    //         // 更新累计签到次数
    //         await User.updateOne({ _id: user.data._id }, {
    //             $inc: {
    //                 signInTol: 1
    //             }
    //         })
    //     } else return res.status(200).send(Response.success(`${setting.site.callName}今天已签到~`))
    // },
    /**
     * @description 用户签到
     * @param {Request} req 
     * @param {Response} res 
     */
    async signIn(req, res) {
        let { user } = req,
            now = new Date(),
            uid = user.data._id,
            data,
            exp = 10, // 默认签到给10经验 
            log = await SignIn.findOne({ uid });
        if (log) {
            let nowNum = parseInt(moment(now).format('YYYYMMDD')),
                lastSignIn = parseInt(moment(new Date(log.lastSignIn * 1000)).format('YYYYMMDD'))
            // 今日是否签到
            if (nowNum == lastSignIn) return res.status(200).send(Response.success(`${setting.site.callName}今天已经签到过啦~`))
            let update = {
                $set: { lastSignIn: parseInt(now.getTime() / 1000) }
            }
            // 判断是否连续签到
            if (nowNum - lastSignIn == 1) {
                update.$inc = { continuity: 1 };
                exp += (log.continuity + 1) * 5;
            }
            else update.$set.continuity = 1;
            data = await SignIn.findOneAndUpdate({ uid }, update).lean()

            if (nowNum - lastSignIn == 1) data.continuity++;
        } else {
            data = await new SignIn({
                uid,
                lastSignIn: parseInt(now.getTime() / 1000)
            }).save()
        }
        // 更新总签到次数
        await User.updateOne({ _id: uid }, {
            $inc: {
                signInTol: 1,
                exp
            }
        })
        let coin = parseInt(Math.random() * (10 - 1 + 1) + 1, 10);
        await setCoin(uid, coin, `签到随机获得1-10硬币`);
        let u = await getUser(uid);
        let continuity = log ? (log.continuity + 1) : 1;

        res.status(200).send(Response.success(`签到成功，${setting.site.callName}已连续签到${continuity}天，获得${coin}个硬币和${exp}经验值。`, u))
    },
    /**
     * @description 刷新TOKEN
     * @param {Request} req 
     * @param {Response} res 
     * @returns 
     */
    async refreshToken(req, res) {
        try {
            let { rt } = req.signedCookies;
            if (!rt) res.status(401).send(Response.error.USER_NOTLOGGEDIN);
            jwt.verify(rt, SECRET_TOKEN, async (err, decoded) => {
                if (err) {
                    res.clearCookie('rt')
                    res.status(401).send(Response.error.USER_REXPIRED)
                } else if (decoded.uid) {
                    // 更新用户信息
                    let user = await getUser(decoded.uid);
                    delete user.password;
                    user.token = await makeToken(user, res);
                    res.status(200).send(Response.success('更新TOKEN成功', user))
                } else res.status(401).send(Response.error.USER_NOTLOGGEDIN)
            })
        } catch (err) {
            console.log(err)
            res.status(500).send(Response.error.SERVER)
        }
    },
    /**
    * @description 获取基本信息
    * @param {Request} req 
    * @param {Response} res 
    */
    async profile(req, res) {
        let uid = req.user.data._id,
            user = await getUser(uid),
            signInLog = await SignIn.findOne({ uid }).lean();
        user.signInCtn = signInLog ? signInLog.continuity : 0;
        res.status(200).send(Response.success('获取用户资料成功', user));
    },
    /**
    * @description 编辑个人资料
    * @param {Request} req 
    * @param {Response} res 
    */
    async profileEdit(req, res) {
        let keys = ['nickname', 'usersign'], set = {};
        keys.forEach(key => { set[key] = req.body[key] })
        let user = req.user.data;

        // 如果用户修改了昵称则检测昵称是否被使用
        if (set.nickname != user.nickname) {
            let u = await User.findOne({ nickname: set.nickname }).lean();
            if (u) return res.status(400).send(Response.error.USER_NAMEUSED);
            let wordCheck = mint.filterSync(set.nickname)
            if (!wordCheck.pass) return res.status(422).send(Response.error.msg(422, `保存失败，昵称存在违规词：${wordCheck.words.toString()}`))
        }
        if(!nicknameCheck(set.nickname)) return res.status(412).send(Response.error.USER_NICKNAMEERR);

        let wordCheck = mint.filterSync(set.usersign)
        if (!wordCheck.pass) return res.status(422).send(Response.error.msg(422, `保存失败，签名存在违规词：${wordCheck.words.toString()}`))

        let data = await User.findByIdAndUpdate(user._id, {
            $set: set
        })

        data = data.toJSON()

        keys.forEach(key => { data[key] = req.body[key] })

        res.status(200).send(Response.success('修改资料成功', data));
    },
    /**
     * @description 修改头像
     * @param {Request} req 
     * @param {Response} res 
     */
    async setAvatar(req, res) {
        let uid = req.user.data._id,
            { url } = req.body;

        await User.updateOne({ _id: uid }, {
            $set: {
                avatar: url
            }
        })

        res.status(200).send(Response.success('修改头像成功', global.HOST + url));
    }

}