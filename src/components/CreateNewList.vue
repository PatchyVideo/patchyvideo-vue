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
  <div class="listForm" v-loading="loading">
    <el-form ref="list" :model="list" label-width="auto" :rules="rules">
      <!-- 标题 -->
      <el-form-item prop="title">
        <el-input v-model="list.title" placeholder="这里是列表标题"></el-input>
      </el-form-item>
      <!-- 简介 -->
      <el-form-item prop="desc">
        <el-input
          type="textarea"
          :autosize="{ minRows: 6}"
          placeholder="来介绍一下自己的列表吧~"
          v-model="list.desc"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-checkbox v-model="list.private">设为私有列表</el-checkbox>
      </el-form-item>
      <!-- 封面上传,暂时用不上 -->
      <el-form-item>
        <!-- <el-upload
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
        <el-button type="primary" @click="onSubmit" style="width:80%">立即创建</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  data() {
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
        title: [{ required: true, message: "还没输入标题呢", trigger: "blur" }],
        desc: [
          { required: true, message: "不来介绍一下列表吗？", trigger: "blur" }
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
      this.$message.warning("只能上传一个封面！");
    },
    // 删除文件之前调用的函数
    beforeRemove(file, fileList) {
      return this.$confirm(`确定移除 ${file.name}？`);
    },
    // 提交视频列表
    onSubmit() {
      // 先使页面出于加载状态
      this.loading = true;
      // 表单验证
      this.$refs.list.validate(valid => {
        if (valid) {
          this.axios({
            method: "post",
            url: "be/lists/new.do",
            data: {
              title: this.list.title,
              desc: this.list.desc,
              cover: this.list.cover,
              private: this.list.private
            }
          }).then(result => {
            console.log(result);
            this.loading = false;
            // 提交失败的情况
            if (result.data.status == "FAILED") {
              this.open("列表创建失败，请重试！");
            }
            // 出现错误的情况
            else if (result.data.status == "ERROR") {
              this.$store.commit("changeifRouter", "0");
              this.open("登录验证失败，请先登录！");
            }
            // 提交成功
            else {
              this.open2("列表创建成功！");
              this.$router.push({ path: "/lists" });
            }
          });
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