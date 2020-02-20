<!-- 当前页面刷新方法：将router-view先隐藏后显示 -->
<!-- 使用方法：子页面在export default下声明inject: ['reload']，然后直接在页面下调用this.reload -->
<template>
  <div id="app" :class="this.$store.state.bgcMark">
    <router-view v-if="isRouterAlive" />
  </div>
</template>
<script>
export default {
  provide() {
    return {
      reload: this.reload
    };
  },
  data() {
    return {
      isRouterAlive: true
    };
  },
  methods: {
    reload() {
      this.isRouterAlive = false;
      this.$nextTick(function() {
        this.isRouterAlive = true;
      });
    }
  },
  components: {}
};
</script>

<style>
  .el-popover{
    position: absolute;
    top: 50% !important;
    left: 50%;
    transform: translate(20%,-50%);
    margin: 0px 20px !important;
  }
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  width: 100%;
  min-width: 1500px;
  height: 100%;
}
</style>
