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
    "commit":"评论",
    "commitCount":"共{length}条评论",
    "noCommit":"暂无评论！",
    "saySth":"说点儿什么吧~",
    "usingEnter":"使用Enter键发表评论",
    "post":"发表",
    "joinDiscuss":"想要一起参与讨论？",
    "login":"点我登录",
    "showRplies":"查看{length}条回复",
    "reply":"回复",
    "hideReply":"收起回复",
    "manage":"管理",
    "replyTo":"回复Ta",
    "hiddenCommit":"该评论已被隐藏",
    "openCommit":"点我展开",
    "deletedCommit":"抱歉，该评论已被删除",
    "selectOpts":"请选择操作",
    "deletCommit":"删除评论",
    "hideCommit":"隐藏评论",
    "cancel":"取 消",
    "getCommitFailed":"获取评论失败，请检查网络设置！",
    "PsaySth":"请输入内容！",
    "postSuccessfully":"发表成功！",
    "postFailed":"发表失败，请检查网络设置！",
    "operationSuccessfully":"操作成功！",
    "operationFailed":"操作失败，请检查网络设置！"
  },
  "ENG": {
    "commit":"Commit",
    "commitCount":"{length} commits in total",
    "noCommit":"No commit here!",
    "saySth":"Say something...",
    "usingEnter":"Post commit using Enter key",
    "post":"Post",
    "joinDiscuss":"Want to join the discuss? ",
    "login":"Click me to login",
    "showRplies":"Show {length} commits",
    "reply":"Reply ",
    "hideReply":"Hide the reply",
    "manage":"Manage",
    "replyTo":"Reply to...",
    "hiddenCommit":"The commit has been hidden. ",
    "openCommit":"Click me to show the commit",
    "deletedCommit":"Sorry, the commit has been deleted",
    "selectOpts":"Please select the operation",
    "deletCommit":"Delet the commit",
    "hideCommit":"Hide the commit",
    "cancel":"Cancel",
    "getCommitFailed":"Geting commit data failed, please check your Internet!",
    "PsaySth":"Please say something!",
    "postSuccessfully":"Post Successfully",
    "postFailed":"Failed post , please check your Internet!",
    "operationSuccessfully":"Operate Successfully",
    "operationFailed":"Failed operation, please check your Internet!"
  }
}
</i18n>


<template>
  <div style="text-align: left;">
    <!-- 管理操作的弹出框 -->
    <el-dialog :title="$t('selectOpts')" :visible.sync="AuthOps" width="50%">
      <div v-loading="Authorizing">
        <el-button style="width:100%;" @click="deletCommit()">{{$t('deletCommit')}}</el-button>
        <br />
        <br />
        <el-button style="width:100%;" @click="hideCommit()">{{$t('hideCommit')}}</el-button>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="AuthOps = false">{{$t('cancel')}}</el-button>
      </span>
    </el-dialog>

    <!-- 标题 -->
    <div class="new_top">
      <h2>{{$t('commit')}}</h2>
      <p v-if="allCommits.length">{{$t('commitCount', {length: allCommits.length})}}</p>
      <p v-else>{{$t('noCommit')}}</p>
    </div>

    <!-- 发表评论 -->
    <div class="commit" v-if="isLogin">
      <el-input
        type="textarea"
        :autosize="{ minRows: 4}"
        :placeholder="$t('saySth')"
        maxlength="500"
        show-word-limit
        v-model="commit"
        @keyup.enter.native="postCommitOnInput()"
      ></el-input>
      <el-checkbox v-model="UsingEnter">{{$t('usingEnter')}}</el-checkbox>
      <el-button type="primary" @click="postCommit()" :loading="posting">{{$t('post')}}</el-button>
    </div>
    <!-- 未登录时显示 -->
    <div v-else>
      {{$t('joinDiscuss')}}
      <router-link to="/login" @click.native="login">{{$t('login')}}</router-link>
    </div>

    <!-- 评论详情 -->
    <el-divider></el-divider>
    <div class="commitBox" v-for="(item,index) in allCommits" :key="index">
      <!-- 正常情况下的渲染 -->
      <div class="commitDetail" v-if="!item.hidden&&!item.deleted">
        <!-- 用户头像 -->
        <div class="avatar">
          <el-avatar :src="userAvatar(commitUser(item.meta.created_by.$oid).profile.image)"></el-avatar>
        </div>
        <!-- 右半部分 -->
        <div class="commitContent">
          <div>
            <router-link
              :to="'/users/'+item.meta.created_by.$oid"
              target="_blank"
            >{{commitUser(item.meta.created_by.$oid).profile.username}}:</router-link>
            {{item.content}}
          </div>
          <span class="commitDate">{{commitdate(item.meta.created_at.$date)}}</span>
          <el-button
            class="replyCommit"
            v-if="item.children.length&&!showReplies[index].show"
            type="text"
            @click="showReplies[index].show=true"
          >{{$t('showRplies', {length: item.children.length})}}</el-button>
          <el-button
            class="replyCommit"
            v-else-if="!replycommits[index].show&&isLogin"
            type="text"
            @click="openReplyBox(index, commitUser(item.meta.created_by.$oid).profile.username,item._id.$oid)"
          >{{$t('reply')}}</el-button>
          <el-button
            class="replyCommit"
            v-else-if="isLogin"
            type="text"
            @click="replycommits[index].show=false"
          >{{$t('hideReply')}}</el-button>

          <!-- 权限操作 -->
          <el-button
            class="replyCommit"
            v-if="isLogin&&(Authorized||myCommit(commitUser(item.meta.created_by.$oid).profile.username))"
            type="text"
            @click="AuthorizeCommit(item._id.$oid)"
          >{{$t('manage')}}</el-button>
        </div>

        <!-- 楼中楼 -->
        <div>
          <el-collapse-transition>
            <div v-show="showReplies[index].show">
              <div class="allReply" v-for="(reply,i) in item.children" :key="i">
                <!-- 正常情况下的渲染 -->
                <div v-if="!reply.hidden&&!reply.deleted">
                  <!-- 楼中楼头像 -->
                  <div class="avatar" style="margin:0">
                    <el-avatar
                      :src="userAvatar(commitUser(reply.meta.created_by.$oid).profile.image)"
                      size="small"
                    ></el-avatar>
                  </div>
                  <!-- 楼中楼右半部分 -->
                  <div class="commitContent" style="margin-left:40px;">
                    <div>
                      <router-link
                        :to="'/users/'+item.meta.created_by.$oid"
                        target="_blank"
                      >{{commitUser(reply.meta.created_by.$oid).profile.username}}:</router-link>
                      {{reply.content}}
                    </div>
                    <span class="commitDate">{{commitdate(reply.meta.created_at.$date)}}</span>
                    <el-button
                      v-if="isLogin"
                      class="replyCommit"
                      type="text"
                      @click="openReplyBox(index,commitUser(reply.meta.created_by.$oid).profile.username,reply._id.$oid)"
                    >{{$t('reply')}}</el-button>
                    <!-- 权限操作 -->
                    <el-button
                      class="replyCommit"
                      v-if="isLogin&&(Authorized||myCommit(commitUser(reply.meta.created_by.$oid).profile.username))"
                      type="text"
                      @click="AuthorizeCommit(reply._id.$oid)"
                    >{{$t('manage')}}</el-button>
                  </div>
                </div>
                <!-- 被隐藏的时候的渲染 -->
                <div style="margin-left:40px;" v-if="reply.hidden">
                  {{$t('hiddenCommit')}}
                  <el-button type="text" @click="reply.hidden=false">{{$t('openCommit')}}</el-button>
                </div>
                <div
                  style="margin-left:40px;margin-bottom:10px"
                  v-if="reply.deleted"
                >{{$t('deletedCommit')}}</div>
              </div>
            </div>
          </el-collapse-transition>
        </div>

        <!-- 楼中楼的回复框 -->
        <div>
          <el-collapse-transition>
            <div v-show="replycommits[index].show">
              <div class="replyBox">
                <el-input
                  type="textarea"
                  :autosize="{ minRows: 1, maxRows: 4}"
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
                >{{$t('post')}}</el-button>
              </div>
            </div>
          </el-collapse-transition>
        </div>
      </div>
      <!-- 被隐藏的时候的渲染 -->
      <div class="hiddenCommit" v-if="item.hidden">
        {{$t('hiddenCommit')}}
        <el-button type="text" @click="item.hidden=false">{{$t('openCommit')}}</el-button>
      </div>
      <div class="deletedCommit" v-if="item.deleted">{{$t('deletedCommit')}}</div>
      <el-divider></el-divider>
    </div>
  </div>
</template>

<script>
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
      allCommits: [],
      // 评论区所有用户的信息
      allUsers: [],
      // 用户输入的评论
      commit: "",
      // 用户输入的楼中楼的回复
      reply: "",
      // 用户评论对象的cid
      cidReplied: "",
      // 楼层评论区是否打开的数组
      replycommits: [],
      // 楼层详情是否打开的数组
      showReplies: [],
      // 是否使用Enter键发表评论
      UsingEnter: true,
      // 评论是否正在发表中
      posting: false,
      // 回复是否正在发表中
      replying: false,
      // 评论是否在加载中
      loadingCommit: false,
      // 是否有管理权限
      Authorized: false,
      // 管理页面的弹出框
      AuthOps: false,
      // 被管理对象的cid
      AuthorizedCid: "",
      // 管理页面是否加载的标志
      Authorizing: false
    };
  },
  computed: {
    // 评论的用户
    commitUser() {
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
    commitdate() {
      return function(date) {
        var upload_time = new Date(date);
        var y = upload_time.getFullYear(); //getFullYear方法以四位数字返回年份
        var M = upload_time.getMonth() + 1; // getMonth方法从 Date 对象返回月份 (0 ~ 11)，返回结果需要手动加一
        var d = upload_time.getDate(); // getDate方法从 Date 对象返回一个月中的某一天 (1 ~ 31)
        var h = upload_time.getHours(); // getHours方法返回 Date 对象的小时 (0 ~ 23)
        var m = upload_time.getMinutes(); // getMinutes方法返回 Date 对象的分钟 (0 ~ 59)
        var s = upload_time.getSeconds(); // getSeconds方法返回 Date 对象的秒数 (0 ~ 59)
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
    myCommit() {
      return function(name) {
        return name == this.$store.state.username;
      };
    },
    // 判断请求的URL
    requestURL() {
      if (this.$route.path === "/listdetail")
        return {
          url: "/be/comments/add_to_playlist.do",
          data: { pid: this.$route.query.id, text: this.commit }
        };
      else if (this.$route.path === "/video")
        return {
          url: "/be/comments/add_to_video.do",
          data: { vid: this.$route.query.id, text: this.commit }
        };
      else return false;
    }
  },
  created() {
    this.isAuthorized();
  },
  methods: {
    // 获取评论
    getCommits() {
      this.loadingCommit = true;

      this.axios({
        method: "post",
        url: "/be/comments/view.do",
        data: {
          thread_id: this.tid
        }
      })
        .then(result => {
          this.allCommits = result.data.data.comments;
          this.allUsers = result.data.data.users;

          // 初始化评论区开启标志
          for (var i = 0; i < this.allCommits.length; i++) {
            this.showReplies.push({
              show: false
            });
          }
          // 初始化回复框开启标志
          for (var i = 0; i < this.allCommits.length; i++) {
            this.replycommits.push({
              show: false
            });
          }

          this.loadingCommit = false;
        })
        .catch(error => {
          console.log(error);
          this.openFailed(this.$t("getCommitFailed"));
          this.loadingCommit = false;
        });
    },
    // 使用Enter键发布视频
    postCommitOnInput() {
      if (this.UsingEnter) {
        this.commit = this.commit.substr(0, this.commit.length - 1);
        this.postCommit();
      }
      return false;
    },
    // 发表评论
    postCommit() {
      if (this.commit == "" || this.commit == "\n") {
        this.commit = "";
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
            this.commit = "";
            this.getCommits();
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
      for (var i = 0; i < this.replycommits.length; i++) {
        this.replycommits[i].show = false;
      }
      this.replycommits[index].show = true;
      this.reply = this.$t("reply") + name + " :";
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
            this.replycommits[index].show = false;
            this.showReplies[index].show = true;
            this.getCommits();
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
      this.$store.commit("changeifRouter", "0");
    },
    // 查看是否有编辑权限
    // op可选参数：
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
    AuthorizeCommit(cid) {
      this.AuthorizedCid = cid;
      this.AuthOps = true;
    },
    // 删除评论
    deletCommit() {
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
            this.getCommits();
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
    hideCommit() {
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
            this.getCommits();
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
      this.getCommits();
    }
  },
  components: {}
};
</script>

<style scoped>
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
.commit {
  /* border: 3px solid #1414142d; */
  text-align: right;
}
.commit .el-textarea {
  width: calc(100% - 10px);
  margin: 5px;
}
.commit .el-checkbox {
  float: left;
  margin-left: 10%;
  margin-top: 15px;
}
.commit .el-button {
  width: 30%;
  margin: 5px;
}

.avatar {
  float: left;
  margin: 15px;
  margin-top: 0px;
}
.commitContent {
  margin-left: 70px;
  white-space: pre-line;
}
.commitDate {
  font-size: 13px;
  line-height: 2.5;
  color: #909399;
}
.replyCommit {
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
.hiddenCommit {
  margin-left: 70px;
}
.deletedCommit {
  margin-left: 70px;
}
</style>