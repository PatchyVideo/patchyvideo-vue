<!--    vue页面：ListDetail.vue     -->
<!--
    页面：视频列表的详细信息
    功能：展示展示视频列表的详细信息
    包含组件：LeftNavbar.vue、TopNavbar.vue、Foot.vue、EditTags
    更新日志：
    12/29/2019: v1.0 
      release
    1/9/2020：v1.0.1
      1.加入了Tag编辑功能
    ★待解决问题：
      1.播放列表里链接的复制功能因为涉及到对dom的直接操作，所以可能会有被抓住漏洞的风险
      2.图片链接尚未完工
-->
<template>
  <div class="listDetail">
    <topnavbar />
    <!-- EditTags组件-->
    <EditTags :msg="videolistPid" :visible.sync="showTagPanel"></EditTags>

    <!-- listdetail页面的正文 -->
    <div class="w main-page-background-img" v-loading="loading">
      <div class="content">
        <!-- 视频列表介绍 -->
        <div class="deemo shadow">
          <div class="d_t">
            <img src="../static/img/5.png" style="float:left;margin-top:50px;" />
            <img src="../static/img/1.png" style="float:right;margin-top:50px;" />
            <h2>{{ videolistName }}</h2>
            <img :src="'/images/covers/'+videolistDetail.playlist.cover" style="min-height:200px" />
            <p>{{ videolistDesc }}</p>
          </div>
          <!-- 打开Tag编辑页面 -->
          <el-button type="primary" @click="openEditTags" class="EditTagsButton">编辑标签</el-button>
        </div>

        <!-- 视频列表 -->
        <div class="recommend">
          <!-- 视频详情 -->
          <div class="minbox shadow" v-for="(item, index) in videolistVideos" :key="item._id.$oid">
            <div class="re_video">
              <h1>{{ index+1 }}</h1>
              <img class="re_video_img" :src="'/images/covers/'+item.item.cover_image" />
              <div class="re_video_desc">
                <h3>
                  <router-link
                    target="_blank"
                    :to="{ path: '/video', query: { id: item._id.$oid } }"
                    tag="a"
                  >{{ item.item.title }}</router-link>
                </h3>
                <p>{{ item.item.desc }}</p>
                <div>
                  <img
                    :src="require('../static/img/' + item.item.site + '.png')"
                    width="16px"
                    style="margin-right:2px"
                  />
                  <a :href="item.item.url" :id="'link' + (index)">{{ item.item.url }}</a>
                  <i @click="copyVideoLink(index)" class="fa fa-copy fa-lg" style="margin-left:2px"></i>
                </div>
              </div>
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
import EditTags from "../components/EditTags.vue";
import { copyToClipboard } from "../static/js/generic";

export default {
  data() {
    return {
      // 视频列表的详细信息
      videolistDetail: {
        playlist: {
          cover: ""
        }
      },
      // 视频列表的名称
      videolistName: "",
      // 视频列表的介绍
      videolistDesc: "",
      // 视频列表里的视频
      videolistVideos: [],
      // 当前页数
      page: 1,
      // 全部分页数
      maxpage: 1,
      // 每一页的视频数量
      count: 20,
      // 视频的全部数量
      maxcount: 0,
      videolistPid: "",
      // 视频列表是否属于加载状态的判断
      loading: true,
      ifOpenTag: false,
      showTagPanel: false
    };
  },
  computed: {},
  created() {
    this.getVideoList(this.page, this.count);
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
    // 请求单个播放列表详细数据
    getVideoList: function(e, count) {
      // 先使页面出于加载状态
      this.loading = true;

      this.axios({
        method: "post",
        url: "be/lists/get_playlist.do",
        data: { page: e, page_size: count, pid: this.$route.query.id }
      }).then(result => {
        this.videolistDetail = result.data.data;
        this.videolistName = this.videolistDetail.playlist.title.english;
        this.videolistDesc = this.videolistDetail.playlist.desc.english;
        this.videolistVideos = this.videolistDetail.videos;
        this.videolistPid = this.videolistDetail.playlist._id.$oid;
        this.maxcount = result.data.data.count;
        this.maxpage = result.data.data.page_count;

        // 加载结束,加载动画消失
        this.loading = false;

        // 回到顶部
        if ($("html").scrollTop()) {
          //动画效果
          $("html").animate({ scrollTop: 0 }, 100);
        }
      });
    },
    // 复制视频连接
    copyVideoLink: function(index) {
      copyToClipboard($("#link" + index));
    },
    // 打开Tag编辑页面
    openEditTags: function() {
      this.showTagPanel = true;
    }
  },
  watch: {
    page(v) {
      this.getVideoList(this.page, this.count);
    },
    count(v) {
      this.getVideoList(this.page, this.count);
    }
  },
  components: { topnavbar, Footer, EditTags }
};
</script>

<style scoped>
.content {
  top: 3px;
  width: 80%;
  position: relative;
  flex: 1;
}
.main-page-background-img {
  background-repeat: no-repeat;
  min-height: 800px;
  width: 85%;
  margin-top: 20px;
}
.d_t {
  width: 100%;
  margin-bottom: 0px;
  padding-bottom: 5px;
}
.d_t h2 {
  padding-top: 20px;
}
.d_t p {
  width: 60%;
  text-align: center;
  white-space: pre-line;
  margin: 0px auto;
}
.d_t img {
  height: 200px;
  margin: 10px;
  background-color: rgba(255, 255, 255, 0);
}

.EditTagsButton {
  width: 70%;
  margin-bottom: 20px;
}

.minbox {
  width: 1200px;
  margin-left: 12.5px;
  margin-right: 12.5px;
  margin-top: 30px;
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
  /* height: 150px; */
  margin-left: 10px;
  margin-right: 10px;
  margin-top: 20px;
  padding-top: 20px;
}
.re_video h1 {
  display: inline-block;
  font-size: 80px;
  margin-right: 30px;
  position: relative;
  bottom: 35px;
  color: rgb(98, 169, 231);
}
.re_video_img {
  display: inline-block;
  width: 200px;
  margin-right: 20px;
  min-width: 200px;
  min-height: 125px;
}
.re_video_desc {
  width: 850px;
  display: inline-block;
  vertical-align: top;
  white-space: pre-wrap;
  height: 4.3rem;
}
.re_video_desc p {
  font-size: 1rem;
  line-height: 1.1rem;
  height: 4.3rem;
  white-space: pre-wrap;
  margin-top: 10px;
  margin-bottom: 10px;
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

.fa-copy:hover {
  color: olive;
  cursor: pointer;
}
</style>