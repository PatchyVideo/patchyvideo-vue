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
    },
    "CHT": {
    "page_count": "顯示 {count} / {maxcount} 個視頻",
    "no_result": "沒有搜索到視頻",
    "show_deleted": "顯示已失效視頻",
    "blacklist_prompt": "*已屏蔽含有敏感標簽的視頻，可在個人界面設置",
    "latest": "發布時間正序",
    "oldest": "發布時間倒序",
    "latest_video": "原視頻上傳時間正序",
    "oldest_video": "原視頻上傳時間倒序",
    "popular_tags": "熱門標簽",
    "search_result": "搜索結果 - {result}",
    "syntax_error": "查詢語法錯誤！",
    "syntax_error_not": "所輸入的查詢不能與NOT連用！"
    }
    }
</i18n>



<template>
  <div>
    <div class="tag-box">
      <el-tag
        @click="(e) => onSitesChange()"
        style="margin: 0 5px"
        key
        :type="visibleSites.includes('') ? '' : 'info'"
      >全部</el-tag>
      <el-tag
        v-for="item in allSites"
        :key="item.id"
        style="margin: 0 5px"
        @click="(e) => onSitesChange(item.id)"
        :type="visibleSites.includes(item.id) ? '' : 'info'"
      >{{item.label}}</el-tag>
    </div>
    <div class="w main-page-background-img" v-loading="loading">
      <left_navbar :msg="tags" :name="'main'"></left_navbar>

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
            <div class="video-item">
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
                <div class="title-div">
                  <img
                    :src="require('../../static/img/' + item.item.site + '.png')"
                    width="16px"
                    style="margin-right:2px;display:inline;"
                  />
                  <h4>
                    <router-link
                      target="_blank"
                      :to="{ path: '/video', query: { id: item._id.$oid } }"
                      tag="a"
                    >{{ item.item.title }}</router-link>
                  </h4>
                </div>
                <p>{{ item.item.desc }}</p>
                <div class="link-div">
                  <a target="_blank" :href="item.item.url">{{item.item.url}}</a>
                  <i
                    @click="copyVideoLink(item.item.url)"
                    class="fa fa-copy fa-lg"
                    style="margin-left:2px"
                  ></i>
                </div>
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
  </div>
</template>

<script>
import left_navbar from "../../components/LeftNavbar.vue";

import { copyToClipboardText } from "../../static/js/generic";
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
      checked: false,
      visibleSites: [""],
      allSites: [
        { label: "Bilibili", id: "bili" },
        { label: "Nicovideo", id: "nico" },
        { label: "YouTube", id: "ytb" },
        { label: "Twitter", id: "twitter" },
        { label: "Acfun", id: "acfun" },
        { label: "站酷", id: "zcool" },
        { label: "IPFS", id: "ipfs" }
      ]
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
    this.$store.commit("changeLeftNavBarTitle", 2);
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
      var sites = "";
      const index = this.visibleSites.indexOf("");
      if (index == -1) {
        // 用户选择了某几个网站
        for (var i = 0; i < this.visibleSites.length; ++i) {
          sites += "site:" + this.visibleSites[i] + " ";
        }
        sites = "ANY(" + sites + ")";
      }
      // 请求数据
      this.axios({
        method: "post",
        url: "/be/listvideo.do",
        data: {
          page: e,
          page_size: count,
          order: this.couponSelected,
          hide_placeholder: !this.checked,
          additional_constraint: sites,
          lang: localStorage.getItem("lang")
        }
      }).then(result => {
          this.maxcount = result.data.data.count;
        //取得总页数制作分页
        this.maxpage = Math.ceil(result.data.data.count / count);
        if (this.maxpage < this.page) {
          this.page = 1;
        }
        this.$store.commit("getMaxPage", this.maxpage);
        this.listvideo = result.data.data.videos;

        /* 排序处理 */

        // 获得热门标签
        var tags = result.data.data.tags;
        var tagswithcount = result.data.data.tag_pops;
        // 排序热门标签
        var ntags = {};
        tagswithcount = Object.keys(tagswithcount)
          .sort((a, b) => tagswithcount[b] - tagswithcount[a])
          .forEach(key => {
            ntags[key] = tags[key];
          });

        this.tags = ntags;
        /* 处理结束 */

        //this.tags = result.data.data.tags;
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
      var sites = "";
      const index = this.visibleSites.indexOf("");
      if (index == -1) {
        // 用户选择了某几个网站
        for (var i = 0; i < this.visibleSites.length; ++i) {
          sites += "site:" + this.visibleSites[i] + " ";
        }
        sites = "ANY(" + sites + ")";
      }
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
          additional_constraint: sites,
          lang: localStorage.getItem("lang")
        }
      }).then(result => {
        if (result.data.status == "SUCCEED") {
          this.maxcount = result.data.data.count;
          //取得总页数制作分页
          this.maxpage = Math.ceil(result.data.data.count / count);
          if (this.maxpage < this.page) {
            this.page = 1;
          }
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
    },
    onSitesChange(id = "") {
      if (id == "") {
        this.visibleSites = [""];
      } else {
        if (this.visibleSites.includes(id)) {
          const index = this.visibleSites.indexOf(id);
          this.visibleSites.splice(index, 1);
        } else {
          this.visibleSites.push(id);
          const index = this.visibleSites.indexOf("");
          if (index > -1) {
            this.visibleSites.splice(index, 1);
          }
        }
      }
      if (this.visibleSites.length == 0) {
        this.visibleSites = [""];
      }
      if (this.ifSearch === false) {
        this.getListVideo(this.page, this.count);
        return;
      }
      if (this.ifSearch === true) {
        this.getSearchData(this.page, this.count, this.searchKeyWord);
        return;
      }
      //this.getListVideo_VideoOnly(this.page, this.count);
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
  components: { left_navbar }
};
</script>

<style lang="less" scoped>
.tag-box {
  .el-tag {
    cursor: pointer;
  }
}
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

.video-detail > .title-div {
  /* 使文字变为最多显示1行，多余的使用省略号代替 */
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.video-detail > .title-div > h4 {
  display: inline;
}
.video-detail > p {
  font-size: 1rem;
  line-height: 1.1rem;
  white-space: pre-wrap;
  overflow: hidden;
  height: 4.2rem;
  padding-top: 5px;
  /* 使文字变为最多显示4行，多余的使用省略号代替 */
  display: -webkit-box;
  -webkit-line-clamp: 4;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}
.video-detail > .link-div {
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
  padding-left: 2px;
  margin-right: 20px;
  float: left;
  position: relative;
  z-index: 1;
}
.video-thumbnail img{
  border-radius: 4px;
}

.video-item {
  padding-top: 2px;
  padding-bottom: 2px;
/*  border: 1px solid #e5e9ef;
    &:hover{
        border: 1px solid #ffffff;
    }*/
}

.list-item {
  padding-top: 5px;
  padding-bottom: 5px;
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
