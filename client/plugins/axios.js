var loading = false,
  timer,
  counter = 0; // 计数器 计算正在请求的接口
function showLoading(store) {
  counter++;
  timer && clearTimeout(timer);
  timer = setTimeout(() => {
    store.commit('setLoading', true);
  }, 300)
}

function hideLoading(store) {
  counter--;
  if (counter <=0) {
    counter = 0;
    timer = clearTimeout(timer);
    store.commit('setLoading', false);
  }
}

function showError(store, msg) {
  hideLoading(store)
  store.commit('setErrMsg', msg)

}

export default function ({ store, redirect, req, router, route, $axios, $bvToast, app }) {


  $axios.defaults.baseURL = process.env.BASE_URL;
  // request interceptor
  $axios.interceptors.request.use(
    config => {
      showLoading(store);
      let token = store.getters.token;
      if (token) config.headers['Authorization'] = 'Bearer ' + token;
      return config
    },
    error => {
      // console.log(error.response)
      showError(store, error.toString())
      return Promise.reject(error)
    }
  )

  // response interceptor
  $axios.interceptors.response.use(
    response => {
      hideLoading(store)
      const res = response.data;
      if (res.code != 200) showError(store, res.msg.toString())
      else {
        response.config.showMsg && store.commit('setResMsg', res.msg)
      }
      return response.data
    },
    async (error) => {
      // 服务器有响应
      if (error.response) {
        const { data } = error.response;
        // 服务器有返回数据
        if (data && data instanceof Object) {
          if (data.code != 4008) showError(store, data.msg)
          else hideLoading(store)
          switch (data.code) {
            case 401:
              if (route.path.indexOf('profile') > -1) app.router.replace('/');
              break;
            // token过期
            case 4008:
              try {
                let res = await $axios.post('/api/user/refreshToken')
                store.commit('user/setCurrent', res.data)
                return $axios(error.response.config)
              } catch (err) {
                store.commit('user/setCurrent', null)
                return Promise.reject(err)
              }
          }
        } else {
          showError(store, error.response.statusText)
        }

      } else {
        showError(store, error.toString())
      }

      return Promise.reject(error)
    }
  )
}
