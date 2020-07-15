<template>
  <div style="text-align: left;">
    <!-- 管理操作的弹出框 -->
    <el-dialog :title="$t('manage.title')" :visible.sync="AuthOps" width="50%">
      <div v-loading="Authorizing">
        <el-button style="width: 100%;" @click="deletcomment()">{{ $t("manage.del") }}</el-button>
        <br />
        <br />
        <el-button style="width: 100%;" @click="hidecomment()">{{ $t("manage.hide") }}</el-button>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="AuthOps = false">{{ $t("_common.botton.cancel_b") }}</el-button>
      </span>
    </el-dialog>

    <!-- 标题 -->
    <div class="new_top">
      <h2>{{ $t("comment") }}</h2>
      <p v-if="allcomments.length">{{ $t("count.value", { length: allcomments.length }) }}</p>
      <p v-else>{{ $t("count.null") }}</p>
    </div>

    <!-- 发表评论 -->
    <div v-if="isLogin" class="comment">
      <!-- 表情区域 -->
      <div style="text-align: center !important;">
        <el-popover v-model="faceVisible" placement="top" trigger="manual">
          <table cellpadding="1" cellspacing="1" align="center" border="1" bordercolor="#e3e3e3" style="border-collapse: collapse;">
            <tr v-for="(p, i) in faceData" :key="i">
              <td v-for="(m, n) in p" :key="n" border="1" style="border-collapse: collapse;">
                <a v-for="(z, x) in m" :key="z" @click="addFaceToComments(m)">
                  <img :src="z" :alt="x" :title="x" />
                </a>
              </td>
            </tr>
          </table>

          <el-button
            slot="reference"
            v-t="'post.face'"
            class="face"
            type="success"
            icon="el-icon-magic-stick"
            style="width: 100px;"
            @click="
              faceVisible = !faceVisible;
              emojiVisible = false;
            "
          ></el-button>
        </el-popover>
        <el-popover v-model="emojiVisible" placement="top" trigger="manual">
          <table cellpadding="1" cellspacing="1" align="center" border="1" bordercolor="#e3e3e3" style="border-collapse: collapse;">
            <tr v-for="(p, i) in emojiData" :key="i">
              <td v-for="(m, n) in p" :key="n" border="1" style="border-collapse: collapse;">
                <a v-for="(z, x) in m" :key="x" class="emoji" :title="x" @click="addEmojiToComments(m)" v-text="z"></a>
              </td>
            </tr>
          </table>

          <el-button
            slot="reference"
            v-t="'post.emoji'"
            class="face"
            type="success"
            icon="el-icon-magic-stick"
            style="width: 100px;"
            @click="
              emojiVisible = !emojiVisible;
              faceVisible = false;
            "
          ></el-button>
        </el-popover>
      </div>

      <el-input
        v-model="comment"
        type="textarea"
        :autosize="{ minRows: 4 }"
        :placeholder="$t('saySth')"
        maxlength="500"
        show-word-limit
        @keyup.enter.native="postcommentOnInput()"
      ></el-input>
      <el-checkbox v-model="UsingEnter" v-t="'post.cfg.usingEnter'"></el-checkbox>
      <i18n path="post.term" tag="span">
        <a v-t="'post.rules'" place="rules" href="https://patchyvideo.wiki/Comments" target="_blank" rel="noopener noreferrer" style="color: #409eff;"></a>
      </i18n>
      <el-button v-t="'post.submit'" type="primary" :loading="posting" @click="postcomment()"></el-button>
    </div>
    <!-- 未登录时显示 -->
    <i18n v-else path="join.text" tag="div">
      <router-link v-t="'join.login'" place="login" to="/login" @click.native="login"></router-link>
    </i18n>

    <!-- 评论详情 -->
    <el-divider></el-divider>
    <div v-for="(item, index) in allcomments" :key="index" class="commentBox">
      <!-- 正常情况下的渲染 -->
      <div v-if="!item.hidden && !item.deleted" class="commentDetail">
        <!-- 用户头像 -->
        <div class="avatar">
          <el-avatar :src="userAvatar(commentUser(item.meta.created_by.$oid).profile.image)"></el-avatar>
        </div>
        <!-- 右半部分 -->
        <div class="commentContent">
          <div v-linkified>
            <router-link :to="'/users/' + item.meta.created_by.$oid" target="_blank"
              >{{ commentUser(item.meta.created_by.$oid).profile.username }}:</router-link
            >
            <span v-html="parseComment(item.content)"></span>
          </div>

          <span class="commentDate">{{ commentdate(item.meta.created_at.$date) }}</span>
          <el-button v-if="item.children.length && !showReplies[index].show" class="replycomment" type="text" @click="showReplies[index].show = true">{{
            $t("child.show", { length: item.children.length })
          }}</el-button>
          <el-button
            v-else-if="!replycomments[index].show && isLogin"
            class="replycomment"
            type="text"
            @click="openReplyBox(index, commentUser(item.meta.created_by.$oid).profile.username, item._id.$oid)"
            >{{ $t("reply") }}</el-button
          >
          <el-button v-else-if="isLogin" class="replycomment" type="text" @click="replycomments[index].show = false">{{ $t("child.hide") }}</el-button>

          <!-- 权限操作 -->
          <el-button
            v-if="isLogin && (Authorized || mycomment(commentUser(item.meta.created_by.$oid).profile.username))"
            class="replycomment"
            type="text"
            @click="Authorizecomment(item._id.$oid)"
            >{{ $t("manage.label") }}</el-button
          >
        </div>

        <!-- 楼中楼 -->
        <div>
          <el-collapse-transition>
            <div v-show="showReplies[index].show">
              <div v-for="(replyc, i) in item.children" :key="i" class="allReply">
                <!-- 正常情况下的渲染 -->
                <div v-if="!replyc.hidden && !replyc.deleted">
                  <!-- 楼中楼头像 -->
                  <div class="avatar" style="margin: 0;">
                    <el-avatar :src="userAvatar(commentUser(replyc.meta.created_by.$oid).profile.image)" size="small"></el-avatar>
                  </div>
                  <!-- 楼中楼右半部分 -->
                  <div class="commentContent" style="margin-left: 40px;">
                    <div v-linkified>
                      <router-link :to="'/users/' + replyc.meta.created_by.$oid" target="_blank"
                        >{{ commentUser(replyc.meta.created_by.$oid).profile.username }}:</router-link
                      >
                      <span v-if="typeof replyc.reply_to !== 'undefined'">
                        {{ $t("child.label") }}
                        <router-link :to="'/users/' + cid_comment_map.get(replyc.reply_to.$oid).meta.created_by.$oid" target="_blank"
                          >@{{ commentUser(cid_comment_map.get(replyc.reply_to.$oid).meta.created_by.$oid).profile.username }}</router-link
                        >:
                      </span>
                      <span v-html="parseComment(replyc.content)"></span>
                    </div>
                    <span class="commentDate">{{ commentdate(replyc.meta.created_at.$date) }}</span>
                    <el-button
                      v-if="isLogin"
                      class="replycomment"
                      type="text"
                      @click="openReplyBox(index, commentUser(replyc.meta.created_by.$oid).profile.username, reply._id.$oid)"
                      >{{ $t("reply") }}</el-button
                    >
                    <!-- 权限操作 -->
                    <el-button
                      v-if="isLogin && (Authorized || mycomment(commentUser(replyc.meta.created_by.$oid).profile.username))"
                      class="replycomment"
                      type="text"
                      @click="Authorizecomment(replyc._id.$oid)"
                      >{{ $t("manage.label") }}</el-button
                    >
                  </div>
                </div>
                <!-- 被隐藏的时候的渲染 -->
                <div v-if="replyc.deleted" style="margin-left: 40px; margin-bottom: 10px;">{{ $t("deleted") }}</div>
                <div v-else-if="replyc.hidden" style="margin-left: 40px;">
                  {{ $t("hidden") }}
                  <el-button type="text" @click="replyc.hidden = false">{{ $t("open") }}</el-button>
                </div>
              </div>
            </div>
          </el-collapse-transition>
        </div>

        <!-- 楼中楼的回复框 -->
        <div>
          <el-collapse-transition>
            <div v-show="replycomments[index].show">
              <div class="replyBox">
                <!-- 表情区域 -->
                <el-popover v-model="replycomments[index].face" placement="top" trigger="manual">
                  <table cellpadding="1" cellspacing="1" align="center" border="1" bordercolor="#e3e3e3" style="border-collapse: collapse;">
                    <tr v-for="(p, i) in faceData" :key="i">
                      <td v-for="(m, n) in p" :key="n" border="1" style="border-collapse: collapse;">
                        <a v-for="(z, x) in m" :key="x" @click="addFaceToReply(m, index)">
                          <img :src="z" :alt="x" :title="x" />
                        </a>
                      </td>
                    </tr>
                  </table>

                  <el-button
                    slot="reference"
                    v-t="'post.face'"
                    class="face"
                    type="success"
                    icon="el-icon-magic-stick"
                    style="width: 100px;"
                    @click="
                      replycomments[index].face = !replycomments[index].face;
                      replycomments[index].emoji = false;
                    "
                  ></el-button>
                </el-popover>
                <el-popover v-model="replycomments[index].emoji" placement="top" trigger="manual">
                  <table cellpadding="1" cellspacing="1" align="center" border="1" bordercolor="#e3e3e3" style="border-collapse: collapse;">
                    <tr v-for="(p, i) in emojiData" :key="i">
                      <td v-for="(m, n) in p" :key="n" border="1" style="border-collapse: collapse;">
                        <a v-for="(z, x) in m" :key="x" class="emoji" :title="x" @click="addEmojiToReply(m, index)" v-text="z"></a>
                      </td>
                    </tr>
                  </table>

                  <el-button
                    slot="reference"
                    v-t="'post.emoji'"
                    class="face"
                    type="success"
                    icon="el-icon-magic-stick"
                    style="width: 100px;"
                    @click="
                      replycomments[index].emoji = !replycomments[index].emoji;
                      replycomments[index].face = false;
                    "
                  ></el-button>
                </el-popover>
                <el-input
                  v-model="reply"
                  type="textarea"
                  :autosize="{ minRows: 1, maxRows: 4 }"
                  :placeholder="$t('child.placeholder')"
                  maxlength="500"
                  show-word-limit
                  @keyup.enter.native="postReply(index)"
                ></el-input>
                <el-button v-t="'post.submit'" style="margin: 5px;" type="primary" size="mini" round :loading="replying" @click="postReply(index)"></el-button>
              </div>
            </div>
          </el-collapse-transition>
        </div>
      </div>
      <!-- 被隐藏的时候的渲染 -->
      <div v-if="item.deleted" class="deletedcomment">{{ $t("deleted") }}</div>
      <div v-else-if="item.hidden" class="hiddencomment">
        {{ $t("hidden") }}
        <el-button type="text" @click="item.hidden = false">{{ $t("open") }}</el-button>
      </div>
      <el-divider></el-divider>
    </div>
  </div>
</template>

<script>
import { ParseComment, getFace, getEmoji } from "@/static/js/comment";
import { toGMT as commentdate } from "@/static/js/toGMT";
export default {
  components: {},
  props: {
    sid: {
      type: String,
      required: true,
    },
  },
  data() {
    this.$i18n.locale = localStorage.getItem("lang");
    return {
      // 评论区的ID
      tid: "",
      // 评论区的内容
      allcomments: [],
      cid_comment_map: new Map(),
      // 评论区所有用户的信息
      allUsers: [],
      // 用户输入的评论
      comment: "",
      // 用户输入的楼中楼的回复
      reply: "",
      // 用户评论对象的 cid
      cidReplied: "",
      // 楼层评论区是否打开的数组
      replycomments: [],
      // 楼层详情是否打开的数组
      showReplies: [],
      // 是否使用 Enter 键发表评论
      UsingEnter: true,
      // 评论是否正在发表中
      posting: false,
      // 回复是否正在发表中
      replying: false,
      // 评论是否在加载中
      loadingcomment: false,
      // 是否有管理权限
      Authorized: false,
      // 管理页面的弹出框
      AuthOps: false,
      // 被管理对象的 cid
      AuthorizedCid: "",
      // 管理页面是否加载的标志
      Authorizing: false,
      // face 弹出标志
      faceVisible: false,
      // face 数据
      faceData: [],
      // emoji 数据
      emojiData: [],
      // emoji 弹出标志
      emojiVisible: false,
    };
  },
  computed: {
    // 评论的用户
    commentUser() {
      return function(id) {
        for (let i = 0; i < this.allUsers.length; i++) {
          if (id == this.allUsers[i]._id.$oid) {
            return this.allUsers[i];
          }
        }
      };
    },
    // 评论用户的头像
    userAvatar() {
      return function(imgName) {
        if (imgName == "default") {
          return require("@/static/img/defaultAvatar.jpg");
        } else {
          return "be/images/userphotos/" + imgName;
        }
      };
    },
    // 评论的日期
    commentdate,
    // 判断是否登录
    isLogin() {
      if (JSON.stringify(this.$store.state.username) != "null" && this.$store.state.username != "") {
        return true;
      } else {
        return false;
      }
    },
    // 判断是否为自己的评论
    // *因为是凭借用户名进行判断，所以可能会有些许误差*
    mycomment() {
      return function(name) {
        return name == this.$store.state.username;
      };
    },
    // 判断请求的 URL
    requestURL() {
      if (this.$route.path === "/listdetail")
        return {
          url: "/be/comments/add_to_playlist.do",
          data: { pid: this.$route.query.id, text: this.comment },
        };
      else if (this.$route.path === "/video")
        return {
          url: "/be/comments/add_to_video.do",
          data: { vid: this.$route.query.id, text: this.comment },
        };
      else return false;
    },
  },
  watch: {
    sid() {
      this.tid = this.sid;
    },
    tid() {
      this.getcomments();
    },
  },
  created() {
    this.faceData = getFace();
    this.emojiData = getEmoji();
    this.isAuthorized();
  },
  methods: {
    // getFace() {
    //   // 规定一排多少个
    //   let array = [];
    //   const MAXROW = 10;
    //   // 读取 face 数据,转换成 [{"呵呵":"src"},{}] 格式
    //   for (let i in faceslist) {
    //     let obj = {};
    //     obj[i] = ParseFace(i);
    //     array.push(obj);
    //   }
    //   // 计算最后一排个数
    //   let faceRow = Math.ceil(array.length / MAXROW);
    //   let c = [];
    //   // 转换成 [[{"呵呵":"src"},{}],[]] 格式
    //   for (let i = 0; i < faceRow; ++i) {
    //     c[i] = [];
    //     for (let m = i * MAXROW; m < i * MAXROW + MAXROW; ++m) {
    //       c[i].push(array[m]);
    //     }
    //   }
    //   this.faceData = c;
    // },
    // getEmoji() {
    //   // 规定一排多少个
    //   let array = [];
    //   const MAXROW = 10;
    //   // 读取 face 数据,转换成 [{"呵呵":"src"},{}] 格式
    //   for (let i in emojislist) {
    //     let obj = {};
    //     obj[i] = ParseEmoji(i);
    //     array.push(obj);
    //   }
    //   // 计算最后一排个数
    //   let faceRow = Math.ceil(array.length / MAXROW);
    //   let c = [];
    //   // 转换成 [[{"呵呵":"src"},{}],[]] 格式
    //   for (let i = 0; i < faceRow; ++i) {
    //     c[i] = [];
    //     for (let m = i * MAXROW; m < i * MAXROW + MAXROW; ++m) {
    //       c[i].push(array[m]);
    //     }
    //   }
    //   this.emojiData = c;
    // },
    addFaceToComments(obj) {
      this.comment = this.comment + `[[表情:${Object.keys(obj)}]]`;
      this.faceVisible = false;
    },
    addEmojiToComments(obj) {
      this.comment = this.comment + `[[emoji:${Object.keys(obj)}]]`;
      this.emojiVisible = false;
    },
    addFaceToReply(obj, index) {
      this.reply = this.reply + `[[表情:${Object.keys(obj)}]]`;
      this.replycomments[index].face = false;
    },
    addEmojiToReply(obj, index) {
      this.reply = this.reply + `[[emoji:${Object.keys(obj)}]]`;
      this.replycomments[index].emoji = false;
    },
    // 获取评论
    getcomments() {
      this.loadingcomment = true;

      this.axios({
        method: "post",
        url: "/be/comments/view.do",
        data: {
          thread_id: this.tid,
        },
      })
        .then((result) => {
          this.allcomments = result.data.data.comments;
          this.allUsers = result.data.data.users;
          this.cid_comment_map = new Map();

          for (let i = 0; i < this.allcomments.length; i++) {
            //console.log(this.allcomments[i]);
            for (let j = 0; j < this.allcomments[i].children.length; ++j) {
              //console.log(this.allcomments[i].children[j]._id.$oid);
              this.cid_comment_map.set(this.allcomments[i].children[j]._id.$oid, this.allcomments[i].children[j]);
            }
          }

          // 初始化评论区开启标志
          for (let i = 0; i < this.allcomments.length; i++) {
            this.showReplies.push({
              show: false,
              face: false,
              emoji: false,
            });
          }
          // 初始化回复框开启标志
          for (let i = 0; i < this.allcomments.length; i++) {
            this.replycomments.push({
              show: false,
              face: false,
              emoji: false,
            });
          }

          this.loadingcomment = false;
        })
        .catch((error) => {
          console.log(error);
          this.openFailed(this.$t("getFailed"));
          this.loadingcomment = false;
        });
    },
    // parseComment(content) {
    //   let match = content.match(/((?<=\[\[)[^\(\]\]]+)/g);
    //   match.map((v, i) => {
    //     let kv = v.split(":");
    //     if (kv.length <= 1) return;
    //     let action = kv[0];
    //     let value = kv[1];
    //     let newvalue = "";
    //     switch (action) {
    //       case "表情":
    //         newvalue = `<img src='${ParseFace(value)}' />`;
    //         break;
    //       default:
    //         newvalue = v;
    //         break;
    //     }
    //     content = content.replace(`[[${v}]]`, newvalue);
    //   });
    //   return content;
    // },
    parseComment(content) {
      return ParseComment(content);
    },
    // 使用 Enter 键发布视频
    postcommentOnInput() {
      if (this.UsingEnter) {
        this.comment = this.comment.substr(0, this.comment.length - 1);
        this.postcomment();
      }
      return false;
    },
    // 发表评论
    postcomment() {
      if (this.comment == "" || this.comment == "\n") {
        this.comment = "";
        this.openFailed(this.$t("post.msg.nullc"));
        return;
      }
      this.posting = true;
      this.axios({
        method: "post",
        url: this.requestURL.url,
        data: this.requestURL.data,
      })
        .then((result) => {
          this.posting = false;
          if (result.data.status == "SUCCEED") {
            this.tid = result.data.data.thread_id;
            this.comment = "";
            this.getcomments();
            this.openSuccessful(this.$t("post.msg.ok"));
          } else {
            this.openFailed(this.$t("post.msg.fail"));
          }
        })
        .catch((error) => {
          console.log(error);
          this.openFailed(this.$t("post.msg.fail"));
          this.posting = false;
        });
    },
    // 打开楼中楼的回复框
    openReplyBox(index, name, cid) {
      this.cidReplied = cid;
      this.reply = "";
      for (let i = 0; i < this.replycomments.length; i++) {
        this.replycomments[i].show = false;
        this.replycomments[i].face = false;
        this.replycomments[i].emoji = false;
      }
      this.replycomments[index].show = true;
      this.reply = "";
    },
    // 发表回复
    postReply(index) {
      if (this.reply == "" || this.reply == "\n") {
        this.reply = "";
        this.openFailed(this.$t("post.msg.nullc"));
        return;
      }
      if (this.reply.charAt(this.reply.length - 1) == "\n") {
        this.reply.substring(0, this.reply.length - 1);
      }
      this.replying = true;
      this.axios({
        method: "post",
        url: "/be/comments/reply.do",
        data: {
          reply_to: this.cidReplied,
          text: this.reply,
        },
      })
        .then((result) => {
          if (result.data.status == "SUCCEED") {
            this.reply = "";
            this.replycomments[index].show = false;
            this.showReplies[index].show = true;
            this.getcomments();
            this.openSuccessful(this.$t("post.msg.ok"));
          } else {
            this.openFailed(this.$t("post.msg.fail"));
          }
          this.replying = false;
        })
        .catch((error) => {
          console.log(error);
          this.replying = false;
          this.openFailed(this.$t("post.msg.fail"));
        });
    },
    // 登录跳转
    login() {
      this.$store.comment("changeifRouter", "0");
    },
    // 查看是否有编辑权限
    // op 可选参数：
    // 评论操作：commentAdmin
    // 标签操作：tagAdmin
    // 播放列表操作：editPlaylist
    // 设置视频权限：setVideoClearence
    isAuthorized() {
      this.axios({
        method: "post",
        url: "/be/user/is_authorized",
        data: {
          op: "commentAdmin",
        },
      })
        .then((result) => {
          if (result.data.status == "SUCCEED") {
            this.Authorized = true;
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
    // 打开权限管理窗口
    Authorizecomment(cid) {
      this.AuthorizedCid = cid;
      this.AuthOps = true;
    },
    // 删除评论
    deletcomment() {
      this.Authorizing = true;
      this.axios({
        method: "post",
        url: "be/comments/del.do",
        data: {
          cid: this.AuthorizedCid,
        },
      })
        .then((result) => {
          if (result.data.status == "SUCCEED") {
            this.openSuccessful(this.$t("manage.msg.ok"));
            this.getcomments();
          } else {
            this.openFailed(this.$t("manage.msg.fail"));
          }
          this.Authorizing = false;
          this.AuthOps = false;
        })
        .catch((error) => {
          console.log(error);
          this.openFailed(this.$t("manage.msg.fail"));
          this.Authorizing = false;
          this.AuthOps = false;
        });
    },
    // 隐藏评论
    hidecomment() {
      this.Authorizing = true;
      this.axios({
        method: "post",
        url: "be/comments/hide.do",
        data: {
          cid: this.AuthorizedCid,
        },
      })
        .then((result) => {
          if (result.data.status == "SUCCEED") {
            this.openSuccessful(this.$t("manage.msg.ok"));
            this.getcomments();
          } else {
            this.openFailed(this.$t("manage.msg.fail"));
          }
          this.Authorizing = false;
          this.AuthOps = false;
        })
        .catch((error) => {
          console.log(error);
          this.openFailed(this.$t("manage.msg.fail"));
          this.Authorizing = false;
          this.AuthOps = false;
        });
    },
    // 各种信息
    openSuccessful(message) {
      this.$message({
        message: message,
        type: "success",
      });
    },

    openFailed(message) {
      this.$message({
        message: message,
        type: "error",
      });
    },
  },
};
</script>

<style scoped lang="less">
tr {
  td {
    border-collapse: collapse;
    background-color: rgb(255, 255, 255);
    vertical-align: middle;
    border: 1px solid #e3e3e3;
    width: 54px;
    height: 54px;
    a {
      display: inline-block;
      width: 100%;
      height: 100%;
      position: relative;
      img {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 30px;
        height: 30px;
      }
    }
    .emoji {
      text-align: center;
      font-size: 2rem;
    }
  }
}
.new_top {
  padding-bottom: 10px;
  border-bottom: 3px solid #21c6ef;
  word-wrap: break-word;
  word-break: normal;
  display: inline-block;
  width: 100%;
  margin-bottom: 20px;
  margin-top: 20px;
}
.new_top h2 {
  text-align: center;
}
.comment {
  text-align: right;
}
.comment .el-textarea {
  width: calc(100% - 10px);
  margin: 5px;
}
.comment .el-checkbox {
  float: left;
  margin-left: 10%;
  margin-top: 15px;
}
.comment .el-button {
  width: 30%;
  margin: 5px;
}

.avatar {
  float: left;
  margin: 15px;
  margin-top: 0px;
}
.commentContent {
  margin-left: 70px;
  white-space: pre-line;
}
.commentDate {
  font-size: 13px;
  line-height: 2.5;
  color: #909399;
}
.replycomment {
  float: right;
  margin-left: 10px;
}
.replyBox {
  background-color: #90939909;
  margin-left: 70px;
  margin-bottom: 20px;
  text-align: right;
}
.allReply {
  background-color: #90939909;
  border-top-style: solid;
  border-top-width: 1px;
  border-top-color: #9093993f;
  padding: 5px;
  margin-left: 70px;
  font-size: 14px;
}
.hiddencomment {
  margin-left: 70px;
}
.deletedcomment {
  margin-left: 70px;
}
</style>
