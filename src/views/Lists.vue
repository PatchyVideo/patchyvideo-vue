<template>
  <div>
    <topnavbar />

    <!-- list页面的正文 -->
    <div class="w main-page-background-img">
      <div class="content">
        <!-- 视频列表介绍 -->
        <div class="deemo shadow">
          <div class="d_t">
            <img src="../static/img/4.png" style="float:left" />
            <img src="../static/img/3.png" style="float:right" />
            <p>
              Playlists help people organize videos of the same series or have other attributes in common that require order.
              <br />Use playlist ONLY IF order is a must, otherwise using tags falls better in line with the site's design.
              <br />播放列表功能的核心是为视频提供顺序，如果顺序不是必须要求则使用tag是更好的选择。
            </p>
            <!-- <a
              href="/lists/new"
              class="button button-glow button-border button-rounded button-primary"
            >Create New Playlist</a>-->
            <el-button type="primary" plain class="createPlayListButton">创建播放列表</el-button>
          </div>
        </div>

        <!-- 视频列表列表 -->
        <div class="recommend">
          <div class="minbox shadow">
            <div class="re_top">
              <a href="/list/5d3afaa2446f4e85bd7222ab">
                <h2>【东方MMD】【中文字幕】对了，就去XX吧</h2>
              </a>
              <h5 style="float: right;">Total 4 videos</h5>
            </div>
            <div class="re_video">
              <img
                src="/images/covers/c7f974acf6defadb7b7978f6d983da9b875f53c33fcb1c60.png"
                alt
                width="320px"
                height="200px"
                title="【东方MMD】【中文字幕】对了，就去XX吧"
              />
              <p>
                原作者：ねこぞーん さん
                忆名字幕组制作
              </p>
            </div>
            <span>
              Created by
              <a href="/users/5d39bccc10f25ebf56fd0f62">admin</a>
            </span>
          </div>
        </div>
      </div>
    </div>
    <div class="footer w">
      <p>© 2019 www.patchyvideo.com Touhou Project</p>
    </div>
  </div>
</template>

<script>
import topnavbar from "../components/TopNavbar.vue";
export default {
  data() {
    return {};
  },
  methods: {},
  components: { topnavbar }
};
</script>

<style scoped>
.content {
  top: 3px;
  width: 80%;
  position: relative;
  flex: 1;
  background-color: #ffffffc9;
}
.main-page-background-img {
  background-image: url("./../static/img/imoto3.jpg");
  background-repeat: no-repeat;
  min-height: 800px;
  width: 85%;
  margin-top: 20px;
}
.d_t {
  width: 100%;
  margin: 30px 0px;
  padding-bottom: 20px;
}
.d_t:hover {
  background-color: rgba(255, 255, 255, 0.1);
}
.d_t a {
  display: block;
  width: 300px;
  margin: auto;
}
.d_t p {
  display: block;
  width: 60%;
  color: #fb8ca2;
  text-align: center;
  padding-top: 100px;
  margin: 0px auto 30px;
}
.d_t img {
  height: 200px;
  margin: 10px;
  background-color: rgba(255, 255, 255, 0);
}
.createPlayListButton {
  width: 30%;
}
</style>