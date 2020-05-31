<!--    vue组件：Foot.vue     -->
<!--
    组件：网站最底端的声明
    大小：100% * 100px
    功能：网站的版权声明等
    必要传入参数：无
    更新日志：
    12/3/2019：v1.0 
      release
    12/10/2019：v1.0.1
      1.修改了注释内容  
    2/7/2020：v1.0.2
      1.显示内容更改为网站的代码提交地址的前八位
    4/1/2020: v1.1.0
      1.翻新了foot排版,将顶部导航栏的wiki,ipfs,bug反馈界面以及语言选择界面移动到了里面
-->
<template>
  <div class="patchyvideo-footer">
    <!-- 插图 -->
    <img class="footImg" src="@/static/img/footImg.png" />
    <!-- 语言选项 -->
    <div class="patchyvideo-languageSettings">
      <p style="margin-top: 10px;">
        <strong>{{ $t("LanguageSettings") }}</strong>
      </p>
      <span @click="locale = 'CHS'">简体中文</span>
      <span @click="locale = 'CHT'">繁體中文</span>
      <span @click="locale = 'JPN'">日本語</span>
      <span @click="locale = 'ENG'">English</span>
    </div>
    <!-- 网站上方的链接 -->
    <div class="patchyvideo-links">
      <div class="patchyvideo-links-item">
        <p>
          <strong>{{ $t("About") }}</strong>
        </p>
        <a href="https://patchyvideo.wiki" target="_blank" rel="noopener noreferrer">{{ $t("Wiki") }}</a>
        <a href="https://space.bilibili.com/515657675" rel="noopener noreferrer">{{ $t("OfficialAccount") }}</a>
        <a href="https://patchyvideo.wiki/JoinUs" target="_blank" rel="noopener noreferrer">{{ $t("JoinUs") }}</a>
      </div>
      <div class="patchyvideo-links-item">
        <p>
          <strong>{{ $t("AboutIPFS") }}</strong>
        </p>
        <a href="https://patchyvideo.wiki/Upload" rel="noopener noreferrer">{{ $t("WhatIsIPFS") }}</a>
        <a href="https://zh.wikipedia.org/wiki/%E6%98%9F%E9%99%85%E6%96%87%E4%BB%B6%E7%B3%BB%E7%BB%9F" rel="noopener noreferrer">{{ $t("IPFS") }}</a>
      </div>
      <div class="patchyvideo-links-item">
        <p>
          <strong>{{ $t("Codes") }}</strong>
        </p>
        <a href="https://patchyvideo.wiki/Repositories" target="_blank" rel="noopener noreferrer">{{ $t("Repositories") }}</a>
        <a href="https://github.com/zyddnys/PatchyVideo/issues" target="_blank" rel="noopener noreferrer">{{ $t("bug_report") }}</a>
      </div>
    </div>
    <!-- 最下部的网站声明 -->
    <div>
      <p class="patchyvideo-declear patchyvideo-declear-top">
        <vue-typed-js :strings="yiyan" :type-speed="75" :back-speed="15" :back-delay="4000" :shuffle="true" :loop="true" style="display:block;"
          ><span class="typing"></span
        ></vue-typed-js>
      </p>
      <p class="patchyvideo-declear patchyvideo-declear-top">
        QQ: <a href="https://jq.qq.com/?k=fOJYEJt1" rel="noopener noreferrer">757676234</a> | Telegram:
        <a href="https://t.me/PatchyVideo" rel="noopener noreferrer">t.me/PatchyVideo</a> | Email:
        <a href="mailto:zyddnys@outlook.com" rel="noopener noreferrer">zyddnys@outlook.com</a>
      </p>
      <p class="patchyvideo-declear">
        © 2019-{{ new Date().getFullYear() }} PatchyVideo(C:<a
          :href="'https://github.com/PatchyVideo/patchyvideo-vue/commit/' + commitOfClient"
          rel="noopener noreferrer"
          >{{ commitOfClient2 }}</a
        >;S:<a :href="'https://github.com/PatchyVideo/PatchyVideo/commit/' + commitOfServer" rel="noopener noreferrer">{{ commitOfServer2 }}</a
        >) うちょうてんネットワーク
      </p>
    </div>
  </div>
</template>

<script>
import Vue from "vue";
import VueTypedJs from "vue-typed-js";
Vue.use(VueTypedJs);

import { getYiyanArray } from "@/static/js/yiyan";

export default {
  components: {},
  data() {
    this.$i18n.locale = localStorage.getItem("lang");
    return {
      // github 上的前台 commit 地址
      commitOfClient: "",
      // github 上的后台 commit 地址
      commitOfServer: "",
      // 多语言支持
      locale: localStorage.getItem("lang"),
      // 吾有一言，请诸位静听
      yiyan: getYiyanArray(true, true),
      yiyanin: 0,
    };
  },
  computed: {
    commitOfClient2() {
      return this.commitOfClient.slice(0, 8);
    },
    commitOfServer2() {
      return this.commitOfServer.slice(0, 8);
    },
  },
  watch: {
    locale(val) {
      localStorage.setItem("lang", val);
      location.reload();
    },
  },
  created() {
    this.getCommit();
  },
  destroyed() {
    clearInterval(this.yiyanin);
  },
  methods: {
    // 获取 github 上的 commit 地址
    getCommit() {
      // 获取前端地址
      this.axios({
        method: "get",
        url: "/v/fe/?" + new Date().getTime(),
      }).then((result) => {
        this.commitOfClient = result.data;
      });
      // 获取后端地址
      this.axios({
        method: "get",
        url: "/v/be/?" + new Date().getTime(),
      }).then((result) => {
        this.commitOfServer = result.data;
      });
    },
  },
};
</script>

<style lang="less" scoped>
.patchyvideo-footer {
  position: relative;
  width: calc(100% - 40px);
  padding: 20px;
  padding-bottom: 3px;
  background-color: rgba(253, 204, 226, 0.267);
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  margin: 0 auto;
  margin-top: 40px;
}
.patchyvideo-links {
  margin: 20px;
  display: flex;
  justify-content: center;
  font-size: 17px;
}
.patchyvideo-links-item {
  margin: 20px;
  margin-top: 5px;
  display: flex;
  flex-direction: column;
}
.patchyvideo-links a {
  line-height: 25px;
  color: #606266;
  text-decoration: none;
  transition: all 0.4s ease;
}
.patchyvideo-links a:hover {
  color: #409eff;
}
.patchyvideo-declear {
  color: #909399;
  a {
    color: #909399;
  }
  /* text-align: left; */
  font-size: 15px;
  line-height: 25px;
}
.patchyvideo-declear-top {
  border-top-style: dotted;
  border-top-width: thin;
  border-top-color: #c0c4cc;
}
.footImg {
  position: absolute;
  left: 50px;
}
.patchyvideo-languageSettings {
  position: absolute;
  right: 60px;
  display: flex;
  flex-direction: column;
}
.patchyvideo-languageSettings span {
  line-height: 22px;
  color: #606266;
  text-decoration: none;
  transition: all 0.4s ease;
  cursor: pointer;
}
.patchyvideo-languageSettings span:hover {
  color: #409eff;
}
</style>
