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
    if (JSON.stringify(this.$store.state.username) != "null" && this.$store.state.username != "") {
      // logout
      this.axios({
        method: "post",
        url: "/be/logout.do",
        data: {},
      }).then(() => {
        // 清除所有 session 值(退出登录)
        sessionStorage.clear();
        // 清除用户名
        this.$store.commit("clearUserName");
        // 清除本地数据
        localStorage.removeItem("userInfo");
        // 清除 cookie
        this.clearCookie();
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
        this.setUser(result.data.data.profile.username, result.data.data.profile.image);
        // login successful, redirect to home page
        this.$router.push({ path: "/home" });
      } else {
        // unable to acquire user info, redirect to login page
        this.$router.push({ path: "/login" });
      }
    });
  },
  methods: {
    setUser(username, avatar) {
      const userInfo = JSON.parse(localStorage.getItem("userInfo") || "{}");
      userInfo.username = username;
      userInfo.avatar = avatar;
      localStorage.setItem("userInfo", JSON.stringify(userInfo));
    },
  },
};
</script>

<style scoped></style>
