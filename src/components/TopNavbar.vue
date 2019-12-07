<!--    vue组件：TopNavbar.vue     -->
<!--
    组件：左侧的热门标签导航栏
    大小：100% * 70px
    功能：网站主导航栏
    必要传入参数：无
    更新日志：
    12/1/2019: v1.0 
      release
    12/3/2019：v1.1
      1.修复了导航栏因为边框导致网站宽度大于浏览器宽度的问题
    12/7/2019: v1.2
      2.新增退出登录效果
-->

<template>
  <div class="top-navbar w" id="top-navbar">
    <div class="nav_left">
      <ul>
        <li>
          <router-link to="/home">Home</router-link>
        </li>
        <li>
          <router-link to="/lists">Playlists</router-link>
        </li>
        <li>
          <router-link to="/postvideo">Post Video</router-link>
        </li>
        <li>
          <router-link to="/edittag">Tags</router-link>
        </li>
      </ul>
    </div>
    <div class="nav_right">
      <ul>
        <li id="s1">
          <select class="form_select">
            <option value="0">Tags</option>
          </select>
          <input id="search-bar-query" name="query" type="text" placeholder="Search" value />
          <input id="search-bar-submit" type="submit" value="Search" />
        </li>
        <div class="loginUser" v-show="!isLogin">
          <li>
            <router-link to="/login">Login</router-link>
          </li>
          <li>
            <a href="/logout">Log out</a>
          </li>
        </div>
        <div class="userHome" v-show="isLogin">
          <li>
            <router-link to="/login">{{this.$store.state.username}}</router-link>
          </li>
          <li>
            <a @click="dialogVisible = true">Log out</a>

            <!-- 退出登录的弹出框 -->
            <el-dialog
              title="提示"
              :visible.sync="dialogVisible"
              width="30%"
              :before-close="handleClose"
            >
              <span>你确定要退出登录吗?</span>
              <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="cleanLocalStorage">确 定</el-button>
              </span>
            </el-dialog>
          </li>
        </div>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 控制退出登录的弹出框
      dialogVisible: false,
      isLogin: true
    };
  },
  methods: {
    cleanLocalStorage: function() {
      // 清除所有session值(退出登录)
      sessionStorage.clear();
      // 清除用户名
      this.$store.commit("clearUserName");
      window.location.reload();
      this.dialogVisible = false;
    },
    // 控制退出登录的弹出框自带函数
    handleClose(done) {
      this.$confirm("确认关闭？")
        .then(_ => {
          done();
        })
        .catch(_ => {});
    }
  },
  components: {}
};
</script>

<style scoped>
@import "../static/css/common.css";

.top-navbar {
  margin: 0 auto;
  height: 70px;
  width: calc(100% - 20px);
  display: flex;
  align-items: center;
  overflow: hidden;
  position: relative;
  background-color: #fff;
  box-shadow: 0 2px 20px #a78c97;
}

.top-navbar li a {
  text-decoration: none;
  color: #761226;
  transition: all 0.4s ease;
}

.top-navbar a:hover {
  color: #ff88a0;
}

.nav_right li#s1 {
  width: 600px;
  height: 70px;
  line-height: 70px;
  position: relative;
  top: 0px;
  right: 50px;
}

.nav_left {
  width: 50%;
  text-align: left;
  padding-left: 20px;
}

.nav_right {
  width: 60%;
}

.nav_left li {
  height: 70px;
  line-height: 70px;
  display: inline-block;
  margin-left: 6%;
  text-align: center;
  font-size: 19px;
}

.nav_right li {
  height: 70px;
  line-height: 70px;
  float: left;
  margin-left: 2%;
  display: inline-block;
  text-align: center;
  font-size: 19px;
}

.form_select {
  width: 120px;
  height: 20px;
  padding-left: 5px;
  text-rendering: auto;
  color: black;
  letter-spacing: normal;
  word-spacing: normal;
  display: inline-block;
  box-sizing: border-box;
  align-items: center;
  white-space: pre;
  background-color: white;
  cursor: pointer;
  outline: none;
  border-style: solid;
  border-color: white;
  position: relative;
  right: 74px;
  transition: all 0.6s ease;
}
#search-bar-query {
  width: 220px;
  height: 40px;
  outline: none;
  border: none;
  padding-left: 13px;
  position: absolute;
  border: 1px solid white;
  right: 74px;
  top: 50%;
  transform: translateY(-50%);
  transition: all 0.6s ease;
}

.form_select:hover {
  outline: none;
  border-style: solid;
  border-color: #d1d1d1;
  box-shadow: 0px 0px 10px 5px white, 0px 0px 10px dodgerblue,
    0px 0px 20px dodgerblue;
  color: dodgerblue;
}

#search-bar-query:hover {
  border: 1px solid #d1d1d1;
}

#search-bar-submit {
  display: block;
  background: #c5464a;
  text-shadow: 0 0 10px #fff, 0 0 20px #fff, 0 0 30px #fff, 0 0 40px #c5464a,
    0 0 70px #c5464a, 0 0 80px #c5464a, 0 0 100px #c5464a, 0 0 150px #c5464a;
  width: 74px;
  color: white;
  height: 42px;
  outline: none;
  border: none;
  cursor: pointer;
  position: absolute;
  right: 0px;
  top: 50%;
  transform: translateY(-50%);
  transition: all 0.6s ease;
}

#search-bar-submit:hover {
  background-color: royalblue;
  text-shadow: 0 0 10px #fff, 0 0 20px #fff, 0 0 30px #fff, 0 0 40px #228dff,
    0 0 70px #228dff, 0 0 80px #228dff, 0 0 100px #228dff, 0 0 150px #228dff;
}
</style>