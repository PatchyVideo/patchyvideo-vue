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
  <div class="listForm" v-loading="loading">
    <el-form ref="list" :model="list" label-width="auto" :rules="rules">
      <h3 class="desc">这里可以直接导入播放列表，但是请注意，本功能仅限于b站收藏夹、YouTube播放列表和nicovideo的mylist哦</h3>
      <el-form-item prop="URL">
        <el-input v-model="list.URL" placeholder="在这里输入列表的网址"></el-input>
      </el-form-item>
      <el-form-item class="leadInList">
        <el-button type="primary" @click="onSubmit" style="width:80%">立即导入</el-button>
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
        URL: ""
      },
      // 校验数据
      rules: {
        URL: [{ required: true, message: "还没输入地址呢", trigger: "blur" }]
      },
      // 页面是否出于加载状态的标志
      loading: false
    };
  },
  created() {},
  methods: {
    // 提交视频列表
    onSubmit() {
      // 先使页面出于加载状态
      this.loading = true;
      // 表单验证
      this.$refs.list.validate(valid => {
        if (valid) {
          this.axios({
            method: "post",
            url: "be/lists/create_from_existing_playlists.do",
            data: {
              url: this.list.URL
            }
          }).then(result => {
            this.loading = false;
            if (result.data.status == "FAILED") {
              this.open();
            } else {
              this.open2();
            }
          });
        } else {
          // 加载结束,加载动画消失
          this.loading = false;
        }
      });
    },
    open() {
      this.$message({
        message: "列表导入失败，请检查地址是否正确！",
        type: "error"
      });
    },
    open2() {
      this.$message({
        message: "列表导入成功！",
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
.leadInList {
  text-align: center;
}
.desc {
  margin-bottom: 10px;
}
</style>