<!--    vue页面：ForgetPassword.vue     -->
<!--
    页面：paychyvideo的找回密码界面
    功能：用户由此找回密码
    更新日志：
    1/22/2020：v1.0
      release
    ★待解决问题：
      1.错误信息尚未进行分类
-->
<template>
  <div class="loginPic">
    <div class="w" v-loading="loading">
      <h1>
        <router-link to="/home">PatchyVideo</router-link>
      </h1>
      <div class="top in">
        <h3 style="color:#909399">重置密码</h3>
      </div>

      <el-form ref="FormRef" :model="FormRef" class="middle in" :rules="rules">
        <el-form-item prop="email">
          <el-input
            id="email"
            name="email"
            type="email"
            v-model="FormRef.email"
            clearable
            placeholder="请输入账户绑定的Email"
            prefix-icon="el-icon-message"
            @keyup.enter.native="resetpass()"
          ></el-input>
        </el-form-item>
      </el-form>

      <!-- 登录按钮 -->
      <div class="bottom in">
        <div @click="resetpass()" class="login in">发送邮件</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 邮件地址
      FormRef: {
        email: ""
      },
      // 校验地址
      rules: {
        email: [
          { required: true, message: "请输入邮箱", trigger: "blur" },
          { type: "email", message: "请输入正确的邮箱地址", trigger: ["blur"] }
        ]
      },
      // 视频列表是否属于加载状态的判断
      loading: false
    };
  },
  created() {
    // 初始化页面名为login
    this.$store.commit("changeBgc", "forgetPassword");
    // 修改网站标题
    document.title = "找回密码 - Patchyvideo";
  },
  mounted() {
    console.log(
      "背景图片p站ID：66686322，如有侵权请联系本站开发者（本站账号：admin）删除"
    );
  },
  methods: {
    // 发送邮件
    resetpass() {
      // 先使页面出于加载状态
      this.loading = true;
      // 表单验证
      this.$refs.FormRef.validate(valid => {
        if (valid) {
          this.axios({
            method: "post",
            url: "be/user/request_resetpass.do",
            data: {
              email: this.FormRef.email
            }
          }).then(result => {
            this.loading = false;
            if (result.data.status == "FAILED") {
              this.open();
            } else {
              this.open2();
              this.$router.push("/home");
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
        message: "验证失败,请检查邮箱地址是否正确！",
        type: "error"
      });
    },
    open2() {
      this.$message({
        message: "邮件发送成功，请查收！",
        type: "success"
      });
    }
  },
  components: {}
};
</script>

<style scoped>
.loginPic {
  height: 100%;
  width: 100%;
  background: url("../static/img/forgetPassword.png") no-repeat top center;
  /* background-position: 200px 0; */
  background-size: cover;
  background-attachment: fixed;
  background-color: #646257;
}
.alert {
  color: red;
}
input::-webkit-input-placeholder {
  color: #c8c8c8;
}
input::-moz-placeholder {
  /* Mozilla Firefox 19+ */
  color: #c8c8c8;
}
input:-moz-placeholder {
  /* Mozilla Firefox 4 to 18 */
  color: #c8c8c8;
}
input:-ms-input-placeholder {
  /* Internet Explorer 10-11 */
  color: #c8c8c8;
}
input[type="text"] {
}

* {
  margin: 0px;
  padding: 0px;
}
a {
  text-decoration: none;
  color: #ff7792;
}

.w {
  position: relative;
  top: 100px;
  display: block;
  width: 300px;
  height: 320px;
  padding: 50px;
  background-color: white;
  box-shadow: 0px 0px 80px #ffeef1;
  background-position-x: 50%;
  left: 200px;
  margin: auto;
}
.w h1 {
  width: 100%;
  height: 60px;
  display: block;
  text-align: center;
}

.in {
  width: 300px;
}

.top {
  margin-bottom: 50px;
  text-align: center;
}
.top a {
  font-weight: 400;
  color: #969696;
}
.top a:hover {
  font-weight: 700;
  color: #ea6f5a;
  border-bottom: 2px solid #ff6685;
}
.top b {
  margin: 0px 10px 0px;
  font-size: 10px;
}

.middle input {
  padding-left: 10px;
  width: 100%;
  height: 50px;
  cursor: text;
  font-size: 14px;
  color: #646257;

  border: 1px solid #c8c8c8;
  background-color: hsla(0, 0%, 71%, 0.1);
}
.middle input:focus {
}

.login {
  padding: 0px 5px;
  margin: 20px 0px 10px;
  height: 50px;
  line-height: 50px;
  text-align: center;
  font-size: 18px;
  border-radius: 25px;
  color: #fff;
  background: #ff99ad;
}
.login:hover {
  cursor: pointer;
  background: #ff7792;
}

.forgetPassword {
  text-align: left;
  cursor: pointer;
}
.forgetPassword:hover {
  color: #409eff;
}

p {
  margin: 10px 0;
  padding: 0;
  text-align: center;
  font-size: 12px;
  line-height: 20px;
  color: #969696;
}

.last {
  margin: auto;
  margin-top: 50px;
  height: 50px;
  width: 250px;

  border-top: 1px solid #c8c8c8;
}
.last p {
  display: block;
  margin: auto;
  width: 100px;
  padding: 10px;
  background-color: #fff;
  margin-top: -80px;
}

i {
  font-style: normal;
}

i:hover {
  cursor: pointer;
  color: blue;
}
.el-form-item {
  margin-top: 30px;
}
</style>