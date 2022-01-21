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
                                               :to="{path:'/question/edit', query:{id:article.id}}">Edit</nuxt-link>
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
                            <h2>Answers</h2>
                            <el-card v-if="!commentList || commentList.length===0">No Answers For Now</el-card>
                            <el-card v-for="comment in commentList" :key="comment.id" style="margin-bottom: 1%">
                                <Comment :userId="userId" :userImag="userImage"
                                         :authorId="article.userId"
                                         :commentList="[comment]"
                                         @doChildSend="doChildSend" @doRemove="doRemove"
                                         :showComment="false"
                                         >
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

        <div style="margin-left: 13%; width: 50%">
            <h2>Post Your Answer</h2>
            <el-card v-if="!$store.state.userInfo">
                <h4>Please Login to participate the discussion</h4>
            </el-card>
            <el-card v-else>
                <mavon-editor :autofocus="false" ref="md" v-model="mdContent" @change="getMdHtml"
                              @imgAdd="uploadContentImg" @imgDel="delContentImg" />
                <el-button type="primary" @click="submitData" style="margin-left: 45%; margin-top: 2%">Submit</el-button>
            </el-card>
        </div>

    </div>
</template>

<script>
import {dateFormat} from "static/js/date";
import Affix from "@/components/Affix";
import Directory from "@/components/Directory";
import Comment from "@/components/Comment";

export default {
    name: "_id",
    data(){
        return {
            isThumb: this.$cookies.get(`article-thumb-${this.$route.params.id}`) ? this.$cookies.get(`article-thumb-${this.$route.params.id}`) : false,
            userId: this.$store.state.userInfo && this.$store.state.userInfo.uid,
            userImage: this.$store.state.userInfo && this.$store.state.userInfo.imageUrl,
            mdContent: '',
            htmlContent: '',
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
    async asyncData({app, params}){
        const {data: content} = await app.$getQuestionById(params.id)
        const isView = app.$cookies.get(`question-view-${content.data.id}`)
        if (!isView) {
            const {data: updateView} = await app.$updateQuestionViewCount(params.id)
            if(updateView.code === 200) {
                content.data.viewCount++
            }
            app.$cookies.set(`question-view-${content.data.id}`, true)
        }

        const {data:commentData} = await app.$getReplayByQuestionId(params.id)
        return {article:content.data, commentList:commentData.data}
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
        getMdHtml(mdContent, htmlContent) {
            this.mdContent = mdContent
            this.htmlContent = htmlContent
        },
        uploadContentImg(pos, file) {
            let fd = new FormData()
            fd.append('file', file)
            this.$uploadImg(fd).then(response => {
                console.log(response)
                this.$refs.md.$img2Url(pos, response.data.data)
            })
        },
        delContentImg(urlAndFileArr) {
            const fileUrl = urlAndFileArr[0]
            this.$deleteImg(fileUrl)
        },
        submitData({params}){
            if (this.htmlContent === '') {
                this.$message.error("Please write content")
                return false
            }
            let mdContentCopy = this.mdContent
            let htmlContentCopy = this.htmlContent
            const data = {
                htmlContentCopy,
                mdContentCopy,
                parentId: -1,
                questionId: this.$route.params.id,
                userId: this.userId,
                userImage: this.userImage,
                nickName: this.$store.state.userInfo && this.$store.state.userInfo.nickName
            }
            console.log(data)
            this.$addReplay(data).then((response) => {
                this.htmlContent = ''
                this.mdContent = ''
                this.refreshComment()
            }).catch(error => {
                this.$message.error(error)
            })
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
    margin-top: 2%;
    margin-left: 40%;
}
</style>
