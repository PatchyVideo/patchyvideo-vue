<!--    vue页面：PostVideo.vue     -->
<!--
    页面：paychyvideo的视频上传页面
    功能：用户可以上传视频
    包含组件：TopNavbar.vue、Foot.vue、PostSingleVideo.vue、PostMultiVideos.vue
    其他说明：1.用户必须登录才能进入此页面；2.本页面暂时只支持a站，b站，n站，推特和油管的视频上传
    更新日志：
    1/18/2020：
      release
-->

<template>
  <div>
    <topnavbar />

    <!-- PostVideo页面的正文 -->
    <div class="w main-page-background-img">
      <el-tabs v-model="activeName" type="card" @tab-click="handleClick" class="topTabs">
        <el-tab-pane label="单个发布" name="first">
          <PostSingleVideo></PostSingleVideo>
        </el-tab-pane>
        <el-tab-pane label="批量发布" name="second">
          <PostMultiVideos></PostMultiVideos>
        </el-tab-pane>
      </el-tabs>
    </div>

    <Footer></Footer>
  </div>
</template>

<script>
import topnavbar from "../components/TopNavbar.vue";
import Footer from "../components/Footer.vue";
import PostSingleVideo from "../components/PostSingleVideo";
import PostMultiVideos from "../components/PostMultiVideos";
export default {
  data() {
    return {
      //默认打开的标签页
      activeName: "first"
    };
  },
  created() {
    // 初始化页面名为list
    this.$store.commit("changeBgc", "postVideo");
    // 修改网站标题
    document.title = "发布视频 - Patchyvideo";
  },
  mounted() {},
  methods: {
    // 切换标签页
    handleClick(tab, event) {}
  },
  components: { topnavbar, Footer, PostSingleVideo, PostMultiVideos }
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