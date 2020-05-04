<!--    vue页面：IPFS_player.vue     -->
<!--
    组件：网站的实验性播放页
    功能：播放IPFS视频等
    更新日志：
    2/9/2020: v1.0 
      release
-->

<i18n>
{
  "CHS": {
    "title":"IPFS 视频播放页",
    "content":{
        "title":"实验性 内嵌js-ipfs播放页",
        "TODO1":"自动解析到本页面",
        "TODO2":"根据av号查到hash，填入video src中",
        "TODO3":"后续评论功能等",
        "init_tip":"IPFS服务初始化中..",
        "connecting_tip":"IPFS 服务已启动，正在连接..",
        "connect_success_tip":" IPFS 节点已连接",
        "err_tip":"您的浏览器八成是IE"
    }
  },
  "ENG": {
    "title":"IPFS Video play page",
    "content":{
        "title":"Experimental Embedded js-ipfs play page",
        "TODO1":"Automatically parse to this page",
        "TODO2":"Find the hash according to the av number and fill it into the video src",
        "TODO3":"Follow-up comment functions, etc.",
        "init_tip":"IPFS Service initializing..",
        "connecting_tip":"IPFS Service started, connecting..",
        "connect_success_tip":" IPFS node is connected",
        "err_tip":"Your browser may be IE"
    }
  },
  "CHT": {
    "title":"IPFS 視頻播放頁",
    "content":{
        "title":"實驗性 內嵌js-ipfs播放頁",
        "TODO1":"自動解析到本頁面",
        "TODO2":"根據av號查到hash，填入video src中",
        "TODO3":"後續評論功能等",
        "init_tip":"IPFS服務初始化中..",
        "connecting_tip":"IPFS 服務已啟動，正在連接..",
        "connect_success_tip":" IPFS 節點已連接",
        "err_tip":"您的瀏覽器八成是IE"
    }
  }
}
</i18n>

<template>
  <div>
    <topnavbar />
    <div class="w main-page-background-img">
      <div class="content">
        <h1>{{$t('content.title')}}</h1>
        <h2>TODO:</h2>
        <ul>
          <li>"/ipfs/av....." {{$t('content.TODO1')}}</li>
          <li>{{$t('content.TODO2')}}</li>
          <li>{{$t('content.TODO3')}}</li>
          <li>—— liuAbin</li>
        </ul>

        <div id="nodes">{{$t('content.init_tip')}}</div>
        <video id="player" controls>{{$t('content.err_tip')}}</video>
      </div>
    </div>
    <Footer></Footer>
  </div>
</template>

<script>
import topnavbar from "../components/TopNavbar.vue";
import Footer from "../components/Footer.vue";

import IPFS from "ipfs";
import VideoStream from "videostream";

export default {
  data() {
    return {};
  },
  computed: {
    nodeShow() {
      return document.getElementById("nodes");
    }
  },
  created() {
    // 修改网站标题
    document.title = this.$t("title") + " - Patchyvideo";
  },
  mounted() {
    //// IPFS Settings ////
    const ipfs = new IPFS({
      repo: "/ipfs"
    });

    const Interval = 5 * 1000;
    ipfs.once("ready", () => {
      // console.log("ipfs node ready.");
      this.nodeShow.innerHTML = this.$t("content.connecting_tip");
      setInterval(() => {
        ipfs.swarm.peers((err, peerInfos) => {
          if (err) {
            throw err;
          }
          // console.log(peerInfos.length+" ipfs node(s) connect.");
          this.nodeShow.innerHTML =
            peerInfos.length + this.$t("content.connect_success_tip");
        });
      }, Interval);
      const player = document.getElementById("player");
      var vs = this.genIpfsVideo(
        ipfs,
        "QmcAmXANyKjCfRoy9HAHA2tK4c3ujHH2yekwZwNTD6gTDh",
        player
      );
    });
  },
  methods: {
    // This is a function to simplify the js
    // Need: Ipfs node init
    genIpfsVideo(ipfsnode, hash, element) {
      let stream;

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
  components: { topnavbar, Footer }
};
</script>

<style scoped>
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
.content {
  background-color: #ffffffc9;
}
</style>
