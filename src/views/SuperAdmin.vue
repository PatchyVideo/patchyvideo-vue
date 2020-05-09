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
  },
  "CHT": {
	"user_management":"用戶管理",
	"log_view":"日誌查看",
	"para_settings":"網站參數設置",
	"scripts":"網站腳本"
  }
}
</i18n>

<template>
  <div>
    <topnavbar></topnavbar>

    <!-- 管理员身份验证界面 -->
    <div v-if="!admin" v-loading="!admin" class="adminloading" element-loading-text="少女祈祷中" element-loading-spinner="el-icon-loading"></div>

    <el-tabs v-else v-model="activeName">
      <!-- 用户管理 -->
      <el-tab-pane :label="$t('user_management')" name="first" :lazy="true">
        <usermanagemennt></usermanagemennt>
      </el-tab-pane>

      <!-- 日志查看 -->
      <el-tab-pane :label="$t('log_view')" name="second" :lazy="true">
        <logview></logview>
      </el-tab-pane>

      <!-- 网站参数设置 -->
      <el-tab-pane :label="$t('para_settings')" name="third" :lazy="true">
        <parasettings></parasettings>
      </el-tab-pane>
    </el-tabs>
    <Footer></Footer>
  </div>
</template>

<script>
import topnavbar from "../components/TopNavbar.vue";
import Footer from "../components/Footer.vue";
import usermanagemennt from "../components/admincompoents/UserManagement.vue";
import logview from "../components/admincompoents/LogView.vue";
import parasettings from "../components/admincompoents/ParaSettings.vue";
export default {
  data() {
    this.$i18n.locale = localStorage.getItem("lang");
    return {
      activeName: "second",
      admin: false
    };
  },
  created() {
    this.isAdmin();
  },
  methods: {
    // 判断当前用户是不是 Admin，不是则 404
    isAdmin() {
      this.axios({
        method: "post",
        url: "/be/user/myprofile.do",
        data: {}
      }).then(ret => {
        let status = ret.data.data.access_control.status;
        if (status !== "admin") {
          this.$router.push({ path: "*" });
        } else {
          this.admin = true;
        }
      });
    }
  },
  components: { topnavbar, Footer, usermanagemennt, logview, parasettings }
};
</script>

<style scoped>
.adminloading {
  width: 80%;
  min-height: 600px;
  margin: 0 auto;
  margin-top: 20px;
}

.el-tabs {
  width: 80%;
  margin: auto;
}
</style>
