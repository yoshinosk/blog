

export const state = () => ({
  articleList: [], // 首页的文章列表缓存
  articlePage: 1,
  articleTotal: 0,
  articleMore: 'loadmore',
  articleSort: [],
  errMsg: '', // 请求错误消息
  resMsg: '', // 请求结果消息
  loading: false, // 控制loading组件是否展开
})

export const mutations = {
  setArticle(state, data) {
    state.articleList.push(...data.list);
    state.articleTotal = data.total;
    state.articlePage = data.page + 1;
    state.articleMore = state.articleList.length >= data.total ? 'nomore' : 'loadmore';
  },
  setArticleLoading(state, status) {
    state.articleMore = status;
  },
  setErrMsg(state, msg) {
    state.errMsg = msg;
  },
  setResMsg(state, msg) {
    state.resMsg = msg;
  },
  setArticleSort(state, data) {
    state.articleSort = data;
  },
  setLoading(state, status) {
    state.loading = status;
  }
}

export const actions = {
  async nuxtServerInit({ commit, dispatch, state }, { req, res, app }) {
    try {
      await dispatch('config/getSetting')
      if (String(req.headers.cookie).indexOf('rt=') > -1) {
        await dispatch('user/refreshToken')
      } else commit('user/showNav')
    } catch (e) {

    }

  },
  async getArticleList({ state, commit }) {
    commit('setArticleLoading', 'loading')
    try {
      let { data } = await this.$api.article.getArticleList({
        page: state.articlePage,
        pageSize: 10
      })
      commit('setArticle', data)
      return Promise.resolve(data)
    } catch (e) {
      commit('setArticleLoading', 'loadmore')
      return Promise.reject(e)
    }
  },
  async getArticleSort({ commit }) {
    try {
      let { data } = await this.$api.article.getArticleSort()
      commit('setArticleSort', data)
      return Promise.resolve(data)
    } catch (e) {
      return Promise.reject(e)
    }
  }
}


export const getters = {
  articleCover(state) {
    return state.config.setting.site.articleCover.indexOf('http') > -1 ? state.config.setting.site.articleCover : new URL(state.config.setting.site.articleCover, process.env.BASE_URL).toString();
  },
  notic(state) {
    return state.config.setting.site.notic || ''
  },
  token(state) {
    return state.user.current ? state.user.current.token : '';
  },
  callName(state) {
    return state.config.setting.site.callName
  },
  user(state) {
    return state.user.current;
  },
  siteName(state){
    return state.config.setting.site.siteName
  }
}
