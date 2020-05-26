<!--    vue组件：CreateNewList.vue     -->
<!--
    组件：创建播放列表
    大小：100% * 800px（最小）
    功能：创建一个新的播放列表
    必要传入参数：无
    更新日志：
    1/22/2020: v1.0 
      release
    2/1/2020: v1.0.1
      1.新增创建播放列表在创建成功之后跳转到视频列表列表页面的功能
      2.提交列表新增未登录报错的情况
-->

<template>
  <div v-loading="loading" class="listForm">
    <el-form ref="list" :model="list" label-width="auto" :rules="rules">
      <!-- 标题 -->
      <el-form-item prop="title">
        <el-input v-model="list.title" :placeholder="$t('this_is_playlist_title')"></el-input>
      </el-form-item>
      <!-- 简介 -->
      <el-form-item prop="desc">
        <el-input v-model="list.desc" type="textarea" :autosize="{ minRows: 6 }" :placeholder="$t('describe_your_playlist')"></el-input>
      </el-form-item>
      <el-form-item>
        <el-checkbox v-model="list.private">{{ $t("set_as_private_playlist") }}</el-checkbox>
        <a href="https://patchyvideo.wiki/Playlist" target="_blank" rel="noopener noreferrer" style="float: right;">{{ $t("showListRules") }}</a>
      </el-form-item>
      <!-- 封面上传,暂时用不上 -->
      <el-form-item v-if="false">
        <!--<el-upload
          action="https://jsonplaceholder.typicode.com/posts/"
          :before-remove="beforeRemove"
          :limit="1"
          :on-exceed="handleExceed"
          :file-list="list.cover"
        >
          <el-button size="small" type="primary">点击上传列表封面(可选)</el-button>
          <div slot="tip" class="el-upload__tip">只能上传jpg/png文件</div>
        </el-upload>-->
      </el-form-item>
      <el-form-item class="createList">
        <el-button type="primary" style="width: 80%;" @click="onSubmit">{{ $t("create_now") }}</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  components: {},
  props: {
    // 创建列表完成后是否需要跳转
    needGo: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    this.$i18n.locale = localStorage.getItem("lang");
    return {
      // 播放列表数据
      list: {
        title: "",
        desc: "",
        cover: "",
        private: false,
      },
      // 校验数据
      rules: {
        title: [
          {
            required: true,
            message: this.$t("no_title_prompt"),
            trigger: "blur",
          },
        ],
        desc: [
          {
            required: true,
            message: this.$t("no_desc_prompt"),
            trigger: "blur",
          },
        ],
      },
      // 页面是否出于加载状态的标志
      loading: false,
    };
  },
  created() {},
  methods: {
    // 超出限制大小时调用的函数
    handleExceed() {
      this.$message.warning(this.$t("one_cover_prompt"));
    },
    // 删除文件之前调用的函数
    beforeRemove(file) {
      return this.$confirm(this.$t("delete_confirm_prompt", { name: file.name }));
    },
    // 提交视频列表
    onSubmit() {
      // 先使页面出于加载状态
      this.loading = true;
      // 表单验证
      this.$refs.list.validate(async (valid) => {
        if (valid) {
          await this.axios({
            method: "post",
            url: "be/lists/new.do",
            data: {
              title: this.list.title,
              desc: this.list.desc,
              cover: this.list.cover,
              private: this.list.private,
            },
          })
            .then((result) => {
              // 提交失败的情况
              if (result.data.status == "FAILED") {
                this.open(this.$t("create_failed"));
              }
              // 出现错误的情况
              else if (result.data.status == "ERROR") {
                this.$store.commit("changeifRouter", "0");
                this.open(this.$t("not_login"));
              }
              // 提交成功
              else {
                this.open2(this.$t("create_succeed"));
                this.list.title = "";
                this.list.desc = "";
                this.list.cover = "";
                this.list.private = false;
                if (this.needGo) this.$router.push({ path: "/lists" });
                else this.$emit("closeMe", true);
              }
            })
            .catch(() => {
              this.open(this.$t("create_failed"));
            });
          this.loading = false;
        } else {
          // 加载结束,加载动画消失
          this.loading = false;
        }
      });
    },
    open(message) {
      this.$message({
        message: message,
        type: "error",
      });
    },
    open2(message) {
      this.$message({
        message: message,
        type: "success",
      });
    },
  },
};
</script>

<style scoped>
.listForm {
  width: 80%;
}
.createList {
  text-align: center;
}
</style>

<i18n folder></i18n>
