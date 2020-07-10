<template>
  <div></div>
</template>

<script>
export default {
  components: {},
  data() {
    this.$i18n.locale = localStorage.getItem("lang");
    return {};
  },
  created() {},
  mounted() {
    // check if user is logged in
    if (JSON.stringify(this.$store.state.username) != "null" && this.$store.state.username != "")
    {
      // logout
      this.axios({
        method: "post",
        url: "/be/logout.do",
        data: {},
      }).then(() => {
        this.isLogin = false;
        // 清除所有 session 值(退出登录)
        sessionStorage.clear();
        // 清除用户名
        this.$store.commit("clearUserName");
        // 清除本地数据
        localStorage.setItem("username", "");
        // 清除 cookie
        this.clearCookie();
        // 刷新界面
        location.reload();
        this.loading = false;
        this.dialogVisible = false;
      });
    }
    this.axios({
      method: "post",
      url: "/be/user/myprofile.do",
      data: {},
      withCredentials: true,
    }).then((result) => {
      if (result.status == 200 && result.data.status == "SUCCEED") {
        this.$store.commit("getUserName", result.data.data.profile.username);
        this.$store.commit("getUserAvatar", result.data.data.profile.image);
        this.$store.commit("changeifTruelyLogin", 1);
        // 利用 cookie 储存登录状态
        this.setCookie(result.data.data.profile.username, result.data.data.profile.image, 7);
        // login successful, redirect to home page
        this.$router.push({ path: "/home" });
      } else {
        // unable to acquire user info, redirect to login page
        this.$router.push({ path: "/login" });
      }
    });
  },
  methods: {
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

<style scoped></style>
