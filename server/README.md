# 四糸乃赛高的博客 - 动漫风格的个人博客


基于 Nuxt.js + Express + MongoDB 开发的个人博客。[线上地址 yoshinosk.com](https://yoshinosk.com)。

客户端使用[Nuxt.js](https://www.nuxtjs.cn/) + [BootstrapVue](https://bootstrap-vue.org/)，后台使用[vue-manage-system](https://github.com/lin-xin/vue-manage-system/tree/V4.2.0)。

服务端使用基于[Nodejs](http://nodejs.cn/)的[Express](https://github.com/expressjs/express)框架。

数据库使用[MongoDB](https://www.mongodb.com/)。

第一次开源，文档写的不好请见谅。

如果您在使用过程中遇到问题，可以联系我。

邮箱：996111053@qq.com

交流群：779724783

***
## 目录
+ client 客户端
+ server 服务端
+ database 数据库文件
+ admin 后台

***
## 项目截图

![项目截图](/screenshots/%E9%A6%96%E9%A1%B5.png)
![项目截图](/screenshots/%E6%96%87%E7%AB%A0.png)
![项目截图](/screenshots/%E7%94%A8%E6%88%B7%E4%B8%AD%E5%BF%83.png)

![项目截图](/screenshots/%E5%90%8E%E5%8F%B01.png)
![项目截图](/screenshots/%E5%90%8E%E5%8F%B02.png)
![项目截图](/screenshots/%E5%90%8E%E5%8F%B03.png)

***
## 功能
- [x] 文章管理/点赞/审核
- [x] 鉴权
- [x] 评论
- [x] 登录/注册/找回密码/自动登录
- [x] 网站设置
- [x] 用户等级
- [x] 留言板
- [x] 签到
- [x] 消息
- [x] 上传图片
- [x] 违规词检测

***
## 安装
分别进入客户端、服务端、后台 安装项目依赖，安装失败可用 cnpm 或 yarn
```
npm install
```

服务端，默认端口3000，开启后可在浏览器输入地址访问后台 http://localhost:3000/admin 
```
npm run start
```

客户端/后台，默认端口8080
```
npm run dev
```
***
## 导入数据库

数据库包含基础权限，默认文章分类，默认用户等级。
```
mongorestore -d blog ./database -u [用户名] -p [密码] --authenticationDatabase admin
```


***
## 目录结构

### 服务端
+ config 配置文件
+ controller 控制器 业务逻辑都在这里
+ models 数据库模型
+ public 服务端静态文件
+ routes 路由配置
+ utils 工具类

### 客户端
+ api 接口模块
+ assets 需要编译的资源文件
+ middleware 中间件
+ layouts 视图模板
+ pages 页面组件
+ components 公共组件
+ plugins 插件
+ static 静态资源文件

***
## 其他

开启服务端前需配置数据库，在服务端/config/index.js文件。

在客户端文件：nuxt.config.js、app.html取消L2Dwidget的注释可以开启左下角的Live2D

考虑到文章要审核，只加了xss过滤，没有违规词检测。

未登录用户可发布留言和点赞文章。