<!--    vue页面：Detail.vue     -->
<!--
    页面：视频的详细信息
    功能：展示展示视频的详细信息
    更新日志：
-->
<template>
  <div>
    <topnavbar />

    <!-- 更改视频级别的弹出框 -->
    <el-dialog :title="$t('management')" :visible.sync="managementBox" width="30%">
      <div style="width: 80%; margin: 0 auto;">
        <el-select v-model="theVideoRank" placeholder="请修改视频的等级" style="width: 100%;">
          <el-option v-for="(val, key) in videoRanks" :key="key" :label="key" :value="val">{{ key }}</el-option>
        </el-select>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="managementBox = false">取 消</el-button>
        <el-button type="primary" :loading="loading" @click="manageVideo()">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 更改视频级别的弹出框 -->
    <el-dialog title="修改视频发布类型" :visible.sync="changeRepostType" width="30%">
      <div style="width: 80%; margin: 0 auto;">
        <el-select v-model="RepostType" :placeholder="$t('infotip.release_type')" style="width: 100%;">
          <el-option v-for="item in RepostTypes" :key="item.label" :label="item.label" :value="item.value"></el-option>
        </el-select>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="changeRepostType = false">取 消</el-button>
        <el-button type="primary" :loading="loading" @click="repostType()">确 定</el-button>
      </span>
    </el-dialog>

    <!--添加到我的播放列表的弹出框 -->
    <el-dialog title="添加到列表" :visible.sync="addToList" width="30%">
      <!-- 新建列表的嵌套弹出框 -->
      <el-dialog width="60%" title="新建列表:" :visible.sync="newListDialog" append-to-body>
        <createNewList
          :need-go="!newListDialog"
          style="margin: 0 auto;"
          @closeMe="
            ($event) => {
              newListDialog = false;
            }
          "
        ></createNewList>
        <div slot="footer" class="dialog-footer">
          <el-button @click="newListDialog = false">取 消</el-button>
        </div>
      </el-dialog>

      <div v-loading="loadingList">
        <el-input v-model="myListQuery" placeholder="搜索我的列表..." @keyup.enter.native="getMyList()">
          <el-button slot="append" icon="el-icon-search" @click="getMyList()"></el-button>
        </el-input>
        <div v-if="myVideoList.length" class="myVideoList">
          <div v-for="(item, index) in myVideoList" :key="index" class="myVideoListItem" @click="addToThisList(item._id.$oid)">
            <h2>{{ item.title.english }}</h2>
            <h3 v-if="item.private" style="display: inline-block; color: #909399;">[私密]</h3>
            <h3 v-if="item.exist" style="display: inline-block; color: #e6a23c;">[已有此视频]</h3>
            <p>共{{ item.videos }}个视频</p>
          </div>
        </div>
        <p v-else>您还没有视频列表！</p>
        <!-- ElementUI 自带的分页器 -->
        <el-pagination
          background
          class="page-selector"
          layout=" prev, pager, next"
          :current-page="page"
          :total="maxcount"
          :page-size="10"
          @current-change="handleCurrentChange"
        ></el-pagination>
        <el-button class="createNewList" type="primary" @click="newListDialog = true">新建列表</el-button>
      </div>
    </el-dialog>

    <!-- Detail 页面的正文 -->
    <div v-loading="loading" class="w detail-page-background-img">
      <left-navbar :msg="myVideoData.tag_by_category"></left-navbar>

      <div class="content">
        <!-- 推荐视频栏开始  -->
        <div class="recommend">
          <h4 style="color: #606266;">
            {{ videoType }}:
            <el-button v-if="isLogin" type="text" @click="changeRepostType = true">{{ $t("modify") }}</el-button>
            <i v-if="isAdmin" class="el-icon-refresh" style="float: right;" @click="refreshVideo(myVideoData)"></i>
          </h4>
          <div class="re_top">
            <h2>{{ myVideoData.video.item.title }}</h2>
            <div style="margin-left: 5px;">
              <el-button v-if="isLogin" icon="el-icon-star-off" type="primary" round @click="openMyList">{{ $t("favorite") }}</el-button>
              <el-button v-if="isAdmin" @click="managementBox = true">{{ $t("management") }}</el-button>
            </div>
          </div>
          <h4 class="video_link">
            <a :href="myVideoData.video.item.url">{{ myVideoData.video.item.url }}</a>
            <!-- 一键复制的小图标 -->
            <i class="fa fa-copy fa-1x" style="margin-left: 4px;" @click="copyVideoLink(myVideoData.video.item.url)"></i>
          </h4>
          <!-- 视频上传时间（？） -->
          <h5 style="text-align: center;">{{ videodate }}</h5>

          <!-- 视频详细信息 -->
          <div class="re_video">
            <!-- B站，A站，n站和油管显示内嵌视频播放 -->
            <iframe
              v-if="iframeUrl !== ''"
              :src="iframeUrl"
              allowfullscreen="true"
              style="width: 948px; height: 763px; margin: 10px auto 30px; display: block;"
            ></iframe>
            <!-- 如果是 ipfs 视频则播放视频 -->
            <video
              v-if="isIpfs"
              :src="'https://ipfs.io/ipfs/' + ipfsURL"
              controls
              width="50%"
              style="position: relative; left: 50%; transform: translateX(-50%);"
            ></video>
            <!-- 其他情况显示缩略图 -->
            <img v-if="iframeUrl === '' && !isIpfs" :src="'/images/covers/' + myVideoData.video.item.cover_image" width="320px" height="200px" />
            <p v-linkified class="videoDesc" style="word-break: break-all;" @click="postAsCopy($event)" v-html="myVideoData.video.item.desc"></p>
          </div>
        </div>

        <!-- 评分区 -->
        <div>
          <Score type="video"></Score>
        </div>

        <!-- B站分P视频区 -->
        <div>
          <PagesOfVideo v-if="myVideoData.video.item.site == 'bilibili'" :aid="aid"></PagesOfVideo>
        </div>

        <!-- 副本列表 -->
        <div class="Copies_blibili">
          <div class="new_top">
            <h2>{{ $t("copy") }}</h2>
            <p v-if="myVideoData.copies == ''">
              {{ $t("infotip.nocopies") }}
              <router-link v-if="isLogin == true" :to="{ path: './postvideo', query: { copy: pid } }" tag="a">
                <el-button type="text">[ {{ $t("add_copy") }}]</el-button>
              </router-link>
            </p>
            <p v-else>
              此视频有{{ myVideoData.copies.length }}个副本
              <router-link v-if="isLogin == true" :to="{ path: './postvideo', query: { copy: pid } }" tag="a">
                <el-button type="text">[{{ $t("add_copy") }}]</el-button>
              </router-link>
              <el-button v-if="isLogin == true" type="text" @click="dialogVisible = true">[{{ $t("del_copy") }}]</el-button>
              <el-button v-if="isLogin == true" type="text" style="margin-left: 0px;" @click="broadcastTags()">[{{ $t("sync_replica_label") }}]</el-button>
            </p>
          </div>
          <div v-for="(value, key, index) in myVideoData.copies_by_repost_type" :key="index">
            <h3 v-if="key == 'official'">{{ $t("official") }}</h3>
            <h3 v-if="key == 'official_repost'">{{ $t("official_repost") }}</h3>
            <h3 v-if="key == 'authorized_translation'">{{ $t("authorized_translation") }}</h3>
            <h3 v-if="key == 'authorized_repost'">{{ $t("authorized_repost") }}</h3>
            <h3 v-if="key == 'translation'">{{ $t("translation") }}</h3>
            <h3 v-if="key == 'repost'">{{ $t("repost") }}</h3>
            <h3 v-if="key == 'unknown'">{{ $t("unknown") }}</h3>
            <ul v-for="item in value" :key="item._id.$oid" class="copies">
              <img :src="require('@/static/img/' + item.item.site + '.png')" width="16px" style="margin-right: 2px; vertical-align: middle;" />
              <!-- 将页面参数刷新并重载页面，其中 @click.native 应该是 router-link 为了阻止 a 标签的默认跳转事件 -->
              <a :class="{ shortTitleForPageVideos: item.item.part_name }" @click="shiftID(item._id.$oid)">{{ item.item.title }}</a>
              <span v-if="item.item.part_name" class="shortTitleForTitleOfPageVideos"
                >P{{ item.item.url.slice(item.item.url.indexOf("=") + 1, item.item.url.length) }}:{{ item.item.part_name }}</span
              >
              <el-button v-if="isLogin == true" type="text" style="margin-left: 10px;" @click="synctags(item._id.$oid)"
                >[{{ $t("sync_replica_label_from") }}]</el-button
              >
            </ul>
          </div>
        </div>

        <!-- 播放列表 -->
        <div class="Playlists">
          <div class="new_top">
            <h2>{{ $t("playlist") }}</h2>
            <p v-if="myVideoData.playlists == ''">
              {{ $t("infotip.noplaylist") }}
              <el-dropdown v-if="isLogin == true" @command="handleCommand">
                <span class="el-dropdown-link">
                  <i class="el-icon-more"></i>
                </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item command="a" @click="newFromSingleVideo()">【{{ $t("infotip.create_playlist") }}】</el-dropdown-item>
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
                  <el-dropdown-item command="a" @click="newFromSingleVideo()">【{{ $t("infotip.create_playlist") }}】</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </p>
          </div>
          <ul v-for="item in myVideoData.playlists" :key="item._id.$oid">
            <a v-if="item.prev != ''" @click="shiftID(item.prev)">【{{ $t("previous_article") }}】</a>
            <span v-else>【{{ $t("no_previous_article") }}】</span>
            <router-link :to="{ path: '/listdetail', query: { id: item._id.$oid } }" tag="a">{{ item.title.english }}</router-link>
            <a v-if="item.next != ''" style="float: right;" @click="shiftID(item.next)">【{{ $t("next_article") }}】</a>
            <span v-else style="float: right;">【{{ $t("no_next_article") }}】</span>
          </ul>
        </div>

        <!-- 评论区 -->
        <div>
          <Comments :sid="sid"></Comments>
        </div>
      </div>

      <!-- 删除副本的提示框 -->
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
            >确 定</el-button
          >
        </span>
      </el-dialog>
    </div>

    <Footer></Footer>
  </div>
</template>

<script>
import topnavbar from "@/components/main/bar/TopNavbar";
import Footer from "@/components/main/bar/Footer";
import leftNavbar from "@/components/main/bar/LeftNavbar";
import Comments from "@/components/forum/Comments";
import Score from "@/components/video/Score";
import createNewList from "@/components/playlist/edit/Create";
import PagesOfVideo from "@/components/video/PagesOfVideo";
import { copyToClipboardText } from "@/static/js/generic";

export default {
  components: {
    leftNavbar,
    topnavbar,
    Footer,
    Comments,
    Score,
    createNewList,
    PagesOfVideo,
  },
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
              $date: "",
            },
            // 视频的链接
            url: "",
            //视频封面
            cover_image: "",
            // 视频所属的网站
            site: "bilibili",
          },
        },
      },
      // (如果是B站视频的话)视频的av号
      aid: 0,
      // 我的视频列表
      myVideoList: [],
      // 我的全部视频列表（处理视频是否存在于该列表）
      allVideoList: [],
      // 视频评论的 sid
      sid: "",
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
      // 新建播放列表的弹出框
      newListDialog: false,
      // 获取我的播放列表的时候的加载状态
      loadingList: false,
      // 本页面的视频的等级
      theVideoRank: 3,
      // 视频的等级（0 ~ 3，其中 3 为所有人可见）
      videoRanks: {
        仅管理员可见: 0,
        登录用户可见: 1,
        发布者和管理员可见: 2,
        所有人可见: 3,
      },
      // 本页面的视频的发布类型
      RepostType: "",
      // 视频的发布类型
      RepostTypes: [
        { value: "official", label: this.$t("official") },
        { value: "official_repost", label: this.$t("official_repost") },
        {
          value: "authorized_translation",
          label: this.$t("authorized_translation"),
        },
        { value: "authorized_repost", label: this.$t("authorized_repost") },
        { value: "translation", label: this.$t("translation") },
        { value: "repost", label: this.$t("repost") },
      ],
      dialogVisible: false, // 删除提示框
      pid: "", // 视频的 id 值
      // 视频是否为 ipfs 视频
      isIpfs: false,
      // ipfs 视频的 URL
      ipfsURL: "",
      // 视频列表是否属于加载状态的判断
      loading: true,
      // 匹配视频简介中的短地址，用以扩展成完整地址
      URL_MATCHERS: {},
      // 扩展成的完整地址
      URL_EXPANDERS: {},
      // 内嵌播放的视频链接
      iframeUrl: "",
    };
  },
  computed: {
    // 视频的发布类型
    videoType() {
      switch (this.myVideoData.video.item.repost_type) {
        case "official":
          return this.$t("official");
        case "official_repost":
          return this.$t("official_repost");
        case "authorized_translation":
          return this.$t("authorized_translation");
        case "authorized_repost":
          return this.$t("authorized_repost");
        case "translation":
          return this.$t("translation");
        case "repost":
          return this.$t("repost");
        case "unknown":
          return this.$t("unknown");
        default:
          return this.$t("unknown");
      }
    },
    // 视频的上传日期
    videodate() {
      let upload_time = new Date(this.myVideoData.video.item.upload_time.$date);
      // 设置为东八区的时间
      upload_time.setTime(upload_time.getTime() + 1000 * 3600 * 8);
      let y = upload_time.getFullYear(); // getFullYear 方法以四位数字返回年份
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
    },
    // 判断是否登录的标志
    isLogin() {
      if (JSON.stringify(this.$store.state.username) != "null" && this.$store.state.username != "") {
        return true;
      } else {
        return false;
      }
    },
    // 获取 dom
    nodeShow() {
      let node = document.getElementById("nodes");
      if (node) {
        return node;
      } else {
        return false;
      }
    },
  },
  watch: {
    $route() {
      this.searchVideo();
    },
    newListDialog() {
      if (!this.newListDialog) this.getMyList();
    },
  },
  created() {
    // 改变侧导航条的标题
    this.$store.commit("changeLeftNavBarTitle", 1);
    this.searchVideo();
  },
  mounted() {
    this.buildUrlMatchers();
    // 防止B站侦测 ferrer 导致视频链接跳转出现 404
    $("head").append('<meta name="referrer" content="never">');
  },
  methods: {
    open1(message) {
      this.$message({
        message: message,
        type: "success",
      });
    },
    open2() {
      this.$message({
        message: "同步成功！",
        type: "success",
      });
    },
    open3(message) {
      this.$message({
        message: message,
        type: "warning",
      });
    },
    open4(message) {
      this.$message.error(message);
    },
    // 视频存在的播放列表的下拉菜单的钩子
    handleCommand() {
      this.newFromSingleVideo();
    },
    // 从单个视频创建播放列表
    newFromSingleVideo() {
      this.axios({
        method: "post",
        url: "be/lists/create_from_video.do",
        data: { vid: this.pid },
      }).then((res) => {
        let videoPid = res.data.data;
        this.$router.push({ path: "/listdetail", query: { id: videoPid } });
      });
    },
    breaklink() {
      this.axios({
        method: "post",
        url: "be/videos/breaklink.do",
        data: { video_id: this.pid },
      }).then(() => {
        this.$router.go(0);
      });
    },
    broadcastTags() {
      this.axios({
        method: "post",
        url: "be/videos/broadcasttags.do",
        data: { src: this.pid },
      }).then(() => {
        this.open2();
      });
    },
    // 复制视频连接
    copyVideoLink: function(url) {
      this.$alert("视频链接复制" + (copyToClipboardText(url) ? "成功！" : "失败！"), "分享链接", {
        confirmButtonText: "确定",
      });
    },
    // 设置内嵌播放链接
    regToIframe(url, cid = "") {
      let str = url;
      let regBili = /(https:\/\/|http:\/\/)www.bilibili.com\/video\/av(\S+)\?p=(\S+)/;
      let regNico = /(https:\/\/|http:\/\/)www.nicovideo.jp\/watch\/sm(\S+)/;
      let regYtb = /(https:\/\/|http:\/\/)www.youtube.com\/watch\?v=(\S+)/;
      let regAcf = /(https:\/\/|http:\/\/)www.acfun.cn\/v\/ac(\S+)/;
      if (regBili.exec(str) !== null) {
        this.aid = parseInt(regBili.exec(str)[2]);
        return `//player.bilibili.com/player.html?aid=${regBili.exec(str)[2]}&cid=${cid}&page=${regBili.exec(str)[3]}`;
      }
      if (regNico.exec(str) !== null) {
        return `//embed.nicovideo.jp/watch/sm${regNico.exec(str)[2]}`;
      }
      if (regYtb.exec(str) !== null) {
        return `https://www.youtube.com/embed/${regYtb.exec(str)[2]}`;
      }
      if (regAcf.exec(str) !== null) {
        return `https://www.acfun.cn/player/ac${regAcf.exec(str)[2]}`;
      }
      return "";
    },
    // 查询视频详细信息
    async searchVideo() {
      this.loading = true;

      const detail = (async () => {
        await this.axios({
          method: "post",
          url: "be/getvideo.do",
          data: {
            vid: this.$route.query.id,
            lang: localStorage.getItem("lang"),
          },
        })
          .then((result) => {
            this.myVideoData = result.data.data;
            this.iframeUrl = this.regToIframe(this.myVideoData.video.item.url, this.myVideoData.video.item.cid || "");
            this.theVideoRank = result.data.data.video.clearence;
            if (result.data.data.video.comment_thread) {
              this.sid = result.data.data.video.comment_thread.$oid;
            }

            // 修改网站标题
            document.title = this.myVideoData.video.item.title;
            this.pid = this.myVideoData.video._id.$oid;
            // 标记视频简介中的链接
            this.urlifyDesc();
            // 加载结束,加载动画消失

            // 回到顶部
            if ($("html").scrollTop()) {
              // 动画效果
              $("html").animate({ scrollTop: 0 }, 100);
            }

            if (this.myVideoData.video.item.site == "ipfs") {
              this.isIpfs = true;
              this.ipfsURL = this.myVideoData.video.item.url.slice(5);
            } else {
              this.isIpfs = false;
            }
          })
          .catch(() => {
            this.$router.push({ path: "/404" });
          });
        return true;
      })();
      const identity = this.whoami();
      await detail;
      await identity;
      this.loading = !(detail && identity);
    },
    // 刷新视频信息
    refreshVideo(item) {
      this.axios({
        method: "post",
        url: "be/videos/refresh.do",
        data: {
          video_id: item.video._id.$oid,
        },
      }).then((res) => {
        if (res.data.status === "SUCCEED") {
          this.searchVideo();
          setTimeout(() => {
            this.$message({
              message: "更新成功！",
              type: "success",
            });
          }, 500);
        } else {
          this.$message({
            message: "更新失败",
            type: "warning",
          });
        }
      });
    },
    // 获取用户权限信息
    async whoami() {
      await this.axios({
        method: "post",
        url: "be/user/whoami",
        data: {},
      }).then((result) => {
        if (result.data.data == "admin" && this.isLogin) {
          this.isAdmin = true;
        } else {
          this.isAdmin = false;
        }
      });
      return true;
    },
    // 管理视频（现在的功能是编辑视频权限）
    manageVideo() {
      this.loading = true;
      this.axios({
        method: "post",
        url: "be/videos/set_clearence.do",
        data: {
          vid: this.pid,
          clearence: this.theVideoRank,
        },
      }).then((result) => {
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
          repost_type: this.RepostType,
        },
      }).then((result) => {
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
    // 切换视频 ID
    shiftID(id) {
      this.$router.push({ path: "/video", query: { id: id } });
    },
    // 匹配视频简介中的 URL 的规则
    buildUrlMatchers() {
      this.URL_MATCHERS["(https:\\/\\/|http:\\/\\/)?(www\\.)?bilibili\\.com\\/video\\/([aA][vV][\\d]+|BV[a-zA-Z0-9]+)+"] = function(match) {
        return [match, "video"];
      };
      this.URL_MATCHERS["(https:\\/\\/|http:\\/\\/)?(www\\.)?acfun\\.cn\\/v\\/ac[\\d]+"] = function(match) {
        return [match, "video"];
      };
      this.URL_MATCHERS["(https:\\/\\/|http:\\/\\/)?(www\\.)?nicovideo\\.jp\\/watch\\/(s|n)m[\\d]+"] = function(match) {
        return [match, "video"];
      };
      this.URL_MATCHERS[
        "((https:\\/\\/)?(www\\.|m\\.)?youtube\\.com\\/watch\\?v=[-\\w]+|https:\\/\\/youtu\\.be\\/(watch\\?v=[-\\w]+|[-\\w]+)|youtu\\.be\\/[-\\w]+)"
      ] = function(match) {
        return [match, "video"];
      };
      this.URL_MATCHERS["(https:\\/\\/)?(www\\.|mobile\\.)?twitter\\.com\\/[\\w]+\\/status\\/[\\d]+"] = function(match) {
        return [match, "video"];
      };
      this.URL_MATCHERS["ac[\\d]+"] = function(short_link) {
        return ["https://www.acfun.cn/v/" + short_link, "video"];
      };
      this.URL_MATCHERS["av[\\d]+"] = function(short_link) {
        return ["https://www.bilibili.com/video/" + short_link, "video"];
      };
      this.URL_MATCHERS["BV[a-zA-Z0-9]+"] = function(short_link) {
        return ["https://www.bilibili.com/video/" + short_link, "video"];
      };
      this.URL_MATCHERS["(s|n)m[\\d]+"] = function(short_link) {
        return ["https://www.nicovideo.jp/watch/" + short_link, "video"];
      };
      this.URL_MATCHERS["youtube-[-\\w]+"] = function(short_link) {
        return ["https://www.youtube.com/watch?v=" + short_link.substring(8), "video"];
      };
      this.URL_MATCHERS["mylist\\/[\\d]+"] = function(short_link) {
        return ["https://www.nicovideo.jp/" + short_link, "playlist"];
      };
    },
    // 将视频简介里的连接变成链接
    urlifyDesc() {
      let that = this;
      let desc_text = this.myVideoData.video.item.desc;
      let combined_matcher = "(";
      let i = 1;
      for (let regex in this.URL_MATCHERS) {
        if (i == Object.keys(this.URL_MATCHERS).length) {
          combined_matcher += regex;
        } else {
          combined_matcher += regex + "|";
        }
        i += 1;
      }
      combined_matcher += ")";
      let combined_matcher_regex = new RegExp(combined_matcher, "ig");
      let is_logged_in = this.isLogin;
      let desc_urlified = desc_text.replace(combined_matcher_regex, function(url) {
        for (let key in that.URL_MATCHERS) {
          if (new RegExp(key, "i").test(url)) {
            const [expanded_url, link_type] = that.URL_MATCHERS[key](url);
            return `<div class="video-link-div"><a href="${expanded_url}">${url}</a>${that.buildUrlTools(is_logged_in, expanded_url, link_type)}</div>`;
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
        let ret = `<div class="url-tools">`;
        // 利用 name 属性保存绑定的 URL
        ret += `<button name="${url}">添加副本</button>`;
        ret += `</div>`;
        return ret;
      }

      return "";
    },
    // 将简介中的视频连接存为副本
    postAsCopy(event) {
      if (event.target.nodeName.toString() != "BUTTON") return;
      let url = event.target.name;
      this.loading = true;
      this.axios({
        method: "post",
        url: "be/postvideo.do",
        data: {
          copy: this.myVideoData.video._id.$oid,
          url: url,
          tags: this.myVideoData.tags,
        },
      }).then((result) => {
        if (result.data.status == "SUCCEED") {
          this.open1("副本添加成功！");
          // this.searchVideo();
          // 不知道为什么只能通过刷新才能显示副本
          this.$router.go(0);
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
          src: URL,
        },
      }).then((result) => {
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
          vid: this.$route.query.id,
        },
        withCredentials: true,
      }).then((result) => {
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
          tags: this.myVideoData.tags,
        },
      }).then((result) => {
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
  },
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
.shortTitleForPageVideos {
  display: inline-block;
  vertical-align: middle;
  white-space: nowrap;
  text-overflow: ellipsis;
  max-width: 450px;
  overflow: hidden;
}
.shortTitleForTitleOfPageVideos {
  display: inline-block;
  vertical-align: middle;
  color: #606266;
  font-size: 13px;
  white-space: nowrap;
  text-overflow: ellipsis;
  max-width: 400px;
  overflow: hidden;
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
.re_top {
  padding-bottom: 10px;
  border-bottom: 3px solid red;
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
.createNewList {
  width: 100%;
  margin-top: 10px;
}

.el-dropdown-link {
  cursor: pointer;
  color: #409eff;
}
.el-icon-arrow-down {
  font-size: 12px;
}
</style>
