<!--    vue页面：SignUp.vue     -->
<!--
    页面：paychyvideo的注册页面
    功能：用户由此注册账号
    包含组件：login
    更新日志：
    12/1/2019: v1.0
      release
    12/31/2019：v1.0.1
      1.实现了使用session注册的功能
      2.加入了一些特效
      3.实现了注册后直接登录的功能
      4.实现了填写用户名的时候自动校验是否已经存在的功能
    1/9/2020：v1.0.2
      1.修改了当前页面下的网站标题
    1/21/2020：v1.0.3
      1.储存方式改为使用cookie进行储存
      2.注册账号的时候邮箱成为必要选项
    1/31/2020：v1.0.4
      1.注册界面修改，注册完成后跳转到登录界面而不是直接登录然后返回到主页
    ★待解决问题：
      1.邮件没有查重设置，注册账号的时候没有对邮箱的唯一性进行验证
-->
<template>
  <div class="signupPic">
    <!-- 注册框正文 -->
    <div class="w" v-loading="loading">
      <!-- 标题 -->
      <h1>
        <router-link to="home">PatchyVideo</router-link>
      </h1>
      <div class="top in">
        <router-link to="/login">登录</router-link>
        <b>·</b>
        <router-link to="/signup">注册</router-link>
      </div>

      <!-- 输入账号和密码的框 -->
      <el-form
        ref="signupFormRef"
        :model="signupFormRef"
        class="middle in central-form"
        status-icon
        :rules="rules"
      >
        <el-form-item prop="signup_username" class="signupInput">
          <el-input
            id="username"
            name="username"
            v-model="signupFormRef.signup_username"
            placeholder="请输入用户名"
            clearable
            prefix-icon="el-icon-user-solid"
          ></el-input>
        </el-form-item>
        <el-form-item prop="signup_password1" class="signupInput">
          <el-input
            id="password1"
            name="password1"
            type="password"
            v-model="signupFormRef.signup_password1"
            placeholder="请输入密码"
            prefix-icon="el-icon-lock"
          ></el-input>
        </el-form-item>
        <el-form-item prop="signup_password2" class="signupInput">
          <el-input
            id="password2"
            name="password2"
            type="password"
            v-model="signupFormRef.signup_password2"
            placeholder="请重复密码"
            prefix-icon="el-icon-key"
          ></el-input>
        </el-form-item>
        <el-form-item prop="signup_email" class="signupInput">
          <el-input
            id="email"
            name="email"
            type="email"
            v-model="signupFormRef.signup_email"
            clearable
            placeholder="Email"
            prefix-icon="el-icon-message"
          ></el-input>
        </el-form-item>
        <p id="status" style="text-align: center;" v-bind:class="{alert:status!='就绪'}">{{ status }}</p>
      </el-form>

      <!-- 注册按钮 -->
      <div class="bottom in">
        <div class="login in" @click="signup">注册</div>
      </div>
    </div>
  </div>
</template>

<script>
import login from "../views/Login.vue";
export default {
  data() {
    // 校验用户名是否已经存在
    var checkUsername = (rule, value, callback) => {
      this.axios({
        method: "post",
        url: "be/user/exists.do",
        data: {
          username: value
        }
      }).then(result => {
        if (result.data.data == true) {
          callback(new Error("该用户名已存在！"));
        } else {
          callback();
        }
      });
    };
    // 校验两次输入密码是否一致
    var validatePass2 = (rule, value, callback) => {
      if (value !== this.signupFormRef.signup_password1) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };
    return {
      // 用户账户信息
      signupFormRef: {
        signup_username: "",
        signup_password1: "",
        signup_password2: "",
        signup_email: ""
      },
      // 事先向服务器请求的session值
      session: "",
      rules: {
        signup_username: [
          { required: true, message: "请输入账号", trigger: "blur" },
          { validator: checkUsername, trigger: "blur" },
          { min: 2, max: 32, message: "长度在 2 到 32 个字符", trigger: "blur" }
        ],
        signup_password1: [
          { required: true, message: "请输入密码", trigger: "blur" },
          { min: 6, max: 64, message: "长度在 6 到 64 个字符", trigger: "blur" }
        ],
        signup_password2: [
          { required: true, message: "请重复密码", trigger: "blur" },
          { validator: validatePass2, trigger: "blur" },
          { min: 6, max: 64, message: "长度在 6 到 64 个字符", trigger: "blur" }
        ],
        signup_email: [
          { required: false, message: "请输入邮箱", trigger: "blur" },
          { type: "email", message: "请输入正确的邮箱地址", trigger: ["blur"] }
        ]
      },
      // 登录状态
      status: "就绪",
      // 视频列表是否属于加载状态的判断
      loading: false
    };
  },
  created() {
    // 初始化页面名为signup
    this.$store.commit("changeBgc", "signup");
    // 修改网站标题
    document.title = "注册 - Patchyvideo";
  },
  methods: {
    open2() {
      this.$message({
        message: "注册成功",
        type: "success"
      });
    },

    open3() {
      this.$message({
        message: "该用户名已存在！",
        type: "warning"
      });
    },

    open4() {
      this.$message({
        message: "未知错误",
        type: "warning"
      });
    },

    // 用户注册
    signup: function() {
      // 先使页面出于加载状态
      this.loading = true;

      // 表单验证
      this.$refs.signupFormRef.validate(valid => {
        if (valid) {
          // 验证成功，先获取session
          this.axios({
            method: "post",
            url: "be/auth/get_session.do",
            data: {
              type: "SIGNUP"
            }
          }).then(result => {
            this.session = result.data.data;

            // 请求登录
            this.axios({
              method: "post",
              url: "be/signup.do",
              data: {
                username: this.signupFormRef.signup_username,
                password: this.signupFormRef.signup_password1,
                email: this.signupFormRef.signup_email,
                session: this.session
              }
            }).then(result => {
              if (result.status == 200) {
                if (result.data.status == "SUCCEED") {
                  this.open2();
                  // 加载结束,加载动画消失
                  this.loading = false;
                  // 退回到登录界面
                  this.$router.push("/login");
                }
                // 用户名已存在的情况
                else {
                  var reason = result.data.data.reason;
                  if (reason == "USER_EXIST") {
                    this.open3();
                  } else {
                    this.open4();
                  }
                  this.loading = false;
                }
              } else {
                this.status = "网络异常";
              }
            });
          });
        } else {
          this.status = "填写格式不正确！";
          // 加载结束,加载动画消失
          this.loading = false;
          return false;
        }
      });
    }
  },
  components: { login }
};
</script>

<style scoped>
.signupPic {
  height: 100%;
  width: 100%;
/*  background: url("../static/img/sign_up.jpg") no-repeat top center;*/
  /* background-position: 200px 0; */
  background-size: cover;
  background-attachment: fixed;
}

.alert {
  color: red;
}

input::-webkit-input-placeholder {
  color: #c8c8c8;
}
input::-moz-placeholder {
  /* Mozilla Firefox 19+ */
  color: #c8c8c8;
}
input:-moz-placeholder {
  /* Mozilla Firefox 4 to 18 */
  color: #c8c8c8;
}
input:-ms-input-placeholder {
  /* Internet Explorer 10-11 */
  color: #c8c8c8;
}

* {
  margin: 0px;
  padding: 0px;
}
a {
  text-decoration: none;
  color: #ff7792;
}

.w {
  position: relative;
  top: 100px;
  display: block;
  width: 300px;
  height: 480px;
  padding: 50px;
  background-color: white;
  box-shadow: 0px 0px 80px #ffeef1;
  background-position-x: 50%;
  left: -200px;
  margin: auto;
}
.w h1 {
  width: 100%;
  height: 60px;
  display: block;
  text-align: center;
}

.in {
  width: 300px;
}

.top {
  margin-bottom: 50px;
  text-align: center;
}
.top a {
  font-weight: 400;
  color: #969696;
}
.top a:hover {
  font-weight: 700;
  color: #ea6f5a;
  border-bottom: 2px solid #ff6685;
}
.top b {
  margin: 0px 10px 0px;
  font-size: 10px;
}

.middle input {
  padding-left: 10px;
  width: 100%;
  height: 50px;
  cursor: text;
  font-size: 14px;
  color: #646257;
  border: 1px solid #c8c8c8;
  background-color: hsla(0, 0%, 71%, 0.1);
}

.login {
  padding: 0px 5px;
  margin: 20px 0px 10px;
  height: 50px;
  line-height: 50px;
  text-align: center;
  font-size: 18px;
  border-radius: 25px;
  color: #fff;
  background: #ff99ad;
}
.login:hover {
  cursor: pointer;
  background: #ff7792;
}

p {
  margin: 10px 0;
  padding: 0;
  text-align: center;
  font-size: 12px;
  line-height: 20px;
  color: #969696;
}

.last {
  margin: auto;
  margin-top: 50px;
  height: 50px;
  width: 250px;

  border-top: 1px solid #c8c8c8;
}
.last p {
  display: block;
  margin: auto;
  width: 100px;
  padding: 10px;
  background-color: #fff;
  margin-top: -80px;
}

i {
  font-style: normal;
}

i:hover {
  cursor: pointer;
  color: blue;
}

.el-input {
  margin-top: 5px;
}
</style>