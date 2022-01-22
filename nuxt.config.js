export default {
    // Global page headers: https://go.nuxtjs.dev/config-head
    head: {
        title: 'GBlog',
        htmlAttrs: {
            lang: 'en'
        },
        meta: [
            {charset: 'utf-8'},
            {name: 'viewport', content: 'width=device-width, initial-scale=1'},
            {
                hid: 'description',
                name: 'description',
                content: 'Self Developed Technology Knowledge Sharing Blog Website by Garrick from Columbia Uni.'
            },
            {name: 'format-detection', content: 'telephone=no'}
        ],
        link: [
            {rel: 'icon', type: 'image/x-icon', href: '/gblog.jpeg'}
        ],
        script: [
            // {src: '/js/main.js'},
            // {src: '/js/jquery.min.js'},
            // {src: '/js/jquery.easing.1.3.js'},
            // {src: '/js/bootstrap.min.js'},
            // {src: '/js/jquery.waypoints.min.js'},
            // {src: '/js/jquery.countTo.js'},
            // {src: '/js/jquery.magnific-popup.min.js'},
            // {src: '/js/magnific-popup-options.js'},
            // {src: '/js/modernizr-2.6.2.min.js'},
            // {src: '/js/jquery.stellar.min.js'},
        ]
    },

    // Global CSS: https://go.nuxtjs.dev/config-css
    css: [
        'element-ui/lib/theme-chalk/index.css',
        '@/assets/theme/index.css',
        'element-ui/lib/theme-chalk/display.css',
        "~/static/css/style.css",
        "~/static/css/bootstrap.css",
        "~/static/css/flexslider.css",
        "~/static/css/icomoon.css",
        "~/static/css/magnific-popup.css",
        "~/static/css/animate.css",
        "~/static/css/fonts.css",
    ],

    // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
    plugins: [
        '@/plugins/element-ui',
        '@/plugins/interceptor',
        {src:'@/plugins/mavon-editor', mode:'client', ssr:false},
        '@/api/question',
        '@/api/article',
        '@/api/common',
        '@/api/user',
    ],

    // Auto import components: https://go.nuxtjs.dev/config-components
    components: true,

    // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
    buildModules: [],

    // Modules: https://go.nuxtjs.dev/config-modules
    modules: [
        '@nuxtjs/axios',
        'cookie-universal-nuxt',
    ],

    axios:{
        proxy: true,
        prefix: '/api',
    },

    proxy:{
      '/api': {
          target: 'https://mock.mengxuegu.com/mock/61e6437817249f68847fc292/gblog',
          pathRewrite: {'^/api': ''},
      }
    },

    // Build Configuration: https://go.nuxtjs.dev/config-build
    build: {
        transpile: [/^element-ui/],
        extend(config, ctx) {

        }
    },
    env: {
        authURL: process.env.NODE_ENV === 'dev'? '//localhost:7001' : '//www.auth.garrick.cn'
    },
}
