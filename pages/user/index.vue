<template>
    <div >
        <header id="fh5co-header" class="fh5co-cover fh5co-cover-sm" role="banner" style="background-image:url(/images/img_bg_1.jpg);" data-stellar-background-ratio="0.5">
            <div class="overlay"></div>
            <div class="container">
                <div class="row">
                    <div class="col-md-7 text-left">
                        <div class="display-t">
                            <div class="display-tc animate-box" data-animate-effect="fadeInUp">
                                <h1 class="mb30">Your profile </h1>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </header>
        <!-- 个人信息 -->
        <el-row class="main-top">
            <div class="avatar">
                <el-tooltip content="Click To Upload Your Avatar" effect="light">
                    <el-upload
                        accept="image/*"
                        action=""
                        :show-file-list="false"
                        :http-request="uploadMainImg"
                        >
                        <el-avatar :size="120" :src="this.userInfo.imageUrl" >{{userInfo.nickName}}</el-avatar>
                    </el-upload>
                </el-tooltip>
            </div>
            <div class="info">
                <div>
                    <span class="meta-block">&nbsp;&nbsp;&nbsp;Nick Name：</span>
                    <span class="name">{{this.userInfo.nickName}}</span>
                </div>
                <div>
                    <span class="meta-block">User Name：</span>
                    <span class="name">{{this.userInfo.username}}</span>
                </div>
            </div>
        </el-row>
        <el-row class="main-top" >
            <el-tabs value="public" @tab-click="handleClick" >
                <el-tab-pane label="Public Articles" name="public">
                    <article-list name="public" :page="query" :listData="articleList" @fetch-data="findUserArticleList"/>
                </el-tab-pane>
                <el-tab-pane label="Private Articles" name="nopublic">
                    <article-list name="nopublic" :page="query" :listData="articleList" @fetch-data="findUserArticleList"/>
                </el-tab-pane>
                <el-tab-pane label="My Posts" name="question">
                    <question-list name="question" :page="query" :listData="questionList" @fetch-data="findUserQuestionList"/>
                </el-tab-pane>
                <el-tab-pane label="Modify Personal Info" name="user">
                    <user-edit :loading="loading" :formData="userInfo" @submitForm="submitUserForm" />
                </el-tab-pane>
                <el-tab-pane label="Modify Password" name="password">
                    <user-password :loading="loading" :formData="passwordData" @submitForm="submitPasswordForm" />
                </el-tab-pane>
            </el-tabs>
        </el-row>
    </div>
</template>
<script>
import ArticleList from '@/components/article/List'
import QuestionList from '@/components/question/List'
import UserEdit from '@/components/user/Edit'
import UserPassword from '@/components/user/Password'

export default {
    components: { QuestionList, ArticleList, UserEdit, UserPassword },
    middleware: 'auth',
    data() {
        return {
            loading: false,
            userInfo: {
                imageUrl: ''
            },
            passwordData: { // 修改密码表单
                userId: this.$store.state.userInfo.uid
            },
            questionList: [],
        }
    },
    async asyncData({app, store}){
        const userId = store.state.userInfo && store.state.userInfo.uid
        const {data : userData } = await app.$getUserInfo(userId)
        const query = {
            userId,
            isPublic:1,
            current: 1,
            size:20,
            total:0
        }
        const {data:articleData} = await app.$findUserArticle(query)
        query.total = articleData.data.total
        return {userInfo: userData.data, query, articleList: articleData.data.records}
    },
    methods: {
        handleClick(tab, event) {
            switch (tab.paneName) {
                case 'public':
                case 'nopublic':
                    this.findUserArticleList(tab.paneName, 1)
                    break;
                case 'question':
                    this.findUserQuestionList(tab.paneName, 1)
                    break;
                case 'user':
                    // 用户不用查询，在加载此页面时已经查询了
                    break;
            }
        },

        // 上传头像
        uploadMainImg(file) {

        },

        // 删除头像, 上传成功后删除原来的头像
        deleteImg() {

        },

        // 提交修改个人资料
        async submitUserForm() {
            this.loading = true
            const {data} = await this.$updateUserInfo(this.userInfo)
            if (data.code === 200) {
                this.$message.success("Modify Information Success!")
            } else {
                this.$message.error("Modify Error: Re-try Later")
            }
            this.loading = false
        },

        // 修改密码
        async submitPasswordForm() {
            this.loading = true
            this.passwordData.userId = this.$store.state.userInfo && this.$store.state.userInfo.uid
            const {data} = await this.$updatePassword(this.passwordData)
            if (data.code === 200) {
                this.passwordData = {}
                this.$message.success('Modify Success, Please Login Again')
                this.$store.dispatch('Logout')
            } else {
                this.$message.error('Modify Error:', data.message)
            }
            this.loading = false
        },
        async findUserArticleList(paneName, current) {
            this.query.current = current
            this.query.isPublic = paneName === 'public' ? 1 : 0
            const {data} = await this.$findUserArticle(this.query)
            this.query.total = data.data.total
            this.articleList = data.data.records
        },
        async findUserQuestionList(paneName, current) {
            this.query.current = current
            delete this.query.isPublic
            const {data} = await this.$findUserQuestion(this.query)
            this.query.total = data.data.total
            this.questionList = data.data.records
        }

    },
}
</script>
<style scoped>
.main-top {
    width: 60%;
    margin-left: 20%;
    padding: 30px 0;
}
.avatar{
    float:left;
}
.info {
    margin: 30px 0 0 140px;
}
.info .name {
    font-size: 18px;
    font-weight: 500;
    padding-top: 10px;
}
.info .meta-block {
    font-size: 14px;
    color: #969696;
}
</style>
