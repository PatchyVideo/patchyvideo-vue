<template>
  <div>
    <top-navbar></top-navbar>

    <div class="content mt-4">
      <div>
        <el-alert type="info">
          <div style="color:black;font-size:1.2em">
            <h3>意见反馈</h3>
            <p>
              在这里反馈在帕琪站遇到的问题~<br />
              建议将问题详细描述并尽量附带截图或日志。<br />
              （截图可以使用 img标签 + 图床，日志请尽量使用 pastebin）
            </p>
          </div>
        </el-alert>
      </div>
      <!-- 帖子表 -->
      <el-table
        :data="[...threadPinned, ...threadList]"
        :empty-text="emptyText"
        style="width: 100%"
      >
        <el-table-column label="帖子">
          <template slot-scope="thread">
            <div>
              <router-link
                :to="
                  '/forum/5e8fce11beb63ebb98f8b50c/post/' + thread.row._id.$oid
                "
                ><h3 class="mb-1">
                  <i
                    v-if="thread.row.pinned"
                    class="comment-bar-item pv-icon-pin"
                  ></i
                  >{{ thread.row.title }}
                </h3></router-link
              >
              <p>帖子还没有预览哦~</p>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="作者" width="180">
          <template slot-scope="thread">
            <div v-if="threadAuthorsInfo[thread.row.thread_obj[0].owner.$oid]">
              <router-link
                :to="'/users/' + thread.row.thread_obj[0].owner.$oid"
                target="_blank"
                :title="
                  threadAuthorsInfo[thread.row.thread_obj[0].owner.$oid].profile
                    .username
                "
              >
                <el-avatar
                  size="small"
                  :src="
                    'be/images/userphotos/' +
                      threadAuthorsInfo[thread.row.thread_obj[0].owner.$oid]
                        .profile.image
                  "
                  class="vertical-align:middle"
                ></el-avatar>
              </router-link>
            </div>
            <div v-else>Loading...</div>
          </template>
        </el-table-column>
        <el-table-column prop="address" label="跟贴" width="60">
          <template slot-scope="thread">
            <div>
              <b>{{ thread.row.thread_obj[0].count }}</b>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <div style="text-align:center;margin-top:4px">
        <el-button
          type="primary"
          size="small"
          plain
          style="display:inline-flex;vertical-align:middle;"
          disabled
          >暂无功能</el-button
        >
        <el-pagination
          background
          layout="jumper, prev, pager, next, sizes"
          :current-page.sync="page"
          :total="maxcount"
          :page-size.sync="pageSize"
          :page-sizes="[10, 20, 30, 40]"
          class="page-selector"
          style="display:inline-flex;vertical-align:middle;"
        ></el-pagination>
        <el-button
          type="primary"
          size="small"
          plain
          style="display:inline-flex;vertical-align:middle;"
          @click="post2"
          >发表新帖</el-button
        >
      </div>
      <el-dialog title="意见反馈 > 发表新帖" :visible.sync="postT.visible">
        <h2 style="display:inline-flex;color: #2c3e50;">
          意见反馈 >
        </h2>
        <el-form
          :model="postF"
          @submit.native.prevent
          style="display:inline-flex"
        >
          <el-input
            v-model="postF.title"
            style="width:320px"
            placeholder="在这里填写标题~"
          ></el-input
        ></el-form>
        <div class="t"></div>
        <div
          style="margin-top:16px;border: 1px solid #d1d5da;border-radius: 3px;margin-left:58px;"
        >
          <div class="left-avatar">
            <el-avatar size="large" :src="user.avatar"></el-avatar>
          </div>
          <div class="comment-box">
            <div class="title-div">
              <p class="title">
                <span v-if="user.username">{{ user.username }}</span
                ><span v-else>Loading...</span>&nbsp;<span style="color: gray;"
                  >来说点什么吧</span
                >
              </p>
            </div>
            <div class="comment-div" style="padding: 15px;">
              <el-form :model="postF" @submit.native.prevent>
                <el-input
                  type="textarea"
                  v-model="postF.comment"
                  required
                ></el-input>
              </el-form>
            </div>
          </div>
        </div>
        <div slot="footer" class="dialog-footer">
          <span style="color:gray">注：建议先预览再发贴，提前发现问题</span
          >&emsp;
          <el-button @click="postF.show = true">预览</el-button>
          <el-button type="primary" @click="post()">发表</el-button>
        </div>
      </el-dialog>
      <el-dialog
        v-if="postF.show"
        title="意见反馈 > 预览帖子"
        :visible.sync="postF.show"
      >
        <h2 style="color: #2c3e50;">
          意见反馈 > {{ postF.title || "Loading..." }}
        </h2>
        <div class="t"></div>
        <div
          style="margin-top:16px;border: 1px solid #d1d5da;border-radius: 3px;margin-left:58px;"
        >
          <div class="left-avatar">
            <el-avatar size="large" :src="user.avatar"></el-avatar>
          </div>
          <div class="comment-box">
            <div class="title-div">
              <p class="title">
                <span>{{ user.username || "Loading" }}</span
                >&nbsp;<span style="color: gray;"
                  ><i class="el-icon-date"></i>&thinsp;{{
                    time(+new Date())
                  }}</span
                >
              </p>
            </div>
            <div class="comment-div" style="padding: 15px;">
              <div v-shadow>
                <thread-comment
                  :html="parse(postF.comment)"
                  :size="0.9"
                ></thread-comment>
              </div>
            </div>
          </div>
        </div>
      </el-dialog>
    </div>

    <cfooter></cfooter>
  </div>
</template>

<script>
import topNavbar from "../components/TopNavbar.vue";
import cfooter from "../components/Footer.vue";
import ThreadComment from "../components/ThreadComment.vue";

import { changeSiteTitle } from "../static/js/base";
import { parse } from "../static/js/postparser";

export default {
  components: {
    topNavbar,
    cfooter,
    ThreadComment
  },
  data() {
    return {
      emptyText: "少女祈祷中...",
      threadList: [],
      threadPinned: [],
      threadAuthorsInfo: {},
      page: 1,
      pageSize: 20,
      postT: {
        visible: false,
        comment: {}
      },
      postF: {
        show: false,
        title: "",
        comment: ""
      }
    };
  },
  computed: {
    user() {
      return {
        username: this.$store.state.username,
        avatar:
          this.$store.state.userAvatar == "default"
            ? require("../static/img/defaultAvatar.jpg")
            : "be/images/userphotos/" + this.$store.state.userAvatar
      };
    },
    maxcount() {
      return this.threadList ? this.threadList.length : 0;
    }
  },
  watch: {
    page(newV, oldV) {
      this.fetchData();
    },
    pageSize(newV, oldV) {
      this.fetchData();
    }
  },
  mounted() {
    this.fetchData();
  },
  methods: {
    fetchData() {
      this.axios({
        method: "post",
        url: "/be/forums/view_forum.do",
        data: {
          forum_id: this.$route.params.fid,
          page: this.page,
          page_size: this.pageSize
        }
      })
        .then(result => {
          if (result.data.status == "SUCCEED") {
            this.threadPinned = result.data.data.threads_pinned;
            this.threadList = result.data.data.threads;
            const threadAuthorUIDs = [];
            result.data.data.threads.forEach(data => {
              threadAuthorUIDs.push(data.thread_obj[0].owner.$oid);
            });
            this.axios({
              method: "post",
              url: "/be/user/profile_batch.do",
              data: {
                uids: threadAuthorUIDs
              }
            }).then(result => {
              result.data.data.forEach(data => {
                this.$set(this.threadAuthorsInfo, data._id.$oid, data);
              });
            });
            changeSiteTitle("意见与反馈 - 讨论版");
          }
        })
        .catch(error => {
          this.emptyText = error.toString();
          // this.$router.push({ path: "/404" });
        });
    },
    post2() {
      this.$set(this.postT, "visible", true);
    },
    post() {
      this.axios({
        method: "post",
        url: "/be/forums/post_thread.do",
        data: {
          forum_id: this.$route.params.fid,
          title: this.postF.title,
          text: this.postF.comment
        }
      })
        .then(result => {
          if (result.data.status == "SUCCEED") {
            this.$message({
              type: "info",
              message: "发帖成功！正在跳转~"
            });
            this.$router.push({
              path:
                "/forum/" +
                this.$route.params.fid +
                "/post/" +
                result.data.data.thread_id
            });
          } else {
            throw result.data.status;
          }
        })
        .catch(error => {
          this.$message({
            type: "error",
            message: "发帖失败：" + e.message
          });
        });
    },
    time(t) {
      function i2(i) {
        return (Array(2).join(0) + i).slice(-2);
      }
      const time = new Date(t);
      return `${time.getFullYear()}-${i2(time.getMonth() + 1)}-${i2(
        time.getDate()
      )} ${i2(time.getHours())}:${i2(time.getMinutes())}:${i2(
        time.getSeconds()
      )}`;
    },
    parse(c) {
      try {
        return parse(c);
      } catch (e) {
        return (
          '<div style="font-family:Consolas">Error: ' +
          e.message.replace(/ /g, "&nbsp;").replace(/\n/g, "<br />") +
          "</div>"
        );
      }
    }
  }
};
</script>

<style scoped>
@import "../static/img/svg/style.css";
.content {
  text-align: left;
  max-width: 1110px;
  margin: auto;
}
.mt-4 {
  margin-top: 1em;
}
.mt-2 {
  margin-top: 0.25em;
}
.mb-2 {
  margin-bottom: 0.5em;
}
.mb-1 {
  margin-bottom: 0.25em;
}
.t {
  margin-bottom: 16px;
  padding-bottom: 16px;
  border-bottom: 1px solid #e1e4e8;
}
.left-avatar {
  position: absolute;
  left: 16px;
}
.title {
  padding-top: 8px;
  padding-bottom: 8px;
  color: #586069;
  flex: 1 1 auto;
}
.title-div {
  background-color: #f6f8fa;
  border-bottom: 1px solid #d1d5da;
  padding-right: 16px;
  padding-left: 16px;
  display: flex;
  flex-direction: row;
  align-items: center;
}
.comment-box {
  position: relative;
}
.comment-box:after,
.comment-box:before {
  position: absolute;
  top: 11px;
  right: 100%;
  left: -16px;
  display: block;
  width: 0;
  height: 0;
  pointer-events: none;
  content: " ";
  border-color: transparent;
  border-style: solid solid outset;
}
.comment-box:before {
  border-width: 8px;
  border-right-color: #d1d5da;
}
.comment-box:after {
  margin-top: 1px;
  margin-left: 2px;
  border-width: 7px;
  border-right-color: #f6f8fa;
}
.comment-div {
  overflow: visible;
  font-size: 14px;
}
</style>