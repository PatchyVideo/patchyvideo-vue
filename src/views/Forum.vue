<template>
  <div>
    <top-navbar></top-navbar>

    <div class="content mt-4">
      <div>
        <el-alert type="info">
          <div style="color:black">
            <h2>欢迎来到 PatchyVideo 讨论版</h2>
            <p>
              最后更新时间：2020/4/27<br />
              讨论版仍在最初测试阶段，有很多功能可能不够完善，仅供测试。<br />
              <!-- 讨论版发帖支持使用 markdown
              解析，在内容最前加入[[parser:"markdown"]]即可<br />
              如需区域使用 markdown 请这样书写：[[chunk
              parser:"markdown"]]内容[[/chunk]]<br />
              如需使用额外 markdown 内容请加入 markdown-plugin
              属性，如：[[parser:"markdown" markdown-plugin:"subscript
              superscript"]]<br />
              注意：讨论版的 markdown 解析器并<strong>不</strong>支持嵌入 html
              代码<br /> -->
              如有任何意见可尝试在反馈版提出。
            </p>
          </div>
        </el-alert>
      </div>
      <!-- 板块表 -->
      <el-table
        :data="forumList"
        empty-text="少女祈祷中..."
        style="width: 100%"
      >
        <el-table-column label="板块">
          <template slot-scope="forum">
            <div>
              <router-link :to="'/forum/' + forum.row.id"
                ><h3 class="mb-1">{{ forum.row.name }}</h3></router-link
              >
              <p>{{ forum.row.desc }}</p>
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
      forumList: [
        {
          id: "5e8fce11beb63ebb98f8b50c",
          name: "意见反馈",
          desc: "在这里反馈在帕琪站遇到的问题~"
        }
      ]
    };
  },
  mounted() {
    changeSiteTitle("讨论版");
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