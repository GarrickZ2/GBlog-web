<template>
    <div class="fh5co-nav">
<!--    <div>-->
        <el-row type="flex" justify="space-between">
            <el-col :span="4" :xs="4" :sm="4" :md="4">
                <div id="fh5co-logo">
                    <nuxt-link to="/">GBLOG<span>...</span></nuxt-link>
                </div>
            </el-col>

            <el-col class="nav-main hidden-sm-and-down" :md="10">
                <el-menu mode="horizontal" router :default-active="defaultActive()" active-text-color="#F73859">
                    <el-menu-item index="/" class="nav-item">HOME</el-menu-item>
                    <el-menu-item index="article" class="nav-item">BLOG</el-menu-item>
                    <el-menu-item index="question" class="nav-item">FAQ</el-menu-item>
                    <el-menu-item index="label" class="nav-item">LABEL</el-menu-item>
                </el-menu>
            </el-col>
            <el-col :xs="18" :sm="18" :md="8">
                <div class="nav-sign">
                    <el-button  type="text" v-if="!userInfo" class="nav-item2" @click="$store.dispatch('LoginPage')">Login</el-button>
                    <el-button type="primary" v-if="!userInfo" size="small" round class="nav-item2" @click="$store.dispatch('SignupPage')">Signup</el-button>
                </div>
            </el-col>
            <el-dropdown v-if="userInfo" class="nav-dropdown" @command="handleCommand">
                <div class="el-dropdown-link">
<!--                    <el-avatar src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"></el-avatar>-->
                    <el-avatar icon="el-icon-user-solid"></el-avatar>
                    <i class="el-icon-arrow-down el-icon--right"></i>
                </div>
                <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item command="article">Publish Article</el-dropdown-item>
                    <el-dropdown-item command="question">Post Question</el-dropdown-item>
                    <el-dropdown-item command="user">My Profile</el-dropdown-item>
                    <el-dropdown-item command="logout">Logout</el-dropdown-item>
                </el-dropdown-menu>
            </el-dropdown>

            <style>
                .el-dropdown-link {
                    cursor: pointer;
                    color: #409EFF;
                }
                .el-icon-arrow-down {
                    font-size: 12px;
                }
            </style>
        </el-row>
    </div>

</template>

<script>
export default {
    name: "Header.vue",
    computed: {
        userInfo() {
            return this.$store.state.userInfo
        }
    },
    mounted() {
        window.addEventListener("scroll", this.windowScroll); //监听页面滚动
    },
    methods: {
        handleCommand(command) {
            this.$message('User Click the button ' + command)
            let routeData
            switch (command) {
                case 'article':
                    routeData = this.$router.resolve('/article/edit')
                    window.open(routeData.href, '_blank')
                    break;
                case 'question':
                    routeData = this.$router.resolve('/question/edit')
                    window.open(routeData.href, '_blank')
                    break;
                case 'user':
                    routeData = this.$router.resolve('/user')
                    window.open(routeData.href, '_blank')
                    break;
                case 'logout':
                    this.$store.dispatch('Logout')
                    break;
                default:
                    break;
            }
        },
        windowScroll() {
            let scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop;
            this.opacity = Math.abs(Math.round(scrollTop)) / 250;
            const page = document.getElementById('page')
            if (scrollTop === 0) {
                page.className = ''
            } else {
                page.className = 'scrolled'
            }
        },
        defaultActive() {
            let routePath = this.$route.matched[0].path || '/'
            if (routePath.indexOf('/', 1) !== -1) {
                routePath = routePath.substring(0, routePath.indexOf('/', 1))
            }
            return routePath.indexOf('/article') !== -1? '/' : routePath
        },
    },
    destroyed() {
        window.removeEventListener("scroll", this.windowScroll); //销毁滚动事件
    }
}
</script>

<!-- scoped means only effect on this file-->
<style scoped>
div:focus {
    outline: none;
}
.el-menu.el-menu--horizontal {
    border-bottom: 0;
    margin-top: -8px;
    background-color: transparent;
}

.scrolled li.el-menu-item.nav-item:hover{
    background-color: #adadad;
}

.nav-item {
    font-size: 18px;
    margin-left: 8%;
}

.nav-item2 {
    font-size: 18px;
}

.nav-main {
    width: 35%;
    margin-top: 0;
}

.nav-sign{
    text-align: right;
    font-size: 20px;
    margin: auto 5rem;
    padding: 0;
}
.nav-dropdown {
    margin-right: 5%;
}
.fh5co-nav {
    padding-top: 1%;
}
</style>
