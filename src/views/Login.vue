<template>
  <div
    :class="{ 'h-full w-full': true, 'absolute bg-top bg-cover bg-fixed': pic }"
    :style="pic ? 'background-image:url(' + require('../static/img/tb.jpg') + ')' : ''"
  >
    <div
      :class="{ 'table absolute h-full w-full': true, 'bg-white bg-opacity-50': pic, 'bg-purple-100': !pic }"
      :style="pic ? 'backdrop-filter:blur(1px)' : ''"
    >
      <div class="table-cell align-middle">
        <div class="flex justify-center items-center top-0 mx-auto">
          <!-- 登录框正文 -->
          <div v-loading="loading" class="relative block md:rounded-lg mt-5 py-12 px-4 md:px-8 md:shadow-lg w-full max-w-md bg-white">
            <!-- 标题 -->
            <div class="flex justify-between mx-2">
              <h1 class="text-xl font-semibold text-pink-400">
                <router-link to="/home">PatchyVideo</router-link>
              </h1>
              <h1 class="text-xl text-gray-300">
                <router-link v-t="'login'" class="text-gray-500" :to="session ? '/login?session=' + session : '/login'"></router-link> /
                <router-link v-t="'signup'" class="text-gray-400 hover:text-gray-500" :to="session ? '/signup?session=' + session : '/signup'"></router-link>
              </h1>
            </div>

            <!-- 输入账号和密码的框 -->
            <form class="flex flex-wrap mt-6" @submit.prevent="login">
              <div class="flex flex-col w-full mb-5">
                <input
                  v-model="loginFormRef.login_name"
                  name="username"
                  type="text"
                  class="Uinput px-3 py-2 w-full rounded-lg border-2 border-gray-300 focus:outline-none focus:border-pink-400"
                  :aria-label="$t('username')"
                  required
                  autocomplete="off"
                  @keypress.enter.prevent="$refs.pw.focus()"
                />
                <div
                  v-t="'username'"
                  :class="{
                    'Ulabel absolute rounded text-gray-600 overflow-hidden pointer-events-none transform duration-150': true,
                    'translate-x-2 -translate-y-3 scale-75 bg-white px-1 py-0 m-0': loginFormRef.login_name,
                    'px-4 py-2': !loginFormRef.login_name,
                  }"
                  aria-hidden="true"
                ></div>
              </div>
              <div class="flex flex-col w-full mb-3">
                <input
                  ref="pw"
                  v-model="loginFormRef.login_password"
                  name="password"
                  type="password"
                  class="Uinput px-3 py-2 w-full rounded-lg border-2 border-gray-300 focus:outline-none focus:border-pink-400"
                  :aria-label="$t('psd')"
                  required
                  autocomplete="off"
                  @keypress.enter.prevent="login"
                />
                <div
                  v-t="'psd'"
                  :class="{
                    'Ulabel absolute rounded text-gray-600 overflow-hidden pointer-events-none transform duration-150': true,
                    'translate-x-2 -translate-y-3 scale-75 bg-white px-1 py-0 m-0': loginFormRef.login_password,
                    'px-4 py-2': !loginFormRef.login_password,
                  }"
                  aria-hidden="true"
                ></div>
              </div>
              <div class="flex w-full justify-between items-center mx-2 mb-3 font-light text-sm text-gray-600">
                <router-link to="/forgetPassword">{{ $t("forget_psd") }}</router-link>
                <span :class="{ 'text-right': true, 'font-semibold text-red-500': status != $t('status') }">{{ status }}</span>
              </div>
              <div class="flex w-full">
                <input type="submit" :value="$t('login')" class="w-full py-2 bg-pink-200 hover:bg-pink-300 text-pink-500 rounded shadow-md cursor-pointer" />
              </div>
            </form>

            <div class="relative h-6 my-4">
              <div class="relative border-b border-gray-300 left-0 w-full h-6" style="top:-0.625rem"></div>
              <div v-t="'loginhr'" class="absolute top-0 bg-white text-gray-500 text-center transform -translate-x-1/2 px-2" style="left:50%"></div>
            </div>

            <div class="mx-4 flex">
              <div class="border rounded-full p-1 m-0 w-10 h-10 text-gray-500"><a v-t="'loginvia.qq'" href="/be/oauth?type=qq"></a></div>
            </div>
          </div>
        </div>
      </div>

      <div class="loginhr">
        <div v-t="'loginhr'" class="loginhrhint"></div>
        <div class="loginhrpad"></div>
      </div>

      <div class="bottom in">
        <div class="login in"><a v-t="'loginvia.qq'" href="/be/oauth?type=qq"></a></div>
      </div>
    </div>
    <div v-if="pic" class="absolute bottom-0 left-0 ml-4 mb-2 text-white">
      <a href="https://twitter.com/u_u_zan" target="_blank" rel="noopener noreferrer" style="text-shadow:0 1px 5px hsla(0,0%,0%,.8),0 1px 10px hsla(0,0%,0%,.8)"
        >BG Author:
        <img
          class="inline rounded-full w-6 h-6 mx-1"
          alt="羽々斬"
          src="data:image/png;base64,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"
        />羽々斬 (@u_u_zan)</a
      >
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
      // 登录状态
      status: this.$t("status"),
      // 视频列表是否属于加载状态的判断
      loading: false,
      pic: localStorage.getItem("settings.theme.background.enableImageBackground"),
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
    async login() {
      // 先使页面出于加载状态
      this.loading = true;
      this.status = "";

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
              this.setUser(this.loginFormRef.login_name, result.data.data.image);
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
    },
    // 获取session
    async getSession() {
      // 如URL无session，则从后端获取
      if (!this.session) {
        try {
          const result = await this.axios({
            method: "post",
            url: "be/login.do",
            data: {
              username: this.loginFormRef.login_name,
              password: this.loginFormRef.login_password,
              session: this.session,
            },
          });
          this.session = result.data.data;
        } catch (e) {
          this.loading = false;
          this.open3();
          this.status = this.$t("net_err");
        }
      }
    },
    setUser(username, avatar) {
      const userInfo = JSON.parse(localStorage.getItem("userInfo") || "{}");
      userInfo.username = username;
      userInfo.avatar = avatar;
      localStorage.setItem("userInfo", JSON.stringify(userInfo));
    },
  },
};
</script>

<style lang="postcss" scoped>
.Uinput:focus ~ .Ulabel {
  @apply translate-x-2 -translate-y-3 scale-75 bg-white px-1 py-0 m-0 text-pink-400;
}
</style>
