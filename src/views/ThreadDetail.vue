<template>
  <div>
    <top-navbar></top-navbar>

    <div class="content mt-4">
      <el-row>
        <el-col :span="18">
          <h2>意见反馈 > {{ title || "Loading..." }}</h2>
          <el-table
            :data="commentList"
            :show-header="false"
            empty-text="少女祈祷中..."
            style="width: 100%"
          >
            <el-table-column label="作者" width="54">
              <template slot-scope="comment" style="vertical-align: top;">
                <div
                  v-if="commentAuthorsInfo[comment.row.meta.created_by.$oid]"
                >
                  <router-link
                    :to="'/users/' + comment.row.meta.created_by.$oid"
                    target="_blank"
                    :title="
                      commentAuthorsInfo[comment.row.meta.created_by.$oid]
                        .profile.username
                    "
                  >
                    <el-avatar
                      size="large"
                      :src="
                        'be/images/userphotos/' +
                          commentAuthorsInfo[comment.row.meta.created_by.$oid]
                            .profile.image
                      "
                    ></el-avatar
                  ></router-link>
                </div>
                <div v-else>Loading...</div>
              </template>
            </el-table-column>
            <el-table-column label="帖子内容">
              <template slot-scope="comment">
                <div v-if="comment.row.deleted"></div>
                <div>
                  <span class="mb-3" style="color:gray"
                    ><strong
                      ><span
                        v-if="
                          commentAuthorsInfo[comment.row.meta.created_by.$oid]
                        "
                        >{{
                          commentAuthorsInfo[comment.row.meta.created_by.$oid]
                            .profile.username
                        }}</span
                      ><span v-else>Loading...</span></strong
                    >&emsp;&emsp;<i class="el-icon-date"></i>&thinsp;{{
                      time(comment.row.meta.created_at.$date)
                    }}</span
                  >
                  <div
                    v-if="!comment.row.hidden"
                    style="float:right"
                    @click="reply2('user', comment.row._id.$oid, comment.row)"
                  >
                    回复
                  </div>
                  <div v-if="!comment.row.hidden" v-shadow>
                    <thread-comment
                      :html="parse(comment.row.content)"
                    ></thread-comment>
                  </div>
                  <div v-else>
                    此回复因离题或语言过激被折叠
                    <span
                      style="color:#409eff"
                      @click="comment.row.hidden = false"
                      >显示</span
                    >
                  </div>
                  <el-table
                    v-if="
                      comment.row.children && comment.row.children.length > 0
                    "
                    :data="comment.row.children"
                    :show-header="false"
                    empty-text="少女祈祷中..."
                    style="width: 100%"
                  >
                    <el-table-column label="作者" width="54">
                      <template
                        slot-scope="comment"
                        style="vertical-align: top;"
                      >
                        <div
                          v-if="
                            commentAuthorsInfo[comment.row.meta.created_by.$oid]
                          "
                        >
                          <router-link
                            :to="'/users/' + comment.row.meta.created_by.$oid"
                            target="_blank"
                            :title="
                              commentAuthorsInfo[
                                comment.row.meta.created_by.$oid
                              ].profile.username
                            "
                          >
                            <el-avatar
                              size="large"
                              :src="
                                'be/images/userphotos/' +
                                  commentAuthorsInfo[
                                    comment.row.meta.created_by.$oid
                                  ].profile.image
                              "
                            ></el-avatar
                          ></router-link>
                        </div>
                        <div v-else>Loading...</div>
                      </template>
                    </el-table-column>
                    <el-table-column label="帖子内容">
                      <template slot-scope="comment">
                        <div v-if="comment.row.deleted"></div>
                        <div v-else>
                          <span class="mb-3" style="color:gray"
                            ><strong
                              ><span
                                v-if="
                                  commentAuthorsInfo[
                                    comment.row.meta.created_by.$oid
                                  ]
                                "
                                >{{
                                  commentAuthorsInfo[
                                    comment.row.meta.created_by.$oid
                                  ].profile.username
                                }}</span
                              ><span v-else>Loading...</span></strong
                            >&emsp;&emsp;<i class="el-icon-date"></i>&thinsp;{{
                              time(comment.row.meta.created_at.$date)
                            }}</span
                          >
                          <div
                            v-if="!comment.row.hidden"
                            style="float:right;margin-right:-10px"
                            @click="
                              reply2('user', comment.row._id.$oid, comment.row)
                            "
                          >
                            回复
                          </div>
                          <div v-if="!comment.row.hidden" v-shadow>
                            <thread-comment
                              :html="parse(comment.row.content)"
                              :fontsize="0.8"
                            ></thread-comment>
                          </div>
                          <div v-else-if="comment.row.hidden">
                            此回复因离题或语言过激被折叠
                            <span
                              style="color:#409eff"
                              @click="comment.row.hidden = false"
                              >显示</span
                            >
                          </div>
                        </div>
                      </template>
                    </el-table-column>
                  </el-table>
                </div>
              </template>
            </el-table-column>
          </el-table>
          <el-dialog
            :title="
              '发表回复 > ' + (replyT.type == 'thread' ? '主贴' : '楼中楼')
            "
            :visible.sync="replyT.visible"
          >
            <el-table
              v-if="replyT.comment"
              :data="[replyT.comment]"
              :show-header="false"
              empty-text="少女祈祷中..."
              style="width: 100%"
            >
              <el-table-column label="作者" width="54">
                <template slot-scope="comment" style="vertical-align: top;">
                  <div
                    v-if="commentAuthorsInfo[comment.row.meta.created_by.$oid]"
                  >
                    <router-link
                      :to="'/users/' + comment.row.meta.created_by.$oid"
                      target="_blank"
                      :title="
                        commentAuthorsInfo[comment.row.meta.created_by.$oid]
                          .profile.username
                      "
                    >
                      <el-avatar
                        size="large"
                        :src="
                          'be/images/userphotos/' +
                            commentAuthorsInfo[comment.row.meta.created_by.$oid]
                              .profile.image
                        "
                      ></el-avatar
                    ></router-link>
                  </div>
                  <div v-else>Loading...</div>
                </template>
              </el-table-column>
              <el-table-column label="帖子内容">
                <template slot-scope="comment">
                  <div v-if="comment.row.deleted"></div>
                  <div v-else>
                    <span class="mb-3" style="color:gray"
                      ><strong
                        ><span
                          v-if="
                            commentAuthorsInfo[comment.row.meta.created_by.$oid]
                          "
                          >{{
                            commentAuthorsInfo[comment.row.meta.created_by.$oid]
                              .profile.username
                          }}</span
                        ><span v-else>Loading...</span></strong
                      >&emsp;&emsp;<i class="el-icon-date"></i>&thinsp;{{
                        time(comment.row.meta.created_at.$date)
                      }}</span
                    >
                    <div v-shadow>
                      <thread-comment
                        :html="parse(comment.row.content)"
                      ></thread-comment>
                    </div>
                  </div>
                </template>
              </el-table-column>
            </el-table>
            <el-table
              v-if="replyT.comment"
              :data="[{ user }]"
              :show-header="false"
              empty-text="少女祈祷中..."
              style="width: 100%"
            >
              <el-table-column label="作者" width="54">
                <template slot-scope="data" style="vertical-align: top;">
                  <el-avatar
                    size="large"
                    :src="data.row.user.avatar"
                  ></el-avatar>
                </template>
              </el-table-column>
              <el-table-column label="帖子内容">
                <template slot-scope="data">
                  <span class="mb-3" style="color:gray"
                    ><strong
                      ><span v-if="data.row.user.username">{{
                        data.row.user.username
                      }}</span
                      ><span v-else>Loading...</span></strong
                    >&emsp;&emsp;回复：</span
                  >
                </template>
              </el-table-column>
            </el-table>
            <div slot="footer" class="dialog-footer">
              <el-button @click="replyT.visible = false">取消</el-button>
              <el-button type="primary" @click="replyT.visible = false"
                >发表</el-button
              >
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
      title: "",
      commentList: [],
      commentAuthorsInfo: {},
      replyT: {
        visible: false,
        type: "",
        id: "",
        comment: {}
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
    this.axios({
      method: "post",
      url: "/be/forums/view_thread.do",
      data: { forum_tid: this.$route.params.tid }
    })
      .then(result => {
        if (result.data.status == "SUCCEED") {
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
          this.commentList.push({
            _id: { $oid: "5ea505d8158a8745f2761268" },
            thread: { $oid: "5ea505d8158a8745f2761263" },
            content:
              '[[parser:"markdown" markdown-plugin:"sup"]]### markdown^test^\n\n- list\n- list\n- list\n\njavascript highlight test:\n\n``` javascript\nfunction test(){\n  console.log("highlight test")\n}\n```',
            hidden: false,
            deleted: false,
            upvotes: 0,
            downvotes: 0,
            meta: {
              created_by: { $oid: "5e8945197d85e28e616a06bd" },
              created_at: { $date: 1587873400000 },
              modified_by: { $oid: "5e8945197d85e28e616a06bd" },
              modified_at: { $date: 1587873400000 }
            },
            children: [
              {
                _id: { $oid: "5ea505d8158a8745f2761268" },
                thread: { $oid: "5ea505d8158a8745f2761263" },
                content: '[[parser:"markdown"]]### L2',
                hidden: false,
                deleted: false,
                upvotes: 0,
                downvotes: 0,
                meta: {
                  created_by: { $oid: "5e8945197d85e28e616a06bd" },
                  created_at: { $date: 1587873400000 },
                  modified_by: { $oid: "5e8945197d85e28e616a06bd" },
                  modified_at: { $date: 1587873400000 }
                }
              }
            ]
          });
          this.commentList.push({
            _id: { $oid: "5ea505d8158a8745f2761268" },
            thread: { $oid: "5ea505d8158a8745f2761263" },
            content: "hidden",
            hidden: true,
            deleted: false,
            upvotes: 0,
            downvotes: 0,
            meta: {
              created_by: { $oid: "5e8945197d85e28e616a06bd" },
              created_at: { $date: 1587873400000 },
              modified_by: { $oid: "5e8945197d85e28e616a06bd" },
              modified_at: { $date: 1587873400000 }
            },
            children: []
          });
          this.commentList.push({
            _id: { $oid: "5ea505d8158a8745f2761268" },
            thread: { $oid: "5ea505d8158a8745f2761263" },
            content:
              '[[chunk parser:"markdown"]]\n# Markdown\nwww\n[[/chunk]]\n[[chunk]][[h1]][[h1]]A Error.[[/h1]][[/chunk]]',
            hidden: false,
            deleted: false,
            upvotes: 0,
            downvotes: 0,
            meta: {
              created_by: { $oid: "5e8945197d85e28e616a06bd" },
              created_at: { $date: 1587873400000 },
              modified_by: { $oid: "5e8945197d85e28e616a06bd" },
              modified_at: { $date: 1587873400000 }
            },
            children: []
          });
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
  methods: {
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
      this.replyT = { visible: true, type, id, comment };
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
</style>