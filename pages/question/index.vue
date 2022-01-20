<template>
    <div class="question-container">
        <header id="fh5co-header" class="fh5co-cover fh5co-cover-sm" role="banner" style="background-image:url(/images/img_bg_1.jpg);" data-stellar-background-ratio="0.5">
            <div class="overlay"></div>
            <div class="container">
                <div class="row">
                    <div class="col-md-7 text-left">
                        <div class="display-t">
                            <div class="display-tc animate-box" data-animate-effect="fadeInUp">
                                <h1 class="mb30">Questions</h1>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </header>
        <el-row>
            <el-col :span="24" class="tabs">
                <el-tabs v-model="activeName" @tab-click="handleClick">
                    <el-tab-pane label="Hot Questions" name="hot">
                        <List name="hot" :page="page" :listData="listData" @fetch-data="fetchData" />
                    </el-tab-pane>

                    <el-tab-pane label="New Questions" name="new">
                        <List name="new" :page="page" :listData="listData" @fetch-data="fetchData" />
                    </el-tab-pane>

                    <el-tab-pane label="To be Answered" name="wait">
                        <List name="wait" :page="page" :listData="listData" @fetch-data="fetchData" />
                    </el-tab-pane>
                </el-tabs>
            </el-col>
        </el-row>
    </div>

</template>

<script>
import List from '~/components/List'
export default {
    name: 'index',
    data() {
        return {
            activeName: 'hot',
        };
    },
    async asyncData({app}) {
        const page = {
            total: 0,
            current: 1,
            size: 20,
        }
        const {data} = await app.$getHotList(page)
        return {page, listData: data.data.records}
    },
    methods: {
        handleClick(tab, event) {
            this.fetchData(tab.paneName, 1);
        },
        async fetchData(paneName, current) {
            this.page.current = current
            let response = null
            switch (paneName) {
                case 'hot':
                    response = await this.$getHotList(this.page)
                    break;
                case 'new':
                    response = await this.$getNewList(this.page)
                    break;
                case 'wait':
                    response = await this.$getWaitList(this.page)
                    break;
            }
            if (response !== null) {
                if (response.data && response.data.code === 200) {
                    this.page.total = response.data.data.total
                    this.listData = response.data.data.records
                    console.log('update list data')
                }
            } else {
                console.log("No response")
            }
        },
    },
    components:{
        List,
    }
};
</script>

<style scoped>
.tabs {
    margin-left: 20%;
    width: 60%;
}
</style>
