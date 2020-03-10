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


<i18n>
{
    "CHS":{
        "cancel":"取 消",
        "ok":"确 定",
        "input_addr":"在这里输入IPFS视频的地址w",
        "input_orig_addr":"在这里输入视频的原地址（没有也没关系w）",
        "input_title":"在这里输入视频的标题w",
        "introductory_video":"介绍一下自己的视频吧",
        "upload_cover":"从这里上传视频封面",
        "upload_no_cover":"还没上传封面呢！",
        "upload_limit":"只能一个上传jpg/png文件哦(建议图片比例8：5)",
        "label":"标签",
        "no_label":"暂无标签！",
        "post_video":"发布视频",
        "not_input_addr":"还没输入视频地址呢！",
        "addr_err":"视频地址格式错误！",
        "not_input_title":"还没输入标题呢",
        "not_introductory_video":"不来介绍一下视频吗？",
        "upload_cover_limit":"只能上传一个封面！",
        "upload_fail":"视频上传失败！",
        "not_exist":"不存在！",
        "upload_success":"上传成功！",
        "unknown_err":"未知错误"
    },
    "ENG":{
        "cancel":"Cancel",
        "input_addr":"Enter the address of the IPFS video here",
        "input_orig_addr":"Enter the original address of the video here (Optional)",
        "input_title":"Enter the title of the video here",
        "introductory_video":"Describe your own video",
        "upload_cover":"Upload video cover from here",
        "upload_no_cover":"Haven't uploaded a cover yet!",
        "upload_limit":"Only one jpg / png file can be uploaded (recommend picture ratio 8: 5)",
        "label":"label",
        "no_label":"No tags!",
        "post_video":"Post video",
        "not_input_addr":"Please enter video URL",
        "addr_err":"Incorrect Video URL",
        "not_input_title":"Haven't entered a title yet",
        "not_introductory_video":"Don't you introduce the video?",
        "upload_cover_limit":"Only one cover can be uploaded!",
        "upload_fail":"Ipload failed",
        "not_exist":"Does not exist!",
        "upload_success":"Upload succeed",
        "unknown_err":"Unknown error, please report bug"

    }
}
</i18n>

<template>
  <div class="postBox" v-loading="loading">
    <div class="content">
      <el-form ref="list" :model="list" label-width="auto" :rules="rules">
        <!-- 输入URL的文本框 -->
        <el-form-item prop="URL">
          <el-input :placeholder="$t('input_addr')" v-model="list.URL">
            <template slot="prepend">ipfs:</template>
          </el-input>
        </el-form-item>
        <!-- 视频源地址 -->
        <el-form-item>
          <el-input :placeholder="$t('input_orig_addr')" v-model="list.original_url"></el-input>
        </el-form-item>
        <!-- 视频标题 -->
        <el-form-item prop="title">
          <el-input :placeholder="$t('input_title')" v-model="list.title"></el-input>
        </el-form-item>
        <!-- 视频简介 -->
        <el-form-item prop="desc">
          <el-input
            type="textarea"
            :autosize="{ minRows: 6}"
            :placeholder="$t('introductory_video')"
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
            <el-button size type="primary" style="margin-right:10px;">{{$t('upload_cover')}}</el-button>
            <span slot="tip" style="color:red" v-if="noCover">{{$t('upload_no_cover')}}</span>
            <div slot="tip" class="el-upload__tip">{{$t('upload_limit')}}</div>
          </el-upload>
        </el-form-item>
        <!-- 标签编辑，暂时隐藏 -->
        <el-form-item v-if="false">
          <div class="tagsEdit">
            <h3>{{$t('label')}}</h3>
            <div class="tagBox">
              <p v-if="tags==''" style="margin-bottom:10px;">{{$t('no_label')}}</p>
              <el-tag effect="dark" v-else v-for="item in tags" :key="item">{{item}}</el-tag>
            </div>
          </div>
        </el-form-item>
        <!-- 上传视频的按钮 -->
        <el-form-item style="text-align: center;">
          <el-button class="postButton" type="primary" @click="postMultiVideos">
            {{$t('post_video')}}
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
    this.$i18n.locale = localStorage.getItem('lang');
    // URL校验规则
    var validateURL = (rule, value, callback) => {
      if (!value) {
        return callback(new Error(this.$t('not_input_addr')));
      }
      var value2 = "ipfs:" + value;
      var ipfsURL = /^ipfs:[a-zA-Z0-9]+/;
      if (!ipfsURL.test(value2)) {
        return callback(new Error(this.$t('addr_err')));
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
        title: [{ required: true, message: this.$t('not_input_title'), trigger: "blur" }],
        desc: [
          { required: true, message: this.$t('not_introductory_video'), trigger: "blur" }
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
      this.$message.warning(this.$t('upload_cover_limit'));
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
        message: this.$t('upload_fail'),
        type: "error"
      });
    },
    open3(errorTag) {
      this.$message({
        message:  this.$t('label') + errorTag + " " + this.$t('not_exist'),
        type: "error"
      });
    },
    open4() {
      this.$message({
        message: this.$t('upload_success'),
        type: "success"
      });
    },
    open5() {
      this.$message({
        message: this.$t('unknown_err'),
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