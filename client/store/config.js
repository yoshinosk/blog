
import { deepMerge } from '~/assets/js/utils'

export const state = () => ({
  setting: {
    site: {
      allowRegister: true,// 允许注册用户
      status: 1, //网站状态 0 关闭 1开启
      bg: require('~/assets/img/bg.jpg'), // 网站默认背景
      articleCover: require('~/assets/img/bg1.jpg'), // 文章默认封面
      callName: '主人', // 称呼
      siteName: '四糸乃赛高的小窝'
    }
  },
})

export const mutations = {
  setSetting(state, setting) {
    state.setting = deepMerge(state.setting, setting)
  }
}

export const actions = {
  async getSetting({ commit }) {
    try {
      let { data } = await this.$api.site.getSetting();
      commit('setSetting', data)
      return Promise.resolve(data)
    } catch (error) {
      return Promise.reject(error)
    }
  }
}
