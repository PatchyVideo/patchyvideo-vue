<!--    vue页面：PostVideo.vue     -->
<!--
    页面：paychyvideo的视频列表创建页面
    功能：用户可以创建视频列表
    包含组件：TopNavbar.vue、Foot.vue
    其他说明：1.用户必须登录才能进入此页面
    更新日志：
    1/22/2020：
      release
    ★待解决问题：
      暂无
-->
<template>
  <div>
    <topnavbar />

    <!-- PostVideo页面的正文 -->
    <div class="w main-page-background-img">
      <el-tabs v-model="activeName" type="card" class="topTabs">
        <el-tab-pane :label="$t('create')" name="first">
          <createNewList></createNewList>
        </el-tab-pane>
        <el-tab-pane :label="$t('import')" name="second">
          <leadInExistingList></leadInExistingList>
        </el-tab-pane>
      </el-tabs>
    </div>

    <Footer></Footer>
  </div>
</template>

<script>
import topnavbar from "@/components/main/bar/TopNavbar";
import Footer from "@/components/main/bar/Footer";
import createNewList from "@/components/playlist/edit/Create";
import leadInExistingList from "@/components/playlist/edit/LeadIn";
export default {
  components: { topnavbar, Footer, createNewList, leadInExistingList },
  data() {
    this.$i18n.locale = localStorage.getItem("lang");
    return {
      // 默认打开的标签页
      activeName: "first",
    };
  },
  created() {
    // 初始化页面名为 list
    this.$store.commit("changeBgc", "createVideoList");
    // 修改网站标题
    document.title = this.$t("title") + " - PatchyVideo";
    // 判断是否是从已有列表导入
    if (JSON.stringify(this.$route.query.exist) == "1") {
      this.activeName = "second";
    }
  },
  mounted() {},
  methods: {},
};
</script>

<style scoped>
.w {
  text-align: left;
}
.main-page-background-img {
  background-repeat: no-repeat;
  min-height: 800px;
  width: 100%;
  margin-top: 20px;
  padding: 0px;
}
.topTabs {
  margin: 0 auto;
  width: 80%;
}
</style>
