<!--    vue页面：ListDetail.vue     -->
<!--
    页面：视频列表的详细信息
    功能：展示展示视频列表的详细信息
    更新日志：
-->

<template>
  <div class="listDetail">
    <topnavbar />

    <!-- EditTags 组件-->
    <EditTags v-if="showTagPanel" ref="editTag" :msg="temporaryValForVLP" :visible.sync="showTagPanel"></EditTags>

    <!-- 编辑视频列表时的对话框 -->
    <el-dialog :title="$t('edit_list_info_dialog.title')" :visible.sync="openListEdit" width="40%" :close-on-click-modal="false">
      <el-form ref="list" :model="playlist_metadata" label-width="auto" :rules="rules">
        <!-- 标题 -->
        <el-form-item prop="title">
          <el-input v-model="playlist_metadata.title" :placeholder="$t('edit_list_info_dialog.list_title_tip')"></el-input>
        </el-form-item>
        <!-- 简介 -->
        <el-form-item prop="desc">
          <el-input
            v-model="playlist_metadata.desc"
            type="textarea"
            :autosize="{ minRows: 6 }"
            :placeholder="$t('edit_list_info_dialog.list_introduction_tip')"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-checkbox v-model="playlist_metadata.private">{{ $t("edit_list_info_dialog.set_private_list") }}</el-checkbox>
        </el-form-item>
        <el-form-item class="createList">
          <el-button type="primary" style="width: 80%;" :loading="loading" @click="onSubmit">{{ $t("edit_list_info_dialog.btn_ok") }}</el-button>
          <el-button style="width: 80%; margin-top: 10px; margin-left: 0px;" @click="openListEdit = false">{{
            $t("edit_list_info_dialog.btn_cancel")
          }}</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <!-- 删除列表时的确认框 -->
    <el-dialog :title="$t('delete_dialog.title')" :visible.sync="dialogVisible" width="30%">
      <span>{{ $t("delete_dialog.content") }}</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">{{ $t("delete_dialog.btn_cancel") }}</el-button>
        <el-button
          type="primary"
          @click="
            dialogVisible = false;
            deleteVideoList();
          "
          >{{ $t("delete_dialog.btn_ok") }}</el-button
        >
      </span>
    </el-dialog>

    <!-- listdetail页面的正文 -->
    <div v-loading="loading" class="w main-page-background-img">
      <div class="content">
        <!-- 视频列表介绍 -->
        <div class="deemo shadow">
          <div class="d_t">
            <!--<img src="@/static/img/5.png" style="float:left;margin-top:50px;" />
            <img src="@/static/img/1.png" style="float:right;margin-top:50px;" />-->
            <div class="leftcon">
              <img :src="'/images/covers/' + videolistDetail.playlist.item.cover" style="min-height: 200px;" />
            </div>
            <div class="rightcon">
              <div class="videotitbox">
                <h2 style="text-align: left;">{{ videolistName }}</h2>
                <p>{{ videolistDesc }}</p>
              </div>
              <div class="tagbox">
                <el-tag v-for="(item, index) in videolistDetail.playlist.tags_category['Author']" :key="item" type="author" effect="plain">
                  {{ videolistDetail.playlist.tags_category["Author"][index] }}
                </el-tag>
                <el-tag v-for="(item, index) in videolistDetail.playlist.tags_category['Character']" :key="item" type="character" effect="plain">
                  {{ videolistDetail.playlist.tags_category["Character"][index] }}
                </el-tag>
                <el-tag v-for="(item, index) in videolistDetail.playlist.tags_category['Copyright']" :key="item" type="copyright" effect="plain">
                  {{ videolistDetail.playlist.tags_category["Copyright"][index] }}
                </el-tag>
                <el-tag v-for="(item, index) in videolistDetail.playlist.tags_category['General']" :key="item" type="general" effect="plain">
                  {{ videolistDetail.playlist.tags_category["General"][index] }}
                </el-tag>
                <el-tag v-for="(item, index) in videolistDetail.playlist.tags_category['Language']" :key="item" type="language" effect="plain">
                  {{ videolistDetail.playlist.tags_category["Language"][index] }}
                </el-tag>
                <el-tag v-for="(item, index) in videolistDetail.playlist.tags_category['Meta']" :key="item" type="meta" effect="plain">
                  {{ videolistDetail.playlist.tags_category["Meta"][index] }}
                </el-tag>
                <el-tag v-for="(item, index) in videolistDetail.playlist.tags_category['Soundtrack']" :key="item" type="soundtrak" effect="plain">
                  {{ videolistDetail.playlist.tags_category["Soundtrack"][index] }}
                </el-tag>
              </div>
            </div>
            <div class="taglist" style="display: inline-block;padding-right:35px;"></div>
          </div>
          <!-- 打开 Tag 编辑页面 -->
          <div v-if="editable" class="edit_box">
            <el-button type="success" @click="addVideo">{{ $t("btn_group.add_video") }}</el-button>
            <el-button type="success" @click="addFromList">{{ $t("btn_group.import_from_other") }}</el-button>
            <el-popover style="margin: 0px 10px;" width="100%" trigger="click">
              <ListFolderView v-if="isLogin" ref="listFolder" :msg="temporaryValForVLP" :visible.sync="showListFolder"></ListFolderView>
              <el-button slot="reference" type="primary" class="EditTagsButton" @click="openListFolder">{{ $t("btn_group.add_favorite") }}</el-button>
            </el-popover>

            <el-button type="info" @click="openListEdit = true">{{ $t("btn_group.edit_list_info") }}</el-button>

            <el-button type="primary" class="EditTagsButton" :disabled="showTagPanel" @click="openEditTags">{{ $t("btn_group.edit_common_tags") }}</el-button>

            <el-button type="warning" @click="inverse()">{{ $t("btn_group.reverse_list") }}</el-button>
            <el-button type="danger" @click="dialogVisible = true">{{ $t("btn_group.delete") }}</el-button>
          </div>
          <!-- 没有编辑权限的时候只提供加入收藏功能 -->
          <div v-else>
            <el-popover v-if="isLogin" style="margin: 0px 10px;" width="100%" trigger="click">
              <ListFolderView v-if="isLogin" ref="listFolder" :msg="temporaryValForVLP" :visible.sync="showListFolder"></ListFolderView>
              <el-button slot="reference" type="primary" class="EditTagsButton" @click="openListFolder">{{ $t("btn_group.add_favorite") }}</el-button>
            </el-popover>
          </div>
          <!-- 评分区 -->
          <div>
            <Score type="playlist"></Score>
          </div>
        </div>

        <!-- 视频列表 -->
        <div class="recommend">
          <!-- 视频详情 -->
          <div v-for="item in videolistVideos" :key="item._id.$oid" class="minbox shadow">
            <div class="re_video">
              <div class="edit">
                <div id="edit_first">
                  <h1>{{ item.rank + 1 }}</h1>
                </div>
                <div v-if="editable" id="edit_second">
                  <Move class="move" :msg="PlaylistItemOp(item)"></Move>
                  <!--上移-->
                </div>
              </div>

              <img class="re_video_img" :src="'/images/covers/' + item.item.cover_image" />
              <div class="re_video_desc">
                <el-tooltip v-if="editable" class="item" effect="dark" :content="$t('btn_group.add_video')" placement="top">
                  <router-link
                    :to="{
                      path: './postvideo',
                      query: getInsertData(item),
                    }"
                    class="insert-video"
                  >
                    <i class="fa fa fa-plus" aria-hidden="true"></i>
                  </router-link>
                </el-tooltip>

                <h3>
                  <router-link target="_blank" :to="{ path: '/video', query: { id: item._id.$oid } }" tag="a">{{ item.item.title }}</router-link>
                </h3>
                <h4 v-if="item.item.part_name">P{{ item.item.url.slice(item.item.url.indexOf("=") + 1, item.item.url.length) }}:{{ item.item.part_name }}</h4>
                <p>{{ item.item.desc }}</p>
                <div>
                  <img :src="require('@/static/img/' + item.item.site + '.png')" width="16px" style="margin-right: 2px;" />
                  <a :href="item.item.url">
                    {{ item.item.url }}
                  </a>
                  <i class="fa fa-copy fa-lg" style="margin-left: 2px;" @click="copyVideoLink(item.item.url)"></i>
                </div>
              </div>
              <div v-if="editable" class="item_end">
                <SetCover class="set-cover" :msg="PlaylistItemOp(item)"></SetCover>
                <DeleteVideo class="delete-video" :msg="PlaylistItemOp(item)"></DeleteVideo>
              </div>
            </div>
          </div>
        </div>

        <!-- ElementUI 自带的分页器 -->
        <el-pagination
          background
          class="page-selector"
          layout="jumper, prev, pager, next, sizes"
          :current-page="page"
          :total="maxcount"
          :page-size="20"
          :page-sizes="[10, 20, 30, 40]"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        ></el-pagination>

        <!-- 评论区 -->
        <div>
          <Comments :sid="sid"></Comments>
        </div>
      </div>
    </div>

    <Footer></Footer>
  </div>
</template>

<script>
import topnavbar from "@/components/main/bar/TopNavbar";
import Footer from "@/components/main/bar/Footer";
import EditTags from "@/components/tag/edit/Edit";
import Move from "@/components/playlist/edit/Move";
import DeleteVideo from "@/components/playlist/edit/VideoDelete";
import SetCover from "@/components/playlist/edit/CoverSet";
import ListFolderView from "@/components/playlist/folder/View";
import Comments from "@/components/forum/Comments";
import Score from "@/components/video/Score";
import { copyToClipboardText } from "@/static/js/generic";

export default {
  components: {
    topnavbar,
    Footer,
    EditTags,
    Move,
    DeleteVideo,
    ListFolderView,
    SetCover,
    Comments,
    Score,
  },
  data() {
    this.$i18n.locale = localStorage.getItem("lang");
    return {
      // 视频列表的元信息
      playlist_metadata: {
        title: "",
        desc: "",
        cover: "",
        private: false,
      },
      // 视频列表的详细信息
      videolistDetail: {
        playlist: {
          item: {
            cover: "",
          },
          tags_category: {
            Author: [],
            Character: [],
            Copyright: [],
            General: [],
            Language: [],
            Meta: [],
            Soundtrack: [],
          },
        },
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
      // 列表评论的 sid
      sid: "",
      // 传入 Tags 组件视频页的 ID
      videolistPid: "",
      //传入 Tags 组件视频页的 ID 临时变量
      temporaryValForVLP: "",
      // 视频列表是否属于加载状态的判断
      loading: true,
      // 打开列表详情编辑页面
      openListEdit: false,
      // 打开列表标签编辑页面
      showTagPanel: false,
      // 打开删除列表的确认界面
      dialogVisible: false,
      // 编辑列表详情的校验数据
      rules: {
        title: [
          {
            required: true,
            message: this.$t("edit_list_info_dialog.list_title_err_tip"),
            trigger: "blur",
          },
        ],
        desc: [
          {
            required: true,
            message: this.$t("edit_list_info_dialog.list_introduction_err_tip"),
            trigger: "blur",
          },
        ],
      },
      // 播放列表目录页面是否显示
      showListFolder: false,
    };
  },
  computed: {
    f1() {
      return this.$store.state.refreshCount;
    },
  },
  watch: {
    page() {
      this.getVideoList(this.page, this.count);
    },
    count() {
      this.getVideoList(this.page, this.count);
    },
    f1() {
      this.getVideoList(this.page, this.count);
    },
  },
  mounted() {
    // 查看是否登录
    if (JSON.stringify(this.$store.state.username) != "null" && this.$store.state.username != "") {
      this.isLogin = true;
    }
    this.getVideoList(this.page, this.count);
  },
  methods: {
    // 获取插入视频需要的数据
    getInsertData(e) {
      let obj = {
        pid: this.videolistPid,
        rank: e.rank,
      };
      return obj;
    },
    // 获取移动组件所需要的数据
    PlaylistItemOp(e) {
      let obj = {
        //移动组件所需要的数据
        pid: this.videolistPid,
        vid: e._id.$oid,
        page: this.page,
        page_size: this.maxcount,
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
    getVideoList(e, count) {
      // 先使页面出于加载状态
      this.loading = true;

      this.axios({
        method: "post",
        url: "be/lists/get_playlist.do",
        data: { page: e, page_size: count, pid: this.$route.query.id },
      })
        .then((result) => {
          // 请求失败的情况
          if (result.data.status == "FAILED") {
            // 列表不存在的情况，跳转到 404 页面
            if (result.data.data.reason == "PLAYLIST_NOT_EXIST") {
              this.$router.push({ path: "*" });
            }
          }
          // 页面存在的情况下
          this.videolistDetail = result.data.data;
          // 必须是登录且发来的数据是可编辑的才渲染编辑组件
          this.editable = this.videolistDetail.editable && this.isLogin;
          this.videolistName = this.videolistDetail.playlist.item.title;
          // 修改网站标题
          document.title = this.videolistName;
          this.videolistDesc = this.videolistDetail.playlist.item.desc;
          this.videolistVideos = this.videolistDetail.videos;
          // this.videolistTags = this.videolistDetail.playlist.tag_category;
          this.videolistPid = this.videolistDetail.playlist._id.$oid;
          this.maxcount = result.data.data.count;
          this.maxpage = result.data.data.page_count;
          if (result.data.data.playlist.comment_thread) {
            this.sid = result.data.data.playlist.comment_thread.$oid;
          }

          // 请求单个播放列表的元数据
          this.axios({
            method: "post",
            url: "be/lists/get_playlist_metadata.do",
            data: {
              pid: this.videolistPid,
            },
          }).then((result) => {
            this.playlist_metadata.title = result.data.data.playlist.item.title;
            this.playlist_metadata.desc = result.data.data.playlist.item.desc;
            this.playlist_metadata.private = result.data.data.playlist.item.private;
          });

          // 加载结束，加载动画消失
          this.loading = false;

          // 回到顶部
          if ($("html").scrollTop()) {
            // 动画效果
            $("html").animate({ scrollTop: 0 }, 100);
          }
        })
        .catch(() => {
          this.$router.push({ path: "/404" });
        });
    },
    // 复制视频连接
    copyVideoLink: function(url) {
      this.$alert("视频链接复制" + (copyToClipboardText(url) ? "成功！" : "失败！"), "分享链接", {
        confirmButtonText: "确定",
      });
    },
    // 添加视频
    addVideo() {
      this.$router.push({
        path: "./postvideo",
        query: {
          pid: this.videolistPid,
          rank: -1,
        },
      });
    },
    // 从其他网站的收藏夹导入视频
    addFromList() {
      this.$router.push({
        path: "./createVideoList",
        query: {
          pid: this.videolistPid,
          exist: 1,
        },
      });
    },
    // 提交视频详情修改数据
    onSubmit() {
      this.loading = true;
      this.axios({
        method: "post",
        url: "be/lists/update_playlist_metadata.do",
        data: {
          pid: this.videolistPid,
          title: this.playlist_metadata.title,
          desc: this.playlist_metadata.desc,
          private: this.playlist_metadata.private,
        },
      }).then(() => {
        this.open(this.$t("commit_tip"));
        this.openListEdit = false;
        this.getVideoList();
      });
    },
    // 列表视频倒序显示
    inverse() {
      this.loading = true;
      this.axios({
        method: "post",
        url: "/be/list/inverse.do",
        data: {
          pid: this.videolistPid,
        },
      }).then(() => {
        this.open(this.$t("oper_tip"));
        this.getVideoList();
      });
    },
    //删除列表
    deleteVideoList: function() {
      this.axios({
        method: "post",
        url: "be/lists/del_playlist.do",
        data: {
          pid: this.videolistPid,
        },
      }).then(() => {
        this.open(this.$t("delete_tip"));
        this.$router.push({ path: "/lists" });
      });
    },
    // 打开 Tag 编辑页面
    openEditTags: function() {
      this.temporaryValForVLP = this.videolistPid;
      this.showTagPanel = true;
      // this.$refs.editTag.getCommonTags();
    },
    openListFolder() {
      this.showListFolder = true;
      this.$refs.listFolder.pid = this.videolistPid;
    },
    open(message) {
      this.$message({
        message: message,
        type: "success",
      });
    },
  },
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
  /* justify-content: center; */
  align-items: center;
  .edit {
    width: 150px;
    display: flex;
    #edit_first {
      // h1
      font-size: 30px;
      min-width: 90px;
      color: rgb(98, 169, 231);
      flex-grow: 1;
      display: flex;
      justify-content: center;
      align-items: center;
    }
    #edit_first h1 {
      flex-shrink: 0;
    }
    #edit_second {
      // icon
      /deep/ .move-down-box {
        transform: translateX(-10px);
      }

      /deep/ .move {
        button {
          &:hover {
            background: none;
          }
        }
        display: flex;
        height: 100%;
        flex-direction: column;

        font: normal normal normal 14px/1 FontAwesome;
        font-size: inherit;
        text-rendering: auto;
        -webkit-font-smoothing: antialiased;

        /deep/ .move-up {
          font-size: 40px;
          height: 40px;
          /* margin-bottom: 50px; */
          color: #808080;
          transition: all 0.4s ease;
          // position: absolute;
          // top: -20px;
          &:hover {
            color: white;
            text-shadow: 0 0 5px #fff, 0 0 10px #fff, 0 0 20px #228dff, 0 0 40px #228dff;
          }
          /deep/ .move-down {
            font-size: 40px;
            height: 40px;
            color: #808080;
            transition: all 0.4s ease;

            // position: absolute;
            // bottom: 0px;
          }
        }
        /deep/ .move-down {
          font-size: 40px;
          height: 40px;
          color: #808080;
          transition: all 0.4s ease;

          &:hover {
            color: white;
            text-shadow: 0 0 5px #fff, 0 0 10px #fff, 0 0 20px #228dff, 0 0 40px #228dff;
          }

          // position: absolute;
          // bottom: 0px;
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
        text-shadow: 0 0 5px #fff, 0 0 10px #fff, 0 0 20px #228dff, 0 0 40px #228dff;
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
      text-shadow: 0 0 5px #fff, 0 0 10px #fff, 0 0 20px #228dff, 0 0 40px #228dff;
    }
  }
}

// .shadow {}
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
.d_t h2 {
  padding-top: 20px;
}
.d_t p {
  width: 60%;
  text-align: left;
  white-space: pre-line;
  margin: 10px 0 0;
}
.d_t img {
  height: 200px;
  margin: 10px;
  background-color: rgba(255, 255, 255, 0);
}
.d_t {
  width: 100%;
  margin-bottom: 0px;
  padding-bottom: 5px;
  overflow: auto;
  zoom: 1;
  .leftcon {
    float: left;
    padding: 10px 2% 0;
  }
  .rightcon {
    display: flex;
    flex-flow: column;
    justify-content: space-between;
    float: left;
    vertical-align: top;
    min-width: 750px;
    max-width: 790px;
    min-height: 220px;
    .tagbox {
      flex-wrap: wrap;
      position: relative;
      left: -4px;
      .el-tag {
        float: left;
        border-radius: 50px;
        margin-right: 15px;
        margin-top: 8px;
      }
      .el-tag--author {
        border-color: #aa0000;
        color: #aa0000;
      }
      .el-tag--character {
        border-color: #00aa00;
        color: #00aa00;
      }
      .el-tag--copyright {
        border-color: #aa00aa;
        color: #aa00aa;
      }
      .el-tag--general {
        border-color: #0073ff;
        color: #0073ff;
      }
      .el-tag--language {
        border-color: #585455;
        color: #585455;
      }
      .el-tag--meta {
        border-color: #ff8800;
        color: #ff8800;
      }
      .el-tag--soundtrak {
        border-color: #ff7792;
        color: #ff7792;
      }
    }
  }
}

.EditTagsButton {
  /* width: 70%; */
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
}
// .re_video h1 {}
.re_video_img {
  display: inline-block;
  width: 200px;
  height: 125px;
  margin-right: 20px;
  min-width: 200px;
  min-height: 125px;
}
.re_video_desc {
  width: 679px;
  display: inline-block;
  vertical-align: top;
  white-space: pre-wrap;
  position: relative;
}
.re_video_desc p {
  color: #606266;
  font-size: 1rem;
  line-height: 1.1rem;
  height: 4.3rem;
  white-space: pre-wrap;
  margin-top: 10px;
  margin-bottom: 10px;
  /* 使文字变为最多显示 4 行，多余的使用省略号代替 */
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

.createList {
  text-align: center;
}
</style>
