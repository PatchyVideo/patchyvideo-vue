<!--    vue组件：PostMultiVideos.vue     -->
<!--
    组件：上传多个视频
    大小：100% * 800(最小高度)
    功能：上传多个视频
    必要传入参数：无
    包含组件：EditTags.vue
    更新日志：
    1/18/2020：v1.0
      release
    1/21/2020：v1.0.1
      1.现在可以通过URL传入的参数来进一步更新上传视频的信息
    2/2/2020：v1.0.2
      1.样式微调
    ★待解决问题：
      暂无
-->

<template>
  <div class="postBox" v-loading="loading">
    <div class="content">
      <!-- 输入URL的文本框 -->
      <el-input
        type="textarea"
        :autosize="{ minRows: 8}"
        placeholder="请输入视频的URL, 一行一个"
        v-model="URLs"
      ></el-input>
      <!-- 标签编辑 -->
      <div class="tagsEdit">
        <h3>标签</h3>
        <div class="tagBox">
          <p v-if="tags==''" style="margin-bottom:10px;">暂无标签！</p>
          <el-tag effect="dark" v-else v-for="item in tags" :key="item">{{item}}</el-tag>
        </div>
      </div>
      <!-- 高级选项 -->
      <p class="advancedOptions" @click="showAdvancedOptions">
        高级选项
        <i class="el-icon-caret-bottom" v-if="!advancedOptions"></i>
        <i class="el-icon-caret-top" v-else></i>
      </p>
      <el-collapse-transition style="margin-bottom:20px">
        <div v-show="advancedOptions" class="options">
          <el-checkbox v-model="as_copies" style="margin-top:10px">视频互为副本</el-checkbox>
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
    <EditTags
      :msg="noData"
      :visible.sync="showTagPanel"
      @getEditTagsData="TagShow"
      class="EditTags"
    ></EditTags>
  </div>
</template>

<script>
import EditTags from "../components/EditTags";
export default {
  data() {
    return {
      // 标签页面是否打开
      showTagPanel: true,
      // 视频列表是否属于加载状态的判断
      loading: false,
      // 标签页面传入的参数
      noData: "",
      // 视频的标签数组
      tags: [],
      // 文本域内的文本
      URLs: "",
      // 是否互为副本
      as_copies: false,
      // 是否显示高级选项的标志
      advancedOptions: false
    };
  },
  computed: {
    // 视频的等级，默认为-1
    rank() {
      if (this.$route.query.rank != undefined) {
        return this.$route.query.rank;
      } else {
        return -1;
      }
    },
    // 视频所在收藏夹的pid
    pid() {
      if (this.$route.query.pid != undefined) {
        return this.$route.query.pid;
      } else {
        return "";
      }
    },
    // 视频的副本
    copy() {
      if (this.$route.query.copy != undefined) {
        return this.$route.query.copy;
      } else {
        return "";
      }
    }
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
      this.loading = true;
      // 分割视频URL
      var videos = this.URLs.split(/\r?\n/).filter(function(i) {
        return i;
      });
      this.axios({
        method: "post",
        url: "be/postvideo_batch.do",
        data: {
          rank: this.rank,
          pid: this.pid,
          copy: this.copy,
          videos: videos,
          tags: this.tags,
          as_copies: this.as_copies
        }
      }).then(result => {
        if (result.data.status == "SUCCEED") {
          this.open4();
        } else if (result.data.status == "FAILED") {
          if (result.data.data.reason == "TAG_NOT_EXIST") {
            var errorTag = result.data.data.aux;
            this.open3(errorTag);
          } else {
            this.open2();
          }
        } else {
          this.open5();
        }
        this.loading = false;
      });
    },
    // 各种各样的报错警告
    open2() {
      this.$message({
        message: "视频上传失败！",
        type: "error"
      });
    },
    open3(errorTag) {
      this.$message({
        message: "标签 " + errorTag + " 不存在！",
        type: "error"
      });
    },
    open4() {
      this.$message({
        message: "上传成功！",
        type: "success"
      });
    },
    open5() {
      this.$message({
        message: "未知错误",
        type: "error"
      });
    }
  },
  components: { EditTags }
};
</script>

<style scoped>
.postBox {
  width: 100%;
  min-height: 800px;
  overflow: hidden;
  display: flex;
  /* 针对webkit内核（如Safari）进行的调整 */
  display: -webkit-flex;
  margin: auto;
}
.content {
  flex: 0 0 calc(60% - 30px);
  padding-right: 15px;
  display: block;
  background-color: #ffffffc9;
  text-align: center;
}
.tagsEdit {
  width: 100%;
  min-height: 50px;
  margin: 0 auto;
  margin-top: 20px;
}
.tagsEdit h3 {
  margin-top: 10px;
  margin-bottom: 10px;
}
.tagBox {
  width: 100%;
  margin-bottom: 10px;
  text-align: left;
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
.EditTags {
  flex: 0 0 40%;
  display: block;
}
.EditTags /deep/ #tag {
  width: 100% !important;
  position: relative;
  background-size: cover;
}
</style>