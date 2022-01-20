export default ({$axios}, inject) => {
    inject('uploadImg', (data) => $axios.post(`/article/file/upload`, data))
    inject('deleteImg', (fileUrl) => $axios.delete(`/article/file/delete`, {params:fileUrl}))
}
