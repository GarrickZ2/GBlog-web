<template>
    <div>
        <header id="fh5co-header" class="fh5co-cover fh5co-cover-sm" role="banner" style="background-image:url(/images/img_bg_1.jpg);" data-stellar-background-ratio="0.5">
            <div class="overlay"></div>
            <div class="container">
                <div class="row">
                    <div class="col-md-7 text-left">
                        <div class="display-t">
                            <div class="display-tc animate-box" data-animate-effect="fadeInUp">
                                <h1 class="mb30">{{article.title}}</h1>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </header>
        <div>
            <el-row :gutter="20">
                <el-col :span="16">
                    <div class="article-left" style="margin-left: 20%">
                        <el-card>
                            <div class="fh5co-post title">
                                <h1>{{article.title}}</h1>
                                <p class="author">
                                    <img src="/images/person1.jpg" alt="User Avatar" class="avatar">
                                    <nuxt-link to="#" target="_blank"><cite> {{article.nickName}} </cite></nuxt-link>
                                    <i class="el-icon-date"></i> {{getDateFormat(article.updateDate)}}
                                    <i class="icon-thumbs-up"></i> {{article.thumbUp}}
                                    <i class="el-icon-view"></i> {{article.viewCount}}
                                    <nuxt-link v-if="this.$store.state.userInfo && $store.state.userInfo.uid === article.userId"
                                               :to="{path:'/article/edit', query:{id:article.id}}">Edit</nuxt-link>
                                </p>
                                <el-tag v-for="item in article.labelList" size="small" style="margin-right: 1%">{{item.name}}</el-tag>
                            </div>
                            <img v-if="article.imageUrl" alt="Article Image" :src="article.imageUrl" style="margin-top: 2%">
                            <div class="article-content">
                                <div class="markdown-body" v-html="article.htmlContent">
                                </div>
                            </div>
                            <el-button class="thumb" type="primary" round :disabled="!$store.state.userInfo" @click="handleThumb" :circle="isThumb">
                                <i v-if="!isThumb" class="icon-thumbs-up"></i>
                                <i v-else class="icon-thumbs-down"></i>
                            </el-button>
                        </el-card>
                        <div>
                            <h2>Comments</h2>
                            <el-card v-if="!$store.state.userInfo">Login to make comments on this article</el-card>
                            <el-card>
                                <Comment :userId="userId" :userImag="userImage"
                                :authorId="article.userId" :showComment="$store.state.userInfo?true:false"
                                         :commentList="commentList"
                                @doSend="doSend" @doChildSend="doChildSend" @doRemove="doRemove">
                                </Comment>
                            </el-card>
                        </div>
                    </div>
                </el-col>
                <el-col :span="8">
                    <div class="grid-content bg-purple">
                        <Affix :offset="100">
                            <Directory parent-class="article-content"></Directory>
                        </Affix>
                    </div>
                </el-col>
            </el-row>
        </div>

    </div>
</template>

<script>
import {dateFormat} from "static/js/date";
import Affix from '/components/Affix/index'
import Directory from '/components/Directory/index'
import Comment from '/components/Comment/index'

export default {
    name: "_id",
    data(){
        return {
            isThumb: this.$cookies.get(`article-thumb-${this.$route.params.id}`) ? this.$cookies.get(`article-thumb-${this.$route.params.id}`) : false,
            userId: this.$store.state.userInfo && this.$store.state.userInfo.uid,
            userImage: this.$store.state.userInfo && this.$store.state.userInfo.imageUrl,
        }
    },
    validate({params}) {
        return /^\d+$/.test(params.id)
    },
    components:{
        Affix,
        Directory,
        Comment,
    },
    async asyncData({params, app}) {
        const {data} = await app.$getArticleById(params.id)
        const isView = app.$cookies.get(`article-view-${params.id}`)
        if (!isView) {
            const {data:code} = await app.$updateArticleViewCount(params.id)
            if (code.code === 200) {
                data.data.viewCount++
                app.$cookies.set(`article-view-${params.id}`, true)
            }
        }
        const {data:comments} = await app.$getCommentsList(params.id)
        return {article:data.data, commentList:comments.data}
    },
    methods: {
        getDateFormat(date) {
            return dateFormat(date)
        },
        async handleThumb() {
            this.isThumb = !this.isThumb
            const count = this.isThumb ? 1 : -1;
            const articleId = this.$route.params.id
            const {data} = await this.$updateArticleThumb(articleId, count)
            if (data.code === 200) {
                this.article.thumbUp = this.article.thumbUp + count
                this.$cookies.set(`article-thumb-${this.$route.params.id}`, this.isThumb, {
                    maxAge: 60*60*24*365*5
                })
            }
        },
        doSend(content) {
            console.log("Send the comment for article ", this.$route.params.id, "the content is ", content)
            this.doChildSend(content, -1)
        },
        doChildSend(content, parentId) {
            console.log('for parent comment ', parentId, "and content is ", content)
            const data = {
                content,
                parentId,
                articleId: this.$route.params.id,
                userId: this.userId,
                userImage: this.userImage,
                nickName: this.$store.state.userInfo.nickName,
            }
            this.$addComment(data).then(response => {
                this.refreshComment()
            })
        },
        async refreshComment(){
            const {data:commentData} = await this.$getCommentsList(this.$route.params.id)
            this.commentList = commentData.data
        },
        async doRemove(id) {
            console.log("The comment you want to delete is ", id)
            const {data} = await this.$deleteCommentById(id)
            if (data.code === 200) {
                await this.refreshComment()
            }
        },
    }
}
</script>

<style scoped>
@import "static/css/md/github-min.css";
@import "static/css/md/github-markdown.css";
.author img{
    width: 60px;
    margin-right: 20px;
    -webkit-border-radius: 50%;
    -moz-border-radius: 50%;
    -ms-border-radius: 50%;
    border-radius: 50%;
}
.article-content {
    margin-top: 3%;
}
.thumb {
    margin-left: 40%;
}
</style>
