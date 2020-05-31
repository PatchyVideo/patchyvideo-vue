<!--    vue组件：Foot.vue     -->
<!--
    组件：导入播放列表
    大小：100% * 800px（最小）
    功能：导入现有的播放列表
    必要传入参数：无
    更新日志：
    12/3/2019: v1.0 
      release
    12/10/2019: v1.0.1
      1.修改了注释内容  
-->

<template>
  <div v-loading="loading" class="listForm">
    <el-form ref="list" :model="list" label-width="auto" :rules="rules">
      <h3 class="desc">{{ $t("prompt") }}</h3>
      <el-form-item prop="URL">
        <el-input v-model="list.URL" :placeholder="$t('url_placeholder')" @keyup.enter.native="onSubmit"></el-input>
      </el-form-item>
      <el-form-item class="leadInList">
        <el-button type="primary" style="width: 80%;" @click="onSubmit">{{ $t("upload_now") }}</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  components: {},
  data() {
    this.$i18n.locale = localStorage.getItem("lang");
    return {
      // 播放列表数据
      list: {
        URL: "",
      },
      // 校验数据
      rules: {
        URL: [{ required: true, message: this.$t("no_url_prompt"), trigger: "blur" }],
      },
      // 页面是否出于加载状态的标志
      loading: false,
    };
  },
  computed: {
    // 要导入的视频列表是否已经存在的标志
    exist() {
      return typeof this.$route.query.pid != "undefined" && this.$route.query.exist == "1";
    },
  },
  methods: {
    // 提交视频列表
    onSubmit() {
      // 先使页面出于加载状态
      this.loading = true;
      // 表单验证
      this.$refs.list.validate((valid) => {
        if (valid) {
          // 如果导入的视频列表已经存在
          if (this.exist) {
            this.axios({
              method: "post",
              url: "/be/lists/extend_from_existing_playlists.do",
              data: {
                pid: this.$route.query.pid,
                url: this.list.URL,
              },
            }).then((result) => {
              this.loading = false;
              if (result.data.status == "FAILED") {
                this.open();
              } else {
                this.open2();
                this.$router.push({
                  path: "/listdetail",
                  query: { id: result.data.data.pid },
                });
              }
            });
          }
          // 不存在的情况下
          else {
            this.axios({
              method: "post",
              url: "be/lists/create_from_existing_playlists.do",
              data: {
                url: this.list.URL,
                lang: localStorage.getItem("lang"),
              },
            }).then((result) => {
              this.loading = false;
              if (result.data.status == "FAILED") {
                this.open();
              } else {
                this.open2();
                this.$router.push({
                  path: "/listdetail",
                  query: { id: result.data.data.pid },
                });
              }
            });
          }
        } else {
          // 加载结束,加载动画消失
          this.loading = false;
        }
      });
    },
    open() {
      this.$message({
        message: this.$t("upload_failed"),
        type: "error",
      });
    },
    open2() {
      this.$message({
        message: this.$t("upload_succeed"),
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
.leadInList {
  text-align: center;
}
.desc {
  margin-bottom: 10px;
}
</style>
