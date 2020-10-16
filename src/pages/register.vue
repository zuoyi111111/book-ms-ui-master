<template>
    <div class="login" :style="backgourndStyle" >
        <div style="height:160px"> </div>
        <div>
            <div style="width:58%;float:left">.</div>
            <div style="width:42%;float:left">
                <el-form :model="loginForm" :rules="rules" ref="loginForm"   
                    v-loading="loading"
                    element-loading-text="正在注册..."
                    element-loading-spinner="el-icon-loading"
                    element-loading-background="rgba(0, 0, 0, 0.8)"
                    class="loginContainer">
                    <h3 class="loginTitle">注册</h3>
                    <el-form-item prop="userName">
                        <el-input v-model="loginForm.userName" placeholder="用户名" prefix-icon="el-icon-s-custom"></el-input>
                    </el-form-item>
                    <el-form-item prop="nickName">
                        <el-input v-model="loginForm.nickName" placeholder="姓名" prefix-icon="el-icon-s-custom"></el-input>
                    </el-form-item>
                    <el-form-item prop="password">
                        <el-input type="password" placeholder="密码" v-model="loginForm.password"  @keydown.enter.native="submitForm('loginForm')" prefix-icon="el-icon-key"></el-input>
                    </el-form-item>
                     <el-form-item prop="againPassword">
                        <el-input type="password" placeholder="确认密码" v-model="loginForm.againPassword"  @keydown.enter.native="submitForm('loginForm')" prefix-icon="el-icon-key"></el-input>
                    </el-form-item>
                     <el-form-item prop="phone">
                        <el-input v-model="loginForm.phone" placeholder="电话" prefix-icon="el-icon-phone-outline"></el-input>
                    </el-form-item>
                     <el-form-item prop="email">
                        <el-input v-model="loginForm.email" placeholder="邮件" prefix-icon="el-icon-eleme"></el-input>
                    </el-form-item>
                    <el-form-item style="text-align:right">
                        <el-button type="primary" class="submit_btn" @click="submitForm('loginForm')" size="medium">注册</el-button>
                    </el-form-item>
                </el-form>
            </div>
        </div>
    </div>
</template>

<script>
    export default{
        name:'login',
        data(){
            return{
                loading: false,
                loginForm: {
                    loginName: '18888888888',
                    password: '111111'
                },
                rules: {
                    userName: [
                        { required: true, message: '请输入用户名', trigger: 'blur' },
                    ],
                    password: [
                        { required: true, message: '请输入密码', trigger: 'blur' }
                    ]
                }
            }
        },
        computed:{
            backgourndStyle: function() {
                // 计算body可用高度
                let cHeight = window.outerHeight - (window.outerHeight - window.innerHeight)
                // 计算背景图
                let imgs = ["http://bookstore.zealon.cn/0-1.jpg","http://bookstore.zealon.cn/0-2.jpg","http://bookstore.zealon.cn/0-6.png"]
                let imgName = imgs[Math.floor(Math.random() * 3)]
                let style = "background-image:url('" + imgName + "'); background-repeat: round; height:" + cHeight + "px;";
                return style
            }
        },
        created(){
            this.db.save("LOGINFLAG","0")
            document.title = "爱心图书众筹系统"
        },
        methods:{
            submitForm(loginForm) {
                this.$refs[loginForm].validate((valid) => {
                    if (valid) {
                        if (this.loginForm.password !== this.loginForm.againPassword) {
                             this.$message({
                                type: 'error',
                                message: '两次密码输入不一致，请重新输入'
                            });
                            return
                        }
                        this.loading = true;
                        this.postRequest('/register.json', this.loginForm).then(resp => {
                            this.loading = false;
                            if (resp.success) {
                                //this.db.save("USER", resp.data);
                                let path = this.$route.query.redirect;
                                this.$message({
                                    type: 'success',
                                    message: '注册成功！！'
                                });
                                this.$router.replace((path == '/' || path == undefined) ? '/' : path);
                            } else {
                                this.$message({
                                    type: 'error',
                                    message: '注册失败！！'
                                });
                            }
                        })
                    } else {
                        //console.log('error submit!!')
                        return false;
                    }
                });
            }
        }
    }
</script>

<style >
    body{
        margin:0px;
    }

    .login{
        width:100%;
        
    }

    .loginContainer {
        border-radius: 8px;
        background-clip: padding-box;
        width: 265px;
        padding: 5px 40px 2px 40px;
        background: #fff;
    }

    .loginTitle {
        margin: 15px auto 20px auto;
        text-align: center;
        color: #505458;
        font-size:24px
    }
</style>