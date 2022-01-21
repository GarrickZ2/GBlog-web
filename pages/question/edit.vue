<template>
    <div>
        <header id="fh5co-header" class="fh5co-cover fh5co-cover-sm" role="banner" style="background-image:url(/images/img_bg_1.jpg);" data-stellar-background-ratio="0.5">
            <div class="overlay"></div>
            <div class="container">
                <div class="row">
                    <div class="col-md-7 text-left">
                        <div class="display-t">
                            <div class="display-tc animate-box" data-animate-effect="fadeInUp">
                                <h1 class="mb30">Post Your Question</h1>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </header>
        <div class="block">
            <el-form ref="formData" :model="formData" label-width="100px" label-position="right" :rules="rules">
                <el-form-item label="Title" prop="title">
                    <el-input v-model="formData.title" placeholder="Please input title" maxlength="50" show-word-limit />
                </el-form-item>
                <el-form-item label="label" prop="labelIds">
                    <el-cascader
                        :disabled="disabled"
                        style="display: block"
                        placeholder="Try searchingL Guide"
                        v-model="formData.labelIds"
                        :options="options"
                        :props="{ multiple: true, emitPath:false, children:'labelList', value:'id', label:'name'}"
                        :show-all-levels="false"
                        :filterable="true" clearable></el-cascader>
                </el-form-item>

                <el-form-item label="Content" prop="content">
                    <mavon-editor :autofocus="false" ref="md" v-model="formData.mdContent" @change="getMdHtml" @imgAdd="uploadContentImg" @imgDel="delContentImg"/>
                </el-form-item>

                <el-row type="flex" justify="center">
                    <el-button type="primary" @click="submitForm('formData')">Submit</el-button>
                </el-row>
            </el-form>
        </div>
    </div>

</template>

<script>
export default {
    name: "edit",
    middleware: 'auth',
    validate({query}){
        if (query.id) {
            return /^\d+$/.test(query.id)
        }
        return true
    },
    data() {
        const validateLabel = (rule, value, callback) => {
            if (value && value.length > 5) {
                callback(new Error('Select at most 5 labels'))
            } else {
                callback()
            }
        }
        const validateContent = (rule, value, callback) => {
            if (this.formData.mdContent && this.formData.htmlContent) {
                callback()
            } else {
                callback(new Error('Please input article content'))
            }
        }
        return {
            rules:{
                title: [{required: true, message: 'Please input the title', trigger: 'blur'}],
                labelIds:[
                    {required: true, message: 'Please select a tag', trigger: 'blur'},
                    {validator: validateLabel, trigger: 'change'},
                ],
                content:[{validator:validateContent, trigger:'change'}]
            },
            formData: {},
            disabled : false,
            options:[],
        };
    },
    async asyncData({app, query}){
        const {data} = await app.$getCategoryList()
        if (query.id){
            const {data:question} = await app.$getQuestionById(query.id)
            return {options: data.data, formData: question.data}
        }
        return {options: data.data}
    },
    methods: {
        submitForm(formName){
            this.$refs[formName].validate((valid)=>{
                if (valid) {
                    this.submitData()
                } else {
                    return false
                }
            })
        },
        async submitData(){
            let response = null
            if (this.formData.id) {
                response = await this.$updateQuestion(this.formData)
            } else {
                response = await this.$addQuestion(this.formData)
            }
            if(response.data.code === 200) {
                this.$message.success('Submit Question Success')
                this.$router.push(`/question/${response.data.data}`)
            }
        },
        async uploadMainImg(file){
            const data = new FormData()
            data.append('file', file.file)
            this.$uploadImg(data).then(response => {
                this.deleteImg()
                this.formData.imageUrl = response.data
            }).catch(error => {
                this.$message.error('Upload Failed:', error)
            })
        },
        deleteImg() {
            if(this.formData.imageUrl) {
                this.$deleteImg(this.formData.imageUrl)
            }
        },
        getMdHtml(mdContent, htmlContent) {
            this.formData.mdContent = mdContent
            this.formData.htmlContent = htmlContent
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
    }
};
</script>

<style scoped>
.block {
    width: 70%;
    margin-left: 15%;
}
.avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
}
.avatar-uploader .el-upload:hover {
    border-color: #409EFF;
}
.avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
}
.avatar {
    width: 178px;
    height: 178px;
    display: block;
}
</style>
