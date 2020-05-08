<!--    vue页面：ContributionLogs.vue     -->
<!--
    页面：paychyvideo的标签编辑历史和贡献排行榜
    功能：展示网站标签编辑历史和贡献排行榜
    包含组件：
    其他说明：
    更新日志：
      3/27/2020:
        建立
    ★待解决问题：
      1. 
-->

<template>
  <div>
    <topnavbar />

    <el-tabs type="border-card" v-model="activeName" @tab-click="handleClick">
      <el-tab-pane :label="labelInfo[0]" name="first">
        <tagconhis v-if="activeName === 'first'"></tagconhis>
      </el-tab-pane>
      <el-tab-pane :label="labelInfo[1]" name="second">
        <tagconlist v-if="activeName === 'second'"></tagconlist>
      </el-tab-pane>
    </el-tabs>
    <Footer></Footer>
  </div>
</template>

<script>
import topnavbar from "../components/TopNavbar.vue";
import tagconhis from "../components/TagContributeHistory.vue";
import tagconlist from "../components/TagContributorRanking.vue";
import Footer from "../components/Footer.vue";
export default {
  data() {
    this.$i18n.locale = localStorage.getItem("lang");
    return {
      activeName: "first",
      label: ["历史和贡献"],
      labelInfo: ["标签编辑历史", "标签贡献排行榜"]
    };
  },
  created() {},
  computed: {},
  mounted() {},
  updated() {},
  methods: {
    handleClick(e) {}
  },
  watch: {
    $route(newV, oldV) {
      this.activeName = "first";
    }
  },
  components: {
    tagconhis,
    tagconlist,
    topnavbar,
    Footer
  }
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
</style>
