<!--    vue组件：PostMultiVideos.vue     -->
<!--
    组件：上传多个视频
    大小：100% * 800(最小高度)
    功能：上传多个视频
    必要传入参数：无
    更新日志：
    ★待解决问题：
    其他说明：
      本页面是发布多个视频的多输入框版，现已废弃
-->

<template>
  <div class="postBox">
    <el-form
      :model="dynamicValidateForm"
      ref="dynamicValidateForm"
      label-width="100px"
      class="demo-dynamic"
    >
      <el-form-item
        v-for="(domain, index) in dynamicValidateForm.domains"
        :label="'视频' + (index+1)"
        :key="domain.key"
        :prop="'domains.' + index + '.value'"
        :rules="{
      required: true, message: '视频地址不能为空', trigger: 'blur'
    }"
      >
        <el-input
          class="URLBox"
          ref="input"
          v-model="domain.value"
          :id="'input'+index"
          @keyup.enter.native="addDomain(1)"
        ></el-input>
        <el-button @click.prevent="removeDomain(domain)">
          <i class="el-icon-delete"></i>
        </el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('dynamicValidateForm')">提交</el-button>
        <el-button @click="addDomain(0)">新增视频地址</el-button>
        <el-button @click="resetForm('dynamicValidateForm')">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 视频地址
      dynamicValidateForm: {
        domains: [
          {
            value: ""
          }
        ]
      }
    };
  },
  created() {},
  mounted() {},
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          alert("submit!");
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    resetForm(formName) {
      console.log(this.$refs[formName]);
      this.$refs[formName].resetFields();
    },
    removeDomain(item) {
      var index = this.dynamicValidateForm.domains.indexOf(item);
      if (index !== -1) {
        this.dynamicValidateForm.domains.splice(index, 1);
      }
    },
    addDomain(input) {
      this.dynamicValidateForm.domains.push({
        value: "",
        key: Date.now()
      });
      if (input) {
        var id = "input" + (this.dynamicValidateForm.domains.length - 1);
        console.log(id);
        setTimeout(function() {
          document.getElementById("input1").focus();
        }, 100);
        // console.log($("#" + id + "").val());
        // $("#input" + this.dynamicValidateForm.domains.length - 1).focus();
      }
    }
  },
  components: {}
};
</script>

<style scoped>
.postBox {
  width: 100%;
  min-height: 800px;
  background-color: #ffffffc9;
}

.URLBox {
  width: 60%;
}
</style>