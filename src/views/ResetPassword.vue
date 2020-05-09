<!--    vue页面：ResetPassword.vue     -->
<!--
    页面：paychyvideo的重置密码界面
    功能：用户由此重置密码
    更新日志：
    1/22/2020：v1.0
      release
    1/31/2020：v1.0.1
      1.修复重置密码界面重置密码按钮显示错误的问题
    2/1/2020：v1.0.2
      1.修复了重置密码的功能的bug
    ★待解决问题：
      1.错误信息尚未进行分类
-->

<i18n>
{
  "CHS": {
    "reset_psd":"重置密码",
    "psd_input_tip":"请输入新的密码",
    "repeat_input_tip":"请重复密码",
    "err_tip":"两次输入密码不一致!",
    "input_psd":"请输入密码",
    "psd_limit":"长度在 6 到 64 个字符",
    "fail_msg":"请求失败，请重新在找回密码界面发送邮件！",
    "success_msg":"密码重置成功！"

  },
  "ENG": {
    "reset_psd":"Reset Password",
    "psd_input_tip":"Please enter a new password",
    "repeat_input_tip":"Please repeat password",
    "err_tip":"Passwords mismatch",
    "input_psd":"Please enter password",
    "psd_limit":"Password length: 6 to 64 characters",
    "fail_msg":"Reset failed, please report bug",
    "success_msg":"An reset password email has been sent to your email address."
  },
  "CHT": {
    "reset_psd":"重置密碼",
    "psd_input_tip":"請輸入新的密碼",
    "repeat_input_tip":"請重復密碼",
    "err_tip":"兩次輸入密碼不壹致!",
    "input_psd":"請輸入密碼",
    "psd_limit":"長度在 6 到 64 個字符",
    "fail_msg":"請求失敗，請重新在找回密碼界面發送郵件！",
    "success_msg":"密碼重置成功！"
  }
}
</i18n>

<template>
  <div class="loginPic">
    <!-- 重置密码框正文 -->
    <div class="w" v-loading="loading">
      <!-- 标题 -->
      <h1>
        <router-link to="/home">PatchyVideo</router-link>
      </h1>
      <div class="top in">
        <h3 style="color:#909399">{{ $t("reset_psd") }}</h3>
      </div>

      <!-- 新密码的框 -->
      <el-form ref="FormRef" :model="FormRef" class="middle in" :rules="rules">
        <el-form-item prop="password1">
          <el-input
            id="password1"
            name="password1"
            type="password"
            v-model="FormRef.password1"
            :placeholder="$t('psd_input_tip')"
            prefix-icon="el-icon-lock"
          ></el-input>
        </el-form-item>
        <el-form-item prop="password2">
          <el-input
            id="password2"
            name="password2"
            type="password"
            v-model="FormRef.password2"
            :placeholder="$t('repeat_input_tip')"
            prefix-icon="el-icon-key"
          ></el-input>
        </el-form-item>
      </el-form>

      <!-- 登录按钮 -->
      <div class="bottom in">
        <div @click="resetpass()" class="login in">{{ $t("reset_psd") }}</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    this.$i18n.locale = localStorage.getItem("lang");
    var validatePass2 = (rule, value, callback) => {
      if (value !== this.FormRef.password1) {
        callback(new Error(this.$t("err_tip")));
      } else {
        callback();
      }
    };
    return {
      // 邮件地址
      FormRef: {
        password1: "",
        password2: ""
      },
      // 校验密码
      rules: {
        password1: [
          { required: true, message: this.$t("input_psd"), trigger: "blur" },
          { min: 6, max: 64, message: this.$t("psd_limit"), trigger: "blur" }
        ],
        password2: [
          {
            required: true,
            message: this.$t("repeat_input_tip"),
            trigger: "blur"
          },
          { validator: validatePass2, trigger: "blur" },
          { min: 6, max: 64, message: this.$t("psd_limit"), trigger: "blur" }
        ]
      },
      // 视频列表是否属于加载状态的判断
      loading: false
    };
  },
  computed: {
    reset_key() {
      if (this.$route.query.key != undefined) {
        return this.$route.query.key;
      } else {
        return "";
      }
    }
  },
  created() {
    // 初始化页面名为 login
    this.$store.commit("changeBgc", "resetPassword");
    // 修改网站标题
    document.title = this.$t("reset_psd") + " - Patchyvideo";
  },
  mounted() {
    console.log("背景图片p站ID：30602715，如有侵权请联系本站开发者（本站账号：admin）删除");
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
            url: "be/user/resetpass.do",
            data: {
              reset_key: this.reset_key,
              new_pass: this.FormRef.password1
            }
          }).then(result => {
            this.loading = false;
            if (result.data.status == "FAILED") {
              this.open();
            } else {
              this.open2();
              this.$router.push("/login");
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
        message: this.$t("fail_msg"),
        type: "error"
      });
    },
    open2() {
      this.$message({
        message: this.$t("success_msg"),
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
  /* background: url("../static/img/resetPassword.jpg") no-repeat top center; */
  background-position: 0 -38px;
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
  top: 150px;
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
