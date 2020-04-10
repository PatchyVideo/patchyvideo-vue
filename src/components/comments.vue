<!--    vue页面：Foot.vue     -->
<!--
    组件：网站评论组件
    大小：100%
    功能：显示本视频/播放列表的
    更新日志：
    2/1/2020: v1.0 
      release
-->
<i18n>
{
  "CHS": {
    "comment":"评论",
    "commentCount":"共{length}条评论",
    "nocomment":"暂无评论！",
    "saySth":"说点儿什么吧~",
    "usingEnter":"使用Enter键发表评论",
    "respect":"请遵守",
    "commentRules":"评论规则",
    "yo":"哟",
    "post":"发表",
    "joinDiscuss":"想要一起参与讨论？",
    "login":"点我登录",
    "showRplies":"查看{length}条回复",
    "replyPrompt":" 回复",
    "reply":"回复",
    "hideReply":"收起回复",
    "manage":"管理",
    "replyTo":"回复Ta",
    "hiddencomment":"该评论已被隐藏",
    "opencomment":"点我展开",
    "deletedcomment":"抱歉，该评论已被删除",
    "selectOpts":"请选择操作",
    "deletcomment":"删除评论",
    "hidecomment":"隐藏评论",
    "cancel":"取 消",
    "getcommentFailed":"获取评论失败，请检查网络设置！",
    "PsaySth":"请输入内容！",
    "postSuccessfully":"发表成功！",
    "postFailed":"发表失败，请检查网络设置！",
    "operationSuccessfully":"操作成功！",
    "operationFailed":"操作失败，请检查网络设置！"
  },
  "ENG": {
    "comment":"comment",
    "commentCount":"{length} comments in total",
    "nocomment":"No comment here!",
    "saySth":"Say something...",
    "usingEnter":"Post comment using Enter key",
    "respect":"Please respect ",
    "commentRules":"the commentRules",
    "yo":" ",
    "post":"Post",
    "joinDiscuss":"Want to join the discuss? ",
    "login":"Click me to login",
    "showRplies":"Show {length} comments",
    "replyPrompt":" Reply ",
    "reply":"Reply",
    "hideReply":"Hide the reply",
    "manage":"Manage",
    "replyTo":"Reply to...",
    "hiddencomment":"The comment has been hidden. ",
    "opencomment":"Click me to show the comment",
    "deletedcomment":"Sorry, the comment has been deleted",
    "selectOpts":"Please select the operation",
    "deletcomment":"Delet the comment",
    "hidecomment":"Hide the comment",
    "cancel":"Cancel",
    "getcommentFailed":"Geting comment data failed, please check your Internet!",
    "PsaySth":"Please say something!",
    "postSuccessfully":"Post Successfully",
    "postFailed":"Failed post , please check your Internet!",
    "operationSuccessfully":"Operate Successfully",
    "operationFailed":"Failed operation, please check your Internet!"
  },
  "CHT": {
    "comment":"評論",
    "commentCount":"共{length}條評論",
    "nocomment":"暫無評論！",
    "saySth":"說點兒什麼吧~",
    "usingEnter":"使用Enter鍵發表評論",
    "respect":"請遵守",
    "commentRules":"評論規則",
    "yo":"哦",
    "post":"發表",
    "joinDiscuss":"想要一起參與討論？",
    "login":"點我登錄",
    "showRplies":"查看{length}條回复",
    "replyPrompt":" 回复",
    "reply":"回复",
    "hideReply":"收起回复",
    "manage":"管理",
    "replyTo":"回复Ta",
    "hiddencomment":"該評論已被隱藏",
    "opencomment":"點我展開",
    "deletedcomment":"抱歉，該評論已被刪除",
    "selectOpts":"請選擇操作",
    "deletcomment":"刪除評論",
    "hidecomment":"隱藏評論",
    "cancel":"取 消",
    "getcommentFailed":"獲取評論失敗，請檢查網絡設置！",
    "PsaySth":"請輸入內容！",
    "postSuccessfully":"發表成功！",
    "postFailed":"發表失敗，請檢查網絡設置！",
    "operationSuccessfully":"操作成功！",
    "operationFailed":"操作失敗，請檢查網絡設置！"
  }
}
</i18n>

<template>
  <div style="text-align: left;">
    <!-- 管理操作的弹出框 -->
    <el-dialog :title="$t('selectOpts')" :visible.sync="AuthOps" width="50%">
      <div v-loading="Authorizing">
        <el-button style="width:100%;" @click="deletcomment()">{{ $t("deletcomment") }}</el-button>
        <br />
        <br />
        <el-button style="width:100%;" @click="hidecomment()">{{ $t("hidecomment") }}</el-button>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="AuthOps = false">{{ $t("cancel") }}</el-button>
      </span>
    </el-dialog>

    <!-- 标题 -->
    <div class="new_top">
      <h2>{{ $t("comment") }}</h2>
      <p v-if="allcomments.length">{{ $t("commentCount", { length: allcomments.length }) }}</p>
      <p v-else>{{ $t("nocomment") }}</p>
    </div>

    <!-- 发表评论 -->
    <div class="comment" v-if="isLogin">
      <!-- 表情区域 -->
      <div style="text-align: center !important;">
        <el-popover
          placement="top"
          trigger="manual"
          content="这是一段内容,这是一段内容,这是一段内容,这是一段内容。"
          v-model="faceVisible"
        >
          <table
            cellpadding="1"
            cellspacing="1"
            align="center"
            border="1"
            bordercolor="#e3e3e3"
            style="border-collapse:collapse;"
          >
            <tr v-for="(p,i) in faceData" :key="i">
              <td v-for="(m,n) in p" :key="n" border="1" style="border-collapse:collapse;">
                <a @click="addFaceToComments(m)" v-for="(z,x) in m" :key="z">
                  <img :src="z" :alt="x" :title="x" />
                </a>
              </td>
            </tr>
          </table>
          <el-button
            class="face"
            type="success"
            icon="el-icon-magic-stick"
            slot="reference"
            style="width: 100px"
            @click="faceVisible = !faceVisible;emojiVisible=false;"
          >表情</el-button>
        </el-popover>
        <el-popover
          placement="top"
          trigger="manual"
          content="这是一段内容,这是一段内容,这是一段内容,这是一段内容。"
          v-model="emojiVisible"
        >
          <table
            cellpadding="1"
            cellspacing="1"
            align="center"
            border="1"
            bordercolor="#e3e3e3"
            style="border-collapse:collapse;"
          >
            <tr v-for="(p,i) in emojiData" :key="i">
              <td v-for="(m,n) in p" :key="n" border="1" style="border-collapse:collapse;">
                <a
                  @click="addEmojiToComments(m)"
                  class="emoji"
                  v-for="(z,x) in m"
                  :key="x"
                  v-text="z"
                  :title="x"
                ></a>
              </td>
            </tr>
          </table>
          <el-button
            class="face"
            type="success"
            icon="el-icon-magic-stick"
            slot="reference"
            style="width: 100px"
            @click="emojiVisible = !emojiVisible;faceVisible=false;"
          >Emoji</el-button>
        </el-popover>
      </div>

      <el-input
        type="textarea"
        :autosize="{ minRows: 4 }"
        :placeholder="$t('saySth')"
        maxlength="500"
        show-word-limit
        v-model="comment"
        @keyup.enter.native="postcommentOnInput()"
      ></el-input>
      <el-checkbox v-model="UsingEnter">{{ $t("usingEnter") }}</el-checkbox>
      <span>
        {{ $t('respect') }}
        <a
          href="https://patchyvideo.wiki/Comments"
          target="_blank"
          style="color:#409EFF"
        >{{ $t('commentRules') }}</a>
        {{ $t('yo') }}
      </span>
      <el-button type="primary" @click="postcomment()" :loading="posting">{{ $t("post") }}</el-button>
    </div>
    <!-- 未登录时显示 -->
    <div v-else>
      {{ $t("joinDiscuss") }}
      <router-link to="/login" @click.native="login">{{ $t("login") }}</router-link>
    </div>

    <!-- 评论详情 -->
    <el-divider></el-divider>
    <div class="commentBox" v-for="(item, index) in allcomments" :key="index">
      <!-- 正常情况下的渲染 -->
      <div class="commentDetail" v-if="!item.hidden && !item.deleted">
        <!-- 用户头像 -->
        <div class="avatar">
          <el-avatar :src="userAvatar(commentUser(item.meta.created_by.$oid).profile.image)"></el-avatar>
        </div>
        <!-- 右半部分 -->
        <div class="commentContent">
          <div v-linkified>
            <router-link
              :to="'/users/' + item.meta.created_by.$oid"
              target="_blank"
            >{{ commentUser(item.meta.created_by.$oid).profile.username }}:</router-link>
            <span v-html="parseComment(item.content)"></span>
          </div>

          <span class="commentDate">{{ commentdate(item.meta.created_at.$date) }}</span>
          <el-button
            class="replycomment"
            v-if="item.children.length && !showReplies[index].show"
            type="text"
            @click="showReplies[index].show = true"
          >{{ $t("showRplies", { length: item.children.length }) }}</el-button>
          <el-button
            class="replycomment"
            v-else-if="!replycomments[index].show && isLogin"
            type="text"
            @click="openReplyBox(index, commentUser(item.meta.created_by.$oid).profile.username, item._id.$oid)"
          >{{ $t("reply") }}</el-button>
          <el-button
            class="replycomment"
            v-else-if="isLogin"
            type="text"
            @click="replycomments[index].show = false"
          >{{ $t("hideReply") }}</el-button>

          <!-- 权限操作 -->
          <el-button
            class="replycomment"
            v-if="isLogin && (Authorized || mycomment(commentUser(item.meta.created_by.$oid).profile.username))"
            type="text"
            @click="Authorizecomment(item._id.$oid)"
          >{{ $t("manage") }}</el-button>
        </div>

        <!-- 楼中楼 -->
        <div>
          <el-collapse-transition>
            <div v-show="showReplies[index].show">
              <div class="allReply" v-for="(reply, i) in item.children" :key="i">
                <!-- 正常情况下的渲染 -->
                <div v-if="!reply.hidden && !reply.deleted">
                  <!-- 楼中楼头像 -->
                  <div class="avatar" style="margin:0">
                    <el-avatar
                      :src="userAvatar(commentUser(reply.meta.created_by.$oid).profile.image)"
                      size="small"
                    ></el-avatar>
                  </div>
                  <!-- 楼中楼右半部分 -->
                  <div class="commentContent" style="margin-left:40px;">
                    <div v-linkified>
                      <router-link
                        :to="'/users/' + reply.meta.created_by.$oid"
                        target="_blank"
                      >{{ commentUser(reply.meta.created_by.$oid).profile.username }}:</router-link>
                      <span v-if="typeof reply.reply_to !== 'undefined'">
                        {{ $t('replyPrompt') }}
                        <router-link
                          :to="'/users/' + cid_comment_map.get(reply.reply_to.$oid).meta.created_by.$oid"
                          target="_blank"
                        >@{{ commentUser(cid_comment_map.get(reply.reply_to.$oid).meta.created_by.$oid).profile.username }}</router-link>:
                      </span>
                      <span v-html="parseComment(reply.content)"></span>
                    </div>
                    <span class="commentDate">{{ commentdate(reply.meta.created_at.$date) }}</span>
                    <el-button
                      v-if="isLogin"
                      class="replycomment"
                      type="text"
                      @click="openReplyBox(index, commentUser(reply.meta.created_by.$oid).profile.username,reply._id.$oid)"
                    >{{ $t("reply") }}</el-button>
                    <!-- 权限操作 -->
                    <el-button
                      class="replycomment"
                      v-if="isLogin && (Authorized || mycomment(commentUser(reply.meta.created_by.$oid).profile.username))"
                      type="text"
                      @click="Authorizecomment(reply._id.$oid)"
                    >{{ $t("manage") }}</el-button>
                  </div>
                </div>
                <!-- 被隐藏的时候的渲染 -->
                <div
                  style="margin-left:40px;margin-bottom:10px"
                  v-if="reply.deleted"
                >{{ $t("deletedcomment") }}</div>
                <div style="margin-left:40px;" v-else-if="reply.hidden">
                  {{ $t("hiddencomment") }}
                  <el-button type="text" @click="reply.hidden = false">{{ $t("opencomment") }}</el-button>
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
                <el-popover
                  placement="top"
                  trigger="manual"
                  content="这是一段内容,这是一段内容,这是一段内容,这是一段内容。"
                  v-model="replycomments[index].face"
                >
                  <table
                    cellpadding="1"
                    cellspacing="1"
                    align="center"
                    border="1"
                    bordercolor="#e3e3e3"
                    style="border-collapse:collapse;"
                  >
                    <tr v-for="(p,i) in faceData" :key="i">
                      <td v-for="(m,n) in p" :key="n" border="1" style="border-collapse:collapse;">
                        <a @click="addFaceToReply(m,index)" v-for="(z,x) in m" :key="x">
                          <img :src="z" :alt="x" :title="x" />
                        </a>
                      </td>
                    </tr>
                  </table>
                  <el-button
                    class="face"
                    type="success"
                    icon="el-icon-magic-stick"
                    slot="reference"
                    style="width: 100px"
                    @click="replycomments[index].face = !replycomments[index].face;replycomments[index].emoji=false;"
                  >表情</el-button>
                </el-popover>
                <el-popover
                  placement="top"
                  trigger="manual"
                  content="这是一段内容,这是一段内容,这是一段内容,这是一段内容。"
                  v-model="replycomments[index].emoji"
                >
                  <table
                    cellpadding="1"
                    cellspacing="1"
                    align="center"
                    border="1"
                    bordercolor="#e3e3e3"
                    style="border-collapse:collapse;"
                  >
                    <tr v-for="(p,i) in emojiData" :key="i">
                      <td v-for="(m,n) in p" :key="n" border="1" style="border-collapse:collapse;">
                        <a
                          @click="addEmojiToReply(m,index)"
                          class="emoji"
                          v-for="(z,x) in m"
                          :key="x"
                          v-text="z"
                          :title="x"
                        ></a>
                      </td>
                    </tr>
                  </table>
                  <el-button
                    class="face"
                    type="success"
                    icon="el-icon-magic-stick"
                    slot="reference"
                    style="width: 100px"
                    @click="replycomments[index].emoji = !replycomments[index].emoji;replycomments[index].face=false;"
                  >Emoji</el-button>
                </el-popover>
                <el-input
                  type="textarea"
                  :autosize="{ minRows: 1, maxRows: 4 }"
                  :placeholder="$t('replyTo')"
                  v-model="reply"
                  maxlength="500"
                  show-word-limit
                  @keyup.enter.native="postReply(index)"
                ></el-input>
                <el-button
                  style="margin:5px"
                  type="primary"
                  size="mini"
                  round
                  @click="postReply(index)"
                  :loading="replying"
                >{{ $t("post") }}</el-button>
              </div>
            </div>
          </el-collapse-transition>
        </div>
      </div>
      <!-- 被隐藏的时候的渲染 -->
      <div class="deletedcomment" v-if="item.deleted">{{ $t("deletedcomment") }}</div>
      <div class="hiddencomment" v-else-if="item.hidden">
        {{ $t("hiddencomment") }}
        <el-button type="text" @click="item.hidden = false">{{ $t("opencomment") }}</el-button>
      </div>
      <el-divider></el-divider>
    </div>
  </div>
</template>

<script>
import { ParseComment, getFace, getEmoji } from "../static/js/comment";
export default {
  props: {
    sid: { type: String }
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
      emojiVisible: false
    };
  },
  computed: {
    // 评论的用户
    commentUser() {
      return function(id) {
        for (var i = 0; i < this.allUsers.length; i++) {
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
          return require("../static/img/defaultAvatar.jpg");
        } else {
          return "be/images/userphotos/" + imgName;
        }
      };
    },
    // 评论的日期
    commentdate() {
      return function(date) {
        var upload_time = new Date(date);
        var y = upload_time.getFullYear(); //getFullYear 方法以四位数字返回年份
        var M = upload_time.getMonth() + 1; // getMonth 方法从 Date 对象返回月份 (0 ~ 11)，返回结果需要手动加一
        var d = upload_time.getDate(); // getDate 方法从 Date 对象返回一个月中的某一天 (1 ~ 31)
        var h = upload_time.getHours(); // getHours 方法返回 Date 对象的小时 (0 ~ 23)
        var m = upload_time.getMinutes(); // getMinutes 方法返回 Date 对象的分钟 (0 ~ 59)
        var s = upload_time.getSeconds(); // getSeconds 方法返回 Date 对象的秒数 (0 ~ 59)
        return (
          y +
          "-" +
          // 数字不足两位自动补零，下同
          (Array(2).join(0) + M).slice(-2) +
          "-" +
          (Array(2).join(0) + d).slice(-2) +
          " " +
          (Array(2).join(0) + h).slice(-2) +
          ":" +
          (Array(2).join(0) + m).slice(-2) +
          ":" +
          (Array(2).join(0) + s).slice(-2)
        );
      };
    },
    // 判断是否登录
    isLogin() {
      if (
        JSON.stringify(this.$store.state.username) != "null" &&
        this.$store.state.username != ""
      ) {
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
          data: { pid: this.$route.query.id, text: this.comment }
        };
      else if (this.$route.path === "/video")
        return {
          url: "/be/comments/add_to_video.do",
          data: { vid: this.$route.query.id, text: this.comment }
        };
      else return false;
    }
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
    //   var faceRow = Math.ceil(array.length / MAXROW);
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
    //   var faceRow = Math.ceil(array.length / MAXROW);
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
          thread_id: this.tid
        }
      })
        .then(result => {
          this.allcomments = result.data.data.comments;
          this.allUsers = result.data.data.users;
          this.cid_comment_map = new Map();

          for (var i = 0; i < this.allcomments.length; i++) {
            //console.log(this.allcomments[i]);
            for (var j = 0; j < this.allcomments[i].children.length; ++j) {
              //console.log(this.allcomments[i].children[j]._id.$oid);
              this.cid_comment_map.set(
                this.allcomments[i].children[j]._id.$oid,
                this.allcomments[i].children[j]
              );
            }
          }

          // 初始化评论区开启标志
          for (var i = 0; i < this.allcomments.length; i++) {
            this.showReplies.push({
              show: false,
              face: false,
              emoji: false
            });
          }
          // 初始化回复框开启标志
          for (var i = 0; i < this.allcomments.length; i++) {
            this.replycomments.push({
              show: false,
              face: false,
              emoji: false
            });
          }

          this.loadingcomment = false;
        })
        .catch(error => {
          console.log(error);
          this.openFailed(this.$t("getcommentFailed"));
          this.loadingcomment = false;
        });
    },
    // parseComment(content) {
    //   var match = content.match(/((?<=\[\[)[^\(\]\]]+)/g);
    //   match.map((v, i) => {
    //     var kv = v.split(":");
    //     if (kv.length <= 1) return;
    //     var action = kv[0];
    //     var value = kv[1];
    //     var newvalue = "";
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
        this.openFailed(this.$t("PsaySth"));
        return;
      }
      this.posting = true;
      this.axios({
        method: "post",
        url: this.requestURL.url,
        data: this.requestURL.data
      })
        .then(result => {
          this.posting = false;
          if (result.data.status == "SUCCEED") {
            this.tid = result.data.data.thread_id;
            this.comment = "";
            this.getcomments();
            this.openSuccessful(this.$t("postSuccessfully"));
          } else {
            this.openFailed(this.$t("postFailed"));
          }
        })
        .catch(error => {
          console.log(error);
          this.openFailed(this.$t("postFailed"));
          this.posting = false;
        });
    },
    // 打开楼中楼的回复框
    openReplyBox(index, name, cid) {
      this.cidReplied = cid;
      this.reply = "";
      for (var i = 0; i < this.replycomments.length; i++) {
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
        this.openFailed(this.$t("PsaySth"));
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
          text: this.reply
        }
      })
        .then(result => {
          if (result.data.status == "SUCCEED") {
            this.reply = "";
            this.replycomments[index].show = false;
            this.showReplies[index].show = true;
            this.getcomments();
            this.openSuccessful(this.$t("postSuccessfully"));
          } else {
            this.openFailed(this.$t("postFailed"));
          }
          this.replying = false;
        })
        .catch(error => {
          console.log(error);
          this.replying = false;
          this.openFailed(this.$t("postFailed"));
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
          op: "commentAdmin"
        }
      })
        .then(result => {
          if (result.data.status == "SUCCEED") {
            this.Authorized = true;
          }
        })
        .catch(error => {
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
          cid: this.AuthorizedCid
        }
      })
        .then(result => {
          if (result.data.status == "SUCCEED") {
            this.openSuccessful(this.$t("operationSuccessfully"));
            this.getcomments();
          } else {
            this.openFailed(this.$t("operationFailed"));
          }
          this.Authorizing = false;
          this.AuthOps = false;
        })
        .catch(error => {
          console.log(error);
          this.openFailed(this.$t("operationFailed"));
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
          cid: this.AuthorizedCid
        }
      })
        .then(result => {
          if (result.data.status == "SUCCEED") {
            this.openSuccessful(this.$t("operationSuccessfully"));
            this.getcomments();
          } else {
            this.openFailed(this.$t("operationFailed"));
          }
          this.Authorizing = false;
          this.AuthOps = false;
        })
        .catch(error => {
          console.log(error);
          this.openFailed(this.$t("operationFailed"));
          this.Authorizing = false;
          this.AuthOps = false;
        });
    },
    // 各种信息
    openSuccessful(message) {
      this.$message({
        message: message,
        type: "success"
      });
    },

    openFailed(message) {
      this.$message({
        message: message,
        type: "error"
      });
    }
  },
  watch: {
    sid() {
      this.tid = this.sid;
    },
    tid() {
      this.getcomments();
    }
  },
  components: {}
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
