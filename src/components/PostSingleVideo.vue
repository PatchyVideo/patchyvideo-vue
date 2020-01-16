<!--    vue组件：PostSingleVideo.vue     -->
<!--
    组件：上传单个视频
    大小：100% * 800(最小高度)
    功能：上传单个视频
    必要传入参数：无
    更新日志：
    ★待解决问题：
      1.视频URL的验证逻辑有待进一步改进
      2.在播放列表里上传视频的时候的接口有待改进
-->

<template>
  <div class="postBox" v-loading="loading">
    <!-- 视频输入框 -->
    <el-input v-model="VideoURL" @keyup.enter.native="onFetchVideo_Click" placeholder="视频地址">
      <el-button slot="append" @click="onFetchVideo_Click">获取信息</el-button>
    </el-input>
    <!-- 视频URL验证成功的时候出现的内容 -->
    <el-collapse-transition>
      <!-- 视频详情 -->
      <div class="videoDetail" v-show="show">
        <img :src="thumbnail" />
        <h2>{{title}}</h2>
        <p>{{desc}}</p>
        <!-- 标签编辑 -->
        <div class="tagsEdit">
          <h3>标签编辑</h3>
          <el-tag
            :key="tag"
            v-for="tag in tags"
            closable
            :disable-transitions="false"
            @close="handleClose(tag)"
          >{{tag}}</el-tag>
          <el-input
            class="input-new-tag"
            v-if="inputVisible"
            v-model="inputValue"
            ref="saveTagInput"
            size="small"
            @keyup.enter.native="handleInputConfirm"
            @blur="handleInputConfirm"
          ></el-input>
          <el-button v-else class="button-new-tag" size="small" @click="showInput">+ New Tag</el-button>
        </div>
        <!-- 视频上传 -->
        <el-button class="postButton" type="primary" @click="postSingleVideo">
          上传视频
          <i class="el-icon-upload el-icon--right"></i>
        </el-button>
      </div>
    </el-collapse-transition>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 视频的URL(与输入框绑定)
      VideoURL: "",
      // 视频缩略图的地址
      thumbnail: require("../static/img/LoadingThumbnail.png"),
      // 视频标题
      title: "",
      // 视频详情
      desc: "",
      // 视频列表是否属于加载状态的判断
      loading: false,
      // 视频详情是否打开的判断
      show: false,
      // 视频的等级，默认为-1
      rank: -1,
      // 视频所在收藏夹的pid
      pid: "",
      // 视频的副本
      copy: "",
      // 视频的标签数组
      tags: [],
      // 标签的相关设置
      inputVisible: false,
      // 正在编辑中的标签的数据
      inputValue: "",
      // 匹配短地址，用以扩展成完整地址
      EXPANDERS: {},
      // 匹配URL并请求视频数据
      PARSERS: {}
    };
  },
  created() {},
  mounted() {
    this.buildParsersAndExpanders();
  },
  methods: {
    // 匹配URL的相关设置
    // 通过URL获取视频的各种缩略图,题目和简介
    buildParsersAndExpanders() {
      var that = this;
      // B站的匹配规则
      this.PARSERS[
        "^(https:\\/\\/|http:\\/\\/)?(www\\.)?bilibili\\.com\\/video\\/av[\\d]+"
      ] = function(responseDOM, responseURL) {
        var err = responseDOM.find("div.error-body");
        if (err.length > 0) {
          that.setVideoMetadata("", "", "");
          that.ErrorFetchingVideo();
          return;
        }
        var thumbnailURL = responseDOM
          .filter('meta[itemprop="thumbnailUrl"]')
          .attr("content");
        var title = responseDOM.find("h1.video-title").attr("title");
        var desc = responseDOM.find("div.info.open").text();
        // var utags = responseDOM
        //   .filter('meta[itemprop="keywords"]')
        //   .attr("content")
        //   .split(/,/)
        //   .filter(function(i) {
        //     return i;
        //   })
        //   .slice(1, -4);
        // autotag(utags);
        that.setVideoMetadata(thumbnailURL, title, desc);
      };
      this.EXPANDERS["^av[\\d]+"] = function(short_link) {
        return "https://www.bilibili.com/video/" + short_link;
      };
      // A站的匹配规则
      this.PARSERS[
        "^(https:\\/\\/|http:\\/\\/)?(www\\.)?acfun\\.cn\\/v\\/[aA][cC][\\d]+"
      ] = function(responseDOM, responseURL) {
        var err = responseDOM.find("div.error-body");
        if (err.length > 0) {
          that.setVideoMetadata("", "", "");
          that.ErrorFetchingVideo();
          return;
        }
        var thumbnailURL = "";
        var title = responseDOM.find("h1.title").text();
        var desc = responseDOM
          .filter('div[class="description-container"]')
          .text();
        if (desc == null) {
          desc = responseDOM.find('div[class="J_description"]').text();
        }
        desc = desc.replace(/<br\s*?\/?>/g, "\n");
        // var utags = responseDOM
        //   .filter('meta[name="keywords"]')
        //   .attr("content")
        //   .split(/,/)
        //   .filter(function(i) {
        //     return i;
        //   })
        //   .slice(1, -4);
        // autotag(utags);
        that.setVideoMetadata(thumbnailURL, title, desc);
      };
      this.EXPANDERS["^ac[\\d]+"] = function(short_link) {
        return "https://www.acfun.cn/v/" + short_link;
      };
      // N站的匹配规则
      this.PARSERS[
        "^(https:\\/\\/|http:\\/\\/)?(www\\.)?nicovideo\\.jp\\/watch\\/(s|n)m[\\d]+"
      ] = function(responseDOM, responseURL) {
        // TODO: handle error
        var thumbnailURL = responseDOM
          .filter('meta[itemprop="thumbnailUrl"]')
          .attr("content");
        if (thumbnailURL == null) {
          thumbnailURL = responseDOM
            .filter('meta[name="thumbnail"]')
            .attr("content");
        }
        var title = responseDOM.filter('meta[itemprop="name"]').attr("content");
        if (title == null) {
          title = responseDOM
            .filter('meta[property="og:title"]')
            .attr("content");
        }
        var desc = responseDOM
          .filter('meta[itemprop="description"]')
          .attr("content");
        if (desc == null) {
          desc = responseDOM.filter('meta[name="description"]').attr("content");
        }
        // var utags = responseDOM.filter('meta[property="og:video:tag"]');
        // if (utags == null || utags.length == 0) {
        //   utags = responseDOM.filter('meta[itemprop="og:video:tag"]');
        // }
        // var utags_array = [];
        // for (var i = 0; i < utags.length; ++i) {
        //   utags_array.push($(utags[i]).attr("content"));
        // }
        // autotag(utags_array);
        that.setVideoMetadata(thumbnailURL, title, desc);
      };
      this.EXPANDERS["^(s|n)m[\\d]+"] = function(short_link) {
        return "https://www.nicovideo.jp/watch/" + short_link;
      };
      // YouTube的匹配规则
      this.PARSERS[
        "^(https:\\/\\/(www\\.|m\\.)?youtube\\.com\\/watch\\?v=[-\\w]+|https:\\/\\/youtu\\.be\\/(watch\\?v=[-\\w]+|[-\\w]+))"
      ] = function(responseDOM, responseURL) {
        if (0) {
          // var vidid = "";
          // if (responseURL.indexOf("youtube.com") >= 0) {
          //   var idx = responseURL.lastIndexOf("=");
          //   vidid = responseURL.substring(idx + 1, responseURL.length);
          // } else if (responseURL.indexOf("youtu.be") >= 0) {
          //   if (responseURL.indexOf("watch?v=") >= 0) {
          //     var idx = responseURL.lastIndexOf("=");
          //     vidid = responseURL.substring(idx + 1, responseURL.length);
          //   } else {
          //     var idx = responseURL.lastIndexOf("/");
          //     vidid = responseURL.substring(idx + 1, responseURL.length);
          //   }
          // }
          // if (isEmpty(vidid)) {
          //   that.setVideoMetadata("", "", "");
          //   that.ErrorFetchingVideo();
          //   return;
          // }
          // thumbnailURL = "https://img.youtube.com/vi/" + vidid + "/hqdefault.jpg";
          // info_file_link = proxyResource(
          //   "https://www.youtube.com/get_video_info?video_id=" + vidid
          // );
          // $.get(info_file_link, function(data, status) {
          //   if (status == "success") {
          //     //let searchParams = new URLSearchParams(data);
          //     //player_response = searchParams.get("player_response");
          //     var player_response = getQueryVariable(data, "player_response");
          //     var videoDetails = JSON.parse(player_response)["videoDetails"];
          //     var title = unescape(videoDetails.title).replace(/\+/g, " ");
          //     var desc = unescape(videoDetails.shortDescription).replace(/\+/g, " ");
          //     that.setVideoMetadata(thumbnailURL, title, desc);
          //   } else {
          //     that.setVideoMetadata("", "", "");
          //     that.ErrorFetchingVideo();
          //     return;
          //   }
          // });
        }
        postJSON(
          "/helper/get_ytb_info",
          {
            url: responseURL
          },
          function(data) {
            that.setVideoMetadata(
              data["data"]["thumbnailURL"],
              data["data"]["title"],
              data["data"]["desc"]
            );
            // autotag(data["data"]["utags"]);
          },
          function(data) {
            that.setVideoMetadata("", "", "");
            that.ErrorFetchingVideo();
          }
        );
      };
      // 推特的匹配规则
      this.PARSERS[
        "^(https:\\/\\/)?(www\\.|mobile\\.)?twitter\\.com\\/[\\w]+\\/status\\/[\\d]+"
      ] = function(responseDOM, responseURL) {
        postJSON(
          "/helper/get_twitter_info.do",
          {
            url: responseURL
          },
          function(data) {
            that.setVideoMetadata(
              data["data"]["thumbnailURL"],
              data["data"]["title"],
              data["data"]["desc"]
            );
          },
          function(data) {
            that.setVideoMetadata("", "", "");
            that.ErrorFetchingVideo();
          }
        );
      };
    },
    // 获取视频详细信息
    onFetchVideo_Click() {
      // 验证URL是否为空
      if (this.VideoURL == "") {
        this.InvalidURL();
        return;
      }
      this.loading = true;
      var url = this.VideoURL;
      var ret = this.checkURL(url);
      // URL验证通过
      if (ret[0]) {
        this.VideoURL = ret[1];
        this.fetchVideo(ret[1]);
        return;
      }
      // URL验证未通过
      else {
        this.openfailed();
        this.loading = false;
      }
      this.loading = false;
    },
    // URL标准化
    checkURL(url) {
      var pass = false;
      var new_url = "";
      // 将URL中前后的空格去除
      url = url.trim();
      for (var key in this.EXPANDERS) {
        if (new RegExp(key, "i").test(url)) {
          url = this.EXPANDERS[key](url);
          break;
        }
      }
      url = this.clearURL(url);
      for (var key in this.PARSERS) {
        if (new RegExp(key, "i").test(url)) {
          pass = true;
          new_url = url.match(new RegExp(key, "i"))[0];
          break;
        }
      }
      return [pass, new_url];
    },
    // URL标准化 * 2
    clearURL(url) {
      var url_parsed = new URL(this.addHTTP(url));
      return (
        "https://" + url_parsed.host + url_parsed.pathname + url_parsed.search
      );
    },
    // URL标准化 * 3
    addHTTP(url) {
      if (!/^(?:f|ht)tps?\:\/\//.test(url)) {
        url = "http://" + url;
      }
      return url;
    },
    // URL验证成功的弹出框
    openSuccessfully() {
      this.$message({
        message: "URL验证成功!",
        type: "success"
      });
    },
    // URL验证失败的弹出框
    openfailed() {
      this.$message.error("非法地址或者不支持指向的网站!");
    },
    // URL为空的弹出窗
    InvalidURL() {
      this.$message.error("请输入视频地址!");
    },
    // 获取视频信息失败的弹出框
    ErrorFetchingVideo() {
      this.$message.error("获取视频信息失败,请检查链接是否有效!");
    },
    // 获取视频的详细信息
    fetchVideo(url) {
      var proxy_url = this.proxyResource(url, "");
      var that = this;
      this.downloadPage(
        proxy_url,
        function(result) {
          var responseDOM = $(result);
          that.dispatchParser(url, responseDOM, url);
        },
        function(result) {
          that.setVideoMetadata("", "", "");
          that.ErrorFetchingVideo();
        }
      );
    },
    // URL代理
    proxyResource(
      url,
      referrer = "",
      user_agent = "Mozilla/5.0 (X11; Ubuntu; Linu…) Gecko/20100101 Firefox/65.0"
    ) {
      // 把字符串作为 URI 进行编码
      url = encodeURI(url);
      if (referrer)
        var header = JSON.stringify({
          Referer: referrer,
          "User-Agent": user_agent
        });
      else header = JSON.stringify({ "User-Agent": user_agent });
      header = encodeURI(header);
      return `/be/proxy?url=${url}&header=${header}`;
    },
    // 请求URL页面数据
    downloadPage(url, success, error = null, complete = null) {
      $.ajax({
        type: "GET",
        url: url,
        success: success,
        error: error,
        complete: complete
      });
    },
    // 匹配视频数据
    dispatchParser(url, responseDOM) {
      for (var key in this.PARSERS) {
        if (new RegExp(key, "i").test(url)) {
          this.PARSERS[key](responseDOM, url);
        }
      }
    },
    // 设置视频的基本信息
    setVideoMetadata(thumbnail, title, desc) {
      if (this.isEmpty(thumbnail)) {
        this.thumbnail = require("../static/img/NoThumbnail.png");
      } else {
        var thumbnail_url = this.proxyResource(thumbnail, "");
        this.thumbnail = thumbnail_url;
      }
      this.title = title;
      this.desc = desc;
      this.loading = false;
      if (thumbnail != "" && title != "" && desc != "") {
        this.show = true;
      }
    },
    // 判断字符串是否为空
    isEmpty(str) {
      return !str || 0 === str.length;
    },
    // 编辑标签的相关设置
    handleClose(tag) {
      this.tags.splice(this.tags.indexOf(tag), 1);
    },
    showInput() {
      this.inputVisible = true;
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },
    handleInputConfirm() {
      let inputValue = this.inputValue;
      // 检查标签是否重复
      for (var i = 0; i < this.tags.length; i++) {
        var item = this.tags[i];
        if (inputValue == item) {
          this.inputValue = "";
          this.open();
          return;
        }
      }
      if (inputValue) {
        this.tags.push(inputValue);
      }
      this.inputVisible = false;
      this.inputValue = "";
    },
    open() {
      this.$message({
        message: "您输入了重复的标签，请重新输入！",
        type: "warning"
      });
    },
    open2() {
      this.$message({
        message: "视频上传失败！",
        type: "error"
      });
    },
    open3(errorTag) {
      this.$message({
        message: "标签 " + errorTag + " 不存在！",
        type: "error"
      });
    },
    open4() {
      this.$message({
        message: "上传成功！",
        type: "success"
      });
    },
    open5() {
      this.$message({
        message: "未知错误",
        type: "error"
      });
    },
    // 上传视频
    postSingleVideo() {
      this.loading = true;
      this.axios({
        method: "post",
        url: "be/postvideo.do",
        data: {
          rank: this.rank,
          pid: this.pid,
          copy: this.copy,
          url: this.VideoURL,
          tags: this.tags
        }
      }).then(result => {
        if (result.data.status == "SUCCEED") {
          this.open4();
        } else if (result.data.status == "FAILED") {
          if (result.data.data.reason == "TAG_NOT_EXIST") {
            var errorTag = result.data.data.aux;
            this.open3(errorTag);
          } else {
            this.open2("视频上传失败！");
          }
        } else {
          this.open5();
        }
        this.loading = false;
      });
    }
  },
  components: {}
};
</script>

<style scoped>
.postBox {
  width: 100%;
  min-height: 800px;
  background-color: #ffffffc9;
}

.videoDetail {
  width: 100%;
  margin-top: 20px;
  text-align: center;
}
.videoDetail p {
  width: 60%;
  display: inline-block;
  text-align: left;
  white-space: pre-wrap;
}
.videoDetail img {
  width: 320px;
}
.tagsEdit {
  width: 60%;
  min-height: 50px;
  margin: 0 auto;
  margin-top: 20px;
}
.tagsEdit h3 {
  margin-top: 10px;
  margin-bottom: 10px;
}
.el-tag + .el-tag {
  margin-left: 10px;
}
.button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
.input-new-tag {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}
.postButton {
  width: 60%;
  margin-top: 20px;
  margin-bottom: 20px;
}
</style>