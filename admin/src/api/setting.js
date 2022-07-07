import request from '../utils/request';

export const get = query => {
    return request({
        url: '/admin/setting',
        method: 'get',
        params: query || {},
        showMsg: false
    });
};

export const getList = query => {
    return request({
        url: '/admin/setting/list',
        method: 'get',
        params: query || {},
        showMsg: false
    });
};

export const add = data => {
    return request({
        url: '/admin/setting/add',
        method: 'post',
        data: data || {}
    });
};

export const edit = data => {
    return request({
        url: '/admin/setting/edit',
        method: 'post',
        data: data || {}
    });
};

export const del = id => {
    return request({
        url: '/admin/setting/del',
        method: 'delete',
        data:{ id }
    });
};