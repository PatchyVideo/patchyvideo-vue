<!--    vue页面：User.vue     -->
<!--
    页面：paychyvideo的注册页面
    功能：用户由此注册账号
    包含组件：login
    更新日志：
    1/1/2020: v1.0
      release
    ★待解决问题：
-->
<!--
新增user模块 需要安装依赖
npm install --save-dev less-loader less
npm install echarts --save
npm install font-awesome --save

————————————————————————————

img文件夹下新增 imoto.jpg test.png imoto_left.jpg imoto_left2.jpg

main.js文件下需要添加：
import echarts from 'echarts';
Vue.prototype.$echarts = echarts;

-->

<template>
  <div>
    <topnavbar></topnavbar>
    <div class="content w">
      <!-- <el-menu
        :default-active="activeIndex"
        class="el-menu-demo"
        mode="horizontal"
        @select="handleSelect"
      >
        <el-menu-item index="1">个人中心</el-menu-item>
        <el-menu-item index="2">我的投稿</el-menu-item>
        <el-menu-item index="3">收藏夹</el-menu-item>
      </el-menu>
      <userprofile v-if="1==gotomark"></userprofile>
      <usercontribute v-if="2==gotomark"></usercontribute>
      <userfavorites v-if="3==gotomark"></userfavorites>-->

      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="用户管理" name="first">
          <userprofile></userprofile>
        </el-tab-pane>
        <el-tab-pane label="配置管理" name="second">
          <usercontribute></usercontribute>
        </el-tab-pane>
        <el-tab-pane label="角色管理" name="third">
          <userfavorites></userfavorites>
        </el-tab-pane>
      </el-tabs>
    </div>
    <Footer></Footer>
  </div>
</template>

<script>
import topnavbar from "../components/TopNavbar.vue";
import userprofile from "../components/Userprofile.vue";
import usercontribute from "../components/UserContribute.vue";
import userfavorites from "../components/UserFavorites.vue";
import Footer from "../components/Footer.vue";
export default {
  data() {
    return {
      usersid: "www",
      gotomark: 1,
      activeIndex: "1",
      activeIndex2: "1",
      activeName: "first"
    };
  },
  created() {},
  methods: {
    handleSelect(key, keyPath) {
      console.log(key, keyPath);
      this.gotomark = key;
    },
    gotoUsercontribute() {
      this.flag = !this.flag;
    },
    handleClick(tab, event) {
      console.log(tab, event);
    }
  },

  components: { topnavbar, usercontribute, userprofile, userfavorites, Footer }
};
</script>

<style scoped >
.w {
  display: block;
}

input::-webkit-input-placeholder {
  font-size: 12px;
}

body {
  width: 100%;
  height: 100%;

  background: none;
}

h4 {
  position: absolute;
  display: block;
}

.content {
   width: 1600px;
  height: 100%;
  /*
    background: url("../static/img/imoto.jpg") no-repeat top center;

    opacity: 0.9;
    background-size: cover;
    background-attachment: fixed; */
  background-color: #ffffffc9;
  margin-top: 30px;
}

.font {
}

.standard {
  width: 1500px;
  margin: 10px 5px 0px;
}

.topmsg {
  font-size: 22px;
  font-weight: lighter;
  width: 100%;
  font-family: PingFang SC, Arial, Microsoft YaHei, sans-serif;
  height: 50px;
  border-bottom: 1px solid #ccc;
  /*background-color: white;*/
}
.topmsg div {
  display: flex;
  height: 100%;
}
.topmsg div a {
  display: inline-block;
  text-decoration: none;
  text-align: center;
  height: 100%;
  line-height: 50px;
  margin-right: 15px;
}
.topmsg div a:hover {
  background-color: #fafafa;
}
.topmsg div a:nth-child(1) {
}
</style>