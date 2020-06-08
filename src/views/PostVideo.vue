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
<template>
  <div>
    <topnavbar />

    <!-- PostVideo 页面的正文 -->
    <div class="w main-page-background-img">
      <el-tabs v-model="activeName" type="card" class="topTabs">
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
import topnavbar from "@/components/main/bar/TopNavbar";
import Footer from "@/components/main/bar/Footer";
import PostSingleVideo from "@/components/video/edit/post/SingleVideo";
import PostMultiVideos from "@/components/video/edit/post/MultiVideos";
import PostIPFSVideo from "@/components/video/edit/post/IPFSVideo";
export default {
  components: {
    topnavbar,
    Footer,
    PostSingleVideo,
    PostMultiVideos,
    PostIPFSVideo,
  },
  data() {
    this.$i18n.locale = localStorage.getItem("lang");
    return {
      //默认打开的标签页
      activeName: "first",
    };
  },
  created() {
    // 初始化页面名为 list
    this.$store.commit("changeBgc", "postVideo");
    // 修改网站标题
    document.title = this.$t("title") + " - PatchyVideo";
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

<i18n folder></i18n>
