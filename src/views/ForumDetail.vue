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
              建议将问题详细描述并尽量附带截图或日志。
            </p>
          </div>
        </el-alert>
      </div>
      <!-- 帖子表 -->
      <el-table
        :data="threadList"
        empty-text="少女祈祷中..."
        style="width: 100%"
      >
        <el-table-column label="帖子">
          <template slot-scope="thread">
            <div>
              <router-link
                :to="
                  '/forum/5e8fce11beb63ebb98f8b50c/post/' + thread.row._id.$oid
                "
                ><h3 class="mb-1">{{ thread.row.title }}</h3></router-link
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
    </div>

    <cfooter></cfooter>
  </div>
</template>

<script>
import topNavbar from "../components/TopNavbar.vue";
import cfooter from "../components/Footer.vue";

import { changeSiteTitle } from "../static/js/base";

export default {
  components: {
    topNavbar,
    cfooter
  },
  data() {
    return {
      threadList: [],
      threadAuthorsInfo: {}
    };
  },
  mounted() {
    this.axios({
      method: "post",
      url: "/be/forums/view_forum.do",
      data: {
        forum_id: this.$route.params.fid,
        page: 1,
        page_size: 20
      }
    })
      .then(result => {
        if (result.data.status == "SUCCEED") {
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
          })
            .then(result => {
              result.data.data.forEach(data => {
                this.$set(this.threadAuthorsInfo, data._id.$oid, data);
              });
            })
            .catch(error => {
              console.error(error);
            });
          changeSiteTitle("意见与反馈 - 讨论版");
        }
      })
      .catch(error => {
        console.error(error);
        // this.$router.push({ path: "/404" });
      });
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
.mb-2 {
  margin-bottom: 0.5em;
}
.mb-1 {
  margin-bottom: 0.25em;
}
</style>