<template>

    <div class="w">
        <h1><router-link to="home">PatchyVideo</router-link></h1>
        <div class="top in">
            <router-link to="/login">Login</router-link>
            <b>·</b>
            <router-link to="/signup">Sign up</router-link>
        </div>
        <div class="middle in">
            <form id="signup-info" method="POST">
                <div class="central-form">
                    <el-input id="username" name="username" type="text"      v-model="signup_username" placeholder="Username" prefix-icon="el-icon-user-solid"></el-input>
                    <el-input id="password1" name="password1" type="password"v-model="signup_password1" show-password placeholder="Password" prefix-icon="el-icon-lock"></el-input>
                    <el-input id="password2" name="password2" type="password"v-model="signup_password2" show-password placeholder="Repeat Password" prefix-icon="el-icon-key"></el-input>
                    <el-input id="email" name="email" type="email" v-model="signup_email" clearable placeholder="Email(Optional)" prefix-icon="el-icon-message"></el-input>
                    <p id="status" style="text-align: center;">Ready</p>
                </div>
            </form>
        </div>
        <div class="bottom in">
            <div class="login in" onclick="javascript:signup();">Sign up</div>
        </div>
    </div>

</template>

<script>
    import login  from '../views/Login.vue'
    export default {
        data() {
            return {
                signup_username:'',
                signup_password1:'',
                signup_password2:'',
                signup_email:''
            }
        },
        created(){
            this.$store.commit("changeBgc","signup");
        },
        methods: {},
        components: {login}
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
        left: -200px;
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

    .el-input{
        margin-top: 5px;

    }

</style>