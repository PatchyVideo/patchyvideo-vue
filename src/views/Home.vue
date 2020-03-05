<!--    vue页面：Home.vue     -->
<!--
    页面：paychyvideo的主页面
    功能：展示网站收录的所有视频/展示搜索结果
    包含组件：LeftNavbar.vue、TopNavbar.vue、Foot.vue
    其他说明：显示搜索结果的时候要用query变量向页面传入关键字
    更新日志：
    12/1/2019: v1.0
      release
    12/3/2019: v1.0.1
      1.修复了页面宽度大于浏览器默认宽度的问题
      2.增加了播放列表的背景图片
      3.调整了介绍的排版，从原来的最多显示三行到现在的最多显示四行，剩下的内容使用省略号代替
    12/7/2019: v1.0.2
      1.修改了分页器设计,使用了ElementUI的标准样式,并可以调整页面显示的视频数量或者跳到某一页
      2.新增加载界面,切换页面的时候网站会有加载效果
      3.视频列表刷新(翻页,改变页面显示的视频数量)的时候会自动返回网页顶部
   12/10/2019: v1.0.3
      1.点击播放列表的时候打开新的窗口而不是在本窗口跳转页面
      2.精简了一下css的代码,修改了复制图标的css样式
    12/14/2019: v1.0.4
      1.实现了播放列表里链接的复制功能
      2.对或许视频列表的接口进行了修改，可以进行视频的排序了
    12/27/2019: v1.0.5
      1.修复了“getListVideo”方法名的拼写错误,注释进行优化
      2.去掉了“getListVideo”方法里视频列表是否第一次请求的判断
    12/29/2019: v1.0.5
      1.修复了网站链接前的小图标无法正常显示的问题,同时调整了图标间的距离
    1/8/2020：v1.0.6
      1.现在home页面也可以显示搜索结果
      2.现在播放列表进行重新排序/搜索标签时播放列表页数会跳转到第一页
    1/9/2020：v1.0.7
      1.修改了当前页面下的网站标题
    1/25/2020：v1.0.8
      1.去除了一些冗余的代码（pagechange()及其调用）
    1/27/2020：v1.0.9
      1.显示搜索结果的标签数量进行了优化
    1/29/2020：v1.0.10
      1.对搜索关键字出现非法字符的情况进行了兼容
    2/5/2020：v1.0.11
      1.页面中文优化
    2/7/2020：v1.0.12
      1.新增“输入的查询不能与NOT连用”的错误情况
    2/9/2020：v1.0.13
      1.优化了搜索逻辑，不会在出现请求多次相同接口的情况。
    ★待解决问题：
      1.播放列表里链接的复制功能因为涉及到对dom的直接操作，所以可能会有被抓住漏洞的风险
-->

<i18n>
{
  "CHS": {
    "page_count": "显示 {count} / {maxcount} 个视频",
    "no_result": "没有搜索到视频",
    "show_deleted": "显示已失效视频",
    "blacklist_prompt": "*已屏蔽含有敏感标签的视频，可在个人界面设置",
    "latest": "发布时间正序",
    "oldest": "发布时间倒序",
    "latest_video": "原视频上传时间正序",
    "oldest_video": "原视频上传时间倒序",
    "popular_tags": "热门标签",
    "search_result": "搜索结果 - {result}",
    "syntax_error": "查询语法错误！",
    "syntax_error_not": "所输入的查询不能与NOT连用！"
  },
  "ENG": {
    "page_count": "Showing {count} / {maxcount} videos",
    "no_result": "No video found",
    "show_deleted": "Show deleted videos",
    "blacklist_prompt": "*Some videos are blacklisted, you can change your blacklist setting in your settings panel.",
    "latest": "Latest",
    "oldest": "Oldest",
    "latest_video": "Latest Video",
    "oldest_video": "Oldest Video",
    "popular_tags": "Popular Tags",
    "search_result": "Search - {result}",
    "syntax_error": "Syntax error in query",
    "syntax_error_not": "NOT cannot be used here"
  }
}
</i18n>

<template>
  <div>
    <topnavbar />

    <!-- home页面的正文 -->
    <div class="w main-page-background-img" v-loading="loading">
      <left_navbar :msg="tags"></left_navbar>

      <div class="content">
        <!-- 播放列表的抬头 -->
        <div class="video-list-header">
          <p v-if="maxcount">{{$t('page_count', {count: count2, maxcount: maxcount})}}</p>
          <p v-else>{{$t('no_result')}}</p>
          <el-checkbox class="show_deleted" v-model="checked">{{$t('show_deleted')}}</el-checkbox>
          <p class="blacklist_prompt">{{$t('blacklist_prompt')}}</p>
        </div>
        <el-select id="select-order" v-model="couponSelected">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>

        <!-- 播放列表正文 -->
        <ul>
          <li class="list-item" v-for="(item) in listvideo" :key="item._id.$oid">
            <router-link
              target="_blank"
              :to="{ path: '/video', query: { id: item._id.$oid } }"
              tag="a"
            >
              <div class="video-thumbnail">
                <img :src="'/images/covers/'+item.item.cover_image" width="200px" height="125px" />
                <div class="Imgcover"></div>
              </div>
            </router-link>

            <div class="video-detail">
              <h4>
                <router-link
                  target="_blank"
                  :to="{ path: '/video', query: { id: item._id.$oid } }"
                  tag="a"
                >{{ item.item.title }}</router-link>
              </h4>
              <p>{{ item.item.desc }}</p>
              <div>
                <img
                  :src="require('../static/img/' + item.item.site + '.png')"
                  width="16px"
                  style="margin-right:2px"
                />
                <a target="_blank" :href="item.item.url">{{item.item.url}}</a>
                <i
                  @click="copyVideoLink(item.item.url)"
                  class="fa fa-copy fa-lg"
                  style="margin-left:2px"
                ></i>
              </div>
            </div>
          </li>
        </ul>

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
import left_navbar from "../components/LeftNavbar.vue";
import Footer from "../components/Footer.vue";
import { copyToClipboardText } from "../static/js/generic";
export default {
  data() {
    this.$i18n.locale = localStorage.getItem("lang");
    return {
      // 视频列表的排序规则
      options: [
        { value: "latest", label: this.$t("latest") },
        { value: "oldest", label: this.$t("oldest") },
        { value: "video_latest", label: this.$t("latest_video") },
        { value: "video_oldest", label: this.$t("oldest_video") }
      ],
      // 当前视频列表的排列顺序
      couponSelected: "",
      // 当前页数
      page: 1,
      // 全部分页数
      maxpage: 1,
      // 每一页的视频数量
      count: 20,
      // 每一页视频的真实数量
      count2: 0,
      // 视频的全部数量
      maxcount: 0,
      // 请求到的标签列表
      tags: [],
      // 请求到的视频列表（本页的视频列表）
      listvideo: [],
      // 视频列表是否属于加载状态的判断
      loading: true,
      //搜索关键字
      searchKeyWord: "",
      //是否渲染的是搜索的数据，默认false为主页数据
      ifSearch: false,
      // 判断是否执行查询,有时候页面会进行多次查询浪费资源
      /*      ifQuest: true,*/
      //判断当前页数是不是被搜索事件改变的,即：当我跳转到其他页数，此时再搜索新的关键词，新的页数会被置为1。
      //这时会触发page监听的事件，重新请求搜索的数据，因为根据关键词的改变也会重新请求的数据，会造成资源浪费。
      pageMark: false,
      //是否显示隐藏视频
      checked: false
    };
  },
  created() {
    // 初始化页面名为home
    this.$store.commit("changeBgc", "home");
    // 初始化排列顺序为最新上传排序
    this.couponSelected = this.options[0].value;
    // 获取视频列表
    /* this.getListVideo(this.page, this.count);*/
    // 改变侧导航条的标题
    this.$store.commit("changeLeftNavBarTitle", this.$t("popular_tags"));
    // 修改网站标题
    document.title = "Patchyvideo";

    // 检验传入的数据判断是否应该为搜索页
    if (JSON.stringify(this.$route.query) == "{}") {
      this.ifSearch = false;
    } else if (JSON.stringify(this.$route.query) != "{}") {
      this.searchKeyWord = this.$route.query.keyword;
      this.ifSearch = true;
      // 修改网站标题
      document.title = this.$t("search_result", { result: this.searchKeyWord });
    }
  },
  computed: {},
  mounted() {},
  updated() {},
  methods: {
    // 当前播放列表的页面切换的时候调用
    handleCurrentChange(val) {
      this.page = val;
    },
    // 当前页面显示视频条数切换的时候调用
    handleSizeChange(val) {
      this.count = val;
    },
    // 储存播放列表的信息
    listvideoToStore() {
      this.$store.commit("getwhichPage", this.page);
      this.$store.commit("getVideoObj", this.listvideo);
    },
    // 复制视频连接
    // -------------------------危险提示-------------------------
    //          此函数因为直接操纵dom可能导致网站受到攻击!
    // -------------------------危险提示-------------------------
    // 此外，此函数在其他页面也有调用，在优化的时候请注意其他页面的同步
    copyVideoLink: function(url) {
      this.$alert(
        "视频链接复制" + (copyToClipboardText(url) ? "成功！" : "失败！"),
        "分享链接",
        {
          confirmButtonText: "确定"
        }
      );
    },
    // 请求播放列表数据
    getListVideo: function(e, count, order) {
      // 先使页面出于加载状态

      this.loading = true;

      // 请求数据
      this.axios({
        method: "post",
        url: "/be/listvideo.do",
        data: {
          page: e,
          page_size: count,
          order: this.couponSelected,
          hide_placeholder: !this.checked,
          lang: localStorage.getItem("lang")
        }
      }).then(result => {
        this.maxcount = result.data.data.count;
        //取得总页数制作分页
        this.maxpage = Math.ceil(result.data.data.count / count);
        this.$store.commit("getMaxPage", this.maxpage);
        this.listvideo = result.data.data.videos;
        this.tags = result.data.data.tags;
        this.count2 = result.data.data.videos.length;

        // 加载结束,加载动画消失
        this.loading = false;

        // 回到顶部
        if ($("html").scrollTop()) {
          //动画效果
          $("html").animate({ scrollTop: 0 }, 100);
        }
      });
    },
    // 请求搜索结果列表
    getSearchData: function(e, count, str) {
      // 如果不需要查询则不查询直接返回
      /*  if (!this.ifQuest) {
        this.ifQuest = true;
        return;
      }*/
      this.loading = true;
      this.$store.commit("getTopNavbarSearching", this.searchKeyWord);
      this.axios({
        method: "post",
        url: "be/queryvideo.do",
        data: {
          page: e,
          page_size: count,
          order: this.couponSelected,
          hide_placeholder: !this.checked,
          query: str,
          qtype: this.$route.query.qtype,
          lang: localStorage.getItem("lang")
        }
      }).then(result => {
        if (result.data.status == "SUCCEED") {
          this.maxcount = result.data.data.count;
          //取得总页数制作分页
          this.maxpage = Math.ceil(result.data.data.count / count);
          this.listvideo = result.data.data.videos;
          this.tags = result.data.data.tags;
          this.count2 = result.data.data.videos.length;
          //当前页数大于搜索Tag页数时需要重新请求正确的页数数据,现暂时无用注释掉待观察
          if (0) {
            // if (result.data.data.videos.length == 0) {
            //   this.axios({
            //     method: "post",
            //     url: "be/queryvideo.do",
            //     data: {
            //       page: this.maxpage,
            //       page_size: 20,
            //       order: this.couponSelected,
            //       query: str
            //     }
            //   }).then(res => {
            //     this.maxcount = res.data.data.count;
            //     //取得总页数制作分页
            //     this.maxpage = Math.ceil(res.data.data.count / count);
            //     this.listvideo = res.data.data.videos;
            //     this.tags = res.data.data.tags;
            //     this.loading = false;
            //   });
            // }
          }
        } else {
          // 包含非法字符的时候
          if (result.data.data.reason == "INCORRECT_QUERY") {
            this.$message({
              message: this.$t("syntax_error"),
              type: "error"
            });
          }
          // NOT使用错误的时候
          else if (result.data.data.reason == "FAILED_NOT_OP") {
            this.$message({
              message: this.$t("syntax_error_not"),
              type: "error"
            });
          }
        }
        this.loading = false;

        // 回到顶部
        if ($("html").scrollTop()) {
          //动画效果
          $("html").animate({ scrollTop: 0 }, 100);
        }
      });
    }
  },

  watch: {
    page(v) {
      //如果为True说明是搜索数据导致的页数改变，并且如果当前页数是1的话，取消这一次数据请求
      if (this.pageMark === true && this.page === 1) {
        this.pageMark = false;
        return;
      }
      if (this.ifSearch === false) {
        this.getListVideo(this.page, this.count);
        return;
      }
      if (this.ifSearch === true) {
        this.getSearchData(this.page, this.count, this.searchKeyWord);
        return;
      }
    },
    count(v) {
      //如果为True说明是搜索数据导致的页数改变，并且如果当前页数是1的话，取消这一次数据请求
      if (this.pageMark === true && this.page === 1) {
        this.pageMark = false;
        return;
      }
      if (this.ifSearch === false) {
        this.getListVideo(this.page, this.count);
        return;
      }
      if (this.ifSearch === true) {
        this.getSearchData(this.page, this.count, this.searchKeyWord);
        return;
      }
    },
    listvideo() {
      this.listvideoToStore();
    },
    couponSelected() {
      this.handleCurrentChange(1);
      //如果为True说明是搜索数据导致的页数改变，并且如果当前页数是1的话，取消这一次数据请求
      if (this.pageMark === true && this.page === 1) {
        this.pageMark = false;
        return;
      }
      if (this.ifSearch === false) {
        this.getListVideo(this.page, this.count);
      }
      if (this.ifSearch === true) {
        this.getSearchData(this.page, this.count, this.searchKeyWord);
      }
    },
    ifSearch(newV, oldV) {
      /*      this.ifQuest = false;*/
      this.handleCurrentChange(1);
      //是否渲染的是搜索的数据，默认false为主页数据，清空搜索关键词
      /*      if (newV === false) {
        this.searchKeyWord = "";
        this.getListVideo(this.page, this.count);
      }
      //当监听到的ifSearch为true时，根据搜索的值渲染数据。
      if (newV === true) {
        this.getSearchData(this.page, this.count, this.searchKeyWord);
      }*/
    },
    checked() {
      if (this.ifSearch === false) {
        this.getListVideo(this.page, this.count);
        return;
      }
      if (this.ifSearch === true) {
        this.getSearchData(this.page, this.count, this.searchKeyWord);
        return;
      }
    },
    $route(newV, oldV) {
      this.handleCurrentChange(1);
      //监听路由query的值，当query的值为空时，说明默认是首页，调用this.getListVideo获取首页数据并渲染。
      if (JSON.stringify(this.$route.query) == "{}") {
        // 修改网站标题
        document.title = "Patchyvideo";
        this.ifSearch = false;
        this.getListVideo(this.page, this.count);
        return;
      }
      //监听路由query的值，当用户连续输入的搜索值不一样时，更新搜索关键词，调用 this.getSearchData获取搜索数据并渲染。
      if (
        newV.query.keyword != oldV.query.keyword ||
        newV.query.qtype != oldV.query.qtype
      ) {
        // 修改网站标题
        document.title = this.$t("search_result", {
          result: newV.query.keyword
        });
        this.ifSearch = true;
        this.searchKeyWord = newV.query.keyword;
        //在我请求新的搜索数据之后，因为搜索是路由跳转所以会重置当前页面为1，页数会改变，也会触发监控页数里的函数
        //这里做一个标记，如果是因搜索关键词而改变的页数，那么取消这一次Page页数改变而触发的请求数据事件。
        //pageMark作为监控page中是否重新请求数据的标志。
        if ((this.page = 1)) {
          this.pageMark = true;
        }
        this.getSearchData(this.page, this.count, newV.query.keyword);
        return;
      }
    }
  },
  components: { left_navbar, topnavbar, Footer }
};
</script>

<style lang="less" scoped>
.Imgcover {
  position: absolute;
  width: 100%;
  height: 100%;
  z-index: 20;
  top: 0%;
  transition: all 0.3s ease;
  &:hover {
    background-color: rgba(255, 255, 255, 0.3);
  }
}
.content {
  background-color: #ffffffc9;
}

.page-selector {
  display: block;
  text-align: center;
}

.video-detail > p {
  font-size: 1rem;
  line-height: 1.1rem;
  white-space: pre-wrap;
  overflow: hidden;
  height: 4.3rem;
  /* 使文字变为最多显示4行，多余的使用省略号代替 */
  display: -webkit-box;
  -webkit-line-clamp: 4;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}
.video-detail > div {
  position: absolute;
  bottom: 0px;
  left: 220px;
}
.video-detail {
  height: 125px;
  position: relative;
  transition: all 0.3s ease;
  &:hover {
    /*background-color: rgba(255,255,255,0.3);*/
    background-color: rgb(244, 244, 245);
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  }
}

.video-thumbnail {
  margin-right: 20px;
  float: left;
  position: relative;
  z-index: 1;
}

.list-item {
  padding-bottom: 10px;
}

.fa-copy:hover {
  color: olive;
  cursor: pointer;
}

.video-list-header p {
  display: block;
}
.show_deleted {
  text-align: center;
  line-height: 50px;
}
.video-list-header select {
  height: 25px;
  font: 12px Arial;
  padding: 1px 3px 0 3px;
  vertical-align: middle;
  margin-bottom: 1px;
  float: right;
}
.video-list-header {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  width: calc(100% - 230px);
  margin-bottom: 10px;
}

.el-select {
  width: 200px;
  float: right;
  right: 0px;
  transform: translate(0, -50px);
}
.left-navbar {
  position: relative;
  width: 15%;
  margin-right: 10px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}
:root {
  --view-height: 50px;
}
.w {
  text-align: left;
}
.main-page-background-img {
  background-repeat: no-repeat;
  min-height: 800px;
  width: 85%;
  margin-top: 20px;
}

.blacklist_prompt {
  font-size: 14px;
  color: #606266;
}
</style>
