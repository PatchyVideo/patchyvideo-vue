<!--    vue页面：Home.vue     -->
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
-->
<template>
  <div>
    <topnavbar />

    <!-- Detail页面的正文 -->
    <div class="w detail-page-background-img">
      <left_navbar :msg="tags"></left_navbar>

      <div class="content">
        <!-- 推荐视频栏开始  -->
        <div class="recommend">
          <!-- 视频标题 -->
          <div class="re_top">
            <h2>{{ myVideoData.item.title }}</h2>
          </div>
          <!-- 视频的链接 -->
          <h4 class="video_link">
            <a id="video_link" :href="myVideoData.item.url">{{ myVideoData.item.url }}</a>
            <!-- 一键复制的小图标 -->
            <i @click="copyVideoLink" class="fa fa-copy fa-1x"></i>
          </h4>

          <h5 style="text-align: center;">2019-11-16 13:05:22.562000 UTC</h5>

          <div class="re_video">
            <img
              src="/images/covers/f5da2d4dd9eac171d47eb1100339cbad90e4648556a2f99a.png"
              width="320px"
              height="200px"
            />
            <!-- :title="myVideoData.item.title" -->
            <!-- :alt="myVideoData.item.title" -->
            <!-- <p>{{ myVideoData.item.desc }}</p> -->
          </div>
        </div>
        <!-- 推荐视频栏结束  -->

        <div class="Copies_blibili">
          <div class="new_top">
            <h2>Copies</h2>This video has no other copies.
          </div>
          <ul></ul>
        </div>

        <div class="Playlists">
          <!-- 新视频栏开始  -->

          <div class="new_top">
            <h2>Playlists</h2>

            <p style="display: inline;">This video is not included in any playlists.</p>
          </div>
        </div>
        <ul></ul>
        <div id="tag">
          <i class="fa fa-close fa-2x" id="close"></i>
          <i class="fa fa-circle-o fa-3x" id="save"></i>
          <div class="minibox">
            <div class="m_bg"></div>
            <div class="m_a">
              <ul class="Taglist Copyright"></ul>
              <ul class="Taglist Language"></ul>
              <ul class="Taglist Character"></ul>
              <ul class="Taglist Author"></ul>
              <ul class="Taglist General"></ul>
              <ul class="Taglist Meta"></ul>
            </div>
            <div class="m_b">
              <div>
                <textarea id="ipt"></textarea>
                <!--<input class="fa fa-plus-square" type="button"value="add">-->
                <span id="addtag">
                  <i class="fa fa-plus-square fa-2x"></i>
                </span>
              </div>
            </div>
          </div>
          <span class="tag_title">Edit Tags</span>
          <span class="tag_title" style="opacity: 0;">Tag already exist</span>
          <span class="tag_title" style="opacity: 0;">Tag not exist</span>
        </div>
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
      myVideoData: {},
      tags: [],
      localStorageNum: []
    };
  },
  created() {
    window.localStorage.removeItem("loglevel:webpack-dev-server");
    console.log(this.$route.query.id);
    this.searchVideo();
    this.tagsObjToArry();
    this.tagtest();
  },
  mounted() {},
  methods: {
    // 复制视频连接
    copyVideoLink: function() {
      copyToClipboard($("#video_link"));
    },
    searchVideo() {
      /*
             vuex存储:

             for(let j=0;j<this.$store.state.videoObj.length;j++)
                for(let i=0;i<this.$store.state.videoObj[j].length;++i)
                {



                    if(this.$store.state.videoObj[j][i]._id.$oid==this.$route.query.id)
                    {
         //找到了
                        console.log("Detaail页面下的数据找到了");
                        console.log(this.$store.state.videoObj[j][i]);
                        this.myVideoData=this.$store.state.videoObj[j][i];
                    }
                }*/

      //localStorage存储：
      {
        let maxnums = [];
        for (let i in Object.keys(window.localStorage)) {
          maxnums.push(parseInt(Object.keys(window.localStorage)[i]));
        }
        for (let i = 0; i < Math.max(...maxnums); ++i) {
          if (this.localStorageNum[i] === undefined) {
            this.localStorageNum[i] = [];
          }
        }
        console.log(maxnums);
      }

      for (let m in window.localStorage) {
        if (typeof window.localStorage[m] == "string") {
          this.localStorageNum[parseInt(m)] = JSON.parse(
            window.localStorage[m]
          );
        }
      }
      for (let j = 0; j < this.localStorageNum.length; j++)
        for (let i = 0; i < this.localStorageNum[j].length; ++i) {
          if (this.localStorageNum[j][i]._id.$oid == this.$route.query.id) {
            //找到了`
            console.log("Detaail页面下的数据找到了");
            console.log(this.localStorageNum[j][i]);
            this.myVideoData = this.localStorageNum[j][i];
          }
        }
      console.log("localStorageNum:");
      console.log(this.localStorageNum);
      console.log("myVideoData:");
      console.log(this.myVideoData);
      console.log("分割");
    },
    tagsObjToArry() {
      /*     this.myVideoData.tags.forEach((item,i)=>{
                    this.tags.push(item);
                })
                console.log(this.tags);*/
    },
    tagtest() {
      this.axios({
        method: "post",
        url: "https://www.patchyvideo.com/tags/query_tag_categories.do",
        data: { tags: this.myVideoData.tags }
      }).then(result => {
        console.log(result.data.data.categorie_map);
        this.tags = result.data.data.categorie_map;
      });
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

.recommend,
.Copies_blibili,
.Playlists {
  display: block;
  margin-bottom: 10px;
}

.re_top h2,
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
  vertical-align: middle;
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
</style>
