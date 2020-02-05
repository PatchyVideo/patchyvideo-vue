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
    ★待解决问题：
      1.播放列表里链接的复制功能因为涉及到对dom的直接操作，所以可能会有被抓住漏洞的风险
-->
<template>
  <div>
    <topnavbar />

    <!-- home页面的正文 -->
    <div class="w main-page-background-img" v-loading="loading">
      <left_navbar :msg="tags"></left_navbar>

      <div class="content">
        <!-- 播放列表的抬头 -->
        <div class="video-list-header">
          <p v-if="maxcount">显示 {{ count2 }} / {{ maxcount }} 个视频</p>
          <p v-else>没有搜索到视频</p>
          <el-select id="select-order" v-model="couponSelected">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </div>

        <!-- 播放列表正文 -->
        <ul>
          <li class="list-item" v-for="(item, index) in listvideo" :key="item._id.$oid">
            <div class="video-thumbnail">
              <!--              src="/images/covers/f5da2d4dd9eac171d47eb1100339cbad90e4648556a2f99a.png"-->
              <img :src="'/images/covers/'+item.item.cover_image" width="200px" height="125px" />
            </div>
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
                <a :href="item.item.url" :id="'link' + (index)">{{item.item.url}}</a>
                <i @click="copyVideoLink(index)" class="fa fa-copy fa-lg" style="margin-left:2px"></i>
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
import { copyToClipboard } from "../static/js/generic";
export default {
  data() {
    return {
      // 视频列表的排序规则
      options: [
        { value: "latest", label: "Latest Post  " },
        { value: "oldest", label: "Oldest Post  " },
        { value: "video_latest", label: "Latest Upload" },
        { value: "video_oldest", label: "Oldest Upload" }
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
      ifQuest: true
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
    this.$store.commit("changeLeftNavBarTitle", "热门标签");
    // 修改网站标题
    document.title = "Patchyvideo";

    // 检验传入的数据判断是否应该为搜索页
    if (JSON.stringify(this.$route.query) == "{}") {
      this.ifSearch = false;
      return;
    }
    if (JSON.stringify(this.$route.query) != "{}") {
      this.searchKeyWord = this.$route.query.keyword;
      this.ifSearch = true;
      return;
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
    copyVideoLink: function(index) {
      copyToClipboard($("#link" + index));
    },
    // 请求播放列表数据
    getListVideo: function(e, count, order) {
      // 先使页面出于加载状态
      this.loading = true;

      // 请求数据
      this.axios({
        method: "post",
        url: "/be/listvideo.do",
        data: { page: e, page_size: count, order: this.couponSelected }
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
      if (!this.ifQuest) {
        this.ifQuest = true;
        return;
      }
      this.loading = true;
      this.$store.commit("getTopNavbarSearching", this.searchKeyWord);
      this.axios({
        method: "post",
        url: "be/queryvideo.do",
        data: {
          page: e,
          page_size: count,
          order: this.couponSelected,
          query: str
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
              message: "查询语法错误！",
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
      if (this.ifSearch === false) {
        this.getListVideo(this.page, this.count);
      }
      if (this.ifSearch === true) {
        this.getSearchData(this.page, this.count, this.searchKeyWord);
      }
    },
    ifSearch(newV, oldV) {
      this.ifQuest = false;
      this.handleCurrentChange(1);
      //是否渲染的是搜索的数据，默认false为主页数据，清空搜索关键词
      if (newV === false) {
        this.searchKeyWord = "";
        this.getListVideo(this.page, this.count);
      }
      //当监听到的ifSearch为true时，根据搜索的值渲染数据。
      if (newV === true) {
        this.getSearchData(this.page, this.count, this.searchKeyWord);
      }
    },
    $route(newV, oldV) {
      this.handleCurrentChange(1);
      //监听路由query的值，当query的值为空时，说明默认是首页，调用this.getListVideo获取首页数据并渲染。
      if (JSON.stringify(this.$route.query) == "{}") {
        this.ifSearch = false;
        this.getListVideo(this.page, this.count);
        return;
      }
      //监听路由query的值，当用户连续输入的搜索值不一样时，更新搜索关键词，调用 this.getSearchData获取搜索数据并渲染。
      if (newV.query.keyword != oldV.query.keyword) {
        this.ifSearch = true;
        this.searchKeyWord = newV.query.keyword;
        this.getSearchData(this.page, this.count, newV.query.keyword);
        return;
      }
    }
  },
  components: { left_navbar, topnavbar, Footer }
};
</script>

<style scoped>
.content {
  background-color: #ffffffc9;
}

.page-selector {
  display: block;
  text-align: center;
}

.video-list-header p {
  display: inline;
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
}

.video-thumbnail {
  margin-right: 20px;
  float: left;
}

.list-item {
  padding-bottom: 10px;
}

.fa-copy:hover {
  color: olive;
  cursor: pointer;
}

.video-list-header p {
  display: inline-block;
  height: 25px;
  position: absolute;
  transform: translate(10%, 50%);
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
  width: 100%;
  height: 50px;
}

.el-select {
  width: 200px;
  display: inline-block;
  position: absolute;
  right: 0px;
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
  background-image: url("./../static/img/imoto3.jpg");
  background-repeat: no-repeat;
  min-height: 800px;
  width: 85%;
  margin-top: 20px;
}
</style>
