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
  <div class="footer">
    <p>
      <!-- © 2019 www.patchyvideo.com  -->
      Running patchyvideo(Client:
      <a
        :href="'https://github.com/suwadaimyojin/patchyvideo-vue/commit/'+commitOfClient"
      >{{commitOfClient2}}</a>
      ;Server:
      <a
        :href="'https://github.com/zyddnys/PatchyVideo/commit/'+commitOfServer"
      >{{commitOfServer2}}</a>
      )
    </p>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // github上的前台commit地址
      commitOfClient: "",
      // github上的后台commit地址
      commitOfServer: ""
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
  components: {}
};
</script>

<style scoped>
.footer {
  margin-top: 3px;
  height: 100px;
  width: calc(100%);
  background-color: #fff;
  border-top: 1px solid #c5464a;
  text-align: left;
  line-height: 100px;
  font-size: 14px;
  color: #73777a;
  letter-spacing: 0.5px;
  text-align: left;
}
</style>