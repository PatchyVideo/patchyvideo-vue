<!--    vue页面：PostVideo.vue     -->
<!--
    页面：paychyvideo的视频上传页面
    功能：用户可以上传视频
    包含组件：TopNavbar.vue、Foot.vue、postSingleVideo
    其他说明：1.用户必须登录才能进入此页面；2.本页面暂时只支持a站，b站，n站，推特和油管的视频上传
    更新日志：

-->

<template>
  <div>
    <topnavbar />

    <!-- PostVideo页面的正文 -->
    <div class="w main-page-background-img">
      <el-tabs v-model="activeName" type="card" @tab-click="handleClick" class="topTabs">
        <el-tab-pane label="单个发布" name="first" class="topTabsItem">
          <PostSingleVideo></PostSingleVideo>
        </el-tab-pane>
        <el-tab-pane label="批量发布" name="second">配置管理</el-tab-pane>
      </el-tabs>
    </div>

    <Footer></Footer>
  </div>
</template>

<script>
import topnavbar from "../components/TopNavbar.vue";
import Footer from "../components/Footer.vue";
import PostSingleVideo from "../components/PostSingleVideo";
export default {
  data() {
    return {
      //默认打开的标签页
      activeName: "first"
    };
  },
  methods: {
    // 切换标签页
    handleClick(tab, event) {
      console.log(tab, event);
    }
  },
  components: { topnavbar, Footer, PostSingleVideo }
};
</script>

<style scoped>
.w {
  text-align: left;
}
.main-page-background-img {
  background-image: url("./../static/img/imoto3.jpg");
  background-repeat: no-repeat;
  min-height: 800px;
  width: 85%;
  margin-top: 20px;
}
.topTabs {
  margin: 0 auto;
  width: 80%;
}
.topTabsItem {
  /* width: 500px; */
}
</style>