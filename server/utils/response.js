const { setting } = require('../config'),
    callName = setting.site.callName;

/**
 * @description 格式化请求信息
 * @param {Number} code 错误代码
 * @param {String}} msg 信息
 * @param {Object}} data 数据
 * @returns Object
 */
function format(code, msg, data = null) {
    return {
        code, msg, data
    }
}


module.exports = {
    success(msg, data) {
        return format(200, msg, data)
    },
    error: {
        msg: (code, msg) => format(code, msg),
        CLOSED: format(503, '服务器维护中...'),
        CLOSED_COMMENT: format(503, '评论发布功能暂时关闭'),
        CLOSED_BOARD: format(503, '留言发布功能暂时关闭'),
        SERVER: format(500, '请求失败，服务器错误'),
        NOTDATA: format(400, '内容不存在~'),
        NOTAUTH: format(403, '请求失败，无访问权限'),
        MISPARAM: format(422, '缺少参数'),
        PARAMSERR: format(422, '参数格式错误'),
        BEINGUSED: format(400, '该项目被其他项依赖,无法删除'),
        USER_NOTLOGGEDIN: format(401, `请${callName}登陆后重试`),
        USER_PWDERR: format(4001, `登录失败，请${callName}检查用户名与密码是否正确`),
        USER_EMAILUSED: format(4002, `该邮箱已被使用，请${callName}使用其他邮箱`),
        USER_NAMEUSED: format(4002, `该昵称已被使用，请${callName}使用其他昵称`),
        USER_NICKNAMEERR: format(422, `昵称不能包含_-以外的特殊符号，请${callName}使用其他昵称`),
        USER_NOTFOUND: format(4003, '用户不存在'),
        USER_NOTCODE: format(4007, `请${callName}先发送验证码`),
        USER_EXPIRED: format(4008, `凭证过期，请${callName}重新登录`),
        USER_REXPIRED: format(4009, `凭证过期，请${callName}重新登录`),
        USER_ARTICLE_DEL: format(4031, `删除文章失败，${callName}无权删除该文章`),
        USER_ARTICLE_EDIT: format(4031, `编辑文章失败，${callName}无权编辑该文章`),
        USER_ARTICLE_GET: format(4031, `${callName}无权查看该文章`),
        USER_ARTICLE_TOGGLE: format(4031, `该文章当前状态无法切换`),
        USER_AUTHFAIL: format(400, `验证失败，邮箱验证码不匹配`),
        USER_CODELIMIT: format(400, `验证失败，请${callName}重新发送验证码`),
        USER_BAN: format(4032, `${callName}的账号已被封禁！`),
        EMAIL_CODEERR: format(4004, `${callName}输入的验证码有误！`),
        EMAIL_MISMATCH: format(4005, `${callName}输入的邮箱与验证码不匹配！`),
        EMAIL_SENDTIME: format(4006, `发送间隔过短，请${callName}稍后重试`),
        RIGHTS_NOTFOUND: format(400, '权限不存在'),
        RIGHTS_REJECTDEL: format(400, '该权限被角色或其他依赖，无法删除'),
        LIMIT_PART_COUNT: format(400, 'Too many parts'),
        LIMIT_FILE_SIZE: format(400, '上传失败，文件超出限制大小'),
        LIMIT_FILE_COUNT: format(400, '上传失败，文件数量超出限制'),
        LIMIT_FIELD_KEY: format(400, '上传失败，文件名过长'),
        LIMIT_FIELD_VALUE: format(400, 'Field value too long'),
        LIMIT_FIELD_COUNT: format(400, 'Too many fields'),
        LIMIT_UNEXPECTED_FILE: format(400, 'Unexpected field'),
        LIMIT_FILE_TYPE: format(400, '上传失败，无法上传该类型文件'),
        SITE_REGISTER: format(400, '注册失败，网站已关闭用户注册功能'),
    }
}