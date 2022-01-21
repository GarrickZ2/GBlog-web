export default (({$axios}, inject) => {
    inject('getUserInfo', id => $axios.get(`/system/user/${id}`))
    inject('updateUserInfo', data => $axios.put(`/system/user`, data))
    inject('findUserArticle', query => $axios.post(`/article/article/user`, query))
    inject('findUserQuestion', query => $axios.post(`/question/question/user`, query))
    inject('checkOldPassword', data => $axios.post(`/system/user/check/password`, data))
    inject('updatePassword', data => $axios.put(`/system/user/password`, data))
})
