<!--
    页面：paychyvideo的个人信息界面
    功能：展示用户个人信息
    更新日志：
    12/31/2019: v1.0

    ★待解决问题：
     因个人界面接口较特殊，需登录后才能获取，登录需携带Cookie，请先在官网登录后再打开此页面。
     本地登录提示错误暂未做处理。

       更新日志：
       1/11/2020
       问题：
       1.登录机制需要做成cookie保存验证判断,现有的登录有点问题暂时没有解决，
       2.由于User组件被改动，与原先的单独渲染相反，现在的所有子组件渲染几乎同时完成，意味着只要用户进入user界面，其他三个页面就已经加载完成。
       3.该组件应当采用大驼峰命名，下次更新时修改。


-->
<template>

    <div>
        <div class="bigbox standard" v-if="this.$route.params.id=='me'"   v-loading="loading">
            <div class="bigbox_left"></div>
            <div class="bigbox_left" id="imoto2"></div>
            <div class="bigbox_right">
                <div class="desc">
                    <div class="desc_name">{{myData.username}}</div>
                    <div class="text-form">
                        <textarea name="" v-model="myData.desc" cols="30" rows="10">{{myData.desc}}</textarea>
                    </div>
                    <button @click="changeDesc()">保存</button>
                </div>
                <div class="psd">
                    <div class="desc_name">更改密码</div>
                    <div class="psd-form">
                      <!--  <input type="password" placeholder="Old Password">
                        <input type="password" placeholder="New Password">
                        <input type="password" placeholder="Repeat New Password">-->
                        <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
                            <el-form-item label="旧密码" prop="old_pass">
                                <el-input v-model.number="ruleForm.old_pass"></el-input>
                            </el-form-item>
                            <el-form-item label="新密码" prop="pass">
                                <el-input type="password" v-model="ruleForm.pass" autocomplete="off"></el-input>
                            </el-form-item>
                            <el-form-item label="确认密码" prop="checkPass">
                                <el-input type="password" v-model="ruleForm.checkPass" autocomplete="off"></el-input>
                            </el-form-item>
                            <el-form-item class="post">
                                <el-button type="primary" @click="submitForm('ruleForm')">提交</el-button>
                                <el-button @click="resetForm('ruleForm')">重置</el-button>
                            </el-form-item>

                        </el-form>

                    </div>

          <!--          <button>保存</button>-->

                </div>
                <div class="email">
                    <div class="email-info">绑定邮箱</div>

                    <el-input
                            placeholder="请输入邮箱"
                            prefix-icon="el-icon-message"
                            v-model="myEmail">
                    </el-input>
                    <button @click="bindEmail()">绑定</button>
                </div>


            </div>


        </div>
        <div class="bigbox standard" v-if="this.$route.params.id!='me'"   v-loading="loading">
            <div class="bigbox_left"></div>
            <div class="bigbox_left" id="imoto2"></div>
            <div class="bigbox_right">
                <div class="desc">
                    <div class="desc_name">{{userData.username}}</div>
                    <div class="text-form">
                        <textarea name="" id="" cols="30" rows="10" disabled="disabled">{{userData.desc}}</textarea>
                    </div>

                </div>



            </div>


        </div>
    </div>
</template>

<script>
    export default {
        data() {
            var validateOldPass = (rule, value, callback) => {
                if (!value) {
                    return callback(new Error('请输入旧密码'));
                }
                if(JSON.stringify(value).length< 8){
                    return callback(new Error('密码长度必须至少为8个字符'));
                }
                if(JSON.stringify(value).length> 64){
                    return callback(new Error('密码长度必须至多为64个字符'));
                }
                callback();

            };
            var validatePass = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请输入新密码'));
                }

                else {
                    if(JSON.stringify(value).length< 10){
                        return callback(new Error('密码长度必须至少为8个字符'));
                    }
                    if(JSON.stringify(value).length> 66){
                        return callback(new Error('密码长度必须至多为64个字符'));
                    }else if (this.ruleForm.checkPass !== '') {
                        this.$refs.ruleForm.validateField('checkPass');
                    }
                    callback();
                }
            };
            var validatePass2 = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请再次输入新密码'));
                } else if (value !== this.ruleForm.pass) {
                    callback(new Error('两次输入密码不一致!'));
                } else {
                    callback();
                }
            };
            return {

                ruleForm: {
                    pass: '',
                    checkPass: '',
                    old_pass: ''
                },
                rules: {
                    pass: [
                        { validator: validatePass, trigger: 'blur' }
                    ],
                    checkPass: [
                        { validator: validatePass2, trigger: 'blur' }
                    ],
                    old_pass: [
                        { validator: validateOldPass, trigger: 'blur' }
                    ]
                },


                myEmail:"",
                myData:{
                    username: "null",
                    desc:"null"
                },
                userData:{
                    desc: "null",
                    email: "null",
                    image: "null",
                    pubkey: "null",
                    username: "null",
                },
                loading:true
            }
        },
        created(){

            console.log(this.myData);
            if(this.$route.params.id=='me'){
                this.getMyData();
            }
            if(this.$route.params.id!='me'){
                this.getUserData();
            }
            console.log(this.$route);

        },
        methods: {
            bindEmail(){
                this.axios({
                    method:"post",
                    url:"https://www.patchyvideo.com/user/changeemail.do",
                    data:{"new_email":this.myEmail+""}
                }).then(res=>{
                    if(res.data.status==="FAILED"){
                        this.$message({
                            message: '请检查所填写邮箱是否合法',
                            type: 'warning'
                        })
                    }else {
                        this.$message({
                            message: '绑定成功',
                            type: 'success'
                        })
                    }
                    console.log(res);
                })
            },
            submitForm(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                       /* this.$message({
                            message: '提交成功！',
                            type: 'success'
                        });*/
                        this.changePass();
                    } else {
                        this.$message({
                            message: '请检查所填写信息是否正确',
                            type: 'warning'
                        });
                        return false;
                    }
                });
            },
            resetForm(formName) {
                this.$refs[formName].resetFields();
            },
            open1() {
                this.$message('这是一条消息提示');
            },
            open2() {
                this.$message({
                    message: '修改成功！',
                    type: 'success'
                });
            },

            open3() {
                this.$message({
                    message: '请检查信息是否正确',
                    type: 'warning'
                });
            },

            open4() {
                this.$message.error('错了哦，这是一条错误消息');
            },
            getMyData(){
                //现有的登录机制存在问题，
                //可能本地判断已登录实际并没有登录而进入了user界面，这时没有数据渲染，需要让他跳回登录界面
                this.axios({
                    method:'post',
                    url:"https://www.patchyvideo.com/user/myprofile.do",
                    data:{
                    },
                    withCredentials:true,
                }).then(res=>{
                    if(res.data.status=='ERROR'){
                        //火狐浏览器有BUG 暂时先这样跳，等cookie登陆做完后再在user页面判断。
                        this.$router.push("/login");
                        console.log(res.data.data);
                    }
                    if(res.data.status=='SUCCEED')
                    {
                        this.myData = res.data.data.profile;
                    }
                    this.loading =false;
                }).catch(err=>{
                    console.log(err);
                })
            },
            getUserData(){
                this.axios({
                    method: "post",
                    url:"https://www.patchyvideo.com/user/profile.do",
                    data:{"uid":this.$route.params.id}
                }).then(res=>{
                    this.userData =res.data.data.profile;
                    console.log(res);
                    this.loading =false;
                });

            },
            changeDesc(){
                console.log(this.myData.desc.length);
                if(this.myData.desc.length>2000){
                    this.$message({
                        message: '字数不能超过2000哦！',
                        type: 'warning'
                    });
                    return;
                }
                this.axios({
                    method:"post",
                    url:"https://www.patchyvideo.com/user/changedesc.do",
                    data:{
                        "desc":this.myData.desc
                    }
                }).then(res=>{
                    this.open2();
                    console.log(res);
                })

            },
            changePass(){

                this.axios({
                    method:"post",
                    url:"https://www.patchyvideo.com/user/changepass.do",
                    data:{
                        "old_pass": this.ruleForm.old_pass+"",
                        "new_pass": this.ruleForm.pass+""
                    }
                }).then(res=>{
                    console.log(res);
                    if(res.data.status=="FAILED"){
                        this.$message.error('请检查旧密码是否正确');
                    }else {
                        this.open2();
                    }

                })

            }
        },
        components: {}
    }
</script>

<style scoped>

    .email-info{
        margin-bottom: 20px;
    }
    .email >.el-input{
        margin-bottom: 20px;
    }

.post :nth-child(2){
  position: absolute;
    right: 0px;
}

.el-form{
    width: 450px;
}

    .bigbox {
        height: 1000px;
        display: flex;
        background-color: white;
        opacity: 0.9;
    }


    .bigbox_left {
        position: absolute;

        width: 50%;
        max-width: 800px;
        height: 900px;
        background: url("../static/img/imoto_left.jpg") no-repeat;
        background-size: 100% 100%;
        /*     background-color: #D5D5D5; */
    }

    .bigbox_right {
        position: absolute;
        right: 0px;
        padding: 50px;
        padding-top: 150px;
        text-align: left;
        margin: auto;
        width: 40%;
        height: 900px;

    }

    .desc_name {
        margin-bottom: 20px;
    }

    .bigbox_right .desc {
        width: 100%;
        height: 250px;
        font-size: 18px;
    }

    .desc_name {
        color: #333;
        font-family: Arial, Helvetica, sans-serif;
    }

    .bigbox button {
        width: 100px;
        height: 40px;
        display: inline-block;
        line-height: 1;
        white-space: nowrap;
        cursor: pointer;
        background: #fff;
        border: 1px solid #c4c4c4;
        color: #1f2d3d;
        margin: 0;
        padding: 10px 15px;
        border-radius: 4px;
    }

    .text-form {
        margin-bottom: 20px;
    }

    textarea {
        width: 100%;
        height: 100px;
        padding: 10px;
        font-size: 16px;
        color: #4a4a4a;
        border: 1px solid #d1d1d1;
        border-radius: 2px;
    }

    .psd-form input {
        width: 300px;
        height: 30px;
        margin-bottom: 20px;
        padding-left: 10px;
        display: block;
        font-size: 16px;
        color: #4a4a4a;
        border: 1px solid #d1d1d1;
        border-radius: 2px;
    }

    #imoto2 {
        position: absolute;
        display: none;
        width: 50%;
        height: 800px;
        background: url("../static/img/imoto_left2.jpg") no-repeat;
        background-size: 100% 100%;
    }
</style>