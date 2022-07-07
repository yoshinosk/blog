import request from '../utils/request';

export const getList = query => {
    return request({
        url: '/admin/user/list',
        method: 'get',
        params: query || {},
        showMsg: false
    });
};

export const edit = data => {
    return request({
        url: '/admin/user/edit',
        method: 'post',
        data,
        showMsg: true
    });
};