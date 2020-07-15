<template>
  <div class="signupPic">
    <!-- 注册框正文 -->
    <div v-loading="loading" class="w">
      <!-- 标题 -->
      <h1>
        <router-link to="home">PatchyVideo</router-link>
      </h1>
      <div class="top in">
        <router-link :to="session ? '/login?session=' + session : '/login'">{{ $t("login") }}</router-link>
        <b>·</b>
        <router-link :to="session ? '/signup?session=' + session : '/signup'">{{ $t("signup") }}</router-link>
      </div>

      <!-- 输入账号和密码的框 -->
      <el-form ref="signupFormRef" :model="signupFormRef" class="middle in central-form" status-icon :rules="rules">
        <el-form-item prop="signup_username" class="signupInput">
          <el-input
            id="username"
            v-model="signupFormRef.signup_username"
            name="username"
            :placeholder="$t('input_username')"
            clearable
            prefix-icon="el-icon-user-solid"
          ></el-input>
        </el-form-item>
        <el-form-item prop="signup_password1" class="signupInput">
          <el-input
            id="password1"
            v-model="signupFormRef.signup_password1"
            name="password1"
            type="password"
            :placeholder="$t('input_psd')"
            prefix-icon="el-icon-lock"
          ></el-input>
        </el-form-item>
        <el-form-item prop="signup_password2" class="signupInput">
          <el-input
            id="password2"
            v-model="signupFormRef.signup_password2"
            name="password2"
            type="password"
            :placeholder="$t('repeat_psd')"
            prefix-icon="el-icon-key"
          ></el-input>
        </el-form-item>
        <el-form-item prop="signup_email" class="signupInput">
          <el-input
            id="email"
            v-model="signupFormRef.signup_email"
            name="email"
            type="email"
            clearable
            placeholder="Email"
            prefix-icon="el-icon-message"
          ></el-input>
        </el-form-item>
        <p id="status" style="text-align: center;" :class="{ alert: status != $t('ready') }">{{ status }}</p>
      </el-form>

      <!-- 注册按钮 -->
      <div class="bottom in">
        <div class="login in" @click="signup">{{ $t("signup") }}</div>
      </div>
    </div>
  </div>
</template>

<script>
// import login from "../views/Login.vue";
export default {
  components: {
    // login
  },
  data() {
    this.$i18n.locale = localStorage.getItem("lang");
    // 校验用户名是否已经存在
    let checkUsername = (rule, value, callback) => {
      this.axios({
        method: "post",
        url: "be/user/exists.do",
        data: {
          username: value,
        },
      }).then((result) => {
        if (result.data.data == true) {
          callback(new Error(this.$t("account_limit")));
        } else {
          callback();
        }
      });
    };
    // 校验两次输入密码是否一致
    let validatePass2 = (rule, value, callback) => {
      if (value !== this.signupFormRef.signup_password1) {
        callback(new Error(this.$t("psd_limit")));
      } else {
        callback();
      }
    };
    return {
      // 用户账户信息
      signupFormRef: {
        signup_username: "",
        signup_password1: "",
        signup_password2: "",
        signup_email: "",
      },
      // URL自带或事先向服务器请求的 session 值
      session: "",
      rules: {
        signup_username: [
          {
            required: true,
            message: this.$t("input_account"),
            trigger: "blur",
          },
          { validator: checkUsername, trigger: "blur" },
          {
            min: 2,
            max: 32,
            message: this.$t("account_limit"),
            trigger: "blur",
          },
        ],
        signup_password1: [
          { required: true, message: this.$t("input_psd"), trigger: "blur" },
          { min: 6, max: 64, message: this.$t("psd_limit"), trigger: "blur" },
        ],
        signup_password2: [
          { required: true, message: this.$t("repeat_psd"), trigger: "blur" },
          { validator: validatePass2, trigger: "blur" },
          { min: 6, max: 64, message: this.$t("psd_limit"), trigger: "blur" },
        ],
        signup_email: [
          { required: false, message: this.$t("input_email"), trigger: "blur" },
          { type: "email", message: this.$t("email_limit"), trigger: ["blur"] },
        ],
      },
      // 登录状态
      status: this.$t("ready"),
      // 视频列表是否属于加载状态的判断
      loading: false,
    };
  },
  created() {
    // 初始化页面名为 signup
    this.$store.commit("changeBgc", "signup");
    // 修改网站标题
    document.title = this.$t("signup") + " - PatchyVideo";
  },
  mounted() {
    // 从URL获取session值
    this.session = this.$route.query.session || "";
  },
  methods: {
    open2() {
      this.$message({
        message: this.$t("signup_success"),
        type: "success",
      });
    },

    open3() {
      this.$message({
        message: this.$t("username_exist"),
        type: "warning",
      });
    },

    open4() {
      this.$message({
        message: this.$t("unknown_err"),
        type: "warning",
      });
    },

    // 用户注册
    signup: function() {
      // 先使页面出于加载状态
      this.loading = true;

      // 表单验证
      this.$refs.signupFormRef.validate(async (valid) => {
        if (valid) {
          // 验证成功，先获取 session
          await this.getSession();
          // 请求登录
          this.axios({
            method: "post",
            url: "be/signup.do",
            data: {
              username: this.signupFormRef.signup_username,
              password: this.signupFormRef.signup_password1,
              email: this.signupFormRef.signup_email,
              session: this.session,
            },
          })
            .then((result) => {
              if (result.status == 200) {
                if (result.data.status == "SUCCEED") {
                  this.open2();
                  // 加载结束,加载动画消失
                  this.loading = false;
                  // 退回到登录界面
                  this.$router.push("/login");
                }
                // 用户名已存在的情况
                else {
                  let reason = result.data.data.reason;
                  if (reason == "USER_EXIST") {
                    this.open3();
                  } else {
                    this.open4();
                  }
                  this.loading = false;
                }
              } else {
                this.status = this.$t("net_err");
              }
            })
            .catch(() => {
              this.loading = false;
              this.open4();
              this.status = this.$t("net_err");
            });
        } else {
          this.status = this.$t("format_err");
          // 加载结束,加载动画消失
          this.loading = false;
          return false;
        }
      });
    },
    // 获取session
    async getSession() {
      // 如URL无session，则从后端获取
      if (!this.session) {
        await this.axios({
          method: "post",
          url: "be/auth/get_session.do",
          data: {
            type: "SIGNUP",
          },
        })
          .then((result) => {
            this.session = result.data.data;
          })
          .catch(() => {
            this.loading = false;
            this.open4();
            this.status = this.$t("net_err");
          });
      }
    },
  },
};
</script>

<style scoped>
.signupPic {
  height: 100%;
  width: 100%;
  /* background: url("/static/img/sign_up.jpg") no-repeat top center; */
  /* background-position: 200px 0; */
  background-size: cover;
  background-attachment: fixed;
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
.el-form-item {
  margin-bottom: 22px !important;
}
.w {
  position: relative;
  top: 100px;
  display: block;
  width: 300px;
  height: 480px;
  padding: 50px;
  background-color: white;
  box-shadow: 0px 0px 80px #ffeef1;
  background-position-x: 50%;
  left: -200px;
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

.el-input {
  margin-top: 5px;
}
</style>
