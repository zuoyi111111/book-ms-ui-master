<template>
    <div class="defaultForm">
        <el-form :model="dataForm" :rules="rules" ref="dataForm" size="small"
            label-width="135px" >
            <el-form-item label="众筹图书名称" prop="needBookName">
                <el-input v-model="dataForm.needBookName"></el-input>
            </el-form-item>
              <el-form-item label="众筹图书数量" prop="needBookNum">
                <el-input-number v-model="dataForm.needBookNum" :min="1" label="图书数量"></el-input-number>
            </el-form-item>
              <el-form-item label="众筹区域" prop="needArea">
                <el-input v-model="dataForm.needArea"></el-input>
            </el-form-item>
              <el-form-item label="拥有数量" prop="haveNum">
               <el-input-number v-model="dataForm.haveNum" :min="1" label="拥有数量"></el-input-number>
            </el-form-item>
             <el-form-item label="描述" prop="needDesc">
                <el-input v-model="dataForm.needDesc"></el-input>
            </el-form-item>
             <el-form-item label="众筹有效期30天">
             </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="submitForm('dataForm')">保存</el-button>
                <el-button @click="$router.back(-1)">返回</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                imageUrl:'',
                dataForm: {
                    needBookNum: 1
                },
                num1: 1,
                num2: 1,
                rules: {
                    needBookName: [
                        { required: true, message: '请输入图书名称', trigger: 'blur' }
                    ], needBookNum: [
                        { required: true, message: '请输入图书数量', trigger: 'blur' }
                    ]
                }
            };
        },
        created(){
            this.initData();
        },
        methods: {
            submitForm(dataForm) {
                this.$refs[dataForm].validate((valid) => {
                if (valid) {
                    this.postRequest('/bookDonate/crowdFunding', this.dataForm).then(resp => {
                        if (resp && resp.code==200) {
                             this.$message({
                                type: 'success',
                                message: '众筹图书成功！！'
                            });
                            this.$router.push('/need-list');
                        }
                    })
                } else {
                    console.log('error submit!!');
                    return false;
                }
                });
            },
            initData(){
                // 详情
                let id = this.$route.query.id;
                this.getRequest('/bookType/getDetail.json', {id:id}).then(resp => {
                    if (resp.code == 200) {
                        this.dataForm = resp.data;
                        this.dataForm.attachmentIds = [];
                        // this.imageUrl = this.config.baseApi + "/" + resp.data.headImgUrl;
                    }
                })
            },
            handleAvatarSuccess(res, file) {
                this.imageUrl = URL.createObjectURL(file.raw);
            },
            beforeAvatarUpload(file) {
                const isJPG = file.type === 'image/jpeg';
                const isPNG = file.type === 'image/png';
                const isLt1M = file.size / 1024 / 1024 < 1;

                if (!isJPG && !isPNG) {
                    this.$message.error('上传头像图片只能是 JPG/PNG 格式!');
                }
                
                if (!isLt1M) {
                    this.$message.error('上传头像图片大小不能超过 1MB!');
                }
                return isJPG && isLt1M;
            },
            upload(item){
                let formData = new FormData()
                formData.append('file', item.file)
                formData.append('tableCode', 'author')
                formData.append('tableField', 'head')
                this.postRequest('/upload', formData).then(resp => {
                    if (resp && resp.code==200) {
                        let attachment = resp.data.attachments[0];
                        this.dataForm.attachmentIds[0] = attachment.id;
                        this.dataForm.headImgUrl = attachment.path;
                        this.imageUrl = this.config.baseApi + "/" + attachment.path;
                        if (success.data.msg) {
                            Message.success({message: success.data.msg})
                        }
                    }
                })
            }
        }
    }
</script>

<style scoped>
    .defaultForm {
        margin-top: 20px;
        width: 85%
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
        width: 128px;
        height: 128px;
        line-height: 128px;
        text-align: center;
    }
    .avatar {
        width: 128px;
        height: 128px;
        display: block;
    }
</style>