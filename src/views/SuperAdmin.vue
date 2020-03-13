<!--

	组件：管理员页面
	更新日志：
	2/16/2020:
	待完成
-->

<i18n>
{
  "CHS": {
	"user_management":"用户管理",
	"log_view":"日志查看",
	"para_settings":"网站参数设置",
	"scripts":"网站脚本"
  },
  "ENG": {
	"user_management":"User management",
	"log_view":"Log view",
	"para_settings":"Site parameter settings",
	"scripts":"Web site scripts"
  },
  "CHT": {
	"user_management":"用戶管理",
	"log_view":"日誌查看",
	"para_settings":"網站參數設置",
	"scripts":"網站腳本"
  }
}
</i18n>


<template>
  <div>
	<topnavbar></topnavbar>
	<el-container>
	  <el-header>
		Header
		<el-tabs v-model="activeName" @tab-click="handleClick">
		  <el-tab-pane :label="$t('user_management')" name="first">
			<usermanagemennt></usermanagemennt>
		  </el-tab-pane>

		  <!-- 日志查看 -->
		  <el-tab-pane :label="$t('log_view')" name="second">
			<logview></logview>
		  </el-tab-pane>

		  <el-tab-pane :label="$t('para_settings')" name="third">
			<parasettings></parasettings>
		  </el-tab-pane>
		  <el-tab-pane :label="$t('scripts')" name="fourth">{{$t('scripts')}}</el-tab-pane>
		</el-tabs>
	  </el-header>
	  <el-main></el-main>
	</el-container>
	<!-- <Footer></Footer> -->
  </div>
</template>

<script>
import topnavbar from "../components/TopNavbar.vue";
import Footer from "../components/Footer.vue";
import usermanagemennt from "../components/admincompoents/UserManagement.vue";
import logview from "../components/admincompoents/LogView.vue";
import parasettings from "../components/admincompoents/ParaSettings.vue";
export default {
  data() {
	this.$i18n.locale = localStorage.getItem("lang");
	return {
	  activeName: "second"
	};
  },
  created() {
	  this.isAdmin();
  },
  methods: {
	handleClick(tab, event) {
	},
	// 判断当前用户是不是 Admin ，不是则404
	isAdmin(){
		this.axios({
			method: "post",
			url: "/be/user/myprofile.do" ,
			data: {}
		}).then(ret => {
			var status = ret.data.data.access_control.status;
			if(status !== "admin"){
				this.$router.push({ path: "*" });
			}
		})
	}
  },
  components: { topnavbar, Footer, usermanagemennt, logview, parasettings }
};
</script>

<style scoped>
.el-header,
.el-footer {
  background-color: #b3c0d1;
  color: #333;
  text-align: center;
  line-height: 60px;
}
.el-main {
  background-color: #e9eef3;
  color: #333;
  text-align: center;
  line-height: 160px;
}
.el-tabs {
  width: 80%;
  margin: auto;
}
</style>