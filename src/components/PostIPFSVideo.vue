<!--    vue组件：PostIPFSVideo.vue     -->
<!--
    组件：上传ipfs视频
    大小：100% * 800(最小高度)
    功能：上传ipfs视频
    必要传入参数：无
    包含组件：EditTags.vue
    更新日志：
    2/5/2020：v1.0
      release
    ★待解决问题：
      1.IPFS视频的URL校验有待进一步优化
-->

<template>
  <div class="postBox" v-loading="loading">
    <div class="content">
      <el-form ref="list" :model="list" label-width="auto" :rules="rules">
        <!-- 输入URL的文本框 -->
        <el-form-item prop="URL">
          <el-input placeholder="在这里输入IPFS视频的地址w" v-model="list.URL">
            <template slot="prepend">ipfs:</template>
          </el-input>
        </el-form-item>
        <!-- 视频源地址 -->
        <el-form-item>
          <el-input placeholder="在这里输入视频的原地址（没有也没关系w）" v-model="list.original_url"></el-input>
        </el-form-item>
        <!-- 视频标题 -->
        <el-form-item prop="title">
          <el-input placeholder="在这里输入视频的标题w" v-model="list.title"></el-input>
        </el-form-item>
        <!-- 视频简介 -->
        <el-form-item prop="desc">
          <el-input
            type="textarea"
            :autosize="{ minRows: 6}"
            placeholder="介绍一下自己的视频吧~"
            v-model="list.desc"
          ></el-input>
        </el-form-item>
        <!-- 上传视频封面 -->
        <el-form-item ref="videoCover" prop="cover" style="text-align: left;">
          <el-upload
            action="be/helper/upload_image.do"
            :before-remove="beforeRemove"
            :on-success="uploadVideoCover"
            :limit="1"
            :on-exceed="handleExceed"
            :file-list="list.cover"
            :data="coverData"
          >
            <el-button size type="primary" style="margin-right:10px;">从这里上传视频封面</el-button>
            <span slot="tip" style="color:red" v-if="noCover">还没上传封面呢！</span>
            <div slot="tip" class="el-upload__tip">只能一个上传jpg/png文件哦(建议图片比例8：5)</div>
          </el-upload>
        </el-form-item>
        <!-- 标签编辑，暂时隐藏 -->
        <el-form-item v-if="false">
          <div class="tagsEdit">
            <h3>标签</h3>
            <div class="tagBox">
              <p v-if="tags==''" style="margin-bottom:10px;">暂无标签！</p>
              <el-tag effect="dark" v-else v-for="item in tags" :key="item">{{item}}</el-tag>
            </div>
          </div>
        </el-form-item>
        <!-- 上传视频的按钮 -->
        <el-form-item style="text-align: center;">
          <el-button class="postButton" type="primary" @click="postMultiVideos">
            发布视频
            <i class="el-icon-upload el-icon--right"></i>
          </el-button>
        </el-form-item>
      </el-form>
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
    // URL校验规则
    var validateURL = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("还没输入视频地址呢！"));
      }
      var value2 = "ipfs:" + value;
      var ipfsURL = /^ipfs:[a-zA-Z0-9]+/;
      if (!ipfsURL.test(value2)) {
        return callback(new Error("视频地址格式错误！"));
      } else {
        callback();
      }
    };
    return {
      // 播放列表数据
      list: {
        URL: "",
        original_url: "",
        title: "",
        desc: "",
        cover: []
      },
      // 上传视频封面的携带数据
      coverData: { type: "cover" },
      // 校验数据
      rules: {
        URL: [{ validator: validateURL, trigger: "blur" }],
        title: [{ required: true, message: "还没输入标题呢", trigger: "blur" }],
        desc: [
          { required: true, message: "不来介绍一下视频吗？", trigger: "blur" }
        ]
      },
      // 校验封面是否上传
      noCover: false,
      // 标签页面是否打开
      showTagPanel: true,
      // 视频列表是否属于加载状态的判断
      loading: false,
      // 标签页面传入的参数
      noData: "",
      // 视频的标签数组
      tags: []
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
    // 超出限制大小时调用的函数
    handleExceed() {
      this.$message.warning("只能上传一个封面！");
    },
    // 删除文件调用的函数
    beforeRemove(file, fileList) {
      // return this.$confirm(`确定移除 ${file.name}？`);
      this.list.cover = [];
    },
    // 上传文件成功之后处理数据取消上传文件的校验规则
    uploadVideoCover(response, file, fileList) {
      var cover = {};
      cover.file_key = response.data.file_key;
      cover.name = file.name;
      this.list.cover.push(cover);
      this.noCover = false;
    },
    // 显示标签编辑组件
    TagShow: function(data) {
      this.tags = data;
    },
    // 上传视频
    postMultiVideos() {
      this.loading = true;
      this.$refs.list.validate(valid => {
        // 同时校验表单和封面数据
        if (valid && this.list.cover.length) {
          this.axios({
            method: "post",
            url: "/be/postvideo_ipfs.do",
            data: {
              url: "ipfs:" + this.list.URL,
              tags: this.tags,
              title: this.list.title,
              desc: this.list.desc,
              file_key: this.list.cover[0].file_key,
              original_url: this.list.original_url,
              copy: this.copy,
              pid: this.pid,
              rank: this.rank
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
        }
        // 上传文件校验失败
        else if (this.list.cover.length == 0) {
          this.noCover = true;
          // 加载结束,加载动画消失
          this.loading = false;
        }
        // 表单其他地方校验失败
        else {
          // 加载结束,加载动画消失
          this.loading = false;
        }
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