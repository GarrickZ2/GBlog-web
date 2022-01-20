export default ({$axios}, inject) => {
    inject('getCategoryList', () => $axios.get('/article/api/category/list'))
    inject('getAdvertList', position => $axios.get(`/article/api/ads/show/${position}`))
    inject('getArticleList', query => $axios.post('/article/api/article/list', query))
    inject('getArticleById', id => $axios.get(`/article/api/article/${id}`))
    inject('updateArticleViewCount', id => $axios.put(`/article/api/article/viewCount/${id}`))
    inject('updateArticleThumb', (articleId, count)=> $axios.put(`/article/article/thumb/${articleId}/${count}`))
    inject('getCommentsList', (articleId)=> $axios.get(`/article/api/comment/list/${articleId}`))
    inject('addComment', (data)=> $axios.post(`/article/comment`, data))
    inject('deleteCommentById', (id)=> $axios.delete(`/article/comment/${id}`))
    inject('getCategoryList', ()=> $axios.get(`/article/api/category/label/list`))
    inject('updateArticle', (data)=> $axios.put(`/article/article`, data))
    inject('addNewArticle', (data)=> $axios.post(`/article/article`, data))
}
