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
      新增添加副本 删除副本 由此创建播放列表功能，除了添加副本和删除副本能正常使用外，其余接口暂不支持
    ★待解决问题：
      1.侧导航条的标签列表的标签内容显示有问题
      3.视频介绍里的链接功能尚未实现 
      4.按下浏览器的后退按钮网站没有刷新数据
-->
<template>
  <div>
    <topnavbar />

    <!-- Detail页面的正文 -->
    <div class="w detail-page-background-img" v-loading="loading">
      <left_navbar :msg="myVideoData.tag_by_category"></left_navbar>

      <div class="content">
        <!-- 推荐视频栏开始  -->
        <div class="recommend">
          <div class="re_top">
            <h2>{{ myVideoData.video.item.title }}</h2>
          </div>
          <h4 class="video_link">
            <a id="video_link" :href="myVideoData.video.item.url">
              {{
              myVideoData.video.item.url
              }}
            </a>
            <!-- 一键复制的小图标 -->
            <i @click="copyVideoLink" class="fa fa-copy fa-1x"></i>
          </h4>
          <!-- 视频上传时间（？） -->
          <h5 style="text-align: center;">{{ videodate }}</h5>

          <!-- 视频详细信息 -->
          <div class="re_video">
            <img
             :src="'/images/covers/'+myVideoData.video.item.cover_image"
              width="320px"
              height="200px"
            />
            <!-- :alt="myVideoData.item.title" -->
            <!-- :title="myVideoData.item.title" -->
            <p>{{ myVideoData.video.item.desc }}</p>
          </div>
        </div>

        <!-- 副本列表 -->
        <div class="Copies_blibili">
          <div class="new_top">
            <h2>副本</h2>
            <p v-if="myVideoData.copies == ''">
              此视频不存在副本
              <router-link :to="{path:'./postvideo',query:{copy:this.pid}}" tag="a"><el-button type="text">[添加副本]</el-button></router-link>
            </p>
            <p v-else>
              此视频有{{ myVideoData.copies.length }}个副本

              <router-link :to="{path:'./postvideo',query:{copy:this.pid}}" tag="a"><el-button type="text">[添加副本]</el-button></router-link>
              <!--    <a @click="breaklink()">[删除此副本] </a>-->
              <el-button type="text" @click="dialogVisible = true;">[删除此副本] </el-button>
              <el-button type="text"@click="broadcastTags()">[同步副本标签]</el-button>

            </p>

          </div>
          <ul v-for="item in myVideoData.copies" :key="item._id.$oid">
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
          </ul>
        </div>

        <!-- 播放列表 -->
        <div class="Playlists">
          <div class="new_top">
            <h2>播放列表</h2>
            <p v-if="myVideoData.playlists == ''">
              本视频不包含于任何播放列表中
              <el-button type="text" @click="newFromSingleVideo()">[由此视频创建播放列表]</el-button>
            </p>
            <p v-else>
              此视频存在于{{ myVideoData.playlists.length }}个播放列表中
              <el-button type="text" @click="newFromSingleVideo()">[由此视频创建播放列表]</el-button>
            </p>

          </div>
          <ul v-for="item in myVideoData.playlists" :key="item._id.$oid">
            <!-- 将页面参数刷新并重载页面，其中@click.native应该是router-link为了阻止a标签的默认跳转事件 -->
            <router-link
              v-if="item.prev != ''"
              :to="{ path: '/video', query: { id: item.prev } }"
              tag="a"
              @click.native="reload"
            >【前一篇】</router-link>
            <span v-else>【没有前一篇了哦】</span>
            <router-link
              :to="{ path: '/listDetail', query: { id: item._id.$oid } }"
              tag="a"
              @click.native="reload"
            >{{ item.title.english }}</router-link>
            <router-link
              v-if="item.next != ''"
              :to="{ path: '/video', query: { id: item.next } }"
              tag="a"
              @click.native="reload"
              style="float:right"
            >【后一篇】</router-link>
            <span v-else style="float:right">【没有后一篇了哦】</span>
          </ul>
        </div>
      </div>
      <el-dialog
              title="提示"
              :visible.sync="dialogVisible"
              width="30%"
              :before-close="handleClose">
        <span>确认删除？</span>
        <span slot="footer" class="dialog-footer">
    <el-button @click="dialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="dialogVisible = false;breaklink();">确 定</el-button>
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
    return {
      // 视频的详细信息
      myVideoData: {
        // 视频的副本列表
        copies: [],
        // 视频的播放列表
        playlists: [],
        // 视频的标签列表(已分类)
        tag_by_category: {},
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
            url: ""   ,
            //视频封面
            cover_image:""
          }
        }

      },
      dialogVisible: false, //删除提示框
      pid:"", //视频的id值
      // 视频列表是否属于加载状态的判断
      loading: true
      // 获取到的所有视频，以页数为第一维组成二维数组(和localStorage存储一起使用，已被弃用）
      // localStorageNum: []
    };
  },
  computed: {
    // 视频的上传日期
    videodate() {
      var upload_time = new Date(this.myVideoData.video.item.upload_time.$date);
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
        M +
        "-" +
        d +
        " " +
        h +
        ":" +
        m +
        ":" +
        s +
        " GMT+0800"
      );
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

  },
  methods: {
    handleClose(done) {
      this.$confirm('确认关闭？')
              .then(_ => {

                done();
              })
              .catch(_ => {});
    },
    open1() {
      this.$message('这是一条消息提示');
    },
    open2() {
      this.$message({
        message: '同步成功！',
        type: 'success'
      });
    },

    open3() {
      this.$message({
        message: 'Tag已存在！',
        type: 'warning'
      });
    },

    open4() {
      this.$message.error('请输入合法的Tag!');
    },
    newFromSingleVideo(){
      this.axios({
        method:"post",
        url:"be/lists/newfromsinglevideo.do",
        data:{"vid":this.pid}
      }).then(res=>{

      }).catch(err=>{
        console.log(err);
      })
    },
    breaklink(){
      this.axios({
        method: "post",
        url:"be/videos/breaklink.do",
        data:{"video_id":this.pid}
      }).then(res=>{

        this.$router.go(0);
      })

    },
    broadcastTags(){
      this.axios({
        method:"post",
        url:"be/videos/broadcasttags.do",
        data:{"src":this.pid}
      }).then(res=>{
        this.open2();
        console.log(res);
      })

    },
    // 复制视频连接
    copyVideoLink: function() {
      copyToClipboard($("#video_link"));
    },
    // 查询视频详细信息
    searchVideo: function() {
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
        data: { vid: this.$route.query.id }
      }).then(result => {
        this.myVideoData = result.data.data;

        // 修改网站标题
        document.title = this.myVideoData.video.item.title;
        this.pid = this.myVideoData.video._id.$oid;
        // 加载结束,加载动画消失
        this.loading = false;
      });
    },
    // 刷新页面
    reload: function() {
      this.$router.go(0);
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
</style>
