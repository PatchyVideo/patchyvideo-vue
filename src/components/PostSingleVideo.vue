<!--    vue组件：PostSingleVideo.vue     -->
<!--
    组件：上传单个视频
    大小：100% * 800(最小高度)
    功能：上传单个视频
    必要传入参数：无
    包含组件：EditTags.vue
    更新日志：
    1/18/2020：v1.0
      release
    1/21/2020：v1.0.1
      1.现在可以通过URL传入的参数来进一步更新上传视频的信息
    1/29/2020：v1.0.2
      1.标签编辑框在页面的位置微调
    1/30/2020：v1.0.3
      1.实现了从视频页面“使用标签发布视频”链接跳转到本页面的时候对于视频原本标签的填写
    2/2/2020：v1.0.4
      1.标签编辑组件不需要再提交标签即可获取到标签数据
      2.上传视频按钮在不进行视频验证的情况下可见
    2/3/2020：v1.0.5
      1.修复了油管和推特的视频获取功能
      2.加入了自动标签的功能
    ★待解决问题：
      暂无
-->

<i18n>
{
  "CHS": {
    "video_url": "视频地址",
    "get_info": "获取信息",
    "tag": "标签",
    "no_tag": "暂无标签！",
    "choose_repost_type": "请修改视频的发布类型",
    "post_video": "发布视频",
    "official": "原始发布",
    "official_repost": "官方再发布",
    "authorized_translation": "授权翻译",
    "authorized_repost": "授权转载",
    "translation": "自发翻译",
    "repost": "自发搬运",
    "unknown": "其他",
    "url_passed": "URL验证成功!",
    "invalid_url": "非法地址或者不支持指向的网站!",
    "enter_url": "请输入视频地址!",
    "fetch_failed": "获取视频信息失败,请检查链接是否有效!",
    "post_failed": "视频上传失败！",
    "tag_not_exist": "标签 {tag} 不存在！",
    "post_succeed": "上传成功！",
    "unknown_error": "未知错误"
  },
  "ENG": {
    "video_url": "Video URL",
    "get_info": "Fetch",
    "tag": "Tags",
    "no_tag": "No tags",
    "choose_repost_type": "Please select a repost type",
    "post_video": "Post video",
    "official": "Original",
    "official_repost": "Official Repost",
    "authorized_translation": "Authorized Translation",
    "authorized_repost": "Authorized Repost",
    "translation": "User Translation",
    "repost": "User Repost",
    "unknown": "Other",
    "url_passed": "URL verify succeed",
    "invalid_url": "Invalid URL or not supported website",
    "enter_url": "Please enter video URL",
    "fetch_failed": "Fetch failed",
    "post_failed": "Ipload failed",
    "tag_not_exist": "Tag {tag} does not exist",
    "post_succeed": "Upload succeed",
    "unknown_error": "Unknown error, please report bug"
  },
  "CHT": {
    "video_url": "視頻地址",
    "get_info": "獲取信息",
    "tag": "標簽",
    "no_tag": "暫無標簽！",
    "choose_repost_type": "請修改視頻的發布類型",
    "post_video": "發布視頻",
    "official": "原始發布",
    "official_repost": "官方再發布",
    "authorized_translation": "授權翻譯",
    "authorized_repost": "授權轉載",
    "translation": "自發翻譯",
    "repost": "自發搬運",
    "unknown": "其他",
    "url_passed": "URL驗證成功!",
    "invalid_url": "非法地址或者不支持指向的網站!",
    "enter_url": "請輸入視頻地址!",
    "fetch_failed": "獲取視頻信息失敗,請檢查鏈接是否有效!",
    "post_failed": "視頻上傳失敗！",
    "tag_not_exist": "標簽 {tag} 不存在！",
    "post_succeed": "上傳成功！",
    "unknown_error": "未知錯誤"
  }
}
</i18n>

<template>
  <div class="postBox" v-loading="loading">
    <div class="content">
      <!-- 视频输入框 -->
      <el-input
        v-model="VideoURL"
        @keyup.enter.native="onFetchVideo_Click"
        :placeholder="$t('video_url')"
      >
        <el-button slot="append" @click="onFetchVideo_Click">{{$t('get_info')}}</el-button>
      </el-input>
      <!-- 视频URL验证成功的时候出现的内容 -->
      <el-collapse-transition>
        <!-- 视频详情 -->
        <div class="videoDetail" v-show="show">
          <img :src="thumbnail" />
          <h2>{{title}}</h2>
          <p style="word-break: break-all;">{{desc}}</p>
          <!-- 标签编辑 -->
          <div class="tagsEdit" v-if="false">
            <h3>{{$t('tag')}}</h3>
            <div class="tagBox">
              <p v-if="tags==''">{{$t('no_tag')}}</p>
              <el-tag
                effect="dark"
                v-else
                v-for="item in tags"
                :key="item"
                style="margin-left:5px;margin-right:5px;margin-top:5px"
              >{{item}}</el-tag>
            </div>
          </div>
        </div>
      </el-collapse-transition>
      <!-- 视频副本 -->
      <div class="RepostType">
        <el-select v-model="RepostType" :placeholder="$t('choose_repost_type')" style="width:100%">
          <el-option
            v-for="item in RepostTypes"
            :key="item.label"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </div>
      <!-- 视频上传 -->
      <el-button class="postButton" type="primary" @click="postSingleVideo">
        {{$t('post_video')}}
        <i class="el-icon-upload el-icon--right"></i>
      </el-button>
    </div>

    <!-- 标签编辑组件 -->
    <!--    :key="refreshMark"-->
    <EditTags
      ref="EditTags"
      :msg="use_tags"
      :really="isReally"
      :visible.sync="showTagPanel"
      @getEditTagsData="TagShow"
      class="EditTags"
    ></EditTags>
  </div>
</template>

<script>
import EditTags from "../components/EditTags";
export default {
  data() {
    this.$i18n.locale = localStorage.getItem("lang");
    return {
      // 视频的URL(与输入框绑定)
      VideoURL: "",
      // 视频缩略图的地址,默认为加载中的图片
      thumbnail: require("../static/img/LoadingThumbnail.png"),
      // 视频标题
      title: "",
      // 视频详情
      desc: "",
      // 视频列表是否属于加载状态的判断
      loading: false,
      // 视频详情是否打开的判断
      show: false,
      // 标签页面是否打开
      showTagPanel: true,
      // 视频的标签数组
      tags: [],
      // 本页面的视频的发布类型
      RepostType: "unknown",
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
        { value: "repost", label: this.$t("repost") },
        { value: "unknown", label: this.$t("unknown") }
      ],
      // 匹配短地址，用以扩展成完整地址
      EXPANDERS: {},
      // 匹配URL并请求视频数据
      PARSERS: {},
      //是否点击了上传视频按钮，如果点击了则置为真，使Tag组件返回Tag数据
      isReally: false,
      //重置子组件到初始状态
      refreshMark: +new Date()
    };
  },
  computed: {
    // 视频的等级，默认为-1
    rank() {
      if (this.$route.query.rank != undefined) {
        return this.$route.query.rank;
      } else {
        return -1;
      }
    },
    // 视频所在收藏夹的pid
    pid() {
      if (this.$route.query.pid != undefined) {
        return this.$route.query.pid;
      } else {
        return "";
      }
    },
    // 视频的副本
    copy() {
      if (this.$route.query.copy != undefined) {
        return this.$route.query.copy;
      } else {
        return "";
      }
    },
    // 从视频详情界面传过来的视频的标签信息
    use_tags() {
      if (this.$route.query.use_tags != undefined) {
        return this.$route.query.use_tags;
      } else {
        return "";
      }
    }
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
        "^(https:\\/\\/|http:\\/\\/)?(www\\.)?(bilibili\\.com\\/video\\/av[\\d]+|b23\\.tv\\/[aA][vV][\\d]+)"
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
        var utags = responseDOM
          .filter('meta[itemprop="keywords"]')
          .attr("content")
          .split(/,/)
          .filter(function(i) {
            return i;
          })
          .slice(1, -4);
        that.autotag(utags, title, desc);
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
        var utags = responseDOM
          .filter('meta[name="keywords"]')
          .attr("content")
          .split(/,/)
          .filter(function(i) {
            return i;
          })
          .slice(1, -4);
        that.autotag(utags, title, desc);
        that.setVideoMetadata(thumbnailURL, title, desc);
      };
      this.EXPANDERS["^ac[\\d]+"] = function(short_link) {
        return "https://www.acfun.cn/v/" + short_link;
      };
      // N站的匹配规则
      this.PARSERS[
        "^(https:\\/\\/|http:\\/\\/)?(www\\.)?(nicovideo\\.jp\\/watch\\/(s|n)m[\\d]+|nico\\.ms\\/(s|n)m[\\d]+)"
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
        var utags = responseDOM.filter('meta[property="og:video:tag"]');
        if (utags == null || utags.length == 0) {
          utags = responseDOM.filter('meta[itemprop="og:video:tag"]');
        }
        var utags_array = [];
        for (var i = 0; i < utags.length; ++i) {
          utags_array.push($(utags[i]).attr("content"));
        }
        that.autotag(utags_array, title, desc);
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
        that
          .axios({
            method: "post",
            url: "/be/helper/get_ytb_info",
            data: {
              url: responseURL
            }
          })
          .then(result => {
            var data = result.data;
            that.setVideoMetadata(
              data.data.thumbnailURL,
              data.data.title,
              data.data.desc
            );
            that.autotag(data.data.utags, data.data.title, data.data.desc);
          })
          .catch(error => {
            that.setVideoMetadata("", "", "");
            that.ErrorFetchingVideo();
          });
      };
      // 推特的匹配规则
      this.PARSERS[
        "^(https:\\/\\/)?(www\\.|mobile\\.)?twitter\\.com\\/[\\w]+\\/status\\/[\\d]+"
      ] = function(responseDOM, responseURL) {
        that
          .axios({
            method: "post",
            url: "/be/helper/get_twitter_info",
            data: {
              url: responseURL
            }
          })
          .then(result => {
            var data = result.data;
            that.setVideoMetadata(
              data.data.thumbnailURL,
              data.data.title,
              data.data.desc
            );
            that.autotag([], data.data.title, data.data.desc);
          })
          .catch(error => {
            that.setVideoMetadata("", "", "");
            that.ErrorFetchingVideo();
          });
      };
      // 站酷的匹配规则
      this.PARSERS[
        "https://www.zcool.com.cn/work/[0-9a-zA-Z=]*.html"
      ] = function(responseDOM, responseURL) {
        var err = responseDOM.find("div.error-body");
        if (err.length > 0) {
          that.setVideoMetadata("", "", "");
          that.ErrorFetchingVideo();
          return;
        }
        var title = responseDOM.find("div.details-contitle-box")[0];
        title = title.getElementsByTagName("h2")[0].innerHTML;
        title = title.replace(/\s+/g, "");
        var num = title.search("<");
        title = title.slice(0, num);
        var desc = responseDOM.find("div.atricle-text")[0];
        desc = desc.getElementsByTagName("p")[0].innerHTML;
        desc = desc.replace(/\s+/g, "");
        desc = desc.replace(/<br\s*?\/?>/g, "\n");
        that.setVideoMetadata("", title, desc);
        that.autotag([], title, desc);
      };
    },
    // 自动标签功能
    autotag(utags, title = "", desc = "") {
      /*      this.refreshMark = +new Date();*/
      this.axios({
        method: "post",
        url: "/be/tags/autotag.do",
        data: {
          utags: utags,
          title: title,
          desc: desc,
          lang: localStorage.getItem("lang")
        }
      })
        .then(result => {
          // 向编辑标签组件传送标签
          if (result.data.status == "SUCCEED") {
            // 获取到的标签与已有标签查重
            var autoTags = result.data.data.tags;
            var resultTags = this.$refs["EditTags"].tags;
            /*   this.$refs["EditTags"].firstFlag = true;*/
            this.$refs["EditTags"].msgMark = 1;
            // 已有标签是空的情况
            if (resultTags.length == 0) {
              this.$refs["EditTags"].tags = autoTags;
              this.$refs["EditTags"].tagsForRec = JSON.parse(
                JSON.stringify(this.$refs["EditTags"].tags)
              );
            }
            // 非空的情况
            else {
              for (let i = 0; i < autoTags.length; ++i) {
                for (let j = 0; j < resultTags.length; ++j) {
                  if (this.$refs["EditTags"].tags.indexOf(autoTags[i]) != -1) {
                    break;
                  }
                  this.$refs["EditTags"].tags.push(autoTags[i]);
                  this.$refs["EditTags"].tagsForRec.push(autoTags[i]);
                }
              }

              /*        let setArray = new Set(this.$refs["EditTags"].tags);
              this.tags=Array.from(setArray);
              console.log(Array.from(setArray));*/

              /*    for (var i = 0; i < autoTags.length; i++) {
                    for (var j = 0; j < resultTags.length; j++) {
                      if (resultTags[j] == autoTags[i]) {
                        break;
                      }
                      this.$refs["EditTags"].tags.push(autoTags[i]);
                      this.$refs["EditTags"].tagsForRec.push(autoTags[i]);
                    }
                  }*/
            }
            this.$refs["EditTags"].getTagCategories(
              this.$refs["EditTags"].tags
            ); //范围转换后展示原始数据
            this.$refs["EditTags"].getRecTags(this.$refs["EditTags"].tags); //获取推荐TAG
          }
        })
        .catch(error => {
          // console.log(error);
        });
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
        message: this.$t("url_passed"),
        type: "success"
      });
    },
    // URL验证失败的弹出框
    openfailed() {
      this.$message.error(this.$t("invalid_url"));
    },
    // URL为空的弹出窗
    InvalidURL() {
      this.$message.error(this.$t("enter_url"));
    },
    // 获取视频信息失败的弹出框
    ErrorFetchingVideo() {
      this.$message.error(this.$t("fetch_failed"));
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
      user_agent = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3835.0 Safari/537.36"
    ) {
      // 把字符串作为 URI 进行编码
      url = escape(url);
      if (referrer)
        var header = JSON.stringify({
          Referer: referrer,
          "User-Agent": user_agent
        });
      else header = JSON.stringify({ "User-Agent": user_agent });
      header = escape(header);
      return `/be/helper/proxy?url=${url}&header=${header}`;
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
      if (this.thumbnail != "" && title != "") {
        this.show = true;
      }
    },
    // 判断字符串是否为空
    isEmpty(str) {
      return !str || 0 === str.length;
    },
    // 传入编辑的标签
    TagShow: function(data) {
      this.tags = data;
    },
    // 上传视频
    postSingleVideo() {
      // 验证URL是否为空
      if (this.VideoURL == "") {
        this.InvalidURL();
        return;
      }
      /*
        实际开发采用方案二

        方案一：
            Tag编辑子组件内会监视这个值，当置为真时，会返回Tags数据，但是这个行动会需要消耗一定的时间，
            导致还没有返回Tags就已经开始执行axios请求了。
            鉴于这个消耗的时间较短，且其他解决方案不太优雅，这里选择了定时器，当点击发布视频时，等10ms后执行请求。

        方案二： 为了配合左边区域tagBox的Tag标签添加成功时，能够及时显示数据，Tag编辑子组件现已修改成当用户添加或删除一个标签时，向
            会向父组件传递对应的tags数据。

        第一种方案相当于最终检验，现阶段看起来冗余、暂且注释保留

      */
      /*this.isReally = true;*/
      this.loading = true;
      this.axios({
        method: "post",
        url: "be/postvideo.do",
        data: {
          rank: this.rank,
          pid: this.pid,
          copy: this.copy,
          url: this.VideoURL,
          tags: this.tags,
          repost_type: this.RepostType
        }
      })
        .then(result => {
          if (result.data.status == "SUCCEED") {
            this.open4();
          } else if (result.data.status == "FAILED") {
            if (result.data.data.reason == "TAG_NOT_EXIST") {
              var errorTag = result.data.data.aux;
              this.open3(errorTag);
            } else {
              this.open2();
            }
          } else {
            this.open5();
          }
          this.loading = false;
        })
        .catch(err => {
          this.loading = false;
        });
      /*setTimeout(()=>{
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
              this.open2();
            }
          } else {
            this.open5();
          }
          this.loading = false;
        });
      },10)*/
    },
    // 各种各样的报错警告
    open2() {
      this.$message({
        message: this.$t("post_failed"),
        type: "error"
      });
    },
    open3(errorTag) {
      this.$message({
        message: this.$t("tag_not_exist", { tag: errorTag }),
        type: "error"
      });
    },
    open4() {
      this.$message({
        message: this.$t("post_succeed"),
        type: "success"
      });
    },
    open5() {
      this.$message({
        message: this.$t("unknown_error"),
        type: "error"
      });
    }
  },

  components: { EditTags }
};
</script>

<style scoped>
.postBox {
  width: 100%;
  min-height: 800px;
  overflow: hidden;
  display: flex;
  /* 针对webkit内核（如Safari）进行的调整 */
  display: -webkit-flex;
  margin: auto;
}

.content {
  flex: 0 0 calc(60% - 30px);
  padding-right: 15px;
  display: block;
  background-color: #ffffffc9;
  text-align: center;
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
.tagBox {
  width: 100%;
  text-align: left;
}
.RepostType {
  width: 30%;
  margin-top: 10px;
}
.postButton {
  width: 60%;
  margin-top: 20px;
  margin-bottom: 20px;
}
.EditTags {
  flex: 0 0 40%;
  display: block;
}
.EditTags /deep/ #tag {
  width: 100% !important;
  position: relative;
  background-size: cover;
}
</style>