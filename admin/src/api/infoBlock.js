import request from '../utils/request';

export const getList = query => {
    return request({
        url: '/admin/infoBlock/list',
        method: 'get',
        params: query || {},
        showMsg: false
    });
};

export const add = data => {
    return request({
        url: '/admin/infoBlock/add',
        method: 'post',
        data: data || {}
    });
};

export const edit = data => {
    return request({
        url: '/admin/infoBlock/edit',
        method: 'post',
        data: data || {}
    });
};

export const del = id => {
    return request({
        url: '/infoBlock/role/del',
        method: 'delete',
        data: {
            id
        }
    });
};