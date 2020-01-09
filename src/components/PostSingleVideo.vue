<!--    vue组件：PostSingleVideo.vue     -->
<!--
    组件：上传单个视频
    大小：100%
    功能：上传单个视频
    必要传入参数：无
    更新日志：

-->

<template>
  <el-input v-model="VideoURL" placeholder="视频地址">
    <el-button slot="append" @click="getVideoInfo">获取信息</el-button>
  </el-input>
</template>

<script>
export default {
  data() {
    return {
      VideoURL: ""
    };
  },
  created() {},
  methods: {
    getVideoInfo: function() {
      console.log("check video info!");
    }
  },
  components: {}
};
</script>

<style scoped>
</style>