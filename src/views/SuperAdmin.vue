<!--
 * @Author: your name
 * @Date: 2020-03-01 13:02:28
 * @LastEditTime: 2020-03-01 19:09:54
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \patchyvideo-vue\src\views\SuperAdmin.vue
 -->

<!--

    组件：管理员页面
    更新日志：
    2/16/2020:
    待完成
-->

<i18n>
{
  "CHS": {
    "user_management":"用户管理",
    "log_view":"日志查看",
    "para_settings":"网站参数设置",
    "scripts":"网站脚本"
  },
  "ENG": {
    "user_management":"User management",
    "log_view":"Log view",
    "para_settings":"Site parameter settings",
    "scripts":"Web site scripts"
  }
}
</i18n>


<template>
  <div>
    <topnavbar></topnavbar>
    <el-container>
      <el-header>
        Header
        <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane :label="$t('user_management')" name="first">
            <usermanagemennt></usermanagemennt>
          </el-tab-pane>
          <el-tab-pane :label="$t('log_view')" name="second">{{$t('log_view')}}</el-tab-pane>
          <el-tab-pane :label="$t('para_settings')" name="third">{{$t('para_settings')}}</el-tab-pane>
          <el-tab-pane :label="$t('scripts')" name="fourth">{{$t('scripts')}}</el-tab-pane>
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