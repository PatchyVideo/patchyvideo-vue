<!--    vue页面：List.vue     -->
<!--
    页面：paychyvideo的播放列表页面
    功能：展示网站收录的所有视频列表
    包含组件：TopNavbar.vue、Foot.vue
    更新日志：
    12/27/2019: v1.0 
      release
    1/9/2020: v1.0.1
      1.解决了图片连接的问题
      2.修改了当前页面下的网站标题
    1/30/2020：v1.0.2
      1.加入了列表搜索排序功能
      2.视频列表效果更新，现在视频列表每行上对齐
    2/1/2020：v1.0.3
      1.创建播放列表的功能更新
    ★待解决问题：
      暂无
-->
<template>
  <div>
    <topnavbar />

    <!-- list页面的正文 -->
    <div class="w main-page-background-img" v-loading="loading">
      <div class="content">
        <!-- 视频列表介绍 -->
        <!--<div class="deemo shadow">
          <div class="d_t">
            <img src="../static/img/4.png" style="float:left" />
            <img src="../static/img/3.png" style="float:right" />
            <p>
              Playlists help people organize videos of the same series or have other attributes in common that require order.
              <br />Use playlist ONLY IF order is a must, otherwise using tags falls better in line with the site's design.
              <br />播放列表功能的核心是为视频提供顺序，如果顺序不是必须要求则使用tag是更好的选择。
            </p>-->
            <el-button
              type="primary"
              plain
              class="createPlayListButton"
              @click="createVideoList"
            >创建播放列表</el-button>
      <!--    </div>
        </div>-->

        <div class="recommend">
          <!-- 排序选择框 -->
          <div id="select-order" class="head">
            <el-input
              placeholder="搜索列表..."
              v-model="listSearch"
              clearable
              class="inputbox"
              @keyup.enter.native="searchList()"
            >
              <el-button slot="append" icon="el-icon-search" @click="searchList()">搜索</el-button>
            </el-input>
            <el-select v-model="couponSelected" class="select">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </div>
          <!-- 视频列表列表 -->
          <div class="videolistlist">
            <p
              v-if="videolist.length==0"
              style="display:inline-block;margin:0 auto;margin-top:10px;"
            >没有搜索到视频列表</p>
            <div class="minbox shadow" v-for="item in videolist" :key="item._id.$oid">
              <!-- 视频列表标题 -->
              <div class="re_top">
                <h2>
                  <router-link
                    :to="{ path: '/listdetail', query: { id: item._id.$oid } }"
                    tag="a"
                  >{{ item.title.english }}</router-link>
                </h2>
                <h5 style="float: right;">共{{ item.videos }}个视频</h5>
              </div>
              <!-- 视频列表详情 -->
              <div class="re_video">
                <div class="re_video_img">
                  <el-image :src="'/images/covers/'+item.cover" fit="contain"></el-image>
                </div>
                <div class="re_video_desc">
                  <p>
                    <strong>{{ item.desc.english }}</strong>
                  </p>
                </div>
              </div>
              <p class="minbox_creater">
                作者：
                <router-link
                  :to="'/users/'+item.user_detail._id.$oid"
                >{{ item.user_detail.profile.username }}</router-link>
              </p>
            </div>
          </div>
        </div>

        <!-- ElementUI自带的分页器 -->
        <el-pagination
          background
          class="page-selector"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          layout="jumper, prev, pager, next, sizes"
          :current-page="this.page"
          :total="this.maxcount"
          :page-size="20"
          :page-sizes="[10, 20, 30, 40]"
        ></el-pagination>
      </div>
    </div>

    <Footer></Footer>
  </div>
</template>

<script>
import topnavbar from "../components/TopNavbar.vue";
import Footer from "../components/Footer.vue";
export default {
  data() {
    return {
      // 当前页数
      page: 1,
      // 全部分页数
      maxpage: 1,
      // 每一页的视频列表数量
      count: 20,
      // 视频列表的全部数量
      maxcount: 0,
      // 请求到的视频列表列表（本页的视频列表列表）
      videolist: [],
      // 视频列表是否属于加载状态的判断
      loading: true,
      // 视频列表的排序规则
      options: [
        { value: "latest", label: "时间正序" },
        { value: "oldest", label: "时间倒序" },
        { value: "last_modified", label: "最新修改" }
      ],
      // 当前视频列表的排列顺序
      couponSelected: "",
      // 视频列表的搜索关键字
      listSearch: ""
    };
  },
  created() {
    // 初始化页面名为list
    this.$store.commit("changeBgc", "list");
    // 初始化排列顺序为最新上传排序
    this.couponSelected = this.options[0].value;
    // 获取视频列表列表
    this.getVideoList(this.page, this.count);
    // 修改网站标题
    document.title = "视频列表 - Patchyvideo";
  },
  methods: {
    // 当前播放列表的页面切换的时候调用
    handleCurrentChange(val) {
      this.page = val;
    },
    // 当前页面显示视频条数切换的时候调用
    handleSizeChange(val) {
      this.count = val;
    },
    // 请求播放列表列表数据
    getVideoList: function(e, count) {
      // 先使页面出于加载状态
      this.loading = true;

      // 请求数据
      this.axios({
        method: "post",
        url: "be/lists/all.do",
        data: { page: e, page_size: count, order: this.couponSelected }
      }).then(result => {
        this.maxcount = result.data.data.count;
        this.maxpage = result.data.data.page_count;
        this.videolist = result.data.data.playlists;

        // 加载结束,加载动画消失
        this.loading = false;

        // 回到顶部
        if ($("html").scrollTop()) {
          //动画效果
          $("html").animate({ scrollTop: 0 }, 100);
        }
      });
    },
    // 搜索列表
    searchList() {
      // 先使页面出于加载状态
      this.loading = true;

      // 请求数据
      this.axios({
        method: "post",
        url: "be/lists/search.do",
        data: {
          page: this.page,
          page_size: this.count,
          order: this.couponSelected,
          query: this.listSearch
        }
      }).then(result => {
        this.maxcount = result.data.data.count;
        this.maxpage = result.data.data.page_count;
        this.videolist = result.data.data.playlists;

        // 加载结束,加载动画消失
        this.loading = false;
      });
    },
    // 创建播放列表
    createVideoList() {
      this.$router.push({ path: "/createVideoList" });
    }
  },
  watch: {
    page(v) {
      this.getVideoList(this.page, this.count);
    },
    count(v) {
      this.getVideoList(this.page, this.count);
    },
    couponSelected(v) {
      this.getVideoList(this.page, this.count);
    }
  },
  components: { topnavbar, Footer }
};
</script>

<style scoped>
.recommend {
  display: flex;
  flex-wrap: wrap;
}
.content {
  top: 3px;
  width: 80%;
  position: relative;
  flex: 1;
  background-color: #ffffffc9;
}
.head {
  width: 100%;
  text-align: left;
}
.inputbox {
  width: 300px;
}
.select {
  float: right;
}
.main-page-background-img {
/*  background-image: url("./../static/img/imoto3.jpg");*/
  background-repeat: no-repeat;
  min-height: 800px;
  width: 85%;
  margin-top: 20px;
}
.d_t {
  width: 100%;
  margin-bottom: 0px;
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
.videolistlist {
  width: 100%;
  text-align: left;
  flex-wrap: wrap;
  display: flex;
  align-items: flex-start;
}
.minbox {
  max-width: 48%;
  flex: 0 0 calc(50% - 30px);
  text-align: center;
  margin-left: 12.5px;
  margin-right: 12.5px;
  margin-top: 30px;
}
.minbox:first-child {
  margin-top: 10px;
}
.minbox:nth-child(2) {
  margin-top: 10px;
}
.minbox_creater {
  padding-bottom: 20px;
}

.re_top {
  width: calc(100% - 20px);
  margin: 0 auto;
  margin-top: 20px;
  padding-bottom: 20px;
  border-bottom: 3px solid red;

}
.re_top h5 {
  margin-right: 5px;
}
.re_video {
  text-align: left;
  margin-left: 10px;
  margin-right: 10px;
  margin-top: 20px;
  margin-bottom: 5px;
  vertical-align: middle;
}
.re_video_img {
  display: inline-block;
  width: calc(50% - 20px);
  height: 200px;
  margin-right: 20px;
  min-width: 240px;
  min-height: 150px;
}
.re_video_img .el-image {
  display: inline-block;
  width: 100%;
  height: 100%;
}
.re_video_desc {
  width: 45%;
  height: auto;
  min-width: 270px;
  min-height: 150px;
  margin-top: 40px;
  display: inline-block;
  vertical-align: top;
  white-space: pre-wrap;
  height: 4.3rem;
}
.re_video_desc p {
  font-size: 1.2rem;
  text-align: center;
  /* 使文字变为最多显示4行，多余的使用省略号代替 */
  -webkit-line-clamp: 4;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
}

.page-selector {
  display: block;
  text-align: center;
  margin-top: 20px;
}
</style>