<template>
  <div>
    <top-navbar></top-navbar>

    <div class="content mt-4">
      <div>
        <el-alert type="info">
          <div style="color: black;">
            <h2 v-t="'hint.title'"></h2>
            <i18n path="hint.desc" tag="p" style="white-space: pre-wrap;">
              <span place="version">2020/6/17 (0.4.0-alpha.4)</span>
              <a place="wikilink" href="https://patchyvideo.wiki/Forum" target="_blank" rel="noopener noreferrer">https://patchyvideo.wiki/Forum</a>
            </i18n>
          </div>
        </el-alert>
      </div>
      <!-- 板块表 -->
      <el-table :data="forumList" :empty-text="$t('table.empty-text')" style="width: 100%;">
        <el-table-column :label="$t('table.forum')">
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
import topNavbar from "@/components/main/bar/TopNavbar";
import cfooter from "@/components/main/bar/Footer";

import { changeSiteTitle } from "@/static/js/base";

export default {
  components: {
    topNavbar,
    cfooter,
  },
  data() {
    return {
      forumList: [
        {
          id: "5e8fce11beb63ebb98f8b50c",
          name: "意见反馈",
          desc: "在这里反馈在帕琪站遇到的问题~",
        },
      ],
    };
  },
  mounted() {
    changeSiteTitle("讨论板");
  },
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
