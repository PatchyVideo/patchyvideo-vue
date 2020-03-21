<!--    vue页面：UnreadMsg.vue     -->
<!--
    组件：网站未读消息界面
    功能：展示网站的未读消息
    更新日志：
-->
<i18n>
{
  "CHS": {
    "errmsg":"哎呀，页面好像出错了...",
    "click2home":"点我返回主页"
  },
  "ENG": {
    "errmsg":"Sorry, this page is not found ...",
    "click2home":"Click me to return to homepage"
  },
  "CHT": {
    "errmsg":"哎呀，頁面好像出錯了...",
    "click2home":"點我返回主頁"
  }
}
</i18n>


<template>
  <div class="unreadMsg">
    <div class="unreadMsg-title">未读消息</div>
    <div class="unreadMsg-detail" v-loading="loading"></div>
  </div>
</template>

<script>
export default {
  data() {
    this.$i18n.locale = localStorage.getItem("lang");
    return {
      // 数据是否正在加载的标志
      loading: false
    };
  },
  created() {},
  methods: {},
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
  min-height: 400px;
}
</style>