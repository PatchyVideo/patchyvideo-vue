<template>
  <div>
    <top-navbar></top-navbar>

    <div class="content mt-4">
      <el-row>
        <el-col :span="18">
          <h2>意见反馈 > {{ title || "Loading..." }}</h2>
          <div class="t"></div>
          <div v-for="(comment, index) in commentList" :key="index">
            <thread-comment-box
              :comment="comment"
              :commentAuthorsInfo="commentAuthorsInfo"
              @reply2="reply2"
            ></thread-comment-box>
          </div>
          <el-dialog
            :title="
              (replyT.type == 'thread' ? '主贴' : '楼中楼') + ' > 发表回复'
            "
            :visible.sync="replyT.visible"
          >
            <thread-comment-box
              v-if="replyT.comment"
              :pre="true"
              :comment="replyT.comment"
              :commentAuthorsInfo="commentAuthorsInfo"
            ></thread-comment-box>
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
                    ><span v-else>Loading...</span>&nbsp;<span
                      style="color: gray;"
                      >回复：</span
                    >
                  </p>
                </div>
                <div class="comment-div" style="padding: 15px;">
                  <el-form :model="replyF" @submit.native.prevent>
                    <el-input
                      type="textarea"
                      v-model="replyF.comment"
                      required
                    ></el-input>
                  </el-form>
                </div>
              </div>
            </div>
            <div slot="footer" class="dialog-footer">
              <span style="color:gray">注：建议先预览再发贴，提前发现问题</span
              >&emsp;
              <el-button @click="replyF.show = true">预览</el-button>
              <el-button type="primary" @click="reply()">发表</el-button>
            </div>
          </el-dialog>
          <el-dialog
            v-if="replyF.show"
            :title="
              (replyT.type == 'thread' ? '主贴' : '楼中楼') + ' > 预览回复'
            "
            :visible.sync="replyF.show"
          >
            <thread-comment-box
              v-if="replyT.comment"
              :pre="true"
              :comment="replyT.comment"
              :adcomment="
                replyT.type != 'thread'
                  ? {
                      username: user.username,
                      avatar: user.avatar,
                      comment: replyF.comment,
                      date: +new Date()
                    }
                  : null
              "
              :commentAuthorsInfo="commentAuthorsInfo"
            ></thread-comment-box>
            <div
              v-if="replyT.type == 'thread'"
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
                      :html="parse(replyF.comment)"
                      :size="0.9"
                    ></thread-comment>
                  </div>
                </div>
              </div>
            </div>
          </el-dialog>
        </el-col>
        <el-col
          :span="6"
          style="text-align:center;position:fixed;top:90px;max-width:277.5px;margin-left:832.5px"
        >
          贴子共有{{ commentList ? commentList.length : 0 }}个回复<br />
          <el-button
            type="primary"
            size="small"
            plain
            @click="reply2('thread', $route.params.tid, commentList[0])"
            >发表回复</el-button
          ></el-col
        ></el-row
      >
    </div>

    <cfooter></cfooter>
  </div>
</template>

<script>
import topNavbar from "../components/TopNavbar.vue";
import cfooter from "../components/Footer.vue";
import ThreadCommentBox from "../components/ThreadCommentBox.vue";
import ThreadComment from "../components/ThreadComment.vue";

import { changeSiteTitle } from "../static/js/base";
import { parse } from "../static/js/postparser";

export default {
  components: {
    topNavbar,
    cfooter,
    ThreadComment,
    ThreadCommentBox
  },
  data() {
    return {
      title: "",
      commentList: [],
      commentAuthorsInfo: {},
      replyT: {
        visible: false,
        conform: "",
        type: "",
        id: "",
        comment: {}
      },
      replyF: {
        show: false,
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
    }
  },
  mounted() {
    this.fetchData();
  },
  methods: {
    fetchData() {
      this.axios({
        method: "post",
        url: "/be/forums/view_thread.do",
        data: { forum_tid: this.$route.params.tid }
      })
        .then(result => {
          if (result.data.status == "SUCCEED") {
            this.commentList = [];
            this.commentAuthorsInfo = {};
            this.title = result.data.data.title;
            result.data.data.comments.forEach(value => {
              if (value.deleted) return;
              let c = JSON.parse(JSON.stringify(value));
              c.children = [];
              for (const h of value.children) {
                if (!h.deleted) c.children.push(h);
              }
              this.commentList.push(c);
            });
            // test code
            // this.commentList.push({
            //   _id: { $oid: "5ea505d8158a8745f2761268" },
            //   thread: { $oid: "5ea505d8158a8745f2761263" },
            //   content:
            //     '[[parser:"markdown" markdown-plugin:"sup"]]### markdown^test^\n\n- list\n- list\n- list\n\njavascript highlight test:\n\n``` javascript\nfunction test(){\n  console.log("highlight test")\n}\n```',
            //   hidden: false,
            //   deleted: false,
            //   upvotes: 0,
            //   downvotes: 0,
            //   meta: {
            //     created_by: { $oid: "5e8945197d85e28e616a06bd" },
            //     created_at: { $date: 1587873400000 },
            //     modified_by: { $oid: "5e8945197d85e28e616a06bd" },
            //     modified_at: { $date: 1587873400000 }
            //   },
            //   children: [
            //     {
            //       _id: { $oid: "5ea505d8158a8745f2761268" },
            //       thread: { $oid: "5ea505d8158a8745f2761263" },
            //       content: '[[parser:"markdown"]]### L2',
            //       hidden: false,
            //       deleted: false,
            //       upvotes: 0,
            //       downvotes: 0,
            //       meta: {
            //         created_by: { $oid: "5e8945197d85e28e616a06bd" },
            //         created_at: { $date: 1587873400000 },
            //         modified_by: { $oid: "5e8945197d85e28e616a06bd" },
            //         modified_at: { $date: 1587873400000 }
            //       }
            //     }
            //   ]
            // });
            // this.commentList.push({
            //   _id: { $oid: "5ea505d8158a8745f2761268" },
            //   thread: { $oid: "5ea505d8158a8745f2761263" },
            //   content: "hidden",
            //   hidden: true,
            //   deleted: false,
            //   upvotes: 0,
            //   downvotes: 0,
            //   meta: {
            //     created_by: { $oid: "5e8945197d85e28e616a06bd" },
            //     created_at: { $date: 1587873400000 },
            //     modified_by: { $oid: "5e8945197d85e28e616a06bd" },
            //     modified_at: { $date: 1587873400000 }
            //   },
            //   children: []
            // });
            // this.commentList.push({
            //   _id: { $oid: "5ea505d8158a8745f2761268" },
            //   thread: { $oid: "5ea505d8158a8745f2761263" },
            //   content:
            //     '[[chunk parser:"markdown"]]\n# Markdown\nwww\n[[/chunk]]\n[[chunk]][[h1]][[h1]]A Error.[[/h1]][[/chunk]]',
            //   hidden: false,
            //   deleted: false,
            //   upvotes: 0,
            //   downvotes: 0,
            //   meta: {
            //     created_by: { $oid: "5e8945197d85e28e616a06bd" },
            //     created_at: { $date: 1587873400000 },
            //     modified_by: { $oid: "5e8945197d85e28e616a06bd" },
            //     modified_at: { $date: 1587873400000 }
            //   },
            //   children: []
            // });
            result.data.data.users.forEach(data => {
              this.$set(this.commentAuthorsInfo, data._id.$oid, data);
            });
            changeSiteTitle(this.title + " - 讨论版");
          }
        })
        .catch(error => {
          console.error(error);
          // this.$router.push({ path: "/404" });
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
    },
    reply2(type, id, comment) {
      if (type == this.replyT.type && id == this.replyT.id) {
        this.$set(this.replyT, "visible", true);
        return;
      }
      if (this.replyF.comment != "") {
        this.$confirm("此操作将清空您已存的编辑，确定要继续吗？", "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            this.replyT = { visible: true, type, id, comment };
            this.replyF = { show: false, comment: "" };
          })
          .catch(() => {
            this.$message({
              type: "info",
              message: "回复已取消"
            });
          });
      } else {
        this.replyT = { visible: true, type, id, comment };
        this.replyF = { show: false, comment: "" };
      }
    },
    reply() {
      try {
        switch (this.replyT.type) {
          case "thread": {
            this.axios({
              method: "post",
              url: "/be/forums/add_to_thread.do",
              data: {
                forum_tid: this.$route.params.tid,
                text: this.replyF.comment
              }
            })
              .then(result => {
                if (result.data.status == "SUCCEED") {
                  this.$message({
                    type: "info",
                    message: "发表成功！"
                  });
                  this.fetchData();
                } else {
                  throw result.data.status;
                }
              })
              .catch(e => {
                throw e;
              });
            break;
          }
          case "user": {
            this.axios({
              method: "post",
              url: "/be/forums/reply.do",
              data: {
                reply_to: this.replyT.id,
                text: this.replyF.comment
              }
            })
              .then(result => {
                if (result.data.status == "SUCCEED") {
                  this.$message({
                    type: "info",
                    message: "发表成功！"
                  });
                  this.fetchData();
                } else {
                  throw result.data.status;
                }
              })
              .catch(e => {
                throw e;
              });
            break;
          }
        }
      } catch (error) {
        this.$message({
          type: "error",
          message: "发帖失败：" + e.message
        });
      }
    }
  }
};
</script>

<style>
.el-table td {
  vertical-align: top;
}
</style>

<style scoped>
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
.mb-3 {
  margin-bottom: 0.75em;
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