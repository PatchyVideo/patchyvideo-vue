<!--    vue页面：IPFS_player.vue     -->
<!--
    组件：网站的实验性播放页
    功能：播放IPFS视频等
    更新日志：
    2/9/2020: v1.0 
      release
-->

<template>
  <div>
    <topnavbar />
    <div class="w main-page-background-img">
      <div class="content">
        <h1>实验性 内嵌js-ipfs播放页</h1>
        <h2>TODO:</h2>
        <ul>
          <li>"/ipfs/av....." 自动解析到本页面</li>
          <li>根据av号查到hash，填入video src中</li>
          <li>后续评论功能等</li>
          <li>—— liuAbin</li>
        </ul>

        <div id="nodes">IPFS服务初始化中...</div>
        <video id="player" controls>
          您的浏览器八成是IE
        </video>
      </div>
    </div>
    <Footer></Footer>
  </div>
</template>

<script>
import topnavbar from "../components/TopNavbar.vue";
import Footer from "../components/Footer.vue";
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
    document.title = "IPFS 视频播放页 - Patchyvideo";
  },
  mounted() {
    const IPFS = require("ipfs");
    //// IPFS Settings ////
    const ipfs = new IPFS({
      repo: "/ipfs"
    });

    const Interval = 5 * 1000;
    ipfs.once("ready", () => {
      // console.log("ipfs node ready.");
      this.nodeShow.innerHTML = "IPFS 服务已启动，正在连接...";
      setInterval(() => {
        ipfs.swarm.peers((err, peerInfos) => {
          if (err) {
            throw err;
          }
          // console.log(peerInfos.length+" ipfs node(s) connect.");
          this.nodeShow.innerHTML = peerInfos.length + " IPFS 节点已连接";
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
