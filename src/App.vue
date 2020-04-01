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
.el-popover {
  width: 70%;
  max-width: 70%;
  max-height: 90%;
  min-height: 50%;
  overflow: auto;
  position: absolute;
  top: 50% !important;

  transform: translate(10%, -50%);
  margin: 0px 20px !important;
}
a {
  cursor: pointer;
  transition: all 0.4s ease;
}
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  width: 100%;
  min-width: 1400px;
  height: 100%;
}
</style>
