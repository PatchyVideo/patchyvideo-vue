<template>
  <div>
    <top-navbar></top-navbar>

    <div class="content mt-4">
      <el-row>
        <el-col :span="18">
          <h2>
            <span v-if="fid">{{ Finfo[fid].title || $t("unknowforum") }}&nbsp;>&nbsp;</span>
            <i v-if="pinned" class="comment-bar-item pv-icon-pin"></i>{{ title || "..." }}
          </h2>
          <div class="t"></div>
          <div v-for="(comment, index) in commentList" :key="index">
            <thread-comment-box
              :comment="comment"
              :index="comment._id.$oid"
              :comment-authors-info="commentAuthorsInfo"
              :user-id="userInfo.id"
              :own="userInfo.isAdmin"
              @position="position"
              @pin2="pin2"
              @edit2="edit2"
              @del2="del2"
              @reply2="reply2"
            ></thread-comment-box>
          </div>
          <div>
            <el-dialog
              :title="$t('replydia.title', { type: replyT.type == 'thread' ? $t('replydia.thread') : $t('replydia.comment') })"
              :visible.sync="replyT.visible"
            >
              <thread-comment-box v-if="replyT.comment" :pre="true" :comment="replyT.comment" :comment-authors-info="commentAuthorsInfo"></thread-comment-box>
              <div style="margin-top: 16px; border: 1px solid #d1d5da; border-radius: 3px; margin-left: 58px;">
                <div class="left-avatar">
                  <el-avatar size="large" :src="user.avatar"></el-avatar>
                </div>
                <div class="comment-box">
                  <div class="title-div">
                    <p class="title">
                      <span v-if="user.username">{{ user.username }}</span
                      ><span v-else>...</span>&nbsp;<span v-t="'replydia.reply'" style="color: gray;"></span>
                    </p>
                  </div>
                  <div class="comment-div" style="padding: 15px;">
                    <el-form :model="replyF" @submit.native.prevent>
                      <el-input v-model="replyF.comment" type="textarea" required></el-input>
                    </el-form>
                  </div>
                </div>
              </div>
              <div slot="footer" class="dialog-footer">
                <span v-t="'posthint'" style="color: gray;"></span>&emsp;
                <el-button v-t="'preview'" @click="replyF.show = true"></el-button>
                <el-button v-t="'postb'" type="primary" :disabled="processing" @click="reply()"></el-button>
              </div>
            </el-dialog>
            <el-dialog
              v-if="replyF.show"
              :title="$t('previewdia.title', { type: replyT.type == 'thread' ? $t('replydia.thread') : $t('replydia.comment') })"
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
                        date: +new Date(),
                      }
                    : null
                "
                :comment-authors-info="commentAuthorsInfo"
              ></thread-comment-box>
              <div v-if="replyT.type == 'thread'" style="margin-top: 16px; border: 1px solid #d1d5da; border-radius: 3px; margin-left: 58px;">
                <div class="left-avatar">
                  <el-avatar size="large" :src="user.avatar"></el-avatar>
                </div>
                <div class="comment-box">
                  <div class="title-div">
                    <p class="title">
                      <span>{{ user.username || "..." }}</span
                      >&nbsp;<span style="color: gray;"><i class="el-icon-date"></i>&thinsp;{{ time(+new Date()) }}</span>
                    </p>
                  </div>
                  <div class="comment-div" style="padding: 15px;">
                    <div v-shadow>
                      <thread-comment :html="parse(replyF.comment)"></thread-comment>
                    </div>
                  </div>
                </div>
              </div>
            </el-dialog>
          </div>
          <div>
            <el-dialog :title="$t('editdia.title')" :visible.sync="editF.visible">
              <div style="margin-top: 16px; border: 1px solid #d1d5da; border-radius: 3px; margin-left: 58px;">
                <div class="left-avatar">
                  <el-avatar
                    v-if="commentAuthorsInfo[editF.uid]"
                    size="large"
                    :src="'be/images/userphotos/' + commentAuthorsInfo[editF.uid].profile.image"
                  ></el-avatar>
                  <el-avatar v-else size="large" :src="require('@/static/img/defaultAvatar.jpg')"></el-avatar>
                </div>
                <div class="comment-box">
                  <div class="title-div">
                    <p class="title">
                      <span>{{ commentAuthorsInfo[editF.uid] ? commentAuthorsInfo[editF.uid].profile.username : "..." }}</span
                      >&nbsp;<span v-t="'editdia.edit'" style="color: gray;"></span>
                    </p>
                  </div>
                  <div class="comment-div" style="padding: 15px;">
                    <el-form :model="editF" @submit.native.prevent>
                      <el-input v-model="editF.comment" type="textarea" required></el-input>
                    </el-form>
                  </div>
                </div>
              </div>
              <div slot="footer" class="dialog-footer">
                <span v-t="'posthint'" style="color: gray;"></span>&emsp;
                <el-button v-t="'preview'" @click="editF.show = true"></el-button>
                <el-button v-t="'subb'" type="primary" :disabled="processing" @click="edit()"></el-button>
              </div>
            </el-dialog>
            <el-dialog v-if="editF.show" :title="$t('editpredia.title')" :visible.sync="editF.show">
              <div style="margin-top: 16px; border: 1px solid #d1d5da; border-radius: 3px; margin-left: 58px;">
                <div class="left-avatar">
                  <el-avatar
                    v-if="commentAuthorsInfo[editF.uid]"
                    size="large"
                    :src="'be/images/userphotos/' + commentAuthorsInfo[editF.uid].profile.image"
                  ></el-avatar>
                  <el-avatar v-else size="large" :src="require('@/static/img/defaultAvatar.jpg')"></el-avatar>
                </div>
                <div class="comment-box">
                  <div class="title-div">
                    <p class="title">
                      <span>{{ commentAuthorsInfo[editF.uid] ? commentAuthorsInfo[editF.uid].profile.username : "..." }}</span
                      >&nbsp;<span style="color: gray;"><i class="el-icon-date"></i>&thinsp;{{ time(+new Date()) }}</span
                      >&nbsp;<span v-t="$t('edited')" style="color: gray;"></span>
                    </p>
                  </div>
                  <div class="comment-div" style="padding: 15px;">
                    <div v-shadow>
                      <thread-comment :html="parse(editF.comment)"></thread-comment>
                    </div>
                  </div>
                </div>
              </div>
            </el-dialog>
          </div>
        </el-col>
        <el-col :span="6" style="text-align: center; position: fixed; top: 90px; max-width: 277.5px; margin-left: 832.5px;">
          {{ (commentList.length || 0) != 0 ? $t("totalreply.text", { count: commentList.length }) : $t("totalreply.empty") }}<br />
          <span v-if="user.username"
            ><el-button v-t="'reply'" type="primary" size="small" plain @click="reply2('thread', $route.params.tid, commentList[0])"></el-button
            ><el-button v-t="'pin'" type="primary" size="small" plain @click="pint2($route.params.tid)"></el-button
            ><el-button v-t="'del'" type="danger" size="small" plain @click="delt2($route.params.tid)"></el-button></span></el-col
      ></el-row>
    </div>

    <cfooter></cfooter>
  </div>
</template>

<script>
import topNavbar from "@/components/main/bar/TopNavbar";
import cfooter from "@/components/main/bar/Footer";
import ThreadCommentBox from "@/components/forum/thread/CommentBox";
import ThreadComment from "@/components/forum/thread/Comment";

import { changeSiteTitle } from "@/static/js/base";
import { parse } from "@/static/js/postparser";

export default {
  components: {
    topNavbar,
    cfooter,
    ThreadComment,
    ThreadCommentBox,
  },
  data() {
    return {
      Finfo: {
        "5e8fce11beb63ebb98f8b50c": {
          title: this.$t("5e8fce11beb63ebb98f8b50c.finfoTitle"),
        },
      },
      title: "",
      pinned: false,
      processing: false,
      commentList: [],
      commentAuthorsInfo: {},
      userInfo: {
        id: "",
        isAdmin: false,
      },
      replyT: {
        visible: false,
        conform: "",
        type: "",
        id: "",
        comment: {},
      },
      replyF: {
        show: false,
        comment: "",
      },
      editF: {
        visible: false,
        show: false,
        id: "",
        comment: "",
        bcomment: "",
        uid: "",
        count: 0,
      },
    };
  },
  computed: {
    fid() {
      return this.$route.params.fid;
    },
    user() {
      return {
        username: this.$store.state.username,
        avatar: this.$store.state.userAvatar == "default" ? require("@/static/img/defaultAvatar.jpg") : "be/images/userphotos/" + this.$store.state.userAvatar,
      };
    },
  },
  mounted() {
    this.fetchUserData();
    this.fetchData();
  },
  methods: {
    fetchUserData() {
      this.axios({
        method: "post",
        url: "/be/user/myprofile.do",
        data: {},
        withCredentials: true,
      })
        .then((result) => {
          if (result.data.status == "SUCCEED") {
            this.userInfo = {
              id: result.data.data._id.$oid,
              isAdmin: result.data.data.access_control.status == "admin",
            };
          }
        })
        .catch(() => {});
    },
    fetchData() {
      this.axios({
        method: "post",
        url: "/be/forums/view_thread.do",
        data: { forum_tid: this.$route.params.tid },
      })
        .then((result) => {
          if (result.data.status == "SUCCEED") {
            if (result.data.data.comments == []) return;
            this.commentList = [];
            this.commentAuthorsInfo = {};
            this.title = result.data.data.title;
            this.pinned = result.data.data.pinned;
            let pincl = [];
            let cl = [];
            result.data.data.comments.forEach((value) => {
              if (value.deleted) return;
              let c = JSON.parse(JSON.stringify(value));
              c.children = [];
              let cclp = [];
              let ccl = [];
              for (const h of value.children) {
                if (!h.deleted)
                  if (h.pinned) {
                    cclp.push(h);
                  } else {
                    ccl.push(h);
                  }
              }
              c.children = [...cclp, ...ccl];
              if (c.pinned) {
                pincl.push(c);
              } else {
                cl.push(c);
              }
            });
            if (!result.data.data.comments[0].pinned) {
              this.commentList.push(cl[0]);
              cl.shift();
            }
            this.commentList = [...this.commentList, ...pincl, ...cl];
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
            result.data.data.users.forEach((data) => {
              this.$set(this.commentAuthorsInfo, data._id.$oid, data);
            });
            changeSiteTitle(this.$t("forum", { title: this.title }));
          }
        })
        .catch((error) => {
          console.error(error);
          // this.$router.push({ path: "/404" });
        });
    },
    position(el) {
      const rect = el.getBoundingClientRect();
      const top = window.pageYOffset + rect.top - 10;
      setTimeout(() => {
        window.scrollTo({ behavior: "smooth", top });
      }, 200);
    },
    time(t) {
      function i2(i) {
        return (Array(2).join(0) + i).slice(-2);
      }
      const time = new Date(t);
      return `${time.getFullYear()}-${i2(time.getMonth() + 1)}-${i2(time.getDate())} ${i2(time.getHours())}:${i2(time.getMinutes())}:${i2(time.getSeconds())}`;
    },
    parse(c) {
      try {
        return parse(c);
      } catch (e) {
        return '<div style="font-family:Consolas">Error: ' + e.message.replace(/ /g, "&nbsp;").replace(/\n/g, "<br />") + "</div>";
      }
    },
    pin2(id, pinned) {
      this.axios({
        method: "post",
        url: "/be/comments/pin.do",
        data: {
          cid: id,
          pinned: !pinned,
        },
      })
        .then((result) => {
          if (result.data.status == "SUCCEED") {
            this.$message({
              type: "success",
              // pinned表示操作之前帖子处于的状态，下同
              message: pinned ? this.$t("pinInfo.unpinSuccess") : this.$t("pinInfo.pinSuccess"),
            });
            this.fetchData();
          } else {
            throw result.data.status;
          }
        })
        .catch((e) => {
          this.$message({
            type: "error",
            message: pinned ? this.$t("pinInfo.unpinFailed", { reason: e.message }) : this.$t("pinInfo.pinFailed", { reason: e.message }),
          });
        });
    },
    /**
     * pin a comment
     * @param {string} id thread id
     * @param {Boolean} pinned thread pin status
     */
    pint2(id) {
      this.axios({
        method: "post",
        url: "/be/forums/pin_thread.do",
        data: {
          forum_tid: id,
          pinned: !this.pinned,
        },
      })
        .then((result) => {
          if (result.data.status == "SUCCEED") {
            this.$message({
              type: "success",
              message: this.pinned ? this.$t("pinInfo.unpinSuccess") : this.$t("pinInfo.pinSuccess"),
            });
            this.fetchData();
          } else {
            throw result.data.status;
          }
        })
        .catch((e) => {
          this.$message({
            type: "error",
            message: this.pinned ? this.$t("pinInfo.unpinFailed", { reason: e.message }) : this.$t("pinInfo.pinFailed", { reason: e.message }),
          });
        });
    },
    edit2(id, comment, uid) {
      this.editF = {
        visible: true,
        show: false,
        id,
        comment,
        bcomment: comment,
        uid,
        count: 0,
      };
    },
    edit() {
      if (this.editF.comment == this.editF.bcomment) {
        const msgl = this.$t("editHint");
        const msg = msgl[this.editF.count] || this.$t("editHint.5");
        this.$set(this.editF, "count", this.editF.count + 1);
        this.$message({
          type: "info",
          message: msg,
        });
        return;
      }
      this.processing = true;
      this.axios({
        method: "post",
        url: "/be/comments/edit_unfiltered.do",
        data: {
          cid: this.editF.id,
          text: this.editF.comment,
        },
      })
        .then((result) => {
          if (result.data.status == "SUCCEED") {
            this.$message({
              type: "success",
              message: this.$t("submitSuccess"),
            });
            this.fetchData();
            this.$set(this.editF, "visible", false);
            this.processing = false;
          } else {
            throw result.data.status;
          }
        })
        .catch((e) => {
          this.$message({
            type: "error",
            message: this.$t("submitFailed", { result: e.message }),
          });
        });
    },
    del2(id) {
      this.$confirm(this.$t("delInfo.confirmInfo"), this.$t("warning"), {
        confirmButtonText: this.$t("confirm"),
        cancelButtonText: this.$t("cancel"),
        type: "warning",
      })
        .then(() => {
          this.axios({
            method: "post",
            url: "/be/comments/del.do",
            data: {
              cid: id,
            },
          })
            .then((result) => {
              if (result.data.status == "SUCCEED") {
                this.$message({
                  type: "success",
                  message: this.$t("delInfo.delSuccess"),
                });
                this.fetchData();
              } else {
                throw result.data.data;
              }
            })
            .catch((e) => {
              this.$message({
                type: "error",
                message: this.$t("delInfo.delFailed", { result: e.message }),
              });
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: this.$t("delInfo.delCancelled"),
          });
        });
    },
    delt2(id) {
      this.$confirm(this.$t("delInfo.delAll"), this.$t("warning"), {
        confirmButtonText: this.$t("confirm"),
        cancelButtonText: this.$t("cancel"),
        type: "warning",
      })
        .then(() => {
          this.axios({
            method: "post",
            url: "/be/forums/delete_thread.do",
            data: {
              forum_tid: id,
            },
          })
            .then((result) => {
              if (result.data.status == "SUCCEED") {
                this.$message({
                  type: "success",
                  message: this.$t("delInfo.delSuccess"),
                });
                this.$router.push({
                  path: "/forum/" + (this.fid || ""),
                });
              } else {
                throw result.data.data;
              }
            })
            .catch((e) => {
              this.$message({
                type: "error",
                message: this.$t("delInfo.delFailed", { result: e.message }),
              });
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: this.$t("delInfo.delCancelled"),
          });
        });
    },
    reply2(type, id, comment) {
      if (type == this.replyT.type && id == this.replyT.id) {
        this.$set(this.replyT, "visible", true);
        return;
      }
      if (this.replyF.comment != "") {
        this.$confirm(this.$t("replyInfo.clearReply"), this.$t("warning"), {
          confirmButtonText: this.$t("confirm"),
          cancelButtonText: this.$t("cancel"),
          type: "warning",
        })
          .then(() => {
            this.replyT = { visible: true, type, id, comment };
            this.replyF = { show: false, comment: "" };
          })
          .catch(() => {
            this.$message({
              type: "info",
              message: this.$t("replyInfo.clearReply"),
            });
          });
      } else {
        this.replyT = { visible: true, type, id, comment };
        this.replyF = { show: false, comment: "" };
      }
    },
    reply() {
      if (this.replyF.comment.replace(/[\s]/g, "") == "") {
        this.$message({
          type: "info",
          message: this.$t("replyInfo.noContent"),
        });
        return;
      }
      this.processing = true;
      try {
        switch (this.replyT.type) {
          case "thread": {
            this.axios({
              method: "post",
              url: "/be/forums/add_to_thread_unfiltered.do",
              data: {
                forum_tid: this.$route.params.tid,
                text: this.replyF.comment,
              },
            })
              .then((result) => {
                if (result.data.status == "SUCCEED") {
                  this.$message({
                    type: "success",
                    message: this.$t("replyInfo.replySuccess"),
                  });
                  this.fetchData();
                  this.$set(this.replyT, "visible", false);
                  this.processing = false;
                } else {
                  throw result.data.data;
                }
              })
              .catch((e) => {
                throw e;
              });
            break;
          }
          case "user": {
            this.axios({
              method: "post",
              url: "/be/forums/reply_unfiltered.do",
              data: {
                reply_to: this.replyT.id,
                text: this.replyF.comment,
              },
            })
              .then((result) => {
                if (result.data.status == "SUCCEED") {
                  this.$message({
                    type: "success",
                    message: this.$t("replyInfo.replySuccess"),
                  });
                  this.fetchData();
                  this.$set(this.replyT, "visible", false);
                  this.processing = false;
                } else {
                  throw result.data.data;
                }
              })
              .catch((e) => {
                throw e;
              });
            break;
          }
        }
      } catch (e) {
        this.$message({
          type: "error",
          message: this.$t("replyInfo.replyFailed", { result: e.message }),
        });
      }
    },
  },
};
</script>

<style>
.el-table td {
  vertical-align: top;
}
</style>

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
