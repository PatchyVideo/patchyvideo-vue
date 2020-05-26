<!--    vue页面：404.vue     -->
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
        {{ $t("errmsg") }}
        <router-link to="/home">{{ $t("click2home") }}</router-link>
      </h1>
      <el-image style="width: 50%;" :src="url" :fit="fits[0]"></el-image>
    </div>
  </div>
</template>

<script>
export default {
  components: {},
  data() {
    this.$i18n.locale = localStorage.getItem("lang");
    return {
      fits: ["fill", "contain", "cover", "none", "scale-down"],
      url: "/images/covers/",
    };
  },
  created() {},
  methods: {},
};
</script>

<style scoped>
.errorPage {
  width: 100%;
  padding-top: 5%;
}
</style>

<i18n folder></i18n>
