import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);
export default new Vuex.Store({
  state: {
    // 页面所处的位置（主页，播放列表，上传视频，增加标签等）
    bgcMark: "home",
    // 用户名
    username: "",
    // 用户头像
    userAvatar: "default",
    // 侧导航条(LeftNavBar.vue)的标题
    // 按照以下定义：1 表示“标签”，2 表示“热门标签”，3 表示“相关标签”
    leftNavBarTitle: 1,
    // 顶部导航条(TopNavbar)的搜索内容
    TopNavbarSearching: "",
    // 登录界面是否是因路由拦截而跳转的标志，0 表示从登录按钮跳转，1 表示路由守卫拦截，2 表示从其他地方跳转
    ifRouter: 2,
    // 如果是路由守卫拦截，这里保存下一个页面的路径
    routerPath: "",
    // 如果是路由守卫拦截，这里保存下一个页面的参数
    routerparams: {},
    // 验证用户是否真的登录（有时候用户在其他设备上登录之后再在本设备上登录，登录信息会失效）
    // 0 为未验证，1 为验证登录，2 为验证未登录
    ifTruelyLogin: 0,
    refreshCount: 0,
    homeVideoDisplayStatus: localStorage.getItem("homeVideoDisplayStatus")
      ? Number(localStorage.getItem("homeVideoDisplayStatus"))
      : 0,
  },
  mutations: {
    changeHomeVDS(state, e) {
      state.homeVideoDisplayStatus = e;
    },
    refreshPage(state, e) {
      state.refreshCount++;
    },
    getUserName(state, e) {
      state.username = e;
    },
    getUserAvatar(state, e) {
      state.userAvatar = e;
    },
    clearUserName(state) {
      state.username = "";
    },
    changeBgc(state, e) {
      state.bgcMark = e;
    },
    changeLeftNavBarTitle(state, e) {
      state.leftNavBarTitle = e;
    },
    getTopNavbarSearching(state, e) {
      state.TopNavbarSearching = e;
    },
    changeifRouter(state, e) {
      state.ifRouter = e;
    },
    changerouterPath(state, e) {
      state.routerPath = e;
    },
    changerouterparams(state, e) {
      state.routerparams = e;
    },
    changeifTruelyLogin(state, e) {
      state.ifTruelyLogin = e;
    },
  },
  actions: {},
  modules: {},
});
