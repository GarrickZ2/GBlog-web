<template>
    <div>
        <header id="fh5co-header" class="fh5co-cover fh5co-cover-sm" role="banner" style="background-image:url(/images/img_bg_1.jpg);" data-stellar-background-ratio="0.5">
            <div class="overlay"></div>
            <div class="container">
                <div class="row">
                    <div class="col-md-7 text-left">
                        <div class="display-t">
                            <div class="display-tc animate-box" data-animate-effect="fadeInUp">
                                <h1 class="mb30">{{$route.query.name}}</h1>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </header>

        <div style="margin-left: 20%; width: 60%">
            <el-breadcrumb separator-class="el-icon-arrow-right" >
                <el-breadcrumb-item :to="{ path: '/label' }">Label</el-breadcrumb-item>
                <el-breadcrumb-item :to="{ path: '/label' }">{{$route.query.name}}</el-breadcrumb-item>
                <el-breadcrumb-item>Content</el-breadcrumb-item>
            </el-breadcrumb>

            <el-row style="margin-top: 2%">
                <el-col>
                    <el-tabs v-model="activeName" @tab-click="handleClick">
                        <el-tab-pane label="Blog" name="blog">
                            <el-table class="label-list"
                                      :show-header="false"
                                      :data="listData">

                                <el-table-column width="70">
                                    <template slot-scope="scope">
                                        <el-tag class="count">
                                            {{ scope.row.thumbUp }} <br> Like
                                        </el-tag>
                                    </template>
                                </el-table-column>
                                <el-table-column width="70">
                                    <template slot-scope="scope">
                                        <el-tag class="count">
                                            {{ scope.row.viewCount }} <br>View
                                        </el-tag>
                                    </template>
                                </el-table-column>
                                <el-table-column>
                                    <template slot-scope="scope">
                                        <h2 class="title">
                                            <nuxt-link to="/article/11" target="_blank">
                                                {{ scope.row.title }}
                                            </nuxt-link>
                                        </h2>
                                        <div class="info">
                                            <i class="el-icon-user"></i>{{ scope.row.nickName }} &nbsp;
                                            <i class="el-icon-date"></i> {{ scope.row.createDate }}
                                        </div>

                                    </template>
                                </el-table-column>
                            </el-table>
                        </el-tab-pane>

                        <el-tab-pane label="Question" name="question">
                            <el-table class="label-list"
                                      :show-header="false"
                                      :data="listData"
                                      style="width: 100%">
                                <el-table-column width="70">
                                    <el-table-column width="70">
                                        <template slot-scope="scope">
                                            <el-tag class="count">
                                                {{ scope.row.thumbUp }} <br> Like
                                            </el-tag>
                                        </template>
                                    </el-table-column>
                                    <template slot-scope="scope">
                                        <el-tag class="count">
                                            {{ scope.row.viewCount }} <br> View
                                        </el-tag>
                                    </template>
                                </el-table-column>
                                <el-table-column>
                                    <template slot-scope="scope">
                                        <h2 class="title">
                                            <nuxt-link to="/article/11" target="_blank">
                                                {{ scope.row.title }}
                                            </nuxt-link>
                                        </h2>
                                        <div class="info">
                                            <i class="el-icon-user"></i>{{ scope.row.nickName }} &nbsp;
                                            <i class="el-icon-date"></i> {{ scope.row.createDate }}
                                        </div>

                                    </template>
                                </el-table-column>
                            </el-table>
                        </el-tab-pane>
                    </el-tabs>
                </el-col>
                <el-button type="primary" round :disabled="disable" @click="loadMoreData" style="margin-top: 2%; margin-left: 40%">
                    {{loadData}}
                </el-button>
            </el-row>

        </div>
    </div>
</template>
<script>
export default {
    data() {
        return {
            activeName: 'blog',
            page: {
                total: 0,
                current: 1,
                size: 20,
            },
            listData: [
                {id: '11', nickName: 'meng', title: 'aaa', viewCount: 10, createDate: '2019-12-12'},
                {id: '22', nickName: 'xue', title: 'aaa', viewCount: 10, createDate: '2019-12-12'},
                {id: '33', nickName: 'gu', title: 'aaa', viewCount: 10, createDate: '2019-12-12'},
            ],
            disable:false,
            loadData: 'Load More',
        }
    },
    methods: {
        async handleClick(tab, event) {
            const categoryId = this.$route.params.id
            const query = {categoryId, current:1, size:20}
            switch (tab.name) {
                case 'question':
                    const {data:articles} = await this.$getHotList(query)
                    this.listData = articles.data.records
                    this.page.total = articles.data.total
                    break
                case 'blog':
                    const {data:questions} = await this.$getArticleList(query)
                    this.listData = questions.data.records
                    this.page.total = questions.data.total
                    break
            }
            this.page.current = 1
        },
        async loadMoreData() {
            const categoryId = this.$route.params.id
            const query = {categoryId, current:this.page.current+1, size:20}
            this.loadData = 'Loading...'
            this.disable = true
            let newData = null
            switch (this.activeName) {
                case 'question':
                    const {data:articles} = await this.$getHotList(query)
                    newData = articles.data.records
                    this.page.total = articles.data.total
                    break
                case 'blog':
                    const {data:questions} = await this.$getArticleList(query)
                    newData = questions.data.records
                    this.page.total = questions.data.total
                    break
            }
            if (newData === null || newData.length === 0) {
                this.loadData = 'No More Data'
            } else {
                this.disable = false
                this.listData = this.listData.concat(newData)
                this.loadData = 'Load More'
            }
            this.page.current++
        }
    },
    async asyncData({app, route}) {
        const categoryId = route.params.id
        const query = {categoryId, current:1, size:20}
        const {data:articles} = await app.$getArticleList(query)
        return {listData: articles.data.records, page:{total:articles.data.total, current:1, size:20}}
    }
}
</script>
<style scoped>
.label-list {
}
.label-list .count {
    text-align: center;
    height: 100%;
    line-height: 20px;
}
.label-list .info {
    color: #999;
    font-size: 13px;
}
.label-list .title {
    display: inline-block;
    margin: 0 5px 0 0;
    font-size: 16px;
    height: 22px;
    line-height: 22px;
}
a:hover{
  text-decoration-line: underline;
}
</style>
