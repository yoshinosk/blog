const getters = {
    sidebar: state => state.app.sidebar,
    token: state => state.user.token,
    avatar: state => state.user.avatar,
    nickname: state => state.user.nickname,
    roles: state => state.user.roles.map(item=>item.title).join(';'),
    permission_routes: state => state.permission.routes,
    errorLogs: state => state.errorLog.logs
  }
  export default getters
  