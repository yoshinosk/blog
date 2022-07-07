import request from '../utils/request';

export const login = data => {
    return request({
        url: '/admin/user/login',
        method: 'post',
        data: data || {}
    });
}

export const getBaseInfo = query => {
    return request({
        url: '/admin/baseInfo',
        method: 'get',
        params: query || {},
        showMsg: false
    });
}

export const refreshToken = () => {
    return request({
        url: '/user/refreshToken',
        method: 'post',
        showMsg: false
    });
}