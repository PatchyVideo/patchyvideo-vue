<template>
  <div>正在拉取用户信息……</div>
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
      }
      if (this.$store.state.ifRouter == 0) {
        // 如果是从登录按钮跳转到本界面，回到上一个页面
        this.$store.commit("changeifRouter", "2");
        this.$router.go(-1);
      } else if (this.$store.state.ifRouter == 1) {
        // 如果是从路由守卫跳转到本界面，进入下一个页面
        this.$store.commit("changeifRouter", "2");
        let path = this.$store.state.routerPath;
        let query = this.$store.state.routerparams;
        // 因为发布视频有参数传入的可能,所以做特别的兼容性调整
        if (path == "/postvideo") {
          this.$router.push({ path: path, query: query });
        } else {
          this.$router.push({ path: path });
        }
      } else {
        // 如果是从其他地方跳转到本界面，回到 home 页面
        this.$store.commit("changeifRouter", "2");
        this.$router.push({ path: "/home" });
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
