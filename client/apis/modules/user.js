export default axios => ({
  login: data => axios.post('/api/user/login', data, { showMsg: true }),
  sendEmailCode: (email) => axios.post('/api/user/sendEmailCode', { email }, { showMsg: true }),
  logout: () => axios.post('/api/user/logout', {}, { showMsg: true }),
  signIn: () => axios.post('/api/user/signIn', {}, { showMsg: true }),
  register: data => axios.post('/api/user/register', data, { showMsg: true }),
  retrieve: data => axios.post('/api/user/retrieve', data, { showMsg: true }),
  refreshToken: () => axios.post('/api/user/refreshToken'),

  myArticle: params => axios.get('/api/user/myArticle', { params }),
  getArticle: id => axios.get('/api/user/article/get', { params: { id } }),
  delArticle: id => axios.delete('/api/user/article/del', { data: { id }, showMsg: true }),
  editArticle: data => axios.post('/api/user/article/edit', data, { showMsg: true }),
  addArticle: data => axios.post('/api/user/article/add', data, { showMsg: true }),
  articleToggle: id => axios.post('/api/user/article/toggle', { id }, { showMsg: true }),
  myComment: params => axios.get('/api/user/comment/list', { params }),
  myReply: params => axios.get('/api/user/comment/reply', { params }),
  delComment: id => axios.delete('/api/user/comment/del', { data: { id }, showMsg: true }),
  editProfile: data => axios.post('/api/user/profile/edit', data, { showMsg: true }),
  msgList: params => axios.get('/api/user/message/list', { params }),
  setRead: id => axios.post('/api/user/message/read', { id },),
  coinLog: params => axios.get('/api/user/log/coin', { params }),
  uploadAvatar: data => axios.post('/api/user/upload/avatar', data, {
    headers: { 'Content-Type': 'multipart/form-data;' }
  }),
  setAvatar: url => axios.post('/api/user/profile/avatar', { url }, { showMsg: true }),
  upload: data => axios.post('/api/user/upload/image', data, {
    headers: { 'Content-Type': 'multipart/form-data;' }
  }),
})
