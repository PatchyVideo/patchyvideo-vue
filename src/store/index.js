import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);
export default new Vuex.Store({
  state: {
    // 页面所处的位置（主页，播放列表，上传视频，增加标签等）
    bgcMark: "home",
    // 用户名
    username: "",
    maxpage: 0,
    whichPage: 1,
    // 视频的数据列表(所有视频按照页数组成二维数组)
    videoObj: [],
    // 侧导航条(LeftNavBar.vue)的标题
    leftNavBarTitle: "标签"
  },
  mutations: {
    getUserName(state, e) {
      state.username = e;
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
    // 储存视频列表的时候，同时将视频数据存入本地储存中
    getVideoObj(state, e) {
      // console.log("哪一页:"+state.whichPage);
      state.videoObj[state.whichPage - 1] = e;

      // 清除视频列表中未定义的数据(将videoObj初始化之后出现的未定义的数组元素)
      for (let i = 0; i < state.maxpage; ++i) {
        if (state.videoObj[i] === undefined) {
          state.videoObj[i] = [];
        }
      }

      window.localStorage.setItem(`${state.whichPage - 1}`, JSON.stringify(e));
      window.localStorage.removeItem("loglevel:webpack-dev-server");
    },
    getMaxPage(state, e) {
      state.maxpage = e;
    },
    getwhichPage(state, e) {
      state.whichPage = e;
    }
  },
  actions: {},
  modules: {}
});
