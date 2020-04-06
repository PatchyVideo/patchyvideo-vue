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
/*  .el-popover{
    width: 70%;
    max-width: 70%;
    max-height: 90%;
    min-height: 50%;
    overflow: auto;
    position: absolute;
    top: 50% !important;

    transform: translate(10%,-50%);
    margin: 0px 20px !important;
  }*/
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


.anime-fade-enter-active {
  transition: all .6s ease;
}
.anime-fade-leave-active {
  transition: all .5s ease;
}
.anime-fade-enter, .anime-fade-leave-active {
  transform: translateX(60px);
  opacity: 0;
}

.anime-left-enter-active {
  transition: all .8s ease;
}
.anime-left-leave-active {
  transition: all .6s ease-out;
}
.anime-left-enter, .anime-left-leave-active {
  transform: translateX(-150px);
  opacity: 0;
}

.anime-top-enter-active {
  transition: all .5s ease;
}
.anime-top-leave-active {
  transition: all .2s ease-out;
}
.anime-top-enter, .anime-top-leave-active {
  transform: translateY(-5px);
  opacity: 0;
}

</style>
