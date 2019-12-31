<!--    vue页面：Login.vue     -->
<!--
    页面：paychyvideo的登录页面
    功能：用户由此登录网站
    包含组件：signup
    更新日志：
    12/1/2019: v1.0
      release
    12/30/2019：v1.0.1
      1.实现了使用session登录的功能
      2.加入了一些特效
      3.使用本地储存确保登录信息保留（关联于TopNavbar.vue和index.js(router目录下的)里的函数）
    12/31/2019：v1.0.2
      1.完善了登录验证的相关问题
      2.对注释进行少量更改
    ★待解决问题：
      1.利用本地储存确保登录信息保留可能会导致信息不安全
-->
<template>
  <div class="loginPic">
    <!-- 登录框正文 -->
    <div class="w" v-loading="loading">
      <!-- 标题 -->
      <h1>
        <router-link to="/home">PatchyVideo</router-link>
      </h1>
      <div class="top in">
        <router-link to="/login">登录</router-link>
        <b>·</b>
        <router-link to="/signup">注册</router-link>
      </div>

      <!-- 输入账号和密码的框 -->
      <el-form ref="loginFormRef" :model="loginFormRef" class="middle in" :rules="rules">
        <el-form-item prop="login_name">
          <el-input
            id="username"
            name="username"
            placeholder="用户名"
            v-model="loginFormRef.login_name"
            clearable
            prefix-icon="el-icon-user"
          ></el-input>
        </el-form-item>
        <el-form-item prop="login_password">
          <el-input
            id="password"
            name="password"
            placeholder="密码"
            v-model="loginFormRef.login_password"
            show-password
            prefix-icon="el-icon-lock"
          ></el-input>
        </el-form-item>
        <p id="status" style="text-align: center;" v-bind:class="{alert:status!='就绪'}">{{ status }}</p>
      </el-form>

      <!-- 登录按钮 -->
      <div class="bottom in">
        <div @click="login" class="login in">登录</div>
      </div>
    </div>
  </div>
</template>

<script>
import signup from "../views/SignUp";
export default {
  data() {
    return {
      // 用户信息
      loginFormRef: {
        login_name: "",
        login_password: ""
      },
      // 事先向服务器请求的session值
      session: "",
      // 表单验证规则
      rules: {
        login_name: [
          { required: true, message: "请输入账号", trigger: "blur" },
          { min: 4, max: 32, message: "长度在 4 到 32 个字符", trigger: "blur" }
        ],
        login_password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          { min: 6, max: 64, message: "长度在 6 到 64 个字符", trigger: "blur" }
        ]
      },
      // 登录状态
      status: "就绪",
      // 视频列表是否属于加载状态的判断
      loading: false
    };
  },
  created() {
    // 初始化页面名为login
    this.$store.commit("changeBgc", "login");
    // 修改网站标题
    document.title = "patchyvideo";
  },
  mounted() {},
  methods: {
    open2() {
      this.$message({
        message: "登录成功",
        type: "success"
      });
    },

    open3() {
      this.$message({
        message: "登录失败",
        type: "warning"
      });
    },

    // 用户登录
    login: function() {
      // 先使页面出于加载状态
      this.loading = true;

      // 表单验证
      this.$refs.loginFormRef.validate(valid => {
        if (valid) {
          // 验证成功，先获取session
          this.axios({
            method: "post",
            url: "https://www.patchyvideo.com/auth/get_session.do",
            data: {
              type: "LOGIN"
            }
          }).then(result => {
            this.session = result.data.data;

            // 请求登录
            this.axios({
              method: "post",
              url: "https://www.patchyvideo.com/login.do",
              data: {
                username: this.loginFormRef.login_name,
                password: this.loginFormRef.login_password,
                session: this.session
              }
            }).then(result => {
              if (result.status == 200) {
                if (result.data.status == "SUCCEED") {
                  this.open2();
                  this.$store.commit(
                    "getUserName",
                    this.loginFormRef.login_name
                  );
                  // 加载结束,加载动画消失
                  this.loading = false;

                  // 利用本地储存储存登录状态
                  localStorage.setItem("isLogin", true);
                  localStorage.setItem(
                    "username",
                    this.loginFormRef.login_name
                  );

                  // 回到上一个页面
                  this.$router.go(-1);
                } else {
                  this.open3();
                }
              } else {
                this.status = "请求失败";
              }
            });
          });
        } else {
          this.status = "error submit!!";
          // 加载结束,加载动画消失
          this.loading = false;
          return false;
        }
      });
    }
  },
  components: { signup }
};
</script>

<style scoped>
.loginPic {
  height: 100%;
  width: 100%;
  background: url("../static/img/login.jpg") no-repeat top center;
  /* background-position: 200px 0; */
  background-size: cover;
  background-attachment: fixed;
  background-color: #646257;
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
input[type="text"] {
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
  height: 420px;
  padding: 50px;
  background-color: white;
  box-shadow: 0px 0px 80px #ffeef1;
  background-position-x: 50%;
  left: 200px;
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
.middle input:focus {
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
.el-form-item {
  margin-top: 30px;
}
</style>