<template>
    <div class="label-main">
        <header id="fh5co-header" class="fh5co-cover fh5co-cover-sm" role="banner" style="background-image:url(/images/img_bg_1.jpg);" data-stellar-background-ratio="0.5">
            <div class="overlay"></div>
            <div class="container">
                <div class="row">
                    <div class="col-md-7 text-left">
                        <div class="display-t">
                            <div class="display-tc animate-box" data-animate-effect="fadeInUp">
                                <h1 class="mb30">Labels</h1>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </header>

        <el-row  :gutter="10" style="margin-left: 20%; width: 60%;">
          <el-col v-for="(category, index) in data" :key="index" :xs="24" :sm="24" :md="6" >
            <el-card shadow="hover">
                <!-- 类别名 -->
                <div slot="header">
                    <span>{{category.name}}</span>
                </div>
                <!-- 类别下的标签 -->
                <div>
                    <nuxt-link v-for="label in category.labelList" :key="label.id" :to="{path: `/label/${label.id}`, query:{name:label.name}}" >
                        <el-tag size="small">
                            {{label.name}}
                        </el-tag>
                    </nuxt-link>
                </div>
            </el-card>
          </el-col>
        </el-row>
    </div>
</template>

<script>
export default {

    async asyncData({app}) {
        const {data} = await app.$getCategoryList()
        console.log(data)
        return {data: data.data}
    },

}
</script>
<style scoped>
.label-main{
    margin: 0 10px;
}
.el-col {
    margin-bottom: 20px;
}
.el-tag {
    margin-right: 5px;
}
.el-tag:hover {
    border-bottom: 1px solid #345DC2;
}
.el-card {
    height: 200px;
}
</style>
