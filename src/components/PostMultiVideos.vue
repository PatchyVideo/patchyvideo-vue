<!--    vue组件：PostMultiVideos.vue     -->
<!--
    组件：上传多个视频
    大小：100% * 800(最小高度)
    功能：上传多个视频
    必要传入参数：无
    更新日志：
    ★待解决问题：
      1.视频URL的验证逻辑有待进一步改进
-->

<template>
  <div class="postBox">
    <el-input
      type="textarea"
      :autosize="{ minRows: 4}"
      placeholder="请输入视频的URL, 一行一个"
      v-model="URLs"
    ></el-input>
    <el-button class="postButton" type="primary" @click="postMultiVideos">
      上传视频
      <i class="el-icon-upload el-icon--right"></i>
    </el-button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      URLs: ""
    };
  },
  created() {},
  mounted() {},
  methods: {
    postMultiVideos() {
      console.log(this.URLs);
    }
  },
  components: {}
};
</script>

<style scoped>
.postBox {
  width: 100%;
  min-height: 800px;
  background-color: #ffffffc9;
}
.postButton {
  width: 100%;
  margin-top: 20px;
  margin-bottom: 20px;
}
</style>