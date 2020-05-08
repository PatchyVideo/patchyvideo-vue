<!--
 * @Author: your name
 * @Date: 2020-03-01 13:02:28
 * @LastEditTime: 2020-03-01 18:25:26
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \patchyvideo-vue\src\views\PostVideo.vue
 -->
<!--    vue页面：PostVideo.vue     -->
<!--
    页面：paychyvideo的视频上传页面
    功能：用户可以上传视频
    包含组件：TopNavbar.vue、Foot.vue、PostSingleVideo.vue、PostMultiVideos.vue、PostIPFSVideo.vue 
    其他说明：1.用户必须登录才能进入此页面；2.本页面暂时只支持a站，b站，n站，推特和油管的视频上传
    更新日志：
    1/18/2020：
      release
-->
<i18n>
{
  "CHS": {
    "title":"发布视频",
    "single_release":"单个发布",
    "batch_release":"批量发布",
    "IPFS_release":"IPFS视频发布"
  },
  "ENG": {
    "title":"Post video",
    "single_release":"Single",
    "batch_release":"Batch",
    "IPFS_release":"IPFS video"
  },
  "CHT": {
    "title":"發布視頻",
    "single_release":"單個發布",
    "batch_release":"批量發布",
    "IPFS_release":"IPFS視頻發布"
  }
}
</i18n>

<template>
  <div>
    <topnavbar />

    <!-- PostVideo 页面的正文 -->
    <div class="w main-page-background-img">
      <el-tabs v-model="activeName" type="card" @tab-click="handleClick" class="topTabs">
        <el-tab-pane :label="$t('single_release')" name="first" :lazy="true">
          <PostSingleVideo></PostSingleVideo>
        </el-tab-pane>
        <el-tab-pane :label="$t('batch_release')" name="second" :lazy="true">
          <PostMultiVideos></PostMultiVideos>
        </el-tab-pane>
        <el-tab-pane :label="$t('IPFS_release')" name="third" :lazy="true">
          <PostIPFSVideo></PostIPFSVideo>
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
import PostIPFSVideo from "../components/PostIPFSVideo";
export default {
  data() {
    this.$i18n.locale = localStorage.getItem("lang");
    return {
      //默认打开的标签页
      activeName: "first"
    };
  },
  created() {
    // 初始化页面名为 list
    this.$store.commit("changeBgc", "postVideo");
    // 修改网站标题
    document.title = this.$t("title") + " - Patchyvideo";
  },
  mounted() {},
  methods: {
    // 切换标签页
    handleClick(tab, event) {}
  },
  components: {
    topnavbar,
    Footer,
    PostSingleVideo,
    PostMultiVideos,
    PostIPFSVideo
  }
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
