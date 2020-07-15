<template>
  <div id="app" :class="this.$store.state.bgcMark">
    <router-view v-if="isRouterAlive" />
  </div>
</template>

<script>
export default {
  components: {},
  provide() {
    return {
      reload: this.reload,
    };
  },
  data() {
    return {
      isRouterAlive: true,
    };
  },
  created() {
    if (localStorage.getItem("CON_logRenderTime")) console.time("RenderTime");
  },
  mounted() {
    this.$nextTick(function() {
      if (localStorage.getItem("CON_logRenderTime")) console.timeEnd("RenderTime");
    });
  },
  methods: {
    reload() {
      this.isRouterAlive = false;
      this.$nextTick(function() {
        this.isRouterAlive = true;
      });
    },
  },
};
</script>
