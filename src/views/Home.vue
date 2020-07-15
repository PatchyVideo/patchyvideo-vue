<template>
  <div>
    <topnavbar />
    <!-- home页面的正文 -->
    <el-tabs v-model="activeName" type="border-card">
      <el-tab-pane :label="labelInfo[0]" name="first">
        <i :class="{ 'el-icon-s-grid': flag, 'el-icon-menu': !flag }" @click="changeLine"></i>
        <homemain v-if="activeName === 'first' && !flag"></homemain>
        <girdhomemain v-if="activeName === 'first' && flag"></girdhomemain>
      </el-tab-pane>
      <el-tab-pane v-if="isLogin()" :label="labelInfo[1]" name="second">
        <subscribed v-if="activeName === 'second'"></subscribed>
      </el-tab-pane>
    </el-tabs>
    <Footer></Footer>
  </div>
</template>

<script>
import topnavbar from "@/components/main/bar/TopNavbar";
import Footer from "@/components/main/bar/Footer";
import subscribed from "@/components/main/home/Subscribed";
import homemain from "@/components/main/home/Home";
import girdhomemain from "@/components/main/home/HomeGird";
export default {
  components: {
    topnavbar,
    Footer,
    subscribed,
    homemain,
    girdhomemain,
  },
  data() {
    this.$i18n.locale = localStorage.getItem("lang");
    return {
      activeName: "first",
      // true 表示网格视图，false 表示列表视图
      flag: false,
      label: [this.$t("home")],
      labelInfo: [this.$t("home"), this.$t("Subscribed")],
    };
  },
  computed: {},
  watch: {
    $route() {
      this.activeName = "first";
    },
  },
  created() {
    switch (this.$store.state.homeVideoDisplayStatus) {
      case 0:
        this.flag = false;
        break;
      case 1:
        this.flag = true;
        break;
    }
  },
  mounted() {},
  updated() {},
  methods: {
    isLogin() {
      return !!this.$store.state.username;
    },
    // 切换网格/列表视图
    changeLine() {
      const flag = !this.flag;
      // 1 表示网格，0 表示列表
      localStorage.setItem("homeVideoDisplayStatus", flag + 0);
      this.$store.commit("changeHomeVDS", flag + 0);
      location.reload();
    },
  },
};
</script>

<style lang="less" scoped>
/deep/ .el-tabs__header,
.is-top {
  width: 100% !important;
  margin: auto;
}
/deep/ .el-tabs__nav-scroll {
  width: 80% !important;
  margin: auto;
}

.main-page-background-img {
  background-repeat: no-repeat;
  min-height: 800px;
  width: 85%;
  margin-top: 20px;
}

.blacklist_prompt {
  font-size: 14px;
  color: #606266;
}
i {
  position: absolute;
  font-size: 30px;
  top: 71px;
  right: 80px;
}
</style>
