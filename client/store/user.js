

export const state = () => ({
  current: null,
  showNav: false,
})

export const mutations = {
  setCurrent(state, user) {
    if(user && state.current){
      state.current = { ...state.current,...user }
    }else state.current = user;

  },
  showNav(state) {
    state.showNav = true;
  }
}

export const actions = {
  async refreshToken({ commit }) {
    try {
      let { data } = await this.$api.user.refreshToken();
      commit('setCurrent', data);

      return Promise.resolve(data);
    } catch (e) {
      return Promise.resolve(false);
    } finally {
      commit('showNav');
    }
  }
}
