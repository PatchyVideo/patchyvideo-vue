<!--    vue页面：test.vue     -->
<!--
    组件：网站的测试页面
    功能：可以在这里测试一些神奇的东西
    更新日志：
-->
<template>
  <div></div>
</template>

<script>
export default {
  components: {},
  data() {
    this.$i18n.locale = localStorage.getItem("lang");
    return {};
  },
  created() {},
  mounted() {},
  methods: {},
};
</script>

<style scoped></style>

<i18n folder></i18n>
