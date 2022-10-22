import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

export default new Router({
    routes: [
        {
            path: '/',
            redirect: '/dashboard'
        },
        {
            path: '/',
            component: () => import(/* webpackChunkName: "home" */ '../components/common/Home.vue'),
            meta: { title: '自述文件' },
            children: [
                {
                    path: '/dashboard',
                    component: () => import(/* webpackChunkName: "dashboard" */ '../components/page/Dashboard.vue'),
                    meta: { title: '系统首页', permission: true }
                },
                {
                    path: '/404',
                    component: () => import(/* webpackChunkName: "404" */ '../components/page/404.vue'),
                    meta: { title: '404' }
                },
                {
                    path: '/403',
                    component: () => import(/* webpackChunkName: "403" */ '../components/page/403.vue'),
                    meta: { title: '403' }
                },
                {
                    path: '/rights',
                    component: () => import('@/views/rights'),
                    meta: {title:'权限管理'}
                },
                {
                    path: '/role',
                    component: () => import('@/views/role'),
                    meta: {title:'角色管理'}
                },
                {
                    path: '/article',
                    component: () => import('@/views/article'),
                    meta: { title:'文章管理' },
                },
                {
                    path: '/article/publish',
                    component: () => import('@/views/article/publish'),
                    meta: {title:'文章编辑'}
                },
                {
                    path: '/article/sort',
                    component: () => import('@/views/article/sort'),
                    meta: {title:'分类管理'}
                },
                {
                    path: '/article/comment',
                    component: () => import('@/views/article/comment'),
                    meta: {title:'评论管理'}
                },
                {
                    path: '/user',
                    component: () => import('@/views/user'),
                    meta: {title:'用户管理'}
                },
                {
                    path: '/level',
                    component: () => import('@/views/level'),
                    meta: {title:'等级管理'}
                },
                {
                    path: '/setting',
                    component: () => import('@/views/setting'),
                    meta: {title:'网站设定'}
                },
                {
                    path: '/setting/list',
                    component: () => import('@/views/setting/list'),
                    meta: {title:'设定管理'}
                },
                {
                    path: '/infoBlock',
                    component: () => import('@/views/infoBlock'),
                    meta: {title:'信息块管理'}
                },
                {
                    path: '/board',
                    component: () => import('@/views/board'),
                    meta: {title:'留言板管理'}
                },
                {
                    path: '/links',
                    component: () => import('@/views/links'),
                    meta: {title:'友情链接'}
                },
            ]
        },
        {
            path: '/login',
            component: () => import(/* webpackChunkName: "login" */ '../components/page/Login.vue'),
            meta: { title: '登录' }
        },
        {
            path: '*',
            redirect: '/404'
        }
    ]
});
