import request from '../utils/request';

// 获取权限列表
export const getList = query => {
    return request({
        url: '/admin/rights/list',
        method: 'get',
        params: query || {},
        showMsg: false
    });
};

// 添加权限
export const add = data => {
    return request({
        url: '/admin/rights/add',
        method: 'post',
        data: data || {}
    });
};

// 编辑权限
export const edit = data => {
    return request({
        url: '/admin/rights/edit',
        method: 'post',
        data: data || {}
    });
};

// 删除权限
export const del = id => {
    return request({
        url: '/admin/rights/del',
        method: 'delete',
        data: {id}
    });
};