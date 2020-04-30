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

<i18n>
{
  "CHS": {
    "this_is_playlist_title": "这里是列表标题",
    "describe_your_playlist": "来介绍一下自己的列表吧~",
    "set_as_private_playlist": "设为私有列表",
    "create_now": "立即创建",
    "no_title_prompt": "还没输入标题呢",
    "no_desc_prompt": "不来介绍一下列表吗？",
    "one_cover_prompt": "只能上传一个封面！",
    "delete_confirm_prompt": "确定移除 {name}？",
    "create_failed": "列表创建失败，请重试！",
    "not_login": "登录验证失败，请先登录！",
    "create_succeed": "列表创建成功！",
    "showListRules":"查看创建播放列表的规则"
  },
  "ENG": {
    "this_is_playlist_title": "Title",
    "describe_your_playlist": "Describe this playlist",
    "set_as_private_playlist": "Private Playlist",
    "create_now": "Create",
    "no_title_prompt": "Please enter title",
    "no_desc_prompt": "Please enter description",
    "one_cover_prompt": "You can upload only one cover",
    "delete_confirm_prompt": "Are you sure you want to remove {name}?",
    "create_failed": "Operation failed, please try again",
    "not_login": "Authentication failed, please relogin",
    "create_succeed": "Playlist successfully created",
    "showListRules":"See the rules of creating a list"
  },
  "CHT": {
    "this_is_playlist_title": "這裏是列表標題",
    "describe_your_playlist": "來介紹壹下自己的列表吧~",
    "set_as_private_playlist": "設為私有列表",
    "create_now": "立即創建",
    "no_title_prompt": "還沒輸入標題呢",
    "no_desc_prompt": "不來介紹壹下列表嗎？",
    "one_cover_prompt": "只能上傳壹個封面！",
    "delete_confirm_prompt": "確定移除 {name}？",
    "create_failed": "列表創建失敗，請重試！",
    "not_login": "登錄驗證失敗，請先登錄！",
    "create_succeed": "列表創建成功！",
    "showListRules":"查看創建播放列表的規則"
  }
}
</i18n>

<template>
  <div class="listForm" v-loading="loading">
    <el-form ref="list" :model="list" label-width="auto" :rules="rules">
      <!-- 标题 -->
      <el-form-item prop="title">
        <el-input v-model="list.title" :placeholder="$t('this_is_playlist_title')"></el-input>
      </el-form-item>
      <!-- 简介 -->
      <el-form-item prop="desc">
        <el-input
          type="textarea"
          :autosize="{ minRows: 6 }"
          :placeholder="$t('describe_your_playlist')"
          v-model="list.desc"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-checkbox v-model="list.private">{{ $t("set_as_private_playlist") }}</el-checkbox>
        <a
          href="https://patchyvideo.wiki/Playlist"
          target="_blank"
          style="float:right"
        >{{ $t("showListRules") }}</a>
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
        <el-button type="primary" @click="onSubmit" style="width:80%">{{ $t("create_now") }}</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  props: {
    // 创建列表完成后是否需要跳转
    needGo: {
      type: Boolean,
      default: true
    }
  },
  data() {
    this.$i18n.locale = localStorage.getItem("lang");
    return {
      // 播放列表数据
      list: {
        title: "",
        desc: "",
        cover: "",
        private: false
      },
      // 校验数据
      rules: {
        title: [
          {
            required: true,
            message: this.$t("no_title_prompt"),
            trigger: "blur"
          }
        ],
        desc: [
          {
            required: true,
            message: this.$t("no_desc_prompt"),
            trigger: "blur"
          }
        ]
      },
      // 页面是否出于加载状态的标志
      loading: false
    };
  },
  created() {},
  methods: {
    // 超出限制大小时调用的函数
    handleExceed() {
      this.$message.warning(this.$t("one_cover_prompt"));
    },
    // 删除文件之前调用的函数
    beforeRemove(file, fileList) {
      return this.$confirm(
        this.$t("delete_confirm_prompt", { name: file.name })
      );
    },
    // 提交视频列表
    onSubmit() {
      // 先使页面出于加载状态
      this.loading = true;
      // 表单验证
      this.$refs.list.validate(async valid => {
        if (valid) {
          await this.axios({
            method: "post",
            url: "be/lists/new.do",
            data: {
              title: this.list.title,
              desc: this.list.desc,
              cover: this.list.cover,
              private: this.list.private
            }
          })
            .then(result => {
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
            .catch(err => {
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
        type: "error"
      });
    },
    open2(message) {
      this.$message({
        message: message,
        type: "success"
      });
    }
  },
  components: {}
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
