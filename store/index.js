const state = () => ({
    userInfo: null,
    accessToken: null,
    refreshToken: null,
})

const mutations = {
    RESET_USER_STATE(state) {
        state.userInfo = null;
        state.accessToken = null;
        state.refreshToken = null;
    },
    UPDATE_ALL_STATE( state, data ) {
        state.userInfo = data.userInfo
        state.accessToken = data.accessToken
        state.refreshToken = data.refreshToken
    }
}

const actions = {
    nuxtServerInit({commit}, {app}) {
        const data = {}
        data.userInfo = app.$cookies.get('userInfo')
        data.accessToken = app.$cookies.get('accessToken')
        data.refreshToken = app.$cookies.get('refreshToken')
        commit('UPDATE_ALL_STATE', data)
    },
    LoginPage({commit}) {
        commit('RESET_USER_STATE')
        // To login-page
        window.location.href = `${process.env.authURL}?redirectURL=${window.location.href}`
    },
    SignupPage({commit}) {
        commit('RESET_USER_STATE')
        window.location.href = `${process.env.authURL}?redirectURL=${window.location.href}&dest=register`
    },
    Logout({commit}) {
        commit('RESET_USER_STATE')
        window.location.href = `${process.env.authURL}/logout?redirectURL=${window.location.href}`
    },
}

export default {state, mutations, actions}
