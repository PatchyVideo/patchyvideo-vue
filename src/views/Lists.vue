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

<i18n>
{
  "CHS": {
    "title":"视频列表",
    "create_playList":"创建播放列表",
    "search":{
        "input_tip":"搜索列表...",
        "btn":"搜索",
        "downlist":{
            "latest":"时间正序",
            "oldest":"时间倒序",
            "last_modified":"最近修改"
        }
    },
    "err_tip":"没有搜索到视频列表",
    "statistics":"共{count}个视频",
    "author":"作者："

  },
  "ENG": {
    "title":"playlists",
    "create_playList":"Create playlist",
    "search":{
        "input_tip":"Search list...",
        "btn":"Search",
        "downlist":{
            "latest":"Latest",
            "oldest":"Oldest",
            "last_modified":"Last Modified"
        }
    },
    "err_tip":"No playlist found",
    "statistics":"Total {count} videos",
    "author":"Creator:"
  },
  "CHT": {
    "title":"視頻列表",
    "create_playList":"創建播放列表",
    "search":{
        "input_tip":"搜索列表...",
        "btn":"搜索",
        "downlist":{
            "latest":"時間正序",
            "oldest":"時間倒序",
            "last_modified":"最近修改"
        }
    },
    "err_tip":"沒有搜索到視頻列表",
    "statistics":"共{count}個視頻",
    "author":"作者："
  }
}
</i18n>

<template>
  <div>
    <topnavbar />

    <!-- list 页面的正文 -->
    <div class="w main-page-background-img" v-loading="loading">
      <div class="content">
        <!-- 视频列表介绍 -->
        <div class="deemo shadow">
          <!-- <div class="d_t">
            <img src="../static/img/4.png" style="float:left" />
            <img src="../static/img/3.png" style="float:right" />
            <el-button
              type="primary"
              plain
              class="createPlayListButton"
              @click="createVideoList"
            >{{$t('create_playList')}}</el-button>
          </div>-->
        </div>

        <div class="recommend">
          <!-- 新建播放列表 -->
          <div id="select-order" class="head">
            <div class="d_t">
              <!--<img src="../static/img/4.png" style="float:left" />
              <img src="../static/img/3.png" style="float:right" />-->
              <el-button type="primary" plain class="createPlayListButton" @click="createVideoList">{{ $t("create_playList") }}</el-button>
            </div>
            <!-- 搜索框 -->
            <el-input :placeholder="$t('search.input_tip')" v-model="listSearch" clearable class="inputbox" @keyup.enter.native="goToSearch()">
              <el-button slot="append" icon="el-icon-search" @click="goToSearch()">{{ $t("search.btn") }}</el-button>
            </el-input>
            <!-- 排序选择框 -->
            <el-select v-model="couponSelected" @change="handleCouponChange" class="select">
              <el-option v-for="item in options" :key="item.value" :label="$t('search.downlist.' + item.value)" :value="item.value"></el-option>
            </el-select>
          </div>
          <!-- 视频列表列表 -->
          <div class="videolistlist">
            <p v-if="videolist.length == 0" style="display:inline-block;margin:0 auto;margin-top:10px;">{{ $t("err_tip") }}</p>
            <div class="minbox shadow" v-for="item in videolist" :key="item._id.$oid">
              <!-- 视频列表标题 -->
              <div class="re_top">
                <h2>
                  <router-link :to="{ path: '/listdetail', query: { id: item._id.$oid } }" tag="a">{{ item.title.english }}</router-link>
                </h2>
                <h5 style="float: right;">{{ $t("statistics", { count: item.videos }) }}</h5>
              </div>
              <!-- 视频列表详情 -->
              <div class="re_video">
                <div class="re_video_img">
                  <el-image :src="'/images/covers/' + item.cover" fit="contain"></el-image>
                </div>
                <div class="re_video_desc">
                  <p>
                    <strong>{{ item.desc.english }}</strong>
                  </p>
                </div>
              </div>
              <p class="minbox_creater">
                {{ $t("author") }}
                <router-link :to="'/users/' + item.user_detail._id.$oid">{{ item.user_detail.profile.username }}</router-link>
              </p>
            </div>
          </div>
        </div>

        <!-- ElementUI 自带的分页器 -->
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
    this.$i18n.locale = localStorage.getItem("lang");
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
      couponSelected: "latest",
      // 视频列表的搜索关键字
      listSearch: ""
    };
  },
  created() {
    // 初始化页面名为 list
    this.$store.commit("changeBgc", "list");
    // 初始化排列顺序为最新上传排序
    this.couponSelected = this.options[0].value;
    this.checkURL();
    // 修改网站标题
    document.title = this.$t("title") + " - Patchyvideo";
  },
  methods: {
    // 格式化 URL
    checkURL() {
      // 获取视频列表页数
      if (!this.$route.query.page) {
        this.page = 1;
      } else {
        this.page = parseInt(this.$route.query.page);
      }
      // 获取视频列表每页显示顺序
      if (!this.$route.query.size) {
        this.count = 20;
      } else {
        this.count = parseInt(this.$route.query.size);
      }
      // 获取视频列表每页显示顺序
      if (!this.$route.query.order) {
        this.couponSelected = "latest";
      } else {
        this.couponSelected = this.$route.query.order;
      }
      // 是否为搜索状态
      if (!this.$route.query.key) {
        this.getVideoList(this.page, this.count);
      } else {
        this.listSearch = this.$route.query.key;
        this.searchList();
      }
    },
    // 当前播放列表的页面切换的时候调用
    handleCurrentChange(val) {
      this.page = val;
      // 修改路由参数
      this.$router.push({
        path: "/lists",
        query: {
          page: this.page,
          size: this.count,
          order: this.couponSelected,
          key: this.listSearch
        }
      });
      // 是否为搜索状态
      if (!this.$route.query.key || this.$route.query.key == "") {
        this.getVideoList(this.page, this.count);
      } else {
        this.listSearch = this.$route.query.key;
        this.searchList();
      }
    },
    // 当前页面显示视频条数切换的时候调用
    handleSizeChange(val) {
      this.page = 1;
      this.count = val;
      this.$router.push({
        path: "/lists",
        query: {
          page: this.page,
          size: this.count,
          order: this.couponSelected,
          key: this.listSearch
        }
      });
      // 是否为搜索状态
      if (!this.$route.query.key || this.$route.query.key == "") {
        this.getVideoList(this.page, this.count);
      } else {
        this.listSearch = this.$route.query.key;
        this.searchList();
      }
    },
    // 当前页面视频显示顺序切换的时候调用
    handleCouponChange() {
      this.page = 1;
      this.$router.push({
        path: "/lists",
        query: {
          page: this.page,
          size: this.count,
          order: this.couponSelected,
          key: this.listSearch
        }
      });
      // 是否为搜索状态
      if (!this.$route.query.key || this.$route.query.key == "") {
        this.getVideoList(this.page, this.count);
      } else {
        this.listSearch = this.$route.query.key;
        this.searchList();
      }
    },
    // 搜索视频的时候按下搜索按钮调用
    goToSearch() {
      this.page = 1;
      this.couponSelected = "latest";
      this.$router.push({
        path: "/lists",
        query: {
          page: this.page,
          size: this.count,
          order: this.couponSelected,
          key: this.listSearch
        }
      });
      this.searchList();
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
  watch: {},
  components: { topnavbar, Footer }
};
</script>

<style scoped lang="less">
// @keyframes anim-shadow {
//   0% {
//     transform: rotate3d(0, 1, 0.01, 0);
//     background-color: #fff;
//   }
//   3% {
//     filter: blur(1px);
//     background: linear-gradient(to right bottom, transparent, #fff, #eff8fe);
//   }
//   5% {
//     filter: blur(0px);
//     background: linear-gradient(to right bottom, transparent, #fff, #def1fe);
//   }
//   8% {
//     filter: saturate(10%);
//     background: linear-gradient(to right bottom, transparent, #fff, #ceeafd);
//   }
//   10% {
//     filter: saturate(0%);
//     background: linear-gradient(to right bottom, transparent, #fff, #bde3fd);
//   }
//   15% {
//     filter: hue-rotate(1deg);
//     background: linear-gradient(to right bottom, transparent, #fff, #addcfc);
//   }
//   17% {
//     filter: hue-rotate(30deg);
//   }
//   20% {
//     filter: hue-rotate(60deg);
//     filter: brightness(0.4);
//     background: linear-gradient(to right bottom, transparent, #fff, #9dd5fc);
//   }
//   23% {
//     filter: hue-rotate(90deg);
//   }
//   25% {
//     filter: hue-rotate(120deg);
//     filter: saturate(30%);
//     transform: rotate3d(0, 1, 0.01, 10deg);
//   }
//   28% {
//     filter: hue-rotate(150deg);
//   }
//   31% {
//     filter: hue-rotate(180deg);
//   }
//   50% {
//     transform: rotate3d(0, 1, 0.01, 10deg);
//   }

//   75% {
//     transform: rotate3d(0, 1, 0.01, -10deg);
//   }
//   80% {
//     filter: hue-rotate(180deg);
//     background: linear-gradient(to right bottom, transparent, #fff, #9dd5fc);
//   }
//   85% {
//     background: linear-gradient(to right bottom, transparent, #fff, #addcfc);
//   }
//   90% {
//     background: linear-gradient(to right bottom, transparent, #fff, #bde3fd);
//   }
//   92% {
//     background: linear-gradient(to right bottom, transparent, #fff, #ceeafd);
//   }
//   95% {
//     background: linear-gradient(to right bottom, transparent, #fff, #def1fe);
//   }
//   97% {
//     filter: saturate(0);
//     background: linear-gradient(to right bottom, transparent, #fff, #eff8fe);
//   }
//   100% {
//     transform: rotate3d(0, 1, 0.1, 0deg);
//     background-color: #fff;
//     background: repeating-linear-gradient(
//       to bottom,
//       #fff 0%,
//       #fff 10%,
//       #000 10%
//     );
//   }
// }
.shadow {
  box-shadow: 0 0 15px 0 rgba(0, 0, 0, 0.1);
  border-radius: 20px;
}

.shadow:hover {
  // animation-name: anim-shadow;
  // animation-iteration-count: infinite;
  // animation-direction: alternate;
  // animation-fill-mode: forwards;
  // animation-duration: 5000ms;
}
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
  /* background-image: url("./../static/img/imoto3.jpg"); */
  background-repeat: no-repeat;
  min-height: 800px;
  width: 85%;
  margin-top: 20px;
}
.d_t {
  display: inline-block;
  width: 160px;
  margin-bottom: 0px;
  padding: 0 20px;
}
/deep/.d_t button {
  width: 100%;
  background: #409eff;
  border-color: #409eff;
  color: #fff;
  transition: all 0.4s ease;
  &:hover {
    opacity: 0.5;
  }
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
  /* 使文字变为最多显示 4 行，多余的使用省略号代替 */
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
