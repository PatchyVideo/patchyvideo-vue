<template>
  <div id="app" :class="this.$store.state.bgcMark">
    <router-view />
  </div>
</template>
<script>
export default {
  data() {
    return {};
  },
  components: {}
};
</script>

<style>
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
