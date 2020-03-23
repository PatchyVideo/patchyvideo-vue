<!--    vue组件：AllMessage.vue     -->
<!--
    组件：网站消息界面
    功能：展示用户的所有消息
    更新日志：
    其他说明：
      由于后端原因请求数据的接口只能获取到用户的iID
      此时需要对将用户ID进行整理发送至后端获取用户的详细信息
      但需要注意的是，前端需要对用户信息和用户ID进行再次匹配，会对浏览器造成一定的运算负担
-->
<i18n>
{
  "CHS": {
    "allMsg":"全部消息",
    "noMsg":"还没有收到消息QAQ",
    "replyTo":"回复了你的评论:"
  },
  "ENG": {
    "allMsg":"All Messages",
    "noMsg":"NO MESSAGE YET!",
    "replyTo":"replied to you:"
  },
  "CHT": {
    "allMsg":"全部消息",
    "noMsg":"還沒有收到消息QAQ",
    "replyTo":"回復了你的評論:"
  }
}
</i18n>


<template>
  <div class="unreadMsg">
    <div class="unreadMsg-title">{{ $t("allMsg") }}</div>
    <div class="unreadMsg-detail" v-loading="loading">
      <div v-if="loading||!allMsg.length" style="min-height:400px">{{ $t("noMsg") }}</div>
      <!-- 所有消息列表 -->
      <div v-else>
        <div
          v-for="(item, index) in allMsg"
          :key="index"
          class="replyDetail"
          @click="toDetail(item.replied_type, item.replied_obj.$oid)"
        >
          <!-- 用户头像 -->
          <div class="avatar">
            <el-avatar
              :src="userAvatar(commentUser(item.replied_by.$oid).profile.image)"
              :size="50"
            ></el-avatar>
          </div>
          <!-- 右半部分 -->
          <div class="commentContent">
            <div style="font-size:15px">
              <router-link :to="'/users/' + item.replied_by.$oid" target="_blank">
                {{
                commentUser(item.replied_by.$oid).profile.username
                }}:
              </router-link>
              {{ $t("replyTo") }}:
            </div>
            <div v-linkified>{{ item.content }}</div>

            <span class="commentDate">
              {{
              commentdate(item.time.$date)
              }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    this.$i18n.locale = localStorage.getItem("lang");
    return {
      // 消息页数
      page: 1,
      // 所有消息
      allMsg: [],
      // 用户信息数据
      allUsers: [],
      // 数据是否正在加载的标志
      loading: false
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
          return require("../../static/img/defaultAvatar.jpg");
        } else {
          return "be/images/userphotos/" + imgName;
        }
      };
    },
    // 评论的日期
    commentdate() {
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
    }
  },
  created() {},
  mounted() {
    this.getUnreadMsg();
  },
  methods: {
    // 获取未读信息
    getUnreadMsg() {
      this.loading = true;
      this.axios({
        method: "post",
        url: "be/notes/list_all.do",
        data: {
          page: this.page,
          page_size: 20
        }
      })
        .then(result => {
          this.allMsg = result.data.data.notes;
          // 整理用户的ID
          var UIDs = result.data.data.notes;
          UIDs = UIDs.map(data => {
            return data.replied_by.$oid;
          });
          // 查询用户的信息
          this.axios({
            method: "post",
            url: "/be/user/profile_batch.do",
            data: {
              uids: UIDs
            }
          })
            .then(result => {
              this.allUsers = result.data.data;
              this.loading = false;
            })
            .catch(error => {
              this.loading = false;
              console.log(error);
            });
        })
        .catch(error => {
          this.loading = false;
          console.log(error);
        });
    },
    // 跳转至视频详情/列表详情页面
    toDetail(type, id) {
      if (event.target.tagName == "IMG" || event.target.tagName == "A") return;
      if (type == "video") {
        let routeData = this.$router.resolve({
          path: "/video",
          query: { id: id }
        });
        window.open(routeData.href, "_blank");
      } else if (type == "playlist") {
        let routeData = this.$router.resolve({
          path: "/listdetail",
          query: { id: id }
        });
        window.open(routeData.href, "_blank");
      } else return;
    }
  },
  components: {}
};
</script>

<style scoped>
.UnreadMsg {
  width: 100%;
}
.unreadMsg-title {
  border-radius: 4px;
  background-color: rgb(255, 255, 255);
  border: 8px;
  margin: 10px;
  font-size: 20px;
  color: #303133;
}
.unreadMsg-detail {
  border-radius: 4px;
  background-color: rgba(255, 255, 255, 0.89);
  border: 8px;
  margin: 10px;
  font-size: 20px;
}

.replyDetail {
  text-align: left;
  border-top-style: solid;
  border-top-width: 1px;
  border-top-color: #909399d2;
  cursor: pointer;
}
.replyDetail:hover {
  background-color: rgba(0, 0, 0, 0.068);
}
.avatar {
  float: left;
  margin: 20px;
}
.commentContent {
  margin: 20px;
  margin-left: 90px;
}
.commentDate {
  font-size: 13px;
  line-height: 2.5;
  color: #909399;
}
</style>