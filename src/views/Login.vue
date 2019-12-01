<template>


        <div class="w">
            <h1><router-link to="/home">PatchyVideo</router-link></h1>
            <div class="top in">
              <router-link to="/login"    >Login</router-link>
                <b>·</b>
                <router-link to="/signup">Sign up</router-link>
            </div>
            <el-form ref="loginFormRef" :model="loginFormRef" class="middle in" :rules="rules">
                <!--    <form id="login-info" method="POST">-->
                <el-form-item  prop="login_name">
                <el-input id="username" name="username"  placeholder="Username" v-model="loginFormRef.login_name" clearable prefix-icon="el-icon-user"></el-input>
                </el-form-item>
                <el-form-item  prop="login_password">
                <el-input id="password" name="password"  placeholder="Password"  v-model="loginFormRef.login_password"show-password prefix-icon="el-icon-lock"> </el-input>
                </el-form-item>
                <p id="status" style="text-align: center;">Ready</p>
                <!--       </form>-->
            </el-form>
            <div class="bottom in">
                <div @click="login" class="login in">Login</div>
            </div>

        </div>


</template>

<script>
    import signup  from "../views/SignUp"
    export default {
        data() {
            return {
                loginFormRef:{
                    login_name: '',
                    login_password: '',
                },

                rules:{
                    login_name: [
                        { required: true, message: '请输入账号', trigger: 'blur' },//required:是否为必填项
                        { min: 4, max: 32, message: '长度在 4 到 32 个字符', trigger: 'blur' }
                    ],
                    login_password:[
                        { required: true, message: '请输入密码', trigger: 'blur' },
                        { min: 6, max: 64, message: '长度在 6 到 64 个字符', trigger: 'blur' }
                    ]
                }
            }
        },
        created(){
          this.$store.commit("changeBgc","login");
        },
        mounted() {

        },
        methods: {
            open1() {
                this.$message('这是一条消息提示');
            },
            open2() {
                this.$message({
                    message: '登录成功',
                    type: 'success'
                });
            },

            open3() {
                this.$message({
                    message: '登录失败',
                    type: 'warning'
                });
            },

            open4() {
                this.$message.error('错了哦，这是一条错误消息');
            },

         login() {
     this.$refs.loginFormRef.validate( valid=>{
         if (valid) {
             this.axios({ method:'post',
                 url:'https://www.patchyvideo.com/login.do',
                 data: {
                     "username": this.loginFormRef.login_name,
                     "password": this.loginFormRef.login_password,
                     "session": "cfb13b1b0b3852636d7549fbd1605d7c"
                 }
         }
             ).then(result=>{
                 console.log(result);
                 if(result.status==200){
                  console.log("请求成功");
                  if(result.data.status=="SUCCEED"){
                      this.open2();
                       this.$store.commit("getUserName",this.loginFormRef.login_name);
                      this.$router.push('/home')
                  }else {
                      this.open3();
                  }
              }else {
                     console.log("请求失败");
              }
             })
         } else {
             console.log('error submit!!');
             return false;
         }
     });

  }
        },
        components: {signup}
    }
</script>

<style scoped>

    input::-webkit-input-placeholder{
        color: #c8c8c8;


    }
    input::-moz-placeholder{   /* Mozilla Firefox 19+ */
        color: #c8c8c8;

    }
    input:-moz-placeholder{    /* Mozilla Firefox 4 to 18 */
        color: #c8c8c8;

    }
    input:-ms-input-placeholder{  /* Internet Explorer 10-11 */
        color: #c8c8c8;
    }
    input[type="text"]{

    }

    *{
        margin: 0px;
        padding:0px;
    }
    a{
        text-decoration: none;
        color:  #FF7792;
    }



    .w{
        position: relative;
        top: 100px;
display: block;
        width: 300px;
        height: 420px;
        padding:50px;
        background-color: white;
        box-shadow:  0px 0px 80px #FFEEF1;
        background-position-x:50%;
          left: 200px;
        margin: auto;
    }
    .w h1{
        width: 100%;
        height:60px;
        display: block;
        text-align: center;


    }

    .in{
        width: 300px;
    }

    .top {
        margin-bottom: 50px;
        text-align: center;

    }
    .top a{

        font-weight: 400;
        color: #969696;

    }
    .top a:hover{
        font-weight: 700;
        color: #ea6f5a;
        border-bottom: 2px solid #FF6685;
    }
    .top  b{
        margin:0px 10px 0px;
        font-size: 10px;
    }

    .middle input{
        padding-left: 10px;
        width:100%;
        height: 50px;
        cursor: text;
        font-size: 14px;
        color: #646257;

        border: 1px solid #c8c8c8;
        background-color: hsla(0,0%,71%,.1);
    }
    .middle input:focus{


    }

    .login{
        padding:0px 5px;
        margin: 20px 0px  10px;
        height: 50px;
        line-height: 50px;
        text-align: center;
        font-size: 18px;
        border-radius: 25px;
        color: #fff;
        background: #FF99AD;
    }
    .login:hover{

        cursor:pointer;
        background: #FF7792;
    }

    p{
        margin: 10px 0;
        padding: 0;
        text-align: center;
        font-size: 12px;
        line-height: 20px;
        color: #969696;
    }

    .last{
        margin:auto;
        margin-top: 50px;
        height:50px;
        width: 250px;

        border-top:1px solid #c8c8c8;
    }
    .last p{

        display: block;
        margin: auto;
        width: 100px;
        padding:10px;
        background-color: #fff;
        margin-top: -80px;

    }

    i{

        font-style: normal;
    }


    i:hover{
        cursor: pointer;
        color: blue;
    }
    .el-form-item{
        margin-top: 30px;
    }


</style>