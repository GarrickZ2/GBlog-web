<template>
    <div id="page">
        <!-- Header -->
        <Header/>
        <!-- Middle -->
        <nuxt/>
        <!-- End -->
        <Footer/>

        <el-backtop :bottom="100">
            <div style="{
                height: 100%;
                width: 100%;
                background-color: #ff7d6f;
                box-shadow: 0 0 6px rgba(0,0,0, .12);
                text-align: center;
                line-height: 40px;
                border-radius: 25px;
                color: white;}">
                <i class="el-icon-arrow-up"></i>
            </div>
        </el-backtop>
    </div>
</template>

<script>
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'

export default {
    components: {
        Header,
        Footer
    }
}

</script>

<style>

</style>
