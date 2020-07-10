<template>
  <div>{{ time }}秒后跳转至首页</div>
</template>

<script>
export default {
  components: {},
  data() {
    this.$i18n.locale = localStorage.getItem("lang");
    return {
      time: 10,
      timer: "",
    };
  },
  watch: {
    time() {
      if (this.time <= 0) {
        clearInterval(this.timer);
        this.$router.push("/home");
      }
    },
  },
  created() {
    console.log("hello world!");
  },
  mounted() {
    this.timer = setInterval(() => {
      this.time -= 1;
    }, 1000);
  },
  methods: {},
};
</script>

<style scoped></style>
