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
-->

<template>
  <div class="patchyvideo-footer">
    <!-- 插图 -->
    <img class="footImg" height="150px" src="../static/img/footImg.png" />
    <!-- 语言选项 -->
    <div class="patchyvideo-languageSettings">
      <p style="margin-top:10px">
        <strong>语言选项</strong>
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
          <strong>关于帕琪站</strong>
        </p>
        <a href="https://patchyvideo.wiki" target="_blank">网站维基</a>
        <a href="https://space.bilibili.com/515657675">B站官方号</a>
        <a href="https://patchyvideo.wiki/JoinUs" target="_blank">招募祈愿</a>
      </div>
      <div class="patchyvideo-links-item">
        <p>
          <strong>IPFS相关</strong>
        </p>
        <router-link to="/ipfs">幻想之物</router-link>
        <a
          href="https://zh.wikipedia.org/wiki/%E6%98%9F%E9%99%85%E6%96%87%E4%BB%B6%E7%B3%BB%E7%BB%9F"
        >IPFS是什么?</a>
      </div>
      <div class="patchyvideo-links-item">
        <p>
          <strong>网站代码</strong>
        </p>
        <a href="https://patchyvideo.wiki/Repositories" target="_blank">项目仓库</a>
        <a href="https://github.com/zyddnys/PatchyVideo/issues" target="_blank">反馈BUG</a>
      </div>
    </div>
    <!-- 最下部的网站声明 -->
    <div>
      <p class="patchyvideo-declear">
        © 2019-2020 PatchyVideo(Client:
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
export default {
  data() {
    this.$i18n.locale = localStorage.getItem("lang");
    return {
      // github上的前台commit地址
      commitOfClient: "",
      // github上的后台commit地址
      commitOfServer: "",
      // 多语言支持
      locale: localStorage.getItem("lang")
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
    this.getCommit();
  },
  methods: {
    // 获取github上的commit地址
    getCommit() {
      // 获取前端地址
      this.axios({
        method: "get",
        url: "https://patchyvideo.com/v/fe/"
      }).then(result => {
        this.commitOfClient = result.data;
      });
      // 获取后端地址
      this.axios({
        method: "get",
        url: "https://patchyvideo.com/v/be/"
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