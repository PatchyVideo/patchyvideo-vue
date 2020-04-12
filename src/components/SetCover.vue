<i18n>
{
    "CHS": {
        "set_as_playlist_cover": "设置此视频封面为播放列表封面"
    },
    "ENG": {
        "set_as_playlist_cover": "Set video cover as playlist cover"
    },
    "CHT": {
        "set_as_playlist_cover": "設置此視頻封面為播放列表封面"
    }
}
</i18n>

<template>
  <div>
    <el-tooltip
      class="item"
      effect="dark"
      :content="$t('set_as_playlist_cover')"
      placement="top-end"
    >
      <i class="fa fa-picture-o" aria-hidden="true" @click="setCover()"></i>
    </el-tooltip>
  </div>
</template>

<script>
export default {
  data() {
    this.$i18n.locale = localStorage.getItem("lang");
    return {};
  },
  methods: {
    setCover() {
      this.axios({
        method: "post",
        url: "be/list/setcover.do",
        data: this.msg
      }).then(res => {
        if (res.data.status == "SUCCEED") {
          // 方案一：全局刷新、会有闪屏，且所有数据重新请求，不好。
          // this.$router.go(0);
          // 方案二: VueX 来监听子组件的值。
          this.$store.commit("refreshPage");
        }
      });
    }
  },
  props: ["msg"],
  components: {}
};
</script>

<style scoped>
</style>