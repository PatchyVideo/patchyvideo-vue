<!--    vue页面：PostVideo.vue     -->
<!--
    页面：paychyvideo的视频列表创建页面
    功能：用户可以创建视频列表
    包含组件：TopNavbar.vue、Foot.vue
    其他说明：1.用户必须登录才能进入此页面
    更新日志：
    1/22/2020：
      release
-->

<template>
  <div>
    <topnavbar />

    <!-- PostVideo页面的正文 -->
    <div class="w main-page-background-img">
      <el-tabs v-model="activeName" type="card" @tab-click="handleClick" class="topTabs">
        <el-tab-pane label="创建新列表" name="first">
          <createNewList></createNewList>
        </el-tab-pane>
        <el-tab-pane label="导入已有列表" name="second">
          <leadInExistingList></leadInExistingList>
        </el-tab-pane>
      </el-tabs>
    </div>

    <Footer></Footer>
  </div>
</template>

<script>
import topnavbar from "../components/TopNavbar.vue";
import Footer from "../components/Footer.vue";
import createNewList from "../components/CreateNewList";
import leadInExistingList from "../components/LeadInExistingList";
export default {
  data() {
    return {
      //默认打开的标签页
      activeName: "first"
    };
  },
  created() {
    // 初始化页面名为list
    this.$store.commit("changeBgc", "createVideoList");
    // 修改网站标题
    document.title = "创建播放列表 - Patchyvideo";
  },
  mounted() {},
  methods: {
    // 切换标签页
    handleClick(tab, event) {}
  },
  components: { topnavbar, Footer, createNewList, leadInExistingList }
};
</script>

<style scoped>
.w {
  text-align: left;
}
.main-page-background-img {
  /* background-image: url("./../static/img/imoto3.jpg"); */
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