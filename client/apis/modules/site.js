export default axios => ({
  getSetting: () => axios.get('/api/setting'),
  test: () => axios.get('/api/test'),
  getInfoBlock: (name) => axios.get('/api/infoBlock', { params: { name } }),
  getInfoBlockList: () => axios.get('/api/infoBlock/list'),
  getMsgBoardList: (params) => axios.get('/api/board/list', { params }),
  addMsg: data => axios.post('/api/board/add', data, { showMsg: true }),
  signInTolRank: () => axios.get('/api/rank/signInTol'),
  signInConRank: () => axios.get('/api/rank/signInCon'),
  getLinks: () => axios.get('/api/links'),
})
