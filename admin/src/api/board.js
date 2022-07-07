import request from '../utils/request';

export const getList = query => {
    return request({
        url: '/admin/board/list',
        method: 'get',
        params: query || {},
        showMsg: false
    });
};

export const del = id => {
    return request({
        url: '/admin/board/del',
        method: 'delete',
        data:{ id }
    });
};