import axios from 'axios'
import { Message,Loading  } from 'element-ui'
import { refreshToken } from '@/api';
import store from '../store';

var vm;
export const setVM = (v) => {vm = v}

axios.defaults.baseURL = process.env.VUE_APP_BASE_URL;

const service = axios.create({
    // withCredentials: true, // send cookies when cross-domain requests
    timeout: 5000 ,// request timeout,
    showLoading: true,
    showMsg: true
})

var loading = null;

function hideLoading(){
    if(loading){
        loading.close();
        loading = null;
    }
}

function showError(msg){
    hideLoading()
    Message({
        message:msg,
        type:'error',
        showClose:true
    })
}

// request interceptor
service.interceptors.request.use(
    config => {
        config.showLoading && (
            loading = Loading.service({
                fullscreen: true
            })
        )
        config.headers['Authorization'] = 'Bearer ' + store.state.user.token;
        return config
    },
    error => {
       showError(error.toString())
        return Promise.reject(error)
    }
)
// response interceptor
service.interceptors.response.use(
    response => {
        hideLoading()
        const res = response.data;
        if(res.code != 200) showError(res.msg.toString())
        else{
            response.config.showMsg && Message({
                message:res.msg,
                type:'success',
                duration:2000,
                showClose:true
            })
        }
        return response.data
    },
    async (error) => {
        // 服务器有响应
        if(error.response){
            const {data} = error.response;
            // 服务器有返回数据
            if(data && data instanceof Object){
                if(data.code != 4008) showError(data.msg)
                switch(data.code){
                    
                    case 401:
                        vm.$router.replace('/login');
                        localStorage.removeItem('logged')
                    break; 
                    // token过期
                    case 4008:
                    try{
                        let res = await refreshToken()
                        localStorage.setItem('logged',true)
                        vm.$vuex('user', res.data);
                        return service(error.response.config)
                    }catch(err){
                        return Promise.reject()
                    }
                }
            }else{
                showError(error.response.statusText)
            }
            
        }else{
            showError(error.toString())
        }
         
        return Promise.reject(error)
    }
)

export default  service