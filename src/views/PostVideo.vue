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
