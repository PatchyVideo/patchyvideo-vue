<template>
  <div>
    <el-tooltip class="item" effect="dark" :content="$t('set_as_playlist_cover')" placement="top-end">
      <i class="fa fa-picture-o" aria-hidden="true" @click="setCover()"></i>
    </el-tooltip>
  </div>
</template>

<script>
export default {
  components: {},
  props: {
    msg: {
      type: Object,
      required: true,
    },
  },
  data() {
    this.$i18n.locale = localStorage.getItem("lang");
    return {};
  },
  methods: {
    setCover() {
      this.axios({
        method: "post",
        url: "be/list/setcover.do",
        data: this.msg,
      }).then((res) => {
        if (res.data.status == "SUCCEED") {
          // 方案一：全局刷新、会有闪屏，且所有数据重新请求，不好。
          // this.$router.go(0);
          // 方案二: VueX 来监听子组件的值。
          this.$store.commit("refreshPage");
        }
      });
    },
  },
};
</script>

<style scoped></style>

<i18n folder></i18n>
