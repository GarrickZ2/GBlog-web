export default ({$axios}, inject) => {
    inject('getHotList', page => $axios.post('/question/api/question/hot', page))
    inject('getNewList', page => $axios.post('/question/api/question/new', page))
    inject('getWaitList', page => $axios.post('/question/api/question/wait', page))
    inject('getQuestionById', id => $axios.get(`/question/api/question/${id}`))
    inject('updateQuestionViewCount', id => $axios.put(`/question/api/question/viewCount/${id}`))
    inject('getReplayByQuestionId', questionId => $axios.get(`/question/api/replay/list/${questionId}`))
    inject('updateQuestionThumb', (questionId, count) => $axios.put(`/question/question/thumb/${questionId}/${count}`))
    inject('addReplay', data => $axios.post(`/question/replay`, data))
    inject('deleteReplayById', id => $axios.delete(`/question/replay/${id}`))
}
