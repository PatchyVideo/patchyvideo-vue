<!--

	组件：管理员页面
	更新日志：
	2/16/2020:
	待完成
-->

<template>
  <div>
    <topnavbar></topnavbar>

    <!-- 管理员身份验证界面 -->
    <div
      v-if="!admin"
      v-loading="!admin"
      class="adminloading"
      :element-loading-text="$t('_common.global_text.loading')"
      element-loading-spinner="el-icon-loading"
    ></div>

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

      <!-- 字幕识别列队 -->
      <el-tab-pane label="字幕识别列队" name="ocrlist" :lazy="true">
        <OCRList></OCRList>
      </el-tab-pane>
    </el-tabs>
    <Footer></Footer>
  </div>
</template>

<script>
import topnavbar from "@/components/main/bar/TopNavbar";
import Footer from "@/components/main/bar/Footer";
import usermanagemennt from "@/components/admin/UserManagement";
import logview from "@/components/admin/LogView";
import parasettings from "@/components/admin/ParaSettings";
import OCRList from "@/components/admin/OCRList";

export default {
  components: {
    topnavbar,
    Footer,
    usermanagemennt,
    logview,
    parasettings,
    OCRList,
  },
  data() {
    this.$i18n.locale = localStorage.getItem("lang");
    return {
      activeName: "second",
      admin: false,
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
        data: {},
      }).then((ret) => {
        let status = ret.data.data.access_control.status;
        if (status !== "admin") {
          this.$router.push({ path: "*" });
        } else {
          this.admin = true;
        }
      });
    },
  },
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
