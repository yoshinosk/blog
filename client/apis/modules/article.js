export default axios => ({
  getArticle: id => axios.get('/api/article', { params:{ id } }),
  getArticleList: params => axios.get('/api/article/list', { params }),
  getArticleSort: () => axios.get('/api/article/sort/list'),
  getArticleTags: () => axios.get('/api/article/tags/list'),
  getArticleViewsRank: () => axios.get('/api/article/rank/views'),
  getArticleComment: articleId => axios.get('/api/article/comment', { params: { articleId } }),
  addComment: params => axios.post('/api/user/comment/add', params, { showMsg: true }),
  goodUp: (id) => axios.post('/api/article/goodUp', {id}, { showMsg: true }),
  getTestFieldList: () => axios.get('/api/article/test/list'),
  randomArticle: () => axios.get('/api/article/random' )
})
