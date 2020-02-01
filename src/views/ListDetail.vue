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
    1/16/2020:v1.0.2
      1.增加EditTags对Postvideo的支持。
      2.增加Move、DeleteVideo、SetCover 操作页面的组件，样式微调。
    1/19/2020：v1.0.2
      1.新增字体图标以及对应的元素操作。
      （由于是百分百布局，存在滚动条问题，Dialog对话框触发后滚动条消失，页面会突然向右移动铺满）
    1/20/2020：v1.0.3
      1.新增添加视频 编辑 删除模块，但是现阶段接口不支持。
    ★待解决问题：
      1.播放列表里链接的复制功能因为涉及到对dom的直接操作，所以可能会有被抓住漏洞的风险
      2.EditTags组件应仅对当前收藏列表持有者展示
      3.上下调整视频顺序等功能对非管理员可见但不可用，且鼠标放在上面的时候不显示说明
      4.视频列表为空的时候无法添加视频
-->
<template>
  <div class="listDetail">
    <topnavbar />
    <el-dialog title="提示" :visible.sync="dialogVisible" width="30%" :before-close="handleClose">
      <span>确认删除吗？</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogVisible = false;deleteVideoList()">确 定</el-button>
      </span>
    </el-dialog>

    <!-- EditTags组件-->
    <EditTags :msg="videolistPid" :visible.sync="showTagPanel"></EditTags>
    <!--如果有Pid的情况下-->
    <!--    <EditTags :msg="test" :visible.sync="showTagPanel" @getEditTagsData="editTagsData"></EditTags> 如果没有Pid的情况下 test=""  -->

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
          <div v-if="editable" class="edit_box">
            <el-button type="success">添加视频</el-button>
            <el-button type="info">编辑列表信息</el-button>
            <el-button type="primary" @click="openEditTags" class="EditTagsButton">编辑共有标签</el-button>
            <el-button type="danger" @click="dialogVisible = true">删除</el-button>
          </div>
        </div>

        <!-- 视频列表 -->
        <div class="recommend">
          <!-- 视频详情 -->
          <div class="minbox shadow" v-for="(item, index) in videolistVideos" :key="item._id.$oid">
            <div class="re_video">
              <div class="edit">
                <h1 id="edit_first">{{ index+1 }}</h1>
                <div v-if="editable" id="edit_second">
                  <Move class="move" :msg="PlaylistItemOp(item,index)"></Move>
                  <!--上移-->
                </div>
              </div>

              <img class="re_video_img" :src="'/images/covers/'+item.item.cover_image" />
              <div class="re_video_desc">
                <el-tooltip
                  v-if="editable"
                  class="item"
                  effect="dark"
                  content="在此插入视频"
                  placement="top"
                >
                  <router-link
                    :to="{path:'./postvideo',query:getInsertData(item,index)}"
                    class="insert-video"
                  >
                    <i class="fa fa fa-plus" aria-hidden="true"></i>
                  </router-link>
                </el-tooltip>

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
              <div v-if="editable" class="item_end">
                <SetCover class="set-cover" :msg="PlaylistItemOp(item,index)"></SetCover>
                <DeleteVideo class="delete-video" :msg="PlaylistItemOp(item,index)"></DeleteVideo>
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
import Move from "../components/Move.vue";
import DeleteVideo from "../components/DeleteVideo.vue";
import SetCover from "../components/SetCover.vue";
import { copyToClipboard } from "../static/js/generic";

export default {
  data() {
    return {
      dialogVisible: false,
      // 视频列表的详细信息
      videolistDetail: {
        playlist: {
          cover: ""
        }
      },
      // 判断是否登录
      isLogin: false,
      // 视频编辑功能是否可见的标志
      editable: false,
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
      showTagPanel: false,
      test: "",
      testSonVal: ""

      /*  PlaylistItemOp:{ //移动组件所需要的数据
        "pid":"",
        "vid":"",
        "page":"",
        "page_size":""
      }*/
    };
  },
  computed: {},
  mounted() {
    // 查看是否登录
    if (
      JSON.stringify(this.$store.state.username) != "null" &&
      this.$store.state.username != ""
    ) {
      this.isLogin = true;
    }
    this.getVideoList(this.page, this.count);
  },
  methods: {
    handleClose(done) {
      this.$confirm("确认关闭？")
        .then(_ => {
          done();
        })
        .catch(_ => {});
    },
    getInsertData(e, i) {
      let obj = {
        pid: this.videolistPid,
        rank: e.rank
      };
      return obj;
    },
    PlaylistItemOp(e, i) {
      let obj = {
        //移动组件所需要的数据
        pid: this.videolistPid,
        vid: e._id.$oid,
        page: this.page,
        page_size: this.maxcount
      };

      return obj;
    },
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
        // 必须是登录且发来的数据是可编辑的才渲染编辑组件
        this.editable = this.videolistDetail.editable && this.isLogin;
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
    //删除列表
    deleteVideoList: function() {
      this.axios({
        method: "post",
        url: `be/list/${this.videolistPid}/del`
      }).then(res => {
        console.log(res);
      });
    },
    // 打开Tag编辑页面
    openEditTags: function() {
      this.showTagPanel = true;
    },
    editTagsData: function(data) {
      console.log(data);
    }
  },
  computed: {
    f1() {
      return this.$store.state.refreshCount;
    }
  },
  watch: {
    page(v) {
      this.getVideoList(this.page, this.count);
    },
    count(v) {
      this.getVideoList(this.page, this.count);
    },
    f1() {
      this.getVideoList(this.page, this.count);
    }
  },
  components: { topnavbar, Footer, EditTags, Move, DeleteVideo, SetCover }
};
</script>

<style scoped lang="less">
.insert-video {
  position: absolute;
  left: 35%;
  transform: translateY(-50px);
  i {
    width: 25px;
    height: 25px;
    border-radius: 50%;
    color: white;
    border: 3px solid #006d88;
    text-shadow: 0 0 5px #fff, 0 0 10px #fff, 0 0 20px #228dff, 0 0 40px #228dff;
    text-align: center;
    background-color: black;

    z-index: 1;
    font-size: 25px;
    transition: all 0.3s ease;
  }
}
.re_video {
  display: flex;
  .edit {
    width: 15%;
    display: flex;
    #edit_first {
      //h1
      font-size: 54px;
      margin-right: 30px;
      position: relative;
      bottom: 35px;
      color: rgb(98, 169, 231);
      flex-grow: 1;
      transform: translate(50%, 50%);
    }
    #edit_second {
      //icon

      /deep/ .move-down-box {
        transform: translateX(-10px);
      }

      /deep/ .move-up {
        .move {
          flex: 1;
          height: 100%;
          font: normal normal normal 14px/1 FontAwesome;
          font-size: inherit;
          text-rendering: auto;
          -webkit-font-smoothing: antialiased;

          /deep/ .move-up {
            font-size: 40px;
            height: 40px;
            color: #808080;
            transition: all 0.4s ease;
            /*       position: absolute;
            top: -20px;*/
            &:hover {
              color: white;
              text-shadow: 0 0 5px #fff, 0 0 10px #fff, 0 0 20px #228dff,
                0 0 40px #228dff;
            }
            /deep/ .move-down {
              font-size: 40px;
              height: 40px;
              color: #808080;
              transition: all 0.4s ease;

              /*          position: absolute;
                        bottom: 0px;*/

              &:hover {
                color: white;
                text-shadow: 0 0 5px #fff, 0 0 10px #fff, 0 0 20px #228dff,
                  0 0 40px #228dff;
              }
            }
          }
          /deep/ .move-down {
            font-size: 40px;
            height: 40px;
            color: #808080;
            transition: all 0.4s ease;
            transform: translateY(120%);
            /*          position: absolute;
                        bottom: 0px;*/

            &:hover {
              color: white;
              text-shadow: 0 0 5px #fff, 0 0 10px #fff, 0 0 20px #228dff,
                0 0 40px #228dff;
            }
          }
        }
      }
    }
  }
}
.item_end {
  width: 10%;
  display: flex;
  justify-content: center;

  .delete-video {
    flex: 1;
    height: 30px;
    font-size: 30px;
    text-align: center;
    /deep/ i {
      &:hover {
        transition: all 0.4s ease;
        color: white;
        text-shadow: 0 0 5px #fff, 0 0 10px #fff, 0 0 20px #228dff,
          0 0 40px #228dff;
      }
    }
  }
  .set-cover {
    text-align: center;
    font-size: 30px;
    height: 30px;
    flex: 1;
    &:hover {
      transition: all 0.4s ease;
      color: white;
      text-shadow: 0 0 5px #fff, 0 0 10px #fff, 0 0 20px #228dff,
        0 0 40px #228dff;
    }
  }
}

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
  /*    width: 70%;*/
  margin-bottom: 20px;
}

.minbox {
  width: 1200px;
  margin-left: 12.5px;
  margin-right: 12.5px;
  margin-top: 30px;
  padding: 20px 0px;
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
}
.re_video h1 {
}
.re_video_img {
  display: inline-block;
  width: 200px;
  height: 125px;
  margin-right: 20px;
  min-width: 200px;
  min-height: 125px;
}
.re_video_desc {
  width: 850px;
  display: inline-block;
  vertical-align: top;
  white-space: pre-wrap;
  position: relative;
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