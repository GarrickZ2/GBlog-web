export default (({store, route, redirect, req}) => {
    if (!store || !store.state.userInfo) {
        const redirectURL = 'http://' + req.headers.host + route.path
        const url = `http:${process.env.authURL}?redirectURL=${redirectURL}`
        console.log(url)
        redirect(url)
    }
})
