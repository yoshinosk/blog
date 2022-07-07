import request from '../utils/request';

export const getList = query => {
    return request({
        url: '/admin/level/list',
        method: 'get',
        params: query || {},
        showMsg: false
    });
};

export const add = data => {
    return request({
        url: '/admin/level/add',
        method: 'post',
        data: data || {}
    });
};

export const edit = data => {
    return request({
        url: '/admin/level/edit',
        method: 'post',
        data: data || {}
    });
};

export const del = id => {
    return request({
        url: '/admin/level/del',
        method: 'delete',
        data:{ id }
    });
};