import Vue from 'vue';
import App from './App.vue';
import router from './router';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css'; // 默认主题
// import './assets/css/theme-green/index.css'; // 浅绿色主题
import './assets/css/icon.css';
import './components/common/directives';
import 'babel-polyfill';

import store from './store';
import filters from './utils/filters';
import { setVM } from './utils/request';
import { refreshToken } from './api'

Object.keys(filters).forEach(function (key) {
Vue.filter(key, filters[key])
})

Vue.config.productionTip = false;
Vue.use(ElementUI, {
    size: 'small'
});

Vue.prototype.$vuex = function (name, value) {
    this.$store.commit('$uStore', {
        name, value
    })
}


//使用钩子函数对路由进行权限跳转
router.beforeEach((to, from, next) => {
    document.title = `${to.meta.title} | vue-manage-system`;
    const { user } = store.state;
    if (!user._id && to.path !== '/login') {
        next('/login');
    }  else {
        // 简单的判断IE10及以下不进入富文本编辑器，该组件不兼容
        if (navigator.userAgent.indexOf('MSIE') > -1 && to.path === '/editor') {
            Vue.prototype.$alert('vue-quill-editor组件不兼容IE10及以下浏览器，请使用更高版本的浏览器查看', '浏览器不兼容通知', {
                confirmButtonText: '确定'
            });
        } else {
            next();
        }
    }
});

const app = new Vue({
    router,
    store,
    filters,
    mounted() {
        if (localStorage.getItem('logged')) {
            refreshToken().then(({ data }) => {
                this.$vuex('user', data);
                this.$router.push('/');
            })
        }
    },
    render: h => h(App)
})

setVM(app)

app.$mount('#app');


