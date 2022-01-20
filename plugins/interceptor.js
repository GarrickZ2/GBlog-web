import error from "@/pages/error";
import {store} from "core-js/internals/reflect-metadata";

export default ({store, route, redirect, $axios}) => {
    $axios.onRequest(config => {
        const accessToken = store.state.accessToken
        if (accessToken) {
            config.headers.Authrization = 'Bearer ' + accessToken
        }
        return config
    })
    $axios.onResponse(response => {
        if (!store.state.accessToken) {
            sendRefreshRequest(store, redirect, route)
        }
    })
    $axios.onError(error => {
        if (error.response.status === 401) {
            sendRefreshRequest(store, redirect, route)
        } else {
            return Promise.reject(error)
        }
    })
}

let isLock = false

const sendRefreshRequest = (store, redirect, route) => {
    if (!isLock && store.state.refreshToken) {
        isLock = true
        const url = `http:${process.env.authURL}/refresh?redirectURL=${redirectURL(route)}`
        redirect(url)
        isLock = false
    } else {
        isLock = false
        store.commit('RESET_USER_STATE')
        const url = `http:${process.env.authURL}?redirectURL=${redirectURL(route)}`
        redirect(url)
    }
}

const redirectURL = (route) => {
    if (process.client) {
        return window.location.href
    }
    return process.env._AXIOS_BASE_URL_.replace('/api', '') + route.path
}
