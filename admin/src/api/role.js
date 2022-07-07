import request from '../utils/request';


// 获取角色列表
export const getList = query => {
    return request({
        url: '/admin/role/list',
        method: 'get',
        params: query || {},
        showMsg: false
    });
};

// 添加角色
export const add = data => {
    return request({
        url: '/admin/role/add',
        method: 'post',
        data: data || {}
    });
};

// 编辑角色
export const edit = data => {
    return request({
        url: '/admin/role/edit',
        method: 'post',
        data: data || {}
    });
};