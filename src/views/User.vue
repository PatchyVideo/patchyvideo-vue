<template>
  <div>
    <topnavbar></topnavbar>
    <div class="content w">
      <!-- 个人界面 -->
      <el-tabs v-model="activeName">
        <el-tab-pane v-if="labelInfo.length >= 1" :label="labelInfo.length == info[0].length ? $t('me.tab1') : $t('outer_user.tab1')" name="first">
          <userprofile></userprofile>
        </el-tab-pane>
        <el-tab-pane v-if="labelInfo.length >= 2" :label="labelInfo.length == info[0].length ? $t('me.tab2') : $t('outer_user.tab2')" name="second">
          <usercontribute v-if="activeName === 'second'"></usercontribute>
        </el-tab-pane>
        <el-tab-pane v-if="labelInfo.length >= 3" :label="labelInfo.length == info[0].length ? $t('me.tab3') : $t('outer_user.tab3')" name="third">
          <listfolder v-if="activeName === 'third'"></listfolder>
        </el-tab-pane>
        <el-tab-pane v-if="labelInfo.length >= 4" :label="labelInfo.length == info[0].length ? $t('me.tab4') : $t('outer_user.tab4')" name="four">
          <userfavorites v-if="activeName === 'four'"></userfavorites>
        </el-tab-pane>
        <el-tab-pane v-if="labelInfo.length >= 5" :label="labelInfo.length == info[0].length ? $t('me.tab5') : $t('outer_user.tab5')" name="fifth">
          <userfolder v-if="activeName === 'fifth'"></userfolder>
        </el-tab-pane>
        <el-tab-pane v-if="labelInfo.length >= 6" :label="labelInfo.length == info[0].length ? $t('me.tab6') : $t('outer_user.tab6')" name="six">
          <blacklist v-if="activeName === 'six'"></blacklist>
        </el-tab-pane>
        <el-tab-pane v-if="labelInfo.length >= 7" :label="labelInfo.length == info[0].length ? $t('me.tab7') : $t('outer_user.tab7')" name="seven">
          <usersub v-if="activeName === 'seven'"></usersub>
        </el-tab-pane>
      </el-tabs>

      <!-- 其他用户界面 -->
    </div>
    <Footer></Footer>
  </div>
</template>

<script>
import topnavbar from "@/components/main/bar/TopNavbar";
import Footer from "@/components/main/bar/Footer";
import userprofile from "@/components/user/dash/Profile";
import usercontribute from "@/components/user/dash/Contribute";
import listfolder from "@/components/user/dash/ListFolder";
import userfavorites from "@/components/user/dash/Favorites";
import userfolder from "@/components/user/dash/UserFolder";
import blacklist from "@/components/user/dash/BlackList";
import usersub from "@/components/user/dash/Sub";
export default {
  components: {
    topnavbar,
    usercontribute,
    userprofile,
    listfolder,
    userfavorites,
    usersub,
    userfolder,
    Footer,
    blacklist,
  },
  data() {
    this.$i18n.locale = localStorage.getItem("lang");
    return {
      usersid: "www",
      gotomark: 0,
      activeIndex: "1",
      activeIndex2: "1",
      activeName: "first",
      info: [
        ["我的信息", "我贡献的索引", "我的文件夹", "我的收藏", "索引状态", "订阅", "黑名单"],
        ["用户信息", "他贡献的索引", "他的文件夹", "他的收藏"],
      ],
      labelInfo: ["我的信息", "我贡献的索引", "文件夹", "我的收藏", "索引状态", "订阅", "黑名单"],
    };
  },
  watch: {
    $route(n) {
      if (n.fullPath === "/users/me") {
        this.labelInfo = this.info[0];
      }
    },
  },
  created() {
    // 判断 url 阶段,
    // 如果用户输入的路径为 me,将 User 渲染为个人界面
    // 如果用户输入的路径不为 me,先判断此 uid 是否存在，存在则渲染其他用户界面，不存在则跳到 404
    if (this.$route.params.id == "me") {
      // 如果用户输入的路径为 me,将 User 渲染为个人界面，已经在上面的条件渲染中体现
      this.labelInfo = this.info[0];
    }
    if (this.$route.params.id != "me") {
      // 当路径不为 me，判断输入 uid 是否合法，SUCCEED FAILED
      this.isUidNull();
    }
  },
  mounted() {
    if (Object.keys(this.$route.query).toString() === "path") {
      this.activeName = "third";
      // let path = this.$route.query.path;
      // let str = this.$route.query.path.replace(/\//g,"");
      this.$refs.folder.navigateTo(this.$route.query.path);
    }
  },
  methods: {
    isUidNull() {
      this.axios({
        method: "post",
        url: "be/user/profile.do",
        data: { uid: this.$route.params.id },
      }).then((res) => {
        if (res.data.status == "FAILED") {
          this.$router.push("/*");
          // this.$router.push("/home");
          // 跳到404
        }
        if (res.data.status == "SUCCEED") {
          // uid 合法，渲染该 uid 的用户数据
          this.labelInfo = this.info[1];
        }
      });
    },
  },
};
</script>

<style scoped>
.w {
  display: block;
}
.el-tabs {
  background-color: rgba(255, 255, 255, 0.9);
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
.el-tabs {
  width: 90%;
  margin: auto;
}

.content {
  /* width: 1600px;*/
  width: 98%;
  /* max-width: 3000px; */
  height: 100%;
  /* background: url("/static/img/imoto.jpg") no-repeat top center; */
  opacity: 0.9;
  background-size: cover;
  background-attachment: fixed;
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
  /* background-color: white; */
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
</style>
