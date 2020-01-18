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
    <EditTags :msg="noData" :visible.sync="showTagPanel" @getEditTagsData="TagShow"></EditTags>
    <!-- 输入URL的文本框 -->
    <el-input
      type="textarea"
      :autosize="{ minRows: 8}"
      placeholder="请输入视频的URL, 一行一个"
      v-model="URLs"
    ></el-input>
    <div class="editTags">
      <el-button round class="editTagsButton" type="success">编辑标签</el-button>
    </div>
    <!-- 高级选项 -->
    <p class="advancedOptions" @click="showAdvancedOptions">
      高级选项
      <i class="el-icon-caret-bottom" v-if="!advancedOptions"></i>
      <i class="el-icon-caret-top" v-else></i>
    </p>
    <el-collapse-transition style="margin-bottom:20px">
      <div v-show="advancedOptions" class="options">
        <el-checkbox v-model="copies" style="margin-top:10px">视频互为副本</el-checkbox>
      </div>
    </el-collapse-transition>
    <!-- 上传视频的按钮 -->
    <div style="text-align: center;">
      <el-button class="postButton" type="primary" @click="postMultiVideos">
        上传视频
        <i class="el-icon-upload el-icon--right"></i>
      </el-button>
    </div>
  </div>
</template>

<script>
import EditTags from "../components/EditTags";
export default {
  data() {
    return {
      // 标签页面是否打开
      showTagPanel: false,
      // 标签页面传入的参数
      noData: "",
      // 视频的标签数组
      tags: [],
      // 文本域内的文本
      URLs: "",
      // 是否互为副本
      copies: false,
      // 是否显示高级选项的标志
      advancedOptions: false
    };
  },
  created() {},
  mounted() {},
  methods: {
    // 显示标签编辑组件
    TagShow: function(data) {
      this.tags = data;
    },
    // 显示高级选项
    showAdvancedOptions() {
      this.advancedOptions = !this.advancedOptions;
    },
    // 上传视频
    postMultiVideos() {
      console.log(this.URLs);
    }
  },
  components: { EditTags }
};
</script>

<style scoped>
.postBox {
  width: 100%;
  min-height: 1000px;
  background-color: #ffffffc9;
}
.editTags {
  margin-top: 20px;
  text-align: center;
  width: 100%;
}
.editTagsButton {
  width: 60%;
}
.advancedOptions {
  margin-top: 20px;
  cursor: pointer;
}
.advancedOptions:hover {
  color: #409eff;
}
.options {
  margin-top: 5px;
}
.postButton {
  width: 80%;
  margin-top: 20px;
  margin-bottom: 20px;
}
</style>