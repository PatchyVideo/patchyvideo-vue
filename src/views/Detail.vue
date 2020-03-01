<!--    vue页面：Detail.vue     -->
<!--
    页面：视频的详细信息
    功能：展示展示视频的详细信息
    包含组件：LeftNavbar.vue、TopNavbar.vue、Foot.vue
    更新日志：
    12/1/2019: v1.0 
      release
    12/14/2019: v1.0.1
      1.实现了播放列表里链接的复制功能
      2.对网站排版进行了部分修改
    12/22/2019: v1.0.2
      1.实现了网站标题和视频标题相一致的功能
    12/26/2019：v1.1.0
      1.使用直接向后端请求视频数据的方法重构了页面
    12/29/2019：v1.1.1
      1.当视频为视频列表第一个或最后一个的时候对“【前一篇】”，“【后一篇】”按钮进行优化
      2.加入了副本链接前对应副本指向网站的小图标
    1/20/2020：v1.1.2
      1.新增添加副本 删除副本 由此创建播放列表功能，除了添加副本和删除副本能正常使用外，其余接口暂不支持
    1/30/2020：v1.1.3
      1.新增对于视频标签编辑功能的兼容
    1/31/2020：v1.1.4
      1.新增从单个视频创建播放列表的功能
    2/2/2020：v1.1.5
      1.新增管理员修改视频等级功能
    2/4/2020：v1.1.6
      1.视频介绍里的链接功能以及链接的副本功能完成
      2.副本列表新增同步某一副本视频的功能
    2/7/2020：v1.1.7
      1.视频详情点击会出现副本添加失败的bug修复
    ★待解决问题：
      1.视频介绍里的链接功能弹出的按钮尚待优化
      2.按下浏览器的后退按钮网站没有刷新数据
-->
<i18n>
  {
  "CHS": {
  "favorite":"收藏",
  "modify" :"修改",
  "init_tip":"IPFS服务初始化中..",
  "connecting_tip":"IPFS 服务已启动，正在连接..",
  "connect_success_tip":" IPFS 节点已连接",
  "copy" : "副本",
  "add_copy":"添加副本",
  "del_copy":"删除副本",
  "sync_replica_label":"同步副本标签",
  "sync_replica_label_from":"从此副本同步标签",
  "playlist":"播放列表",
  "management":"管理",
  "official":"原始发布",
  "official_repost":"官方再发布",
  "authorized_translation":"授权翻译",
  "authorized_repost":"授权转载",
  "translation":"自发翻译",
  "repost":"自发搬运",
  "unknown":"其他",
  "previous_article":"前一篇",
  "no_previous_article":"没有前一篇了哦",
  "next_article":"后一篇",
  "no_next_article":"没有后一篇了哦",
    "infotip":{
  "release_type":"请修改视频的发布类型",
  "nocopies":"此视频不存在副本",
  "noplaylist":"本视频不包含于任何播放列表中",
  "create_playlist":"由此视频创建播放列表"
    }
  },
  "ENG": {
  "favorite":"favorited",
  "modify":"modifies",
  "init_tip":"IPFS Service initialization..",
  "connecting_tip":"IPFS Service started, connecting..",
  "connect_success_tip":" IPFS node is connected",
  "copy" : "copies",
  "add_copy":"Add copies",
  "del_copy":"Delete copies",
  "sync_replica_label":"Synchronized copy label",
  "sync_replica_label_from":"Sync tags in this copy",
  "playlist":"playlists",
  "management":"management",
  "other":"other",
  "official":"official",
  "official_repost":"official_repost",
  "authorized_translation":"authorized_translation",
  "authorized_repost":"authorized_repost",
  "translation":"translation",
  "repost":"repost",
  "unknown":"other",
  "previous_article":"Previous article",
  "no_previous_article":"No previous article",
  "next_article":"Next Article",
  "no_next_article":"No next article",
  "infotip":{
  "release_type":"Please edit the release type of the video",
  "nocopies":"No copy of this video",
  "noplaylist":"This video is not included in any playlist",
   "create_playlist":" Create playlist from this video"
  }

  }
  }
</i18n>
<template>
  <div>
    <topnavbar />

    <!-- 更改视频级别的弹出框 -->
    <el-dialog :title="$t('management')" :visible.sync="managementBox" width="30%">
      <div style="width:80%;margin:0 auto">
        <el-select v-model="theVideoRank" placeholder="请修改视频的等级" style="width:100%">
          <el-option v-for="item in videoRanks" :key="item" :label="item" :value="item"></el-option>
        </el-select>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="managementBox = false">取 消</el-button>
        <el-button type="primary" @click="manageVideo()" :loading="loading">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 更改视频级别的弹出框 -->
    <el-dialog title="修改视频发布类型" :visible.sync="changeRepostType" width="30%">
      <div style="width:80%;margin:0 auto">
        <el-select
          v-model="RepostType"
          :placeholder="$t('infotip.release_type')"
          style="width:100%"
        >
          <el-option
            v-for="item in RepostTypes"
            :key="item.label"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="changeRepostType = false">取 消</el-button>
        <el-button type="primary" @click="repostType()" :loading="loading">确 定</el-button>
      </span>
    </el-dialog>

    <!--添加到我的播放列表的弹出框 -->
    <el-dialog title="添加到列表" :visible.sync="addToList" width="30%">
      <div v-loading="loadingList">
        <el-input placeholder="搜索我的列表..." v-model="myListQuery" @keyup.enter.native="getMyList()">
          <el-button slot="append" icon="el-icon-search" @click="getMyList()"></el-button>
        </el-input>
        <div v-if="myVideoList.length" class="myVideoList">
          <div
            v-for="(item, index) in myVideoList"
            :key="index"
            class="myVideoListItem"
            @click="addToThisList(item._id.$oid)"
          >
            <h2>{{ item.title.english }}</h2>
            <h3 style="display:inline-block;color:#909399" v-if="item.private">[私密]</h3>
            <h3 style="display:inline-block;color:#E6A23C" v-if="item.exist">[已有此视频]</h3>
            <p>共{{ item.videos }}个视频</p>
          </div>
        </div>
        <p v-else>您还没有视频列表！</p>
        <!-- ElementUI自带的分页器 -->
        <el-pagination
          background
          class="page-selector"
          @current-change="handleCurrentChange"
          layout=" prev, pager, next"
          :current-page="page"
          :total="maxcount"
          :page-size="10"
        ></el-pagination>
      </div>
    </el-dialog>

    <!-- Detail页面的正文 -->
    <div class="w detail-page-background-img" v-loading="loading">
      <left_navbar :msg="myVideoData.tag_by_category"></left_navbar>

      <div class="content">
        <!-- 推荐视频栏开始  -->
        <div class="recommend">
          <h4 style="color:#606266">
            {{videoType}}:
            <el-button v-if="isLogin" type="text" @click="changeRepostType = true">{{$t('modify')}}</el-button>
            <i
              v-if="isAdmin"
              class="el-icon-refresh"
              @click="refreshVideo(myVideoData)"
              style="float:right"
            ></i>
          </h4>
          <div class="re_top">
            <h2>{{ myVideoData.video.item.title }}</h2>
            <div style="margin-left:5px;">
              <el-button
                v-if="isLogin"
                icon="el-icon-star-off"
                type="primary"
                round
                @click="openMyList"
              >{{$t('favorite')}}</el-button>
              <el-button v-if="isAdmin" @click="managementBox = true">{{$t("management")}}</el-button>
            </div>
          </div>
          <h4 class="video_link">
            <a id="video_link" :href="myVideoData.video.item.url">{{ myVideoData.video.item.url }}</a>
            <!-- 一键复制的小图标 -->
            <i @click="copyVideoLink" class="fa fa-copy fa-1x"></i>
          </h4>
          <!-- 视频上传时间（？） -->
          <h5 style="text-align: center;">{{ videodate }}</h5>

          <!-- 视频详细信息 -->
          <div class="re_video">
            <!-- 如果是ipfs视频直接播放视频，否则显示封面 -->
            <div v-if="isIpfs" style="text-align: center;" id="nodes">{{$t('init_tip')}}</div>
            <video
              :src="myVideoData.video.item.url"
              id="player"
              controls
              loop
              width="50%"
              v-if="isIpfs"
              style="position: relative;left: 50%;transform: translateX(-50%);"
            ></video>
            <img
              v-else
              :src="'/images/covers/' + myVideoData.video.item.cover_image"
              width="320px"
              height="200px"
            />
            <p
              class="videoDesc"
              @click="postAsCopy($event)"
              v-html="myVideoData.video.item.desc"
              v-linkified
            ></p>
          </div>
        </div>

        <!-- 副本列表 -->
        <div class="Copies_blibili">
          <div class="new_top">
            <h2>{{$t("copy")}}</h2>
            <p v-if="myVideoData.copies == ''">
              {{$t("infotip.nocopies")}}
              <router-link
                :to="{ path: './postvideo', query: { copy: this.pid } }"
                tag="a"
                v-if="isLogin == true"
              >
                <el-button type="text">[ {{$t("add_copy")}}]</el-button>
              </router-link>
            </p>
            <p v-else>
              此视频有{{ myVideoData.copies.length }}个副本
              <router-link
                :to="{ path: './postvideo', query: { copy: this.pid } }"
                tag="a"
                v-if="isLogin == true"
              >
                <el-button type="text">[{{$t("add_copy")}}]</el-button>
              </router-link>
              <el-button
                type="text"
                @click="dialogVisible = true"
                v-if="isLogin == true"
              >[{{$t("del_copy")}}]</el-button>
              <el-button
                type="text"
                @click="broadcastTags()"
                v-if="isLogin == true"
                style="margin-left:0px"
              >[{{$t("sync_replica_label")}}]</el-button>
            </p>
          </div>
          <div v-for="(value, key, index) in myVideoData.copies_by_repost_type" :key="index">
            <h3 v-if="key =='official'">{{$t('official')}}</h3>
            <h3 v-if="key =='official_repost'">{{$t('official_repost')}}</h3>
            <h3 v-if="key =='authorized_translation'">{{$t('authorized_translation')}}</h3>
            <h3 v-if="key =='authorized_repost'">{{$t('authorized_repost')}}</h3>
            <h3 v-if="key =='translation'">{{$t('translation')}}</h3>
            <h3 v-if="key =='repost'">{{$t('repost')}}</h3>
            <h3 v-if="key =='unknown'">{{$t('unknown')}}</h3>
            <ul v-for="item in value" :key="item._id.$oid" class="copies">
              <img
                :src="require('../static/img/' + item.item.site + '.png')"
                width="16px"
                style="margin-right:2px"
              />
              <!-- 将页面参数刷新并重载页面，其中@click.native应该是router-link为了阻止a标签的默认跳转事件 -->
              <router-link
                :to="{ path: '/video', query: { id: item._id.$oid } }"
                tag="a"
                @click.native="reload"
              >{{ item.item.title }}</router-link>
              <el-button
                type="text"
                @click="synctags(item._id.$oid)"
                v-if="isLogin == true"
                style="margin-left:10px"
              >[{{$t("sync_replica_label_from")}}]</el-button>
            </ul>
          </div>
        </div>

        <!-- 播放列表 -->
        <div class="Playlists">
          <div class="new_top">
            <h2>{{$t("playlist")}}</h2>
            <p v-if="myVideoData.playlists == ''">
              {{$t("infotip.noplaylist")}}
              <el-dropdown v-if="isLogin == true" @command="handleCommand">
                <span class="el-dropdown-link">
                  <i class="el-icon-more"></i>
                </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item
                    command="a"
                    @click="newFromSingleVideo()"
                  >【{{$t("infotip.create_playlist")}}】</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </p>
            <p v-else>
              此视频存在于{{ myVideoData.playlists.length }}个播放列表中
              <el-dropdown v-if="isLogin == true" @command="handleCommand">
                <span class="el-dropdown-link">
                  <i class="el-icon-more"></i>
                </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item
                    command="a"
                    @click="newFromSingleVideo()"
                  >【{{$t("infotip.create_playlist")}}】</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </p>
          </div>
          <ul v-for="item in myVideoData.playlists" :key="item._id.$oid">
            <!-- 将页面参数刷新并重载页面，其中@click.native应该是router-link为了阻止a标签的默认跳转事件 -->
            <router-link
              v-if="item.prev != ''"
              :to="{ path: '/video', query: { id: item.prev } }"
              tag="a"
              @click.native="reload"
            >【{{$t("previous_article")}}】</router-link>
            <span v-else>【{{$t("no_previous_article")}}】</span>
            <router-link
              :to="{ path: '/listdetail', query: { id: item._id.$oid } }"
              tag="a"
            >{{ item.title.english }}</router-link>
            <router-link
              v-if="item.next != ''"
              :to="{ path: '/video', query: { id: item.next } }"
              tag="a"
              @click.native="reload"
              style="float:right"
            >【{{$t("next_article")}}】</router-link>
            <span v-else style="float:right">【{{$t("no_next_article")}}】</span>
          </ul>
        </div>
      </div>
      <el-dialog title="提示" :visible.sync="dialogVisible" width="30%">
        <span>确认删除？</span>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button
            type="primary"
            @click="
              dialogVisible = false;
              breaklink();
            "
          >确 定</el-button>
        </span>
      </el-dialog>
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
    this.$i18n.locale = localStorage.getItem("lang");
    return {
      // 视频的详细信息
      myVideoData: {
        // 视频的副本列表
        copies: [],
        // 整理分类后的副本列表
        copiesByRepostType: {},
        // 视频的播放列表
        playlists: [],
        // 视频的标签列表(已分类)
        tag_by_category: {},
        // 视频的标签列表(未分类)
        tags: [],
        video: {
          item: {
            // 视频的标题
            title: "",
            // 视频介绍
            desc: "",
            // 视频上传时间(时间戳对象)
            upload_time: {
              $date: ""
            },
            // 视频的链接
            url: "",
            //视频封面
            cover_image: ""
          }
        }
      },
      // 我的视频列表
      myVideoList: [],
      // 我的全部视频列表（处理视频是否存在于该列表）
      allVideoList: [],
      // 视频列表的关键词
      myListQuery: "",
      // 我的视频列表的当前页数
      page: 1,
      // 我的视频列表的全部分页数
      maxpage: 1,
      // 我的视频列表的每一页的视频数量
      count: 10,
      // 视频的全部数量
      maxcount: 0,
      // 判断是否为管理员
      isAdmin: false,
      // 视频管理的对话框
      managementBox: false,
      // 修改视频发布类型的对话框
      changeRepostType: false,
      // 添加到我的播放列表的弹出框
      addToList: false,
      // 获取我的播放列表的时候的加载状态
      loadingList: false,
      // 本页面的视频的等级
      theVideoRank: 3,
      // 视频的等级（0~3，其中3为所有人可见）
      videoRanks: [0, 1, 2, 3],
      // 本页面的视频的发布类型
      RepostType: "",
      // 视频的发布类型
      RepostTypes: [
        { value: "official", label: this.$t("official") },
        { value: "official_repost", label: this.$t("official_repost") },
        {
          value: "authorized_translation",
          label: this.$t("authorized_translation")
        },
        { value: "authorized_repost", label: this.$t("authorized_repost") },
        { value: "translation", label: this.$t("translation") },
        { value: "repost", label: this.$t("repost") }
      ],
      dialogVisible: false, //删除提示框
      pid: "", //视频的id值
      // 视频是否为ipfs视频
      isIpfs: false,
      // ipfs视频的URL
      ipfsURL: "",
      // 视频列表是否属于加载状态的判断
      loading: true,
      // 匹配视频简介中的短地址，用以扩展成完整地址
      URL_MATCHERS: {},
      // 扩展成的完整地址
      URL_EXPANDERS: {}
      // 获取到的所有视频，以页数为第一维组成二维数组(和localStorage存储一起使用，已被弃用）
      // localStorageNum: []
    };
  },
  computed: {
    // 视频的发布类型
    videoType() {
      switch (this.myVideoData.video.item.repost_type) {
        case "official":
          return this.$t("official");
          break;
        case "official_repost":
          return this.$t("official_repost");
          break;
        case "authorized_translation":
          return this.$t("authorized_translation");
          break;
        case "authorized_repost":
          return this.$t("authorized_repost");
          break;
        case "translation":
          return this.$t("translation");
          break;
        case "repost":
          return this.$t("repost");
          break;
        case "unknown":
          return this.$t("unknown");
          break;
      }
    },
    // 视频的上传日期
    videodate() {
      var upload_time = new Date(this.myVideoData.video.item.upload_time.$date);
      // 设置为东八区的时间
      upload_time.setTime(upload_time.getTime() + 1000 * 3600 * 8);
      var y = upload_time.getFullYear(); //getFullYear方法以四位数字返回年份
      var M = upload_time.getMonth() + 1; // getMonth方法从 Date 对象返回月份 (0 ~ 11)，返回结果需要手动加一
      var d = upload_time.getDate(); // getDate方法从 Date 对象返回一个月中的某一天 (1 ~ 31)
      var h = upload_time.getHours(); // getHours方法返回 Date 对象的小时 (0 ~ 23)
      var m = upload_time.getMinutes(); // getMinutes方法返回 Date 对象的分钟 (0 ~ 59)
      var s = upload_time.getSeconds(); // getSeconds方法返回 Date 对象的秒数 (0 ~ 59)
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
    },
    // 判断是否登录的标志
    isLogin() {
      if (
        JSON.stringify(this.$store.state.username) != "null" &&
        this.$store.state.username != ""
      ) {
        return true;
      } else {
        return false;
      }
    },
    // 获取dom
    nodeShow() {
      return document.getElementById("nodes");
    }
  },
  created() {
    // 改变侧导航条的标题
    this.$store.commit("changeLeftNavBarTitle", "标签");
    // 删除本地储存(和localStorage存储一起使用，已被弃用）
    // window.localStorage.removeItem("loglevel:webpack-dev-server");
    this.searchVideo();
  },
  mounted() {
    this.buildUrlMatchers();
  },
  methods: {
    open1(message) {
      this.$message({
        message: message,
        type: "success"
      });
    },
    open2() {
      this.$message({
        message: "同步成功！",
        type: "success"
      });
    },
    open3(message) {
      this.$message({
        message: message,
        type: "warning"
      });
    },
    open4(message) {
      this.$message.error(message);
    },
    openHTML(URL) {
      var message = this.$message({
        dangerouslyUseHTMLString: true,
        message: "<p>创建成功！<i>点我查看</i></p>"
      });
    },
    // 视频存在的播放列表的下拉菜单的钩子
    handleCommand(command) {
      this.newFromSingleVideo();
    },
    // 从单个视频创建播放列表
    newFromSingleVideo() {
      this.axios({
        method: "post",
        url: "be/lists/create_from_video.do",
        data: { vid: this.pid }
      }).then(res => {
        var videoPid = res.data.data;
        this.$router.push({ path: "/listdetail", query: { id: videoPid } });
      });
    },
    breaklink() {
      this.axios({
        method: "post",
        url: "be/videos/breaklink.do",
        data: { video_id: this.pid }
      }).then(res => {
        this.$router.go(0);
      });
    },
    broadcastTags() {
      this.axios({
        method: "post",
        url: "be/videos/broadcasttags.do",
        data: { src: this.pid }
      }).then(res => {
        this.open2();
      });
    },
    // 复制视频连接
    copyVideoLink: function() {
      copyToClipboard($("#video_link"));
    },
    // 查询视频详细信息
    searchVideo: function() {
      this.loading = true;
      // vuex存储:(已被弃用)
      while (0) {
        // for (let j = 0; j < this.$store.state.videoObj.length; j++) {
        //   for (let i = 0; i < this.$store.state.videoObj[j].length; ++i) {
        //     if (this.$store.state.videoObj[j][i]._id.$oid == this.$route.query.id) {
        //       this.myVideoData = this.$store.state.videoObj[j][i];
        //     }
        //   }
        // }
      }
      // localStorage存储：(已被弃用)
      while (0) {
        // 初始化localStorageNum
        // let maxnums = [];
        // for (let i in Object.keys(window.localStorage)) {
        //   maxnums.push(parseInt(Object.keys(window.localStorage)[i]));
        // }
        // for (let i = 0; i < Math.max(...maxnums); ++i) {
        //   if (this.localStorageNum[i] === undefined) {
        //     this.localStorageNum[i] = [];
        //   }
        // }
        // for (let m in window.localStorage) {
        //   if (typeof window.localStorage[m] == "string") {
        //     this.localStorageNum[parseInt(m)] = JSON.parse(
        //       window.localStorage[m]
        //     );
        //   }
        // }
        // // 根据传进来的视频ID寻找对应的视频详细信息
        // for (let j = 0; j < this.localStorageNum.length; j++)
        //   for (let i = 0; i < this.localStorageNum[j].length; ++i) {
        //     if (this.localStorageNum[j][i]._id.$oid == this.$route.query.id) {
        //       this.myVideoData = this.localStorageNum[j][i];
        //     }
        //   }
      }
      // 直接向后端请求视频数据
      this.axios({
        method: "post",
        url: "be/getvideo.do",
        data: { vid: this.$route.query.id, lang: localStorage.getItem("lang") }
      })
        .then(result => {
          this.myVideoData = result.data.data;
          this.theVideoRank = result.data.data.video.clearence;

          // 修改网站标题
          document.title = this.myVideoData.video.item.title;
          this.pid = this.myVideoData.video._id.$oid;
          // 视频pid储存到vuex中
          this.$store.commit("setVideoPid", this.myVideoData.video._id.$oid);
          // 标记视频简介中的链接
          this.urlifyDesc();
          // 加载结束,加载动画消失

          if (this.myVideoData.video.item.site == "ipfs") {
            this.isIpfs = true;
            this.ipfsURL = this.myVideoData.video.item.url.slice(5);
            this.establishIpfsPlayer();
          } else {
            this.isIpfs = false;
          }
          this.loading = false;
          this.whoami();
        })
        .catch(error => {
          this.$router.push({ path: "/404" });
        });
    },
    refreshVideo(item) {
      /*      console.log(item._id.$oid);*/
      this.$axios({
        method: "post",
        url: "be/videos/refresh.do",
        data: {
          video_id: item.video._id.$oid
        }
      }).then(res => {
        if (res.data.status === "SUCCEED") {
          this.searchVideo();
          setTimeout(() => {
            this.$message({
              message: "更新成功！",
              type: "success"
            });
          }, 500);
        } else {
          this.$message({
            message: "更新失败",
            type: "warning"
          });
        }
      });
    },
    // 获取用户权限信息
    whoami() {
      this.loading = true;
      this.axios({
        method: "post",
        url: "be/user/whoami",
        data: {}
      }).then(result => {
        if (result.data.data == "admin" && this.isLogin) {
          this.isAdmin = true;
        } else {
          this.isAdmin = false;
        }
        this.loading = false;
      });
    },
    // 管理视频（现在的功能是编辑视频权限）
    manageVideo() {
      this.loading = true;
      this.axios({
        method: "post",
        url: "be/videos/set_clearence.do",
        data: {
          vid: this.pid,
          clearence: this.theVideoRank
        }
      }).then(result => {
        if (result.data.status == "SUCCEED") {
          this.open1("修改成功！");
          this.loading = false;
          this.managementBox = false;
          this.searchVideo();
        } else {
          this.open4("修改失败，请重试！");
        }
      });
    },
    // 修改发布类型
    repostType() {
      if (this.RepostType == "") {
        this.open4("请选择发布类型！");
        return;
      }
      this.loading = true;
      this.axios({
        method: "post",
        url: "/be/videos/set_repost_type.do",
        data: {
          vid: this.pid,
          repost_type: this.RepostType
        }
      }).then(result => {
        if (result.data.status == "SUCCEED") {
          this.open1("修改成功！");
          this.loading = false;
          this.changeRepostType = false;
          this.searchVideo();
        } else {
          this.open4("修改失败，请重试！");
        }
      });
    },
    // 刷新页面
    reload: function() {
      this.$router.go(0);
    },
    // 匹配视频简介中的URL的规则
    buildUrlMatchers() {
      var that = this;
      this.URL_MATCHERS[
        "(https:\\/\\/|http:\\/\\/)?(www\\.)?bilibili\\.com\\/video\\/av[\\d]+"
      ] = function(match) {
        return [match, "video"];
      };
      this.URL_MATCHERS[
        "(https:\\/\\/|http:\\/\\/)?(www\\.)?acfun\\.cn\\/v\\/ac[\\d]+"
      ] = function(match) {
        return [match, "video"];
      };
      this.URL_MATCHERS[
        "(https:\\/\\/|http:\\/\\/)?(www\\.)?nicovideo\\.jp\\/watch\\/(s|n)m[\\d]+"
      ] = function(match) {
        return [match, "video"];
      };
      this.URL_MATCHERS[
        "((https:\\/\\/)?(www\\.|m\\.)?youtube\\.com\\/watch\\?v=[-\\w]+|https:\\/\\/youtu\\.be\\/(watch\\?v=[-\\w]+|[-\\w]+)|youtu\\.be\\/[-\\w]+)"
      ] = function(match) {
        return [match, "video"];
      };
      this.URL_MATCHERS[
        "(https:\\/\\/)?(www\\.|mobile\\.)?twitter\\.com\\/[\\w]+\\/status\\/[\\d]+"
      ] = function(match) {
        return [match, "video"];
      };
      this.URL_MATCHERS["ac[\\d]+"] = function(short_link) {
        return ["https://www.acfun.cn/v/" + short_link, "video"];
      };
      this.URL_MATCHERS["av[\\d]+"] = function(short_link) {
        return ["https://www.bilibili.com/video/" + short_link, "video"];
      };
      this.URL_MATCHERS["(s|n)m[\\d]+"] = function(short_link) {
        return ["https://www.nicovideo.jp/watch/" + short_link, "video"];
      };
      this.URL_MATCHERS["youtube-[-\\w]+"] = function(short_link) {
        return [
          "https://www.youtube.com/watch?v=" + short_link.substring(8),
          "video"
        ];
      };
      this.URL_MATCHERS["mylist\\/[\\d]+"] = function(short_link) {
        return ["https://www.nicovideo.jp/" + short_link, "playlist"];
      };
    },
    // 将视频简介里的连接变成链接
    urlifyDesc() {
      var that = this;
      var desc_text = this.myVideoData.video.item.desc;
      var combined_matcher = "(";
      var i = 1;
      for (var regex in this.URL_MATCHERS) {
        if (i == Object.keys(this.URL_MATCHERS).length) {
          combined_matcher += regex;
        } else {
          combined_matcher += regex + "|";
        }
        i += 1;
      }
      combined_matcher += ")";
      var combined_matcher_regex = new RegExp(combined_matcher, "ig");
      var is_logged_in = this.isLogin;
      var desc_urlified = desc_text.replace(combined_matcher_regex, function(
        url
      ) {
        for (var key in that.URL_MATCHERS) {
          if (new RegExp(key, "i").test(url)) {
            const [expanded_url, link_type] = that.URL_MATCHERS[key](url);
            return `<div class="video-link-div"><a href="${expanded_url}">${url}</a>${that.buildUrlTools(
              is_logged_in,
              expanded_url,
              link_type
            )}</div>`;
          }
        }
      });
      this.myVideoData.video.item.desc = desc_urlified;
    },
    // 动态创建添加副本的组件
    buildUrlTools(logged_in, url, link_type) {
      if (!logged_in) {
        return "";
      }

      if (link_type == "video") {
        var ret = `<div class="url-tools">`;
        // 利用name属性保存绑定的URL
        ret += `<button name="${url}">添加副本</button>`;
        ret += `</div>`;
        return ret;
      }

      return "";
    },
    // 将简介中的视频连接存为副本
    postAsCopy(event) {
      if (event.target.nodeName.toString() != "BUTTON") return;
      var url = event.target.name;
      this.loading = true;
      this.axios({
        method: "post",
        url: "be/postvideo.do",
        data: {
          copy: this.myVideoData.video._id.$oid,
          url: url,
          tags: this.myVideoData.tags
        }
      }).then(result => {
        if (result.data.status == "SUCCEED") {
          this.open1("副本添加成功！");
          // this.searchVideo();
          // 不知道为什么只能通过刷新才能显示副本
          this.$router.go(0);
          // this.openHTML("/video", url);
        } else if (result.data.status == "FAILED") {
          this.open4("副本添加失败！");
        } else if (result.data.status == "ERROR") {
          if (result.data.data == "UNAUTHORISED_OPERATION") {
            this.open4("登录信息错误，请重新登录！");
          }
        } else {
          this.open4("未知错误");
        }
        this.loading = false;
      });
    },
    // 同步某一副本的标签
    synctags(URL) {
      this.loading = true;
      this.axios({
        method: "post",
        url: "/be/videos/synctags.do",
        data: {
          dst: this.myVideoData.video._id.$oid,
          src: URL
        }
      }).then(result => {
        if (result.data.status == "SUCCEED") {
          this.open1("同步成功！");
          // this.searchVideo();
          // 不知道为什么只能通过刷新才能显示副本
          this.$router.go(0);
        } else if (result.data.status == "FAILED") {
          this.open4("同步失败！");
        } else {
          this.open4("未知错误");
        }
        this.loading = false;
      });
    },
    // 将视频添加到我的播放列表
    openMyList() {
      this.addToList = true;
      this.getMyList();
    },
    // 获取我的播放列表
    getMyList() {
      this.loadingList = true;
      this.axios({
        method: "post",
        url: "be/lists/myplaylists_vid",
        data: {
          query: this.myListQuery,
          page: this.page,
          page_size: this.count,
          order: "last_modified",
          vid: this.$route.query.id
        },
        withCredentials: true
      }).then(result => {
        this.myVideoList = result.data.data.playlists;
        this.maxcount = result.data.data.count;
        this.loadingList = false;
      });
    },
    // 我的播放列表的页面切换的时候调用
    handleCurrentChange(val) {
      this.page = val;
      this.getMyList();
    },
    addToThisList(pid) {
      this.loadingList = true;
      this.axios({
        method: "post",
        url: "be/postvideo.do",
        data: {
          rank: -1,
          pid: pid,
          copy: "",
          url: this.myVideoData.video.item.url,
          tags: this.myVideoData.tags
        }
      }).then(result => {
        if (result.data.status == "SUCCEED") {
          this.myListQuery = "";
          this.open1("添加成功！");
          this.addToList = false;
        } else {
          this.open4("添加失败！");
          this.addToList = false;
        }
        this.loadingList = false;
      });
    },

    // 启动ipfs播放器
    establishIpfsPlayer() {
      const IPFS = require("ipfs");
      //// IPFS Settings ////
      const ipfs = new IPFS({
        repo: "/ipfs"
      });

      const Interval = 5 * 1000;
      ipfs.once("ready", () => {
        // console.log("ipfs node ready.");
        this.nodeShow.innerHTML = this.$t("connecting_tip");
        setInterval(() => {
          ipfs.swarm.peers((err, peerInfos) => {
            if (err) {
              throw err;
            }
            // console.log(peerInfos.length+" ipfs node(s) connect.");
            this.nodeShow.innerHTML =
              peerInfos.length + this.$t("connect_success_tip");
          });
        }, Interval);
        const player = document.getElementById("player");
        var vs = this.genIpfsVideo(ipfs, this.ipfsURL, player);
      });
    },
    //// This is a function to simplify the js
    //// Need: Ipfs node init
    genIpfsVideo(ipfsnode, hash, element) {
      let stream;
      const VideoStream = require("videostream");

      const exampleFile = {
        createReadStream(opts) {
          const { start, end } = opts;
          stream = ipfsnode.catReadableStream(hash, {
            offset: start,
            length: end && end - start
          });
          stream.on("error", err => {
            console.log(err);
          });
          return stream;
        }
      };
      let vs = new VideoStream(exampleFile, element);

      return vs;
    }
  },
  components: { left_navbar, topnavbar, Footer }
};
</script>

<style scoped>
.fa-copy:hover {
  color: olive;
  cursor: pointer;
}

.Copies_blibili ul a {
  cursor: pointer;
  text-align: center;
}
.Playlists {
  display: block;
  margin-top: 10px;
  margin-bottom: 10px;
}

.new_top h2 {
  word-wrap: break-word;
  word-break: normal;
  display: inline-block;
  font-size: 24px;
  font-weight: 1px;

  width: 100%;
  text-align: center;
}

.re_video,
.new_video-detail {
  width: 100%;
  position: relative;
  top: 0px;
  left: 0px;
}
.re_top,
.new_top {
  padding-bottom: 10px;
  border-bottom: 3px solid red;
}
.re_top {
  text-align: center;
  display: flex;
  display: -webkit-flex;
  justify-content: center;
  flex-wrap: wrap;
}
.new_top {
  border-bottom: 3px solid #21c6ef;
}

.re_video a {
  width: 100px;
  text-align: center;
  line-height: 100px;
}

.re_video img {
  display: block;
  margin: 20px auto;
  float: none;
}
.re_video p,
.new_video li p {
  font-size: 21px;
  margin-bottom: 10px;
  margin: 0px 10% 10px;
  word-wrap: break-word;
  white-space: pre-wrap;
}

.video_link {
  text-align: center;
  margin-top: 6px;
}
.w {
  text-align: left;
}
.detail-page-background-img {
  background-repeat: no-repeat;
  background-color: rgb(255, 255, 255);
  width: 85%;
  margin-top: 20px;
}
.videoDesc /deep/ .video-link-div {
  position: relative;
  display: inline-block;
}
.videoDesc /deep/ a {
  color: rgb(6, 95, 212);
}
.videoDesc /deep/ .url-tools {
  visibility: hidden;
  position: absolute;
  width: 100px;
  background-color: rgba(197, 197, 197, 0.219);
  color: #fff;
  text-align: center;
  padding: 5px 0;
  border-radius: 6px;
  z-index: 1;
  opacity: 0;
  transition: opacity 0.3s;
  top: -5px;
  bottom: auto;
  right: 100%;
}
.videoDesc /deep/ .video-link-div:hover .url-tools {
  visibility: visible;
  opacity: 1;
}
.copies {
  height: 25px;
}
.copies .el-button {
  visibility: hidden;
  opacity: 0;
}
.copies:hover .el-button {
  visibility: visible;
  opacity: 1;
}
.myVideoListItem {
  cursor: pointer;
  margin-top: 5px;
  padding: 3px 10px 3px 5px;
}
.myVideoListItem:hover {
  color: #409eff;
  background-color: rgba(0, 0, 0, 0.055);
}

.myVideoListItem h3 {
  color: rgba(0, 0, 0, 0.24);
}
.myVideoListItem p {
  color: rgba(0, 0, 0, 0.568);
  flex: 1;
  text-align: right;
}

.el-dropdown-link {
  cursor: pointer;
  color: #409eff;
}
.el-icon-arrow-down {
  font-size: 12px;
}
</style>
