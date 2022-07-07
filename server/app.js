require('./config/global');// 全局变量 
var express = require('express');
require('express-async-errors');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var indexRouter = require('./routes/index');
var app = express();
var session = require('express-session');

const { SECRET_SESSION, loadSetting } = require('./config'),
    userRouter = require('./routes/user'),
    adminRouter = require('./routes/admin'),
    { connect: connectDB } = require('./utils/db'),
    // { connect: connectRedis } = require('./utils/redis'),
    { checkToken, errorHandle, authUser, authAdmin, serverSetting } = require('./utils/middlewares')


// connectRedis(); // 连接redis

connectDB();

loadSetting();

app.set('trust proxy', 'loopback');

app.all('*', (req, res, next) => {
    res.header("Access-Control-Allow-Origin", req.headers.origin || "*");
    res.header("Access-Control-Allow-Credentials", true);
    res.header("Access-Control-Allow-Headers", "X-Requested-With,Authorization,Content-type");
    res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
    res.header("X-Powered-By", 'Nodejs')
    // res.header("Content-Type", "application/json;charset=utf-8");
    next();
});


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser(SECRET_SESSION));
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
    secret: SECRET_SESSION,
    resave: false,
    saveUninitialized: true,
    cookie: {
        secure: false,// https
        signed: true,
        maxAge: 1000 * 60 * 10 // 毫秒位单位 十分钟过期
    }
}));

app.use('/api', serverSetting, indexRouter);

app.use('/api/user', authUser, checkToken, userRouter);
app.use('/api/admin', authAdmin, checkToken, adminRouter);

app.use(errorHandle);


module.exports = app;
