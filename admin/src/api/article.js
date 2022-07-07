import request from '../utils/request';

// 获取文章内容
export const getArticle = id => {
    return request({
        url: '/admin/article',
        method: 'get',
        params: { id },
        showMsg: false
    });
};
// 获取文章列表
export const getList = query => {
    return request({
        url: '/admin/article/list',
        method: 'get',
        params: query || {},
        showMsg: false
    });
};
// 发布文章
export const add = data => {
    return request({
        url: '/admin/article/add',
        method: 'post',
        data: data || {}
    });
};
// 编辑文章
export const edit = data => {
    return request({
        url: '/admin/article/edit',
        method: 'post',
        data: data || {}
    });
};
// 删除文章
export const del = id => {
    return request({
        url: '/admin/article/del',
        method: 'delete',
        data: { id }
    });
};
// 审核文章
export const approval = data => {
    return request({
        url: '/admin/article/approval',
        method: 'post',
        data
    });
};

// 设置文章排序 aid,order
export const setOrder = (aid, order) => {
    return request({
        url: '/admin/article/order',
        method: 'post',
        data: { aid, order }
    });
};


// 文章分类列表
export const sortList = query => {
    return request({
        url: '/admin/article/sort/list',
        method: 'get',
        params: query || {},
        showMsg: false
    });
};

// 添加文章分类
export const sortAdd = data => {
    return request({
        url: '/admin/article/sort/add',
        method: 'post',
        data: data || {}
    });
};

// 分类编辑
export const sortEdit = data => {
    return request({
        url: '/admin/article/sort/edit',
        method: 'post',
        data: data || {}
    });
};

// 删除分类
export const sortDel = id => {
    return request({
        url: '/admin/article/sort/del',
        method: 'delete',
        data: { id }
    });
};

// 设置分类排序 sid,order
export const sortOrder = (sid, order) => {
    return request({
        url: '/admin/article/sort/order',
        method: 'post',
        data: { sid, order }
    });
};

// 文章评论
export const commentList = query => {
    return request({
        url: '/admin/article/comment/list',
        method: 'get',
        params: query || {},
        showMsg: false
    })
}

// 删除评论
export const commentDel = id => {
    return request({
        url: '/admin/article/comment/del',
        method: 'delete',
        data: { id }
    });
};