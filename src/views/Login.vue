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
    1/9/2020：v1.0.3
      1.修改了当前页面下的网站标题
    1/10/2020：v1.0.4
      1.输入密码之后按下回车会自动登录
    1/21/2020：v1.0.5
      1.储存方式改为使用cookie进行储存
    1/29/2020：v1.0.6
      1.登录页面跳转逻辑更新：
        现跳转逻辑分为三种情况：
          ①点击顶部导航栏的情况下登录成功之后退回到上一页面
          ②路由守卫拦截的情况下登录成功之后前进到本来应该到达但被路由守卫拦截的页面
            现在是"/postvideo"、"/edittag"、"/users/me"、"/createVideoList"四个路径指向的页面
            其中"/postvideo"因为可能有传入的参数所以单独进行兼容
          ③从其他各种神奇的地方（包括且不限于从注册页面的链接，重置密码页面的跳转，甚至直接输入URL）登录成功之后跳转到home页面
        默认为第三种情况，前两种情况在进入登录页面之前会对判断条件进行更新，然后在登录界面跳转的时候进行判断,登录成功之后立刻转回默认情况
      2.前端cookie保存时间更新为7天(以登录那一刻算起往后7天,然后转换为世界统一时间作为cookie失效的时间)
    ★待解决问题：
      暂无
-->
<template>
  <div class="loginPic">
    <!-- 登录框正文 -->
    <div v-loading="loading" class="w">
      <!-- 标题 -->
      <h1>
        <router-link to="/home">PatchyVideo</router-link>
      </h1>
      <div class="top in">
        <router-link :to="session ? '/login?session=' + session : '/login'">{{ $t("login") }}</router-link>
        <b>·</b>
        <router-link :to="session ? '/signup?session=' + session : '/signup'">{{ $t("signup") }}</router-link>
        <b>·</b>
        <a href="/be/oauth?type=qq">{{ $t("login_qq") }}</a>
      </div>

      <!-- 输入账号和密码的框 -->
      <el-form ref="loginFormRef" :model="loginFormRef" class="middle in" :rules="rules">
        <el-form-item prop="login_name">
          <el-input
            id="username"
            v-model="loginFormRef.login_name"
            name="username"
            :placeholder="$t('username')"
            clearable
            prefix-icon="el-icon-user"
          ></el-input>
        </el-form-item>
        <el-form-item prop="login_password">
          <el-input
            id="password"
            v-model="loginFormRef.login_password"
            name="password"
            :placeholder="$t('psd')"
            show-password
            prefix-icon="el-icon-lock"
            @keyup.enter.native="login"
          ></el-input>
        </el-form-item>
        <p style="text-align: left; margin-top: 30px;">
          <router-link to="/forgetPassword" class="forgetPassword">{{ $t("forget_psd") }}</router-link>
        </p>
        <p id="status" style="text-align: center;" :class="{ alert: status != $t('status') }">{{ status }}</p>
      </el-form>

      <!-- 登录按钮 -->
      <div class="bottom in">
        <div class="login in" @click="login">{{ $t("login") }}</div>
      </div>

      <div class="loginhr">
        <div class="loginhrhint">或使用第三方登录</div>
        <div class="loginhrpad"></div>
      </div>

      <div class="bottom in">
        <div class="login in"><a href="/be/oauth?type=qq">通过 QQ 登录</a></div>
      </div>
    </div>
  </div>
</template>

<script>
// import signup from "../views/SignUp";
import { changeSiteTitle } from "@/static/js/base";
export default {
  components: {
    // signup
  },
  data() {
    this.$i18n.locale = localStorage.getItem("lang");
    return {
      // 用户信息
      loginFormRef: {
        login_name: "",
        login_password: "",
      },
      // URL自带或事先向服务器请求的 session 值
      session: "",
      // 表单验证规则
      rules: {
        login_name: [
          { required: true, message: this.$t("username_tip"), trigger: "blur" },
          { min: 2, max: 32, message: this.$t("username_msg"), trigger: "blur" },
        ],
        login_password: [
          { required: true, message: this.$t("psd_tip"), trigger: "blur" },
          { min: 6, max: 64, message: this.$t("psd_msg"), trigger: "blur" },
        ],
      },
      // 登录状态
      status: this.$t("status"),
      // 视频列表是否属于加载状态的判断
      loading: false,
    };
  },
  created() {
    // 初始化页面名为 login
    this.$store.commit("changeBgc", "login");
    // 修改网站标题
    //document.title = this.$t("login") + " - PatchyVideo";
    changeSiteTitle(this.$t("login"));
  },
  mounted() {
    // 从URL获取session值
    this.session = this.$route.query.session || "";
  },
  methods: {
    open2() {
      this.$message({
        message: this.$t("login_success_msg"),
        type: "success",
      });
    },

    open3() {
      this.$message({
        message: this.$t("login_fail_msg"),
        type: "warning",
      });
    },

    // 用户登录
    login() {
      // 先使页面出于加载状态
      this.loading = true;

      // 表单验证
      this.$refs.loginFormRef.validate(async (valid) => {
        if (valid) {
          // 验证成功，先获取 session
          await this.getSession();
          // 请求登录
          this.axios({
            method: "post",
            url: "be/login.do",
            data: {
              username: this.loginFormRef.login_name,
              password: this.loginFormRef.login_password,
              session: this.session,
            },
          })
            .then((result) => {
              if (result.status == 200) {
                if (result.data.status == "SUCCEED") {
                  this.open2();
                  this.$store.commit("getUserName", this.loginFormRef.login_name);
                  this.$store.commit("getUserAvatar", result.data.data.image);
                  this.$store.commit("changeifTruelyLogin", 1);
                  // 加载结束,加载动画消失
                  this.loading = false;
                  // 利用 cookie 储存登录状态
                  this.setCookie(this.loginFormRef.login_name, result.data.data.image, 7);
                  // 如果是从登录按钮跳转到本界面，回到上一个页面
                  if (this.$store.state.ifRouter == 0) {
                    this.$store.commit("changeifRouter", "2");
                    this.$router.go(-1);
                  }
                  // 如果是从路由守卫跳转到本界面，进入下一个页面
                  else if (this.$store.state.ifRouter == 1) {
                    this.$store.commit("changeifRouter", "2");
                    let path = this.$store.state.routerPath;
                    let query = this.$store.state.routerparams;
                    // 因为发布视频有参数传入的可能,所以做特别的兼容性调整
                    if (path == "/postvideo") {
                      this.$router.push({ path: path, query: query });
                    } else {
                      this.$router.push({ path: path });
                    }
                  }
                  // 如果是从其他地方跳转到本界面，回到 home 页面
                  else {
                    this.$store.commit("changeifRouter", "2");
                    this.$router.push({ path: "/home" });
                  }
                } else {
                  this.loading = false;
                  this.open3();
                }
              } else {
                this.status = this.$t("request_failed");
              }
            })
            .catch(() => {
              this.loading = false;
              this.open3();
              this.status = this.$t("net_err");
            });
        } else {
          this.status = "error submit!!";
          // 加载结束,加载动画消失
          this.loading = false;
          return false;
        }
      });
    },
    // 获取session
    async getSession() {
      // 如URL无session，则从后端获取
      if (!this.session) {
        await this.axios({
          method: "post",
          url: "be/auth/get_session.do",
          data: {
            type: "LOGIN",
          },
        })
          .then((result) => {
            this.session = result.data.data;
          })
          .catch(() => {
            this.loading = false;
            this.open3();
            this.status = this.$t("net_err");
          });
      }
    },
    // 设置 cookie
    // 储存变量为 username, userAvatar
    setCookie(username, userAvatar, days) {
      let date = new Date(); // 获取时间
      date.setTime(date.getTime() + 24 * 60 * 60 * 1000 * days); // 保存的天数
      // 字符串拼接 cookie
      window.document.cookie = "username" + ":" + username + ";path=/;expires=" + date.toUTCString();
      window.document.cookie = "userAvatar" + "=" + userAvatar + ";path=/;expires=" + date.toUTCString();
    },
  },
};
</script>

<style scoped>
.loginPic {
  height: 100%;
  width: 100%;
  background-color: #fff;
  /* background: url("/static/img/login.jpg") no-repeat top center; */
  /* background-position: 200px 0; */
  background-size: cover;
  background-attachment: fixed;
  /* background-color: #646257; */
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
.login > a {
  color: #fff;
}
.login:hover {
  cursor: pointer;
  background: #ff7792;
}

.forgetPassword {
  color: #909399;
  cursor: pointer;
}
.forgetPassword:hover {
  color: #409eff;
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

.loginhr {
  height: 14px;
  position: relative;
}
.loginhrhint {
  position: absolute;
  top: 0;
  z-index: 2;
  left: 50%;
  background-color: #fff;
  color: #888;
  text-align: center;
  -webkit-transform: translate(-50%, 0);
  transform: translate(-50%, 0);
  padding: 0 10px;
}
.loginhrpad {
  border-bottom: 1px solid #dedfe0;
  position: relative;
  top: -3px;
  left: 0;
  width: 100%;
  height: 14px;
  z-index: 1;
}
</style>
