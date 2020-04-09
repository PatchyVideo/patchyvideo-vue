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
<i18n>
{
  "CHS": {
    "LanguageSettings":"语言选项",
    "About":"关于帕琪站",
    "Wiki":"网站维基",
    "OfficialAccount":"B站官方账户",
    "JoinUs":"招募祈愿",
    "AboutIPFS":"IPFS相关",
    "IPFS":"幻想之物",
    "WhatIsIPFS":"IPFS是什么?",
    "Codes":"代码相关",
    "Repositories":"项目仓库",
    "bug_report":"反馈BUG"
  },
  "ENG": {
    "LanguageSettings":"Languages",
    "About":"About Patchyvideo",
    "Wiki":"Wiki",
    "OfficialAccount":"BiliBili Official Account",
    "JoinUs":"Join Us",
    "AboutIPFS":"About IPFS",
    "IPFS":"IPFS",
    "WhatIsIPFS":"What is IPFS?",
    "Codes":"Codes",
    "Repositories":"Repositories",
    "bug_report":"Report Bugs"
  },
  "CHT": {
    "LanguageSettings":"語言選項",
    "About":"關於帕琪站",
    "Wiki":"網站維基",
    "OfficialAccount":"B站官方账户",
    "JoinUs":"招募祈願",
    "AboutIPFS":"關於IPFS",
    "IPFS":"幻想之物",
    "WhatIsIPFS":"什麼是IPFS?",
    "Codes":"代碼相關",
    "Repositories":"項目倉庫",
    "bug_report":"反饋BUG"
  }
}
</i18n>

<template>
  <div class="patchyvideo-footer">
    <!-- 插图 -->
    <img class="footImg" height="150px" src="../static/img/footImg.png" />
    <!-- 语言选项 -->
    <div class="patchyvideo-languageSettings">
      <p style="margin-top:10px">
        <strong>{{$t('LanguageSettings')}}</strong>
      </p>
      <span @click="locale='CHS'">简体中文</span>
      <span @click="locale='CHT'">繁體中文</span>
      <span @click="locale='JPN'">日本語</span>
      <span @click="locale='ENG'">English</span>
    </div>
    <!-- 网站上方的链接 -->
    <div class="patchyvideo-links">
      <div class="patchyvideo-links-item">
        <p>
          <strong>{{$t('About')}}</strong>
        </p>
        <a href="https://patchyvideo.wiki" target="_blank">{{$t('Wiki')}}</a>
        <a href="https://space.bilibili.com/515657675">{{$t('OfficialAccount')}}</a>
        <a href="https://patchyvideo.wiki/JoinUs" target="_blank">{{$t('JoinUs')}}</a>
      </div>
      <div class="patchyvideo-links-item">
        <p>
          <strong>{{$t('AboutIPFS')}}</strong>
        </p>
        <router-link to="/ipfs">{{$t('IPFS')}}</router-link>
        <a
          href="https://zh.wikipedia.org/wiki/%E6%98%9F%E9%99%85%E6%96%87%E4%BB%B6%E7%B3%BB%E7%BB%9F"
        >{{$t('WhatIsIPFS')}}</a>
      </div>
      <div class="patchyvideo-links-item">
        <p>
          <strong>{{$t('Codes')}}</strong>
        </p>
        <a href="https://patchyvideo.wiki/Repositories" target="_blank">{{$t('Repositories')}}</a>
        <a href="https://github.com/zyddnys/PatchyVideo/issues" target="_blank">{{$t('bug_report')}}</a>
      </div>
    </div>
    <!-- 最下部的网站声明 -->
    <div>
      <p class="patchyvideo-declear yiyan" style="color:gray;" v-text="yiyan"></p>
      <p class="patchyvideo-declear">
        © 2019-{{(new Date()).getFullYear()}} PatchyVideo(Client:
        <a
          :href="'https://github.com/suwadaimyojin/patchyvideo-vue/commit/'+commitOfClient"
        >{{commitOfClient2}}</a>
        ;Server:
        <a
          :href="'https://github.com/zyddnys/PatchyVideo/commit/'+commitOfServer"
        >{{commitOfServer2}}</a>
        ) うちょうてんネットワーク
      </p>
    </div>
  </div>
</template>

<script>
import { getYiyan } from "../static/js/yiyan";
export default {
  data() {
    this.$i18n.locale = localStorage.getItem("lang");
    return {
      // github上的前台commit地址
      commitOfClient: "",
      // github上的后台commit地址
      commitOfServer: "",
      // 多语言支持
      locale: localStorage.getItem("lang"),
      // 吾有一言，请诸位静听
      yiyan: ""
    };
  },
  computed: {
    commitOfClient2() {
      return this.commitOfClient.slice(0, 8);
    },
    commitOfServer2() {
      return this.commitOfServer.slice(0, 8);
    }
  },
  created() {
    this.yiyan = getYiyan(true);
    setInterval(() => {
      this.yiyan = getYiyan(true);
    }, 10 * 1000);
    this.getCommit();
  },
  methods: {
    // 获取github上的commit地址
    getCommit() {
      // 获取前端地址
      this.axios({
        method: "get",
        url: "/v/fe/?" + new Date().getTime()
      }).then(result => {
        this.commitOfClient = result.data;
      });
      // 获取后端地址
      this.axios({
        method: "get",
        url: "/v/be/?" + new Date().getTime()
      }).then(result => {
        this.commitOfServer = result.data;
      });
    }
  },
  watch: {
    locale(val) {
      localStorage.setItem("lang", val);
      location.reload();
    }
  },
  components: {}
};
</script>

<style scoped>
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
  /* text-align: left; */
  border-top-style: dotted;
  border-top-width: thin;
  border-top-color: #c0c4cc;
  font-size: 15px;
  line-height: 25px;
}
.patchyvideo-declear .yiyan {
  border-top-style: none;
  opacity: 0; /*实先规定文字的状态是不显示的*/
  animation: fade-in 4s ease 0s 1; /*调用名称为fade-in的动画，全程动画显示时间4S，进入方式为ease，延时0S进入，播放次数1次*/
  -webkit-animation: fade-in 4s ease 0s 1;
  -moz-animation: fade-in 4s ease 0s 1;
  -o-animation: fade-in 4s ease 0s 1;
  -ms-animation: fade-in 4s ease 0s 1;

  /*规定动画的最后状态为结束状态*/
  animation-fill-mode: forwards;
  -webkit-animation-fill-mode: forwards;
  -o-animation-fill-mode: forwards;
  -ms-animation-fill-mode: forwards;
  -moz-animation-fill-mode: forwards;
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
@keyframes fade-in {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}
@-webkit-keyframes fade-in {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}
@-ms-keyframes fade-in {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}
@-o-keyframes fade-in {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}
@-moz-keyframes fade-in {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}
</style>