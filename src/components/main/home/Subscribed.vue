<template>
  <div>
    <!-- <topnavbar /> -->
    <!-- home页面的正文 -->
    <div class="tag-box">
      <el-tag key style="margin: 0 5px;" :type="visibleSubs.includes('') ? '' : 'info'" @click="(e) => onSubsChange()">全部</el-tag>
      <el-tag
        v-for="item in allSubs"
        :key="item._id.$oid"
        style="margin: 0 5px;"
        :type="visibleSubs.includes(item._id.$oid) ? '' : 'info'"
        @click="(e) => onSubsChange(item._id.$oid)"
        >{{ item.name || item.qs }}</el-tag
      >
    </div>
    <div v-loading="loading" class="w main-page-background-img">
      <left-navbar :msg="tags" :name="'sub'"></left-navbar>

      <div class="content">
        <!-- 播放列表的抬头 -->
        <div class="video-list-header">
          <p v-if="maxcount">{{ $t("page_count", { count: count2, maxcount: maxcount }) }}</p>
          <p v-else>{{ $t("no_result") }}</p>
          <el-checkbox v-model="checked" class="show_deleted">{{ $t("show_deleted") }}</el-checkbox>
          <p class="blacklist_prompt">{{ $t("blacklist_prompt") }}</p>
        </div>
        <el-select id="select-order" v-model="couponSelected">
          <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
        </el-select>

        <!-- 播放列表正文 -->
        <ul>
          <li v-for="item in listvideo" :key="item._id.$oid" class="list-item">
            <div class="video-item">
              <router-link target="_blank" :to="{ path: '/video', query: { id: item._id.$oid } }" tag="a">
                <div class="video-thumbnail">
                  <bilibili-cover
                    v-if="item.item.site === 'bilibili'"
                    :aid="parseInt(item.item.unique_id.replace('bilibili:av', ''))"
                    :cover-image="item.item.cover_image"
                  ></bilibili-cover>
                  <div v-else>
                    <img :src="'/images/covers/' + item.item.cover_image" width="200px" height="125px" />
                    <div class="Imgcover"></div>
                  </div>
                </div>
              </router-link>

              <div class="video-detail">
                <img :src="require('@/static/img/' + item.item.site + '.png')" width="16px" style="margin-right: 2px; display: inline;" />
                <h4 style="display: inline;">
                  <router-link target="_blank" :to="{ path: '/video', query: { id: item._id.$oid } }" tag="a">{{ item.item.title }}</router-link>
                </h4>
                <p>{{ item.item.desc }}</p>
                <div>
                  <a target="_blank" rel="noopener noreferrer" :href="item.item.url">{{ item.item.url }}</a>
                  <i class="fa fa-copy fa-lg" style="margin-left: 2px;" @click="copyVideoLink(item.item.url)"></i>
                </div>
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

    <!-- <Footer></Footer> -->
  </div>
</template>

<script>
import leftNavbar from "@/components/main/bar/LeftNavbar";

// import { copyToClipboardText } from "@/static/js/generic";
export default {
  components: { leftNavbar },
  data() {
    this.$i18n.locale = localStorage.getItem("lang");
    return {
      options: [
        { value: "latest", label: this.$t("latest") },
        { value: "oldest", label: this.$t("oldest") },
        { value: "video_latest", label: this.$t("latest_video") },
        { value: "video_oldest", label: this.$t("oldest_video") },
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
      // 是否显示隐藏视频
      checked: true,
      visibleSubs: [""],
      allSubs: {},
    };
  },
  computed: {
    toGMT() {
      return function(timeStamp) {
        let upload_time = new Date(timeStamp);
        // 设置为东八区的时间
        upload_time.setTime(upload_time.getTime() + 1000 * 3600 * 8);
        let y = upload_time.getFullYear(); //getFullYear 方法以四位数字返回年份
        let M = upload_time.getMonth() + 1; // getMonth 方法从 Date 对象返回月份 (0 ~ 11)，返回结果需要手动加一
        let d = upload_time.getDate(); // getDate 方法从 Date 对象返回一个月中的某一天 (1 ~ 31)
        let h = upload_time.getHours(); // getHours 方法返回 Date 对象的小时 (0 ~ 23)
        let m = upload_time.getMinutes(); // getMinutes 方法返回 Date 对象的分钟 (0 ~ 59)
        let s = upload_time.getSeconds(); // getSeconds 方法返回 Date 对象的秒数 (0 ~ 59)
        return (
          "视频发布于 " +
          y +
          "-" +
          // 数字不足两位自动补零，下同
          (Array(2).join(0) + M).slice(-2) +
          "-" +
          (Array(2).join(0) + d).slice(-2) +
          " " +
          (Array(2).join(0) + h).slice(-2) +
          ":" +
          (Array(2).join(0) + m).slice(-2) +
          ":" +
          (Array(2).join(0) + s).slice(-2) +
          " GMT+8"
        );
      };
    },
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
    },
    $route(newV, oldV) {
      this.handleCurrentChange(1);
      // 监听路由 query 的值，当 query 的值为空时，说明默认是首页，调用 this.getListVideo 获取首页数据并渲染。
      if (JSON.stringify(this.$route.query) === "{}") {
        // 修改网站标题
        document.title = "PatchyVideo";
        this.ifSearch = false;
        this.getListVideo(this.page, this.count);
        return;
      }
      // 监听路由 query 的值，当用户连续输入的搜索值不一样时，更新搜索关键词，调用 this.getSearchData 获取搜索数据并渲染。
      if (newV.query.keyword !== oldV.query.keyword || newV.query.qtype !== oldV.query.qtype) {
        // 修改网站标题
        document.title = this.$t("search_result", {
          result: newV.query.keyword,
        });
        this.ifSearch = true;
        this.searchKeyWord = newV.query.keyword;
        // 在我请求新的搜索数据之后，因为搜索是路由跳转所以会重置当前页面为 1，页数会改变，也会触发监控页数里的函数
        // 这里做一个标记，如果是因搜索关键词而改变的页数，那么取消这一次 page 页数改变而触发的请求数据事件。
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
      let obj2 = obj;
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
        let ans = true;
        for (let i = 0; i < condition.length; ++i) {
          ans &= this.do_sat(obj, key, null, condition[i]);
        }
        return ans;
      } else if (query_key == "$or") {
        let ans = false;
        for (let i = 0; i < condition.length; ++i) {
          ans |= this.do_sat(obj, key, null, condition[i]);
        }
        return ans;
      } else if (query_key == "$not") {
        return !this.do_sat(obj, key, null, condition);
      }
      if (key == null) {
        let ans = true;
        for (let child in condition) {
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
          if (typeof this.get_obj(obj, key) == "object" && Array.isArray(this.get_obj(obj, key))) {
            // array
            return this.get_obj(obj, key).includes(condition);
          } else {
            let lhs = this.get_obj(obj, key);
            let rhs = condition;
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
            for (let i = 0; i < condition.length; ++i) {
              if (!this.get_obj(obj, key).includes(condition[i])) {
                return false;
              }
            }
            return true;
          } else if (query_key == "$in") {
            for (let i = 0; i < condition.length; ++i) {
              if (this.get_obj(obj, key).includes(condition[i])) {
                return true;
              }
            }
            return false;
          } else if (query_key == "$nin") {
            for (let i = 0; i < condition.length; ++i) {
              if (this.get_obj(obj, key).includes(condition[i])) {
                return false;
              }
            }
            return true;
          }
        } else {
          // tags: {}
          let ans = true;
          for (let child in condition) {
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
    getListVideo: function(e, count) {
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
          lang: localStorage.getItem("lang"),
        },
      })
        .then((result) => {
          // let a = result.data.data.videos[0];
          // console.log(a);
          this.listvideo = this.match_video_query(result.data.data.videos, result.data.data.objs);
          this.allSubs = {};
          for (let i = 0; i < result.data.data.objs.length; ++i) {
            this.allSubs[result.data.data.objs[i]._id.$oid] = result.data.data.objs[i];
          }

          this.maxcount = result.data.data.total;
          // 取得总页数制作分页
          this.maxpage = Math.ceil(result.data.data.total / count);
          // this.listvideo = result.data.data.videos;
          this.tags = result.data.data.related_tags;
          this.count2 = result.data.data.videos.length;

          // 加载结束，加载动画消失
          this.loading = false;

          // 回到顶部
          if ($("html").scrollTop()) {
            // 动画效果
            $("html").animate({ scrollTop: 0 }, 100);
          }
        })
        .catch((err) => {
          console.log(err);
          this.listvideo = "";
          this.loading = false;
        });
    },
    getListVideo_VideoOnly: function(e, count) {
      // 只更新视频数据，不更新其他（包括订阅对象）
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
          lang: localStorage.getItem("lang"),
        },
      })
        .then((result) => {
          // let a = result.data.data.videos[0];
          // console.log(a);
          this.listvideo = this.match_video_query(result.data.data.videos, result.data.data.objs);

          this.maxcount = result.data.data.total;
          // 取得总页数制作分页
          this.maxpage = Math.ceil(result.data.data.total / count);
          this.$store.commit("getMaxPage", this.maxpage);
          // this.listvideo = result.data.data.videos;
          this.tags = result.data.data.related_tags;
          this.count2 = result.data.data.videos.length;

          // 加载结束,加载动画消失
          this.loading = false;

          // 回到顶部
          if ($("html").scrollTop()) {
            // 动画效果
            $("html").animate({ scrollTop: 0 }, 100);
          }
        })
        .catch((err) => {
          console.log(err);
          this.listvideo = "";
          this.loading = false;
        });
    },
    onSubsChange(id = "") {
      if (id == "") {
        this.visibleSubs = [""];
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
        this.visibleSubs = [""];
      }
      this.getListVideo_VideoOnly(this.page, this.count);
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
  h5 {
    color: #606266;
    strong {
      margin-left: 20px;
    }
  }
}

.video-thumbnail {
  padding-left: 2px;
  margin-right: 20px;
  float: left;
  position: relative;
  z-index: 1;
}
.video-thumbnail img {
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

// 为了兼容B站分P功能做出动态绑定的css，因为优先级的关系只能大量使用!important
.shortDescForPageVideos {
  height: 50px !important;
  /* 使文字变为最多显示4行，多余的使用省略号代替 */
  display: -webkit-box !important;
  -webkit-line-clamp: 3 !important;
  -webkit-box-orient: vertical !important;
}
</style>

<i18n folder></i18n>
