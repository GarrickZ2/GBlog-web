<template>
    <div id="fh5co-blog" class="fh5co-bg-section">
        <div class="container">
            <div class="row animate-box row-pb-md" data-animate-effect="fadeInUp">
                <div class="col-md-8 col-md-offset-2 text-left fh5co-heading" style="margin-left: 0">
                    <h2>Blogs</h2>
                </div>
            </div>
            <div class="row">
                <div v-for="item in articleList" class="col-lg-12 col-md-8 col-sm-4 animate-box" data-animate-effect="fadeInUp">
                    <div class="fh5co-post">
                        <div>
                            <span class="fh5co-date">{{item.postTime}}</span>
                            <h3><nuxt-link :to="'/article/' + item.id" target="_blank">{{item.title}}</nuxt-link></h3>
                            <p>{{item.summary}}</p>
                            <p class="author">
                                <img :src="item.avatar" alt="User Avatar">
                                <nuxt-link :to="'/user/'+item.userId" target="_blank"><cite> {{item.nickName}} </cite></nuxt-link>
                                <i class="icon-thumbs-up"></i> {{item.thumbUp}}
                                <i class="el-icon-view"></i> {{item.viewCount}}
                            </p>
                        </div>
                        <div v-if="item.imageUrl" class="blog_image hidden-md-and-down">
                            <img :src="item.imageUrl" alt="User Avatar">
                        </div>
                    </div>
                </div>
            </div>
            <el-row justify="center" style="margin-left: 40%">
                <el-button type="primary" disabled v-if="noMore">
                    Has No More Articles
                </el-button>
                <el-button @click="load" type="primary" :loading="loading" v-else>
                    {{loading? 'Loading...' : 'Click to load more'}}
                </el-button>
            </el-row>
        </div>
    </div>
</template>

<script>
export default {
    name: "_id",
    data(){
        return {
            loading: true,
            noMore: false,
        }
    },
    validate({params}) {
        const id = params.id ? params.id : 0
        return /^\d+$/.test(id)
    },
    async asyncData({params, app}) {
        const categoryId = params.id ? params.id : null
        const query = {categoryId, current:1, size:20}
        const {data: articleData} = await app.$getArticleList(query)
        return {query, articleList:articleData.data.records, loading: false}
    },
    methods:{
        async load() {
            this.query.current++
            this.loading = true

            const {data} = await this.$getArticleList(this.query)
            if (data.data.records && data.data.records.length > 0) {
                this.noMore = false
                this.articleList = this.articleList.concat(data.data.records)
            } else {
                this.noMore = true
            }
            this.loading = false
        }
    },
}
</script>

<style scoped>
@import "static/css/animate.css";
@import "static/css/icomoon.css";
@import "static/css/animate.css";
@import "static/css/bootstrap.css";
@import "static/css/magnific-popup.css";
@import "static/css/style.css";
.brief {
    width: 100%;
}
.blog_image {
    margin-left: 10%;
}
.blog_image img{
    width: 200px;
}


</style>
