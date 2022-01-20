<template>
    <div>
        <header id="fh5co-header" class="fh5co-cover" role="banner" style="background-image:url(/images/img_bg_1.jpg);" data-stellar-background-ratio="0.5">
            <div class="overlay"></div>
            <div class="container">
                <div class="row">
                    <div class="col-md-7 text-left">
                        <div class="display-t">
                            <div class="display-tc animate-box" data-animate-effect="fadeInUp">
                                <h1 class="mb30">Let us build brands together shall we?</h1>
                                <p>
                                    <a href="#fh5co-project" class="btn btn-primary">Get Started</a>  <em class="or">or</em>
                                    <a href="#/channels/staffpicks/93951774" class="link-watch popup-vimeo">Watch Video</a>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </header>
        <el-row :gutter="20">
            <el-col :span="4">
                <el-row class="tac hidden-sm-and-down" style="margin-left: 1rem">
                    <el-col :span="3">
                        <h5>Channels</h5>
                        <el-menu
                            class="el-menu-vertical-demo"
                            router
                            :default-active="$route.path"
                            @open="handleOpen"
                            @close="handleClose">
                            <el-menu-item v-for="item in categoryList" :key="item.id" :index="'/'+item.id">
                                <i class="el-icon-apple"></i>
                                <span>{{ item.name }}</span>
                            </el-menu-item>

                        </el-menu>
                    </el-col>
                </el-row>
            </el-col>

            <el-col :span="18">
                <el-col>
                    <el-carousel :interval="4000" type="card" height="280px">
                        <el-carousel-item v-for="item in adList" :key="item.id">
                            <nuxt-link :to="item.advertUrl" :target="item.advertTarget">
                                <img :src="item.imageUrl" :alt="item.title">
                            </nuxt-link>
                        </el-carousel-item>
                    </el-carousel>
                </el-col>

                <nuxt-child />
            </el-col>
        </el-row>
    </div>

</template>

<script>
export default {
    name: 'IndexPage',

    async asyncData({app}) {
        const {data:categoryData} = await app.$getCategoryList()
        const {data:adData} = await app.$getAdvertList(1)
        return {categoryList:categoryData.data, adList:adData.data}
    },

    methods: {
        handleOpen(key, keyPath) {
            console.log(key, keyPath);
        },
        handleClose(key, keyPath) {
            console.log(key, keyPath);
        }
    }
}

</script>

<style scoped>
.el-carousel__item h3 {
    color: #475669;
    font-size: 14px;
    opacity: 0.75;
    line-height: 200px;
    margin: 0;
}

.el-carousel__item:nth-child(2n) {
    background-color: #99a9bf;
}

.el-carousel__item:nth-child(2n+1) {
    background-color: #d3dce6;
}

.el-row {
    margin-bottom: 20px;
    &:last-child {
         margin-bottom: 0;
     }
}
.el-col {
    border-radius: 4px;
}
.bg-purple-dark {
    background: #99a9bf;
}
.bg-purple {
    background: #d3dce6;
}
.bg-purple-light {
    background: #e5e9f2;
}
.grid-content {
    border-radius: 4px;
    min-height: 36px;
}
.row-bg {
    padding: 10px 0;
    background-color: #f9fafc;
}
</style>
