<!--    vue页面：Foot.vue     -->
<!--
    组件：网站的404页面
    功能：网站的网址错误页面
    更新日志：
    2/1/2020: v1.0 
      release
-->

<template>
  <div>
    <div class="errorPage">
      <h1>
        哎呀，页面好像出错了...
        <router-link to="/home">点我返回主页</router-link>
      </h1>
      <el-image style="width: 50%;" :src="url" :fit="fits[0]"></el-image>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    this.$i18n.locale = localStorage.getItem('lang');
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