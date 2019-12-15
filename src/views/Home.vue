<!--    vue页面：Home.vue     -->
<!--
    页面：paychyvideo的主页面
    功能：展示网站收录的所有视频
    包含组件：LeftNavbar.vue、TopNavbar.vue、Foot.vue
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
    ★待解决问题：
      播放列表里链接的复制功能因为涉及到对dom的直接操作，所以可能会有被抓住漏洞的风险
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
          <p>Showing {{ count }} out of {{ maxcount }} videos</p>
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
              <img
                src="/images/covers/f5da2d4dd9eac171d47eb1100339cbad90e4648556a2f99a.png"
                width="200px"
                height="125px"
              />
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
                <img :src="'./img/' + item.item.site + '.ico'" width="16px" />
                <a :href="item.item.url" :id="'link' + (index)">
                  {{
                  item.item.url
                  }}
                </a>
                <i @click="copyVideoLink(index)" class="fa fa-copy fa-lg"></i>
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
          :page-size="10"
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
      count: 10,
      // 视频的全部数量
      maxcount: 0,
      // 请求到的标签列表
      tags: [],
      // 请求到的视频列表
      listvideo: [],
      // 视频列表是否属于加载状态的判断
      loading: true
    };
  },
  created() {
    // 初始化页面名为home
    this.$store.commit("changeBgc", "home");
    // 初始化排列顺序为最新上传排序
    this.couponSelected = this.options[0].value;
    // 获取视频列表
    this.getListViedeo(this.page, this.count);
  },

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
    copyVideoLink: function(index) {
      copyToClipboard($("#link" + index));
    },
    // 请求播放列表数据
    getListViedeo: function(e, count, order) {
      // 先使页面出于加载状态
      this.loading = true;

      this.axios({
        method: "post",
        url: "https://www.patchyvideo.com/listvideo.do",
        data: { page: e, page_size: count, order: this.couponSelected }
      }).then(result => {
        if (this.maxcount == 0) {
          //第一次请求接口
          this.maxcount = result.data.data.count;
          //取得总页数制作分页
          this.maxpage = Math.ceil(result.data.data.count / count);
          this.$store.commit("getMaxPage", this.maxpage);
        }
        this.listvideo = result.data.data.videos;
        this.tags = result.data.data.tags;

        // 加载结束,加载动画消失
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
      this.getListViedeo(this.page, this.count);
    },
    count(v) {
      this.getListViedeo(this.page, this.count);
    },
    listvideo() {
      this.listvideoToStore();
    },
    couponSelected() {
      this.getListViedeo(this.page, this.count);
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
  display: -webkit-box;
  -webkit-line-clamp: 4;
  -webkit-box-orient: vertical;
  /* 使文字变为最多显示4行，多余的使用省略号代替 */
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
