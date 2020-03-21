<!--    vue页面：404.vue     -->
<!--
    组件：网站的404页面
    功能：网站的网址错误页面
    更新日志：
    2/1/2020: v1.0 
      release
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
  <div>
    <div class="errorPage">
      <h1>
        {{$t('errmsg')}}
        <router-link to="/home">{{$t('click2home')}}</router-link>
      </h1>
      <el-image style="width: 50%;" :src="url" :fit="fits[0]"></el-image>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    this.$i18n.locale = localStorage.getItem("lang");
    return {
      fits: ["fill", "contain", "cover", "none", "scale-down"],
      url: "http://localhost:888/images/covers/"
    };
  },
  created() {},
  methods: {},
  components: {}
};
</script>

<style scoped>
.errorPage {
  width: 100%;
  padding-top: 5%;
}
</style>