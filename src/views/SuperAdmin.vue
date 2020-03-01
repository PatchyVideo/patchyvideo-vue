
<!--

    组件：管理员页面
    更新日志：
    2/16/2020:
    待完成
-->


<template>
  <div>
    <topnavbar></topnavbar>
    <el-container>
      <el-header>
        Header
        <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane label="用户管理" name="first">
            <usermanagemennt></usermanagemennt>
          </el-tab-pane>
          <el-tab-pane label="日志查看" name="second">日志查看</el-tab-pane>
          <el-tab-pane label="网站参数设置" name="third">网站参数设置</el-tab-pane>
          <el-tab-pane label="网站脚本" name="fourth">网站脚本</el-tab-pane>
        </el-tabs>
      </el-header>
      <el-main></el-main>
    </el-container>
    <Footer></Footer>
  </div>
</template>

<script>
import topnavbar from "../components/TopNavbar.vue";
import Footer from "../components/Footer.vue";
import usermanagemennt from "../components/admincompoents/UserManagement.vue";
export default {
  data() {
    this.$i18n.locale = localStorage.getItem('lang');
    return {
      activeName: "second"
    };
  },
  created() {},
  methods: {
    handleClick(tab, event) {
      // console.log(tab, event);
    }
  },
  components: { topnavbar, Footer, usermanagemennt }
};
</script>

<style scoped>
.el-header,
.el-footer {
  background-color: #b3c0d1;
  color: #333;
  text-align: center;
  line-height: 60px;
}
.el-main {
  background-color: #e9eef3;
  color: #333;
  text-align: center;
  line-height: 160px;
}
</style>