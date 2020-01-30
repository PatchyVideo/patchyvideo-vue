<!--    vue组件：Foot.vue     -->
<!--
    组件：网站最底端的声明
    大小：100% * 100px
    功能：网站的版权声明等
    必要传入参数：无
    更新日志：
    12/3/2019: v1.0 
      release
    12/10/2019: v1.0.1
      1.修改了注释内容  
-->

<template>
  <div class="footer">
    <p>© 2019 www.patchyvideo.com Touhou Project</p>
  </div>
</template>

<script>
export default {
  data() {
    return {};
  },
  created() {},
  methods: {},
  components: {}
};
</script>

<style scoped>
.footer {
  margin-top: 3px;
  height: 100px;
  width: calc(100% - 20px);
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