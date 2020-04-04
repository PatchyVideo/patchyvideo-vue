
<i18n>
    {
    "CHS": {
    "page_count": "显示 {count} / {maxcount} 个视频",
    "no_result": "没有搜索到订阅的视频",
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
    <!-- <topnavbar />
    -->
    <!-- home页面的正文 -->
    <div class="tag-box">
      <el-tag @click="(e) => onSubsChange()" style="margin: 0 5px" key="" :type="visibleSubs.includes('') ? '' : 'info'">全部</el-tag>
      <el-tag v-for="item in allSubs" :key="item._id.$oid" style="margin: 0 5px" @click="(e) => onSubsChange(item._id.$oid)" :type="visibleSubs.includes(item._id.$oid) ? '' : 'info'">{{item.name || item.qs}}</el-tag>
    </div>
    <div class="w main-page-background-img" v-loading="loading">
      <left_navbar :msg="tags" :name="'sub'"></left_navbar>

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
                <img
                    :src="require('../../static/img/' + item.item.site + '.png')"
                    width="16px"
                    style="margin-right:2px;display:inline;"
                  />
                <h4 style="display:inline;">
                  <router-link
                    target="_blank"
                    :to="{ path: '/video', query: { id: item._id.$oid } }"
                    tag="a"
                  >{{ item.item.title }}</router-link>
                </h4>
                <p>{{ item.item.desc }}</p>
                <div>
                  <a target="_blank" :href="item.item.url">{{item.item.url}}</a>
                  <i
                    @click="copyVideoLink(item.item.url)"
                    class="fa fa-copy fa-lg"
                    style="margin-left:2px"
                  ></i>
                </div>
              </div>
            </div>订阅来源：
            <el-tag v-for="i in item.sat_objs" :key="'s' + item._id.$oid" style="margin: 0 5px">{{i.name || i.qs}}</el-tag>
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

    <!--        <Footer></Footer>-->
  </div>
</template>

<script>
import left_navbar from "../../components/LeftNavbar.vue";

import { copyToClipboardText } from "../../static/js/generic";
export default {
  data() {
    this.$i18n.locale = localStorage.getItem("lang");
    return {
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
      loading: false,
      ifSearch: false,
      //是否显示隐藏视频
      checked: true,
      visibleSubs: [''],
      allSubs: {}
    };
  },
  created() {
    this.couponSelected = this.options[2].value;
  },
  methods: {
    match_video_query(videos, querys) {
      // takes in videos and objs, return videos with satisfied objs
      for (let i = 0; i < videos.length; ++i) {
        videos[i].sat_objs = [];
        for (let j = 0; j < querys.length; ++j) {
          let video_obj = videos[i];
          let query_obj = querys[j];
          if (this.sat(video_obj, query_obj["obj"])) {
            videos[i].sat_objs.push(query_obj);
          }
        }
      }
      return videos;
    },

    get_obj(obj, key) {
      let path = key.split(".");
      var obj2 = obj;
      for (let i = 0; i < path.length; ++i) {
        obj2 = obj2[path[i]];
      }
      return obj2;
    },

    sat(obj, condition) {
      return this.do_sat(obj, null, null, condition);
    },

    do_sat(obj, key = null, query_key = null, condition = {}) {
      if (query_key == "$and") {
        var ans = true;
        for (i = 0; i < condition.length; ++i) {
          ans &= this.do_sat(obj, key, null, condition[i]);
        }
        return ans;
      } else if (query_key == "$or") {
        var ans = false;
        for (i = 0; i < condition.length; ++i) {
          ans |= this.do_sat(obj, key, null, condition[i]);
        }
        return ans;
      } else if (query_key == "$not") {
        return !this.do_sat(obj, key, null, condition);
      }
      if (key == null) {
        var ans = true;
        for (var child in condition) {
          if (child.charAt(0) == "$") {
            ans &= this.do_sat(obj, null, child, condition[child]);
          } else {
            ans &= this.do_sat(obj, child, query_key, condition[child]);
          }
        }
        return ans;
      } else {
        if (
          typeof condition == "number" ||
          typeof condition == "string" ||
          typeof condition == "boolean" ||
          (typeof condition == "object" && "$date" in condition)
        ) {
          // tags: 1
          if (
            typeof this.get_obj(obj, key) == "object" &&
            Array.isArray(this.get_obj(obj, key))
          ) {
            // array
            return this.get_obj(obj, key).includes(condition);
          } else {
            var lhs = this.get_obj(obj, key);
            var rhs = condition;
            if (typeof lhs == "object" && "$date" in lhs) {
              lhs = lhs["$date"];
            }
            if (typeof rhs == "object" && "$date" in rhs) {
              rhs = rhs["$date"];
            }
            if (query_key == null || query_key == "$eq") {
              // key: value or {$eq: val}
              return lhs == rhs;
            } else if (query_key == "$gt") {
              // {$gt: val}
              return lhs > rhs;
            } else if (query_key == "$lt") {
              // {$lt: val}
              return lhs < rhs;
            } else if (query_key == "$gte") {
              // {$gte: val}
              return lhs >= rhs;
            } else if (query_key == "$lte") {
              // {$lte: val}
              return lhs <= rhs;
            }
          }
        } else if (Array.isArray(condition)) {
          // tags: {$all: [1, 2]} or tags: {$in: [1, 2]} or tags: {$nin: [1, 2]}
          if (query_key == "$all") {
            for (var i = 0; i < condition.length; ++i) {
              if (!this.get_obj(obj, key).includes(condition[i])) {
                return false;
              }
            }
            return true;
          } else if (query_key == "$in") {
            for (var i = 0; i < condition.length; ++i) {
              if (this.get_obj(obj, key).includes(condition[i])) {
                return true;
              }
            }
            return false;
          } else if (query_key == "$nin") {
            for (var i = 0; i < condition.length; ++i) {
              if (this.get_obj(obj, key).includes(condition[i])) {
                return false;
              }
            }
            return true;
          }
        } else {
          // tags: {}
          var ans = true;
          for (var child in condition) {
            if (child.charAt(0) == "$") {
              ans &= this.do_sat(obj, key, child, condition[child]);
            } else {
              console.log("ERR!!");
              return false;
            }
          }
          return ans;
        }
      }
      console.log("ERR!!");
      return false;
    },
    handleCurrentChange(val) {
      this.page = val;
    },
    // 当前页面显示视频条数切换的时候调用
    handleSizeChange(val) {
      this.count = val;
    },
    getListVideo: function(e, count, order) {
      // 先使页面出于加载状态

      this.loading = true;

      // 请求数据
      this.axios({
        method: "post",
        url: "be/subs/list.do",
        data: {
          page: e,
          page_size: count,
          order: this.couponSelected,
          hide_placeholder: this.checked,
          visible: this.visibleSubs,
          lang: localStorage.getItem("lang")
        }
      })
        .then(result => {
          /*      let a = result.data.data.videos[0];
                          console.log(a);*/
          this.listvideo = this.match_video_query(
            result.data.data.videos,
            result.data.data.objs
          );
          this.allSubs = {};
          for (var i = 0; i < result.data.data.objs.length; ++i) {
            this.allSubs[result.data.data.objs[i]._id.$oid] = result.data.data.objs[i];
          }

          this.maxcount = result.data.data.total;
          //取得总页数制作分页
          this.maxpage = Math.ceil(result.data.data.total / count);
          this.$store.commit("getMaxPage", this.maxpage);
          /*                 this.listvideo = result.data.data.videos;*/
          this.tags = result.data.data.related_tags;
          this.count2 = result.data.data.videos.length;

          // 加载结束,加载动画消失
          this.loading = false;

          // 回到顶部
          if ($("html").scrollTop()) {
            //动画效果
            $("html").animate({ scrollTop: 0 }, 100);
          }
        })
        .catch(err => {
          console.log(err);
          this.listvideo = "";
          this.loading = false;
        });
    },
    getListVideo_VideoOnly: function(e, count, order) { // 只更新视频数据，不更新其他（包括订阅对象）
      // 先使页面出于加载状态

      this.loading = true;

      // 请求数据
      this.axios({
        method: "post",
        url: "be/subs/list.do",
        data: {
          page: e,
          page_size: count,
          order: this.couponSelected,
          hide_placeholder: this.checked,
          visible: this.visibleSubs,
          lang: localStorage.getItem("lang")
        }
      })
        .then(result => {
          /*      let a = result.data.data.videos[0];
                          console.log(a);*/
          this.listvideo = this.match_video_query(
            result.data.data.videos,
            result.data.data.objs
          );

          this.maxcount = result.data.data.total;
          //取得总页数制作分页
          this.maxpage = Math.ceil(result.data.data.total / count);
          this.$store.commit("getMaxPage", this.maxpage);
          /*                 this.listvideo = result.data.data.videos;*/
          this.tags = result.data.data.related_tags;
          this.count2 = result.data.data.videos.length;

          // 加载结束,加载动画消失
          this.loading = false;

          // 回到顶部
          if ($("html").scrollTop()) {
            //动画效果
            $("html").animate({ scrollTop: 0 }, 100);
          }
        })
        .catch(err => {
          console.log(err);
          this.listvideo = "";
          this.loading = false;
        });
    },
    onSubsChange(id = "") {
      if (id == "") {
        this.visibleSubs = [''];
      } else {
        if (this.visibleSubs.includes(id)) {
          const index = this.visibleSubs.indexOf(id);
          this.visibleSubs.splice(index, 1);
        } else {
          this.visibleSubs.push(id);
          const index = this.visibleSubs.indexOf("");
          if (index > -1) {
            this.visibleSubs.splice(index, 1);
          }
        }
      }
      if (this.visibleSubs.length == 0) {
        this.visibleSubs = [''];
      }
      this.getListVideo_VideoOnly(this.page, this.count);
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
      if (JSON.stringify(this.$route.query) === "{}") {
        // 修改网站标题
        document.title = "Patchyvideo";
        this.ifSearch = false;
        this.getListVideo(this.page, this.count);
        return;
      }
      //监听路由query的值，当用户连续输入的搜索值不一样时，更新搜索关键词，调用 this.getSearchData获取搜索数据并渲染。
      if (
        newV.query.keyword !== oldV.query.keyword ||
        newV.query.qtype !== oldV.query.qtype
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
    .tag-box{
        .el-tag{
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
/*  border: 1px solid #e5e9ef;*/
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