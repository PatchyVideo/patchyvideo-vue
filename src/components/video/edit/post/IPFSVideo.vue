<!--    vue组件：PostIPFSVideo.vue     -->
<!--
    组件：上传ipfs视频
    大小：100% * 800(最小高度)
    功能：上传ipfs视频
    必要传入参数：无
    包含组件：PostVideo.vue
    更新日志：
    2/5/2020：v1.0
      release
    ★待解决问题：
      1.IPFS视频的URL校验有待进一步优化
-->

<template>
  <div v-loading="loading" class="postBox">
    <div class="content">
      <el-form ref="list" :model="list" label-width="auto" :rules="rules">
        <!-- 输入URL的文本框 -->
        <el-form-item prop="URL">
          <el-input v-model="list.URL" :placeholder="$t('input_addr')">
            <template slot="prepend">ipfs:</template>
          </el-input>
        </el-form-item>
        <!-- 视频源地址 -->
        <el-form-item>
          <el-input v-model="list.original_url" :placeholder="$t('input_orig_addr')"></el-input>
        </el-form-item>
        <!-- 视频标题 -->
        <el-form-item prop="title">
          <el-input v-model="list.title" :placeholder="$t('input_title')"></el-input>
        </el-form-item>
        <!-- 视频简介 -->
        <el-form-item prop="desc">
          <el-input v-model="list.desc" type="textarea" :autosize="{ minRows: 6 }" :placeholder="$t('introductory_video')"></el-input>
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
            <el-button size type="primary" style="margin-right: 10px;">{{ $t("upload_cover") }}</el-button>
            <span v-if="noCover" slot="tip" style="color: red;">{{ $t("upload_no_cover") }}</span>
            <div slot="tip" class="el-upload__tip">{{ $t("upload_limit") }}</div>
          </el-upload>
        </el-form-item>
        <!-- 标签编辑，暂时隐藏 -->
        <el-form-item v-if="false">
          <div class="tagsEdit">
            <h3>{{ $t("label") }}</h3>
            <div class="tagBox">
              <p v-if="tags == ''" style="margin-bottom: 10px;">{{ $t("no_label") }}</p>
              <el-tag v-for="item in tags" v-else :key="item" effect="dark">{{ item }}</el-tag>
            </div>
          </div>
        </el-form-item>
        <el-form-item>
          <!-- Wiki链接 -->
          <a href="https://patchyvideo.wiki/Upload" target="_blank" rel="noopener noreferrer" style="color: #409eff; float: right; font-size: 17px;">{{
            $t("HowToPost")
          }}</a>
        </el-form-item>
        <!-- 上传视频的按钮 -->
        <el-form-item style="text-align: center;">
          <el-button class="postButton" type="primary" @click="postMultiVideos">
            {{ $t("post_video") }}
            <i class="el-icon-upload el-icon--right"></i>
          </el-button>
        </el-form-item>
      </el-form>
    </div>
    <EditTags :msg="noData" :visible.sync="showTagPanel" class="EditTags" @getEditTagsData="TagShow"></EditTags>
  </div>
</template>

<script>
import EditTags from "@/components/tag/edit/Edit";
export default {
  components: { EditTags },
  data() {
    this.$i18n.locale = localStorage.getItem("lang");
    // URL 校验规则
    let validateURL = (rule, value, callback) => {
      if (!value) {
        return callback(new Error(this.$t("not_input_addr")));
      }
      let value2 = "ipfs:" + value;
      let ipfsURL = /^ipfs:[a-zA-Z0-9]+/;
      if (!ipfsURL.test(value2)) {
        return callback(new Error(this.$t("addr_err")));
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
        cover: [],
      },
      // 上传视频封面的携带数据
      coverData: { type: "cover" },
      // 校验数据
      rules: {
        URL: [{ validator: validateURL, trigger: "blur" }],
        title: [
          {
            required: true,
            message: this.$t("not_input_title"),
            trigger: "blur",
          },
        ],
        desc: [
          {
            required: true,
            message: this.$t("not_introductory_video"),
            trigger: "blur",
          },
        ],
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
      tags: [],
    };
  },
  computed: {
    // 视频的等级，默认为 -1
    rank() {
      if (this.$route.query.rank != undefined) {
        return this.$route.query.rank;
      } else {
        return -1;
      }
    },
    // 视频所在收藏夹的 pid
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
    },
  },
  created() {},
  mounted() {},
  methods: {
    // 超出限制大小时调用的函数
    handleExceed() {
      this.$message.warning(this.$t("upload_cover_limit"));
    },
    // 删除文件调用的函数
    beforeRemove() {
      // return this.$confirm(`确定移除 ${file.name}？`);
      this.list.cover = [];
    },
    // 上传文件成功之后处理数据取消上传文件的校验规则
    uploadVideoCover(response, file) {
      let cover = {};
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
      this.$refs.list.validate((valid) => {
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
              rank: this.rank,
            },
          }).then((result) => {
            if (result.data.status == "SUCCEED") {
              this.open4();
            } else if (result.data.status == "FAILED") {
              if (result.data.data.reason == "TAG_NOT_EXIST") {
                let errorTag = result.data.data.aux;
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
        message: this.$t("upload_fail"),
        type: "error",
      });
    },
    open3(errorTag) {
      this.$message({
        message: this.$t("label") + errorTag + " " + this.$t("not_exist"),
        type: "error",
      });
    },
    open4() {
      this.$message({
        message: this.$t("upload_success"),
        type: "success",
      });
    },
    open5() {
      this.$message({
        message: this.$t("unknown_err"),
        type: "error",
      });
    },
  },
};
</script>

<style scoped>
.postBox {
  width: 100%;
  min-height: 800px;
  overflow: hidden;
  display: flex;
  /* 针对 webkit 内核（如 Safari）进行的调整 */
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

<i18n folder></i18n>
