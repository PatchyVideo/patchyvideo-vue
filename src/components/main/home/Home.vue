<template>
  <div>
    <div class="tag-box text-center">
      <el-tag
        key
        v-t="'_common.global_text.all'"
        style="margin: 0 5px;"
        :type="visibleSites.includes('') ? '' : 'info'"
        @click="(e) => onSitesChange()"
      ></el-tag>
      <el-tag
        v-for="item in allSites"
        :key="item.id"
        style="margin: 0 5px;"
        :type="visibleSites.includes(item.id) ? '' : 'info'"
        @click="(e) => onSitesChange(item.id)"
        >{{ item.label }}</el-tag
      >
    </div>
    <div v-loading="loading" class="w main-page-background-img flex mx-auto max-w-screen-xl">
      <div class="content inline-block">
        <!-- 播放列表的抬头 -->
        <div class="video-list-header">
          <p v-if="maxcount">{{ $t("page_count", { count: count2, maxcount: maxcount }) }}</p>
          <p v-else>{{ $t("no_result") }}</p>
          <el-checkbox v-model="checked" class="show_deleted">{{ $t("show_deleted") }}</el-checkbox>
          <p class="blacklist_prompt">{{ $t("blacklist_prompt") }}</p>
          <el-select id="select-order" v-model="couponSelected">
            <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </div>

        <!-- 播放列表正文 -->
        <ul>
          <li v-for="item in listvideo" :key="item._id.$oid" class="list-item">
            <div class="video-item">
              <!-- 封面图片 -->
              <a
                target="_blank"
                rel="noopener noreferrer"
                :href="item.item.url"
                tag="a"
                style="width: 200px; height: 125px; margin-right: 20px; display: inline-block;"
              >
                <div class="video-thumbnail">
                  <bilibili-cover
                    v-if="item.item.site === 'bilibili'"
                    :aid="parseInt(item.item.unique_id.replace('bilibili:av', ''))"
                    :cid="item.item.cid"
                    :cover-image="item.item.cover_image"
                  ></bilibili-cover>
                  <youtube-cover
                    v-else-if="item.item.site === 'youtube'"
                    :v="item.item.unique_id.replace('youtube:', '')"
                    :cover-image="item.item.cover_image"
                  ></youtube-cover>
                  <div v-else>
                    <img :src="'/images/covers/' + item.item.cover_image" width="200px" height="125px" />
                    <div class="Imgcover"></div>
                  </div>
                </div>
              </a>

              <div class="video-detail">
                <!-- 图标和标题，以及分P -->
                <div class="title-div">
                  <img :src="require('@/static/img/' + item.item.site + '.png')" width="16px" style="display: inline; vertical-align: -2px;" />
                  <h4>
                    <router-link target="_blank" :to="{ path: '/video', query: { id: item._id.$oid } }" tag="a">{{ item.item.title }}</router-link>
                  </h4>
                  <h5 v-if="item.item.part_name" class="text-xs p-0 -mt-1 font-light">P{{ pageOfVideo(item.item.url) }}:{{ item.item.part_name }}</h5>
                </div>
                <!-- 图标和标题 -->
                <!-- 内容 -->
                <p
                  :class="{ 'whitespace-pre-line': true, shortDescForPageVideos: item.item.part_name }"
                  :title="toGMT(item.item.upload_time.$date) + '\n' + (item.item.desc || $t('nodesc'))"
                >
                  {{ getDesc(item.item.desc) }}
                </p>
                <!-- 作者信息 -->
                <!--<router-link
                  class="linkToPublisher"
                  target="_blank"
                  :to="'/users/'+item.meta.created_by.$oid"
                  tag="a"
                >{{$t("see_uploaders")}}
                </router-link>-->
                <div class="time-up">{{ toGMT(item.item.upload_time.$date) + "\n" }}</div>
              </div>
              <div class="rating-box">
                <span v-show="item.total_rating" class="rating" :title="$t('score.title')">{{
                  (item.total_rating / item.total_rating_user || 0).toFixed(1)
                }}</span>
              </div>
            </div>
          </li>
        </ul>

        <!-- ElementUI 自带的分页器 -->
        <el-pagination
          background
          class="page-selector"
          layout="jumper, prev, pager, next, sizes"
          :current-page="page"
          :total="maxcount"
          :page-size="20"
          :page-sizes="[10, 20, 30, 40]"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        ></el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import bilibiliCover from "./BilibiliCover";
import YoutubeCover from "./YoutubeCover";
import { toGMT } from "@/static/js/toGMT";
export default {
  components: { bilibiliCover, YoutubeCover },
  data() {
    this.$i18n.locale = localStorage.getItem("lang");
    return {
      // 视频列表的排序规则
      options: [
        { value: "latest", label: this.$t("latest") },
        { value: "oldest", label: this.$t("oldest") },
        { value: "video_latest", label: this.$t("latest_video") },
        { value: "video_oldest", label: this.$t("oldest_video") },
      ],
      // 当前视频列表的排列顺序
      couponSelected: "latest",
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
      // 搜索关键字
      searchKeyWord: "",
      // 是否渲染的是搜索的数据，默认 false 为主页数据
      ifSearch: false,
      // 判断是否执行查询,有时候页面会进行多次查询浪费资源
      // ifQuest: true,
      // 判断当前页数是不是被搜索事件改变的,即：当我跳转到其他页数，此时再搜索新的关键词，新的页数会被置为 1。
      // 这时会触发 page 监听的事件，重新请求搜索的数据，因为根据关键词的改变也会重新请求的数据，会造成资源浪费。
      pageMark: false,
      // 是否显示隐藏视频
      checked: false,
      visibleSites: [""],
      allSites: [
        { label: "Bilibili", id: "bili" },
        { label: "Nicovideo", id: "nico" },
        { label: "YouTube", id: "ytb" },
        { label: "Twitter", id: "twitter" },
        { label: "Acfun", id: "acfun" },
        { label: "站酷", id: "zcool" },
        { label: "IPFS", id: "ipfs" },
        { label: "weibo", id: "weibo-mobile" },
      ],
    };
  },
  computed: {
    toGMT,
    // B站分P视频的哪一P
    pageOfVideo() {
      return (url) => {
        return url.slice(url.indexOf("=") + 1, url.length);
      };
    },
  },

  watch: {
    page() {
      // 如果为 True 说明是搜索数据导致的页数改变，并且如果当前页数是 1 的话，取消这一次数据请求
      if (this.pageMark && this.page === 1) {
        this.pageMark = false;
        return;
      }
      if (this.ifSearch) {
        this.getSearchData(this.page, this.count, this.searchKeyWord);
      } else {
        this.getListVideo(this.page, this.count);
      }
    },
    count() {
      // 如果为 True 说明是搜索数据导致的页数改变，并且如果当前页数是 1 的话，取消这一次数据请求
      if (this.pageMark && this.page === 1) {
        this.pageMark = false;
        return;
      }
      if (this.ifSearch) {
        this.getSearchData(this.page, this.count, this.searchKeyWord);
      } else {
        this.getListVideo(this.page, this.count);
      }
    },
    couponSelected() {
      this.handleCurrentChange(1);
      // 如果为 True 说明是搜索数据导致的页数改变，并且如果当前页数是 1 的话，取消这一次数据请求
      if (this.pageMark && this.page === 1) {
        this.pageMark = false;
        return;
      }
      if (this.ifSearch) {
        this.getSearchData(this.page, this.count, this.searchKeyWord);
      } else {
        this.getListVideo(this.page, this.count);
      }
      this.historyPush();
    },
    ifSearch() {
      // this.ifQuest = false;
      this.handleCurrentChange(1);
      // 是否渲染的是搜索的数据，默认 false 为主页数据，清空搜索关键词
      // if (newV === false) {
      //   this.searchKeyWord = "";
      //   this.getListVideo(this.page, this.count);
      // }
      // 当监听到的 ifSearch 为 true 时，根据搜索的值渲染数据。
      // if (newV === true) {
      //   this.getSearchData(this.page, this.count, this.searchKeyWord);
      // }
    },
    checked() {
      if (this.ifSearch) {
        this.getSearchData(this.page, this.count, this.searchKeyWord);
      } else {
        this.getListVideo(this.page, this.count);
      }
      this.historyPush();
    },
    $route(newV, oldV) {
      this.getInfoFromUrl(newV);
      this.handleCurrentChange(1);
      // 监听路由 query 的值，当 query 的值为空时，说明默认是首页，调用 this.getListVideo 获取首页数据并渲染。
      if (!newV.query.keyword) {
        // 修改网站标题
        document.title = "PatchyVideo";
        this.ifSearch = false;
        this.getListVideo(this.page, this.count);
        return;
      }
      // 监听路由 query 的值，当用户连续输入的搜索值不一样时，更新搜索关键词，调用 this.getSearchData 获取搜索数据并渲染。
      else if (newV.query.keyword != oldV.query.keyword || newV.query.qtype != oldV.query.qtype) {
        // 修改网站标题
        document.title = this.$t("search_result", {
          result: newV.query.keyword,
        });
        this.ifSearch = true;
        this.searchKeyWord = newV.query.keyword;
        // 在我请求新的搜索数据之后，因为搜索是路由跳转所以会重置当前页面为 1，页数会改变，也会触发监控页数里的函数
        // 这里做一个标记，如果是因搜索关键词而改变的页数，那么取消这一次 Page 页数改变而触发的请求数据事件。
        // pageMark 作为监控 page 中是否重新请求数据的标志。
        if (this.page == 1) {
          this.pageMark = true;
        }
        this.getSearchData(this.page, this.count, newV.query.keyword);
        return;
      }
    },
  },
  created() {
    // 初始化页面名为 home
    this.$store.commit("changeBgc", "home");
    // 初始化排列顺序为最新上传排序
    this.couponSelected = this.options[0].value;
    // 获取视频列表
    // this.getListVideo(this.page, this.count);
    // 改变侧导航条的标题
    this.$store.commit("changeLeftNavBarTitle", 2);
    // 修改网站标题
    document.title = "PatchyVideo";

    this.getInfoFromUrl(this.$route);

    // 检验传入的数据判断是否应该为搜索页
    if (!this.$route.query.keyword) {
      this.ifSearch = false;
    } else if (this.$route.query.keyword) {
      this.searchKeyWord = this.$route.query.keyword;
      this.ifSearch = true;
      // 修改网站标题
      document.title = this.$t("search_result", { result: this.searchKeyWord });
    }

    this.handleCurrentChange(1);

    // 如果为 True 说明是搜索数据导致的页数改变，并且如果当前页数是 1 的话，取消这一次数据请求
    if (this.pageMark && this.page === 1) {
      this.pageMark = false;
      return;
    }
    if (this.ifSearch) {
      this.getSearchData(this.page, this.count, this.searchKeyWord);
    } else {
      this.getListVideo(this.page, this.count);
    }
  },
  mounted() {},
  updated() {},
  methods: {
    // 当前播放列表的页面切换的时候调用
    handleCurrentChange(val) {
      this.page = val;
      this.historyPush();
    },
    // 当前页面显示视频条数切换的时候调用
    handleSizeChange(val) {
      this.count = val;
      this.historyPush();
    },
    // 请求播放列表数据
    getListVideo: function(e, count) {
      // 先使页面处于加载状态
      this.loading = true;
      let sites = "";
      const index = this.visibleSites.indexOf("");
      if (index == -1) {
        // 用户选择了某几个网站
        for (let i = 0; i < this.visibleSites.length; ++i) {
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
          lang: localStorage.getItem("lang"),
        },
      }).then((result) => {
        this.maxcount = result.data.data.count;
        // 取得总页数制作分页
        this.maxpage = Math.ceil(result.data.data.count / count);
        if (this.maxpage < this.page) {
          this.page = 1;
        }
        this.listvideo = result.data.data.videos;

        /* 排序处理 */

        // 获得热门标签
        let tags = result.data.data.tags;
        let tagswithcount = result.data.data.tag_pops;
        // 排序热门标签
        let ntags = {};
        tagswithcount = Object.keys(tagswithcount)
          .sort((a, b) => tagswithcount[b] - tagswithcount[a])
          .forEach((key) => {
            ntags[key] = tags[key];
          });

        this.tags = ntags;
        /* 处理结束 */

        // this.tags = result.data.data.tags;
        this.count2 = result.data.data.videos.length;

        // 加载结束，加载动画消失
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
      // if (!this.ifQuest) {
      //   this.ifQuest = true;
      //   return;
      // }
      this.loading = true;
      this.$store.commit("getTopNavbarSearching", this.searchKeyWord);
      let sites = "";
      const index = this.visibleSites.indexOf("");
      if (index == -1) {
        // 用户选择了某几个网站
        for (let i = 0; i < this.visibleSites.length; ++i) {
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
          lang: localStorage.getItem("lang"),
        },
      }).then((result) => {
        if (result.data.status == "SUCCEED") {
          this.maxcount = result.data.data.count;
          // 取得总页数制作分页
          this.maxpage = Math.ceil(result.data.data.count / count);
          if (this.maxpage < this.page) {
            this.page = 1;
          }
          this.listvideo = result.data.data.videos;
          this.tags = result.data.data.tags;
          this.count2 = result.data.data.videos.length;
          // 当前页数大于搜索 Tag 页数时需要重新请求正确的页数数据,现暂时无用注释掉待观察
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
        } else {
          // 包含非法字符的时候
          if (result.data.data.reason == "INCORRECT_QUERY") {
            this.$message({
              message: this.$t("syntax_error"),
              type: "error",
            });
          }
          // NOT 使用错误的时候
          else if (result.data.data.reason == "FAILED_NOT_OP") {
            this.$message({
              message: this.$t("syntax_error_not"),
              type: "error",
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

      if (this.ifSearch) {
        this.getSearchData(this.page, this.count, this.searchKeyWord);
      } else {
        this.getListVideo(this.page, this.count);
      }

      this.historyPush();
      // this.getListVideo_VideoOnly(this.page, this.count);
    },
    historyPush() {
      const visibleSites = btoa(JSON.stringify(this.visibleSites));
      let query = {};

      this.page != 1 && (query.page = this.page);
      this.count != 20 && (query.page_count = this.count);
      this.couponSelected != "latest" && (query.coupon = this.couponSelected);
      this.checked && (query.showDeleted = this.checked);
      this.visibleSites.indexOf("") == -1 && (query.visibleSites = visibleSites);
      this.$route.query.keyword && (query.keyword = this.$route.query.keyword);
      this.$route.query.qtype && (query.qtype = this.$route.query.qtype);

      const urlSearchParams = new URLSearchParams();
      for (let i in query) {
        urlSearchParams.set(i, query[i]);
      }

      if (Object.keys(query).length > 0) {
        if (window.location.href != window.location.href.split("?")[0] + "?" + urlSearchParams.toString()) {
          history.pushState({}, "", window.location.href.split("?")[0] + "?" + urlSearchParams.toString());
        }
      } else {
        if (window.location.href != window.location.href.split("?")[0]) {
          history.pushState({}, "", window.location.href.split("?")[0]);
        }
      }
    },
    getInfoFromUrl(route) {
      this.couponSelected = route.query.coupon || this.couponSelected;
      this.page = parseInt(route.query.page) || this.page;
      this.count = parseInt(route.query.page_count || this.count);
      this.checked = route.query.showDeleted == "true";
      this.visibleSites = route.query.visibleSites ? JSON.parse(atob(route.query.visibleSites)) : this.visibleSites;
    },
    getDesc(desc) {
      if (desc) {
        let d = desc;
        d = d.replace(/(?:[-—=+~]{4,}([^-—=+~\s]+))?(?:[-—=+~]{4,})(?:$|(?=[^-—=+~>》→]))/g, "$1"); // 删除分割线
        d = d.replace(/(?:[-—=+~]+)(?=[-—=+~]{4}[>》→])/, ""); // 缩短长箭头
        d = d.replace(/[↑↓]/g, ""); // 删除上下指向
        d = d.replace(/\s(?=\s)/g, ""); // 删除连续空格
        return d;
      } else {
        return this.$t("nodesc");
      }
    },
  },
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

.video-item {
  display: flex;
  padding-top: 2px;
  padding-bottom: 2px;
  &:hover {
    /*background-color: rgba(255,255,255,0.3);*/
    background-color: rgb(244, 244, 245);
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  }
  width: 100%;
  a {
    .video-thumbnail {
      padding-left: 2px;
      margin-right: 20px;
      float: left;
      position: relative;
      z-index: 1;
      img {
        border-radius: 4px;
      }
      // .Imgcover {}
    }
  }
  .video-detail {
    flex-grow: 1;
    height: 125px;
    position: relative;
    transition: all 0.3s ease;

    .title-div {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      max-width: 75%;
      h4 {
        display: inline;
      }
      img {
        vertical-align: bottom;
      }
      h5 {
        margin-left: 20px;
        color: #606266;
      }
    }
    p {
      display: block;
      color: #606266;
      width: 90%;
      font-size: 1rem;
      line-height: 1.15rem;
      white-space: pre-wrap;
      text-overflow: ellipsis;
      overflow: hidden;
      height: 70px;
      margin-bottom: 5px;
      padding-top: 5px;
      /* 使文字变为最多显示4行，多余的使用省略号代替 */
      display: -webkit-box;
      -webkit-line-clamp: 4;
      -webkit-box-orient: vertical;
    }
    // .time-up {}
    // .linkToPublisher {}
  }
  .rating-box {
    position: relative;

    .rating {
      position: absolute;
      bottom: 0;
      right: 0;
      display: inline-block;
      height: 40px;
      line-height: 40px;
      color: #f8d714;
      font-size: 25px;
      font-weight: bolder;
    }
  }
}

.video-detail > .link-div {
  position: absolute;
  bottom: 0px;
  left: 220px;
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
  width: 100%;
  margin-bottom: 10px;
}

.el-select {
  width: 200px;
  float: right;
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
  background-repeat: no-repeat;
  min-height: 800px;
  width: 85%;
}

.blacklist_prompt {
  font-size: 14px;
  color: #606266;
}
.updatetime {
  margin-top: 5px;
  font-size: 12px;
  color: rgb(0, 0, 0);
}
.linkToPublisher {
  font-size: 14px;
}
// 为了兼容B站分P功能做出动态绑定的css，因为优先级的关系只能大量使用!important
.shortDescForPageVideos {
  height: 52px !important;
  /* 使文字变为最多显示4行，多余的使用省略号代替 */
  display: -webkit-box !important;
  -webkit-line-clamp: 3 !important;
  -webkit-box-orient: vertical !important;
}
</style>
