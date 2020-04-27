<template>
  <div>
    <top-navbar></top-navbar>

    <div class="content mt-4">
      <el-row>
        <el-col :span="18">
          <h2>{{ title || "Loading..." }}</h2>
          <el-table
            :data="commentList"
            :show-header="false"
            empty-text="少女祈祷中..."
            style="width: 100%"
          >
            <el-table-column label="作者" width="54">
              <template slot-scope="comment">
                <div v-if="!comment.row.hidden || comment.row.deleted">
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
                        class="vertical-align:middle"
                      ></el-avatar
                    ></router-link>
                  </div>
                  <div v-else>Loading...</div>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="帖子内容">
              <template slot-scope="comment">
                <div v-if="comment.row.deleted"></div>
                <div v-else-if="!comment.row.hidden">
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
                  <div style="float:right">
                    回复
                  </div>
                  <p
                    style="color:black"
                    v-html="parseComment(comment.row.content)"
                  ></p>
                </div>
                <div v-else-if="comment.row.hidden">
                  此回复因离题或语言过激被折叠
                </div>
              </template>
            </el-table-column>
          </el-table>
        </el-col>
        <el-col
          :span="6"
          style="text-align:center;position:fixed;top:90px;max-width:277.5px;margin-left:832.5px"
        >
          帖子共有{{ commentList ? commentList.length : 0 }}个回复<br />
          <el-button type="primary" size="small" plain
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

import { changeSiteTitle } from "../static/js/base";
import { ParseComment, getFace, getEmoji } from "../static/js/comment";

export default {
  components: {
    topNavbar,
    cfooter
  },
  data() {
    return {
      title: "",
      commentList: [],
      commentAuthorsInfo: {}
    };
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
          this.commentList = result.data.data.comments;
          const commentAuthorUIDs = [];
          result.data.data.comments.forEach(data => {
            commentAuthorUIDs.push(data.meta.created_by.$oid);
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
    parseComment(c) {
      return ParseComment(c);
    }
  }
};
</script>

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