<template>
  <div>
    <topnavbar />

    <el-tabs v-model="activeName" type="border-card">
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
import topnavbar from "@/components/main/bar/TopNavbar";
import Footer from "@/components/main/bar/Footer";
import tagconhis from "@/components/tag/cont/History";
import tagconlist from "@/components/tag/cont/Ranking";
export default {
  components: {
    tagconhis,
    tagconlist,
    topnavbar,
    Footer,
  },
  data() {
    this.$i18n.locale = localStorage.getItem("lang");
    return {
      activeName: "first",
      label: [this.$t("label")],
      labelInfo: [this.$t("history"), this.$t("contribution")],
    };
  },
  computed: {},
  watch: {
    $route() {
      this.activeName = "first";
    },
  },
  created() {},
  mounted() {},
  updated() {},
  methods: {},
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
