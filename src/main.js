/* Vue */
import Vue from "vue";

/* App */
import App from "./App.vue";

/* Vue config */
Vue.config.productionTip = false;

/* Vue router */
import router from "./router";

/* Vuex */
import store from "./store";

/* Vue axios */
import axios from "axios";
// Vue.prototype.$axios = axios;
import VueAxios from "vue-axios";
Vue.use(VueAxios, axios);

/* Element-UI */
import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
import "font-awesome/css/font-awesome.min.css";
Vue.use(ElementUI);

/* Vue i18n */
import VueI18n from "vue-i18n";
Vue.use(VueI18n);
const i18n = new VueI18n({
  locale: "CHS", // set locale
  fallbackLocale: "CHS",
});
// 多浏览器语言识别兼容，统一小写
const localMap = {
  en: "ENG",
  "en-us": "ENG",
  "en-gb": "ENG",
  zh: "CHS",
  "zh-cn": "CHS",
  "zh-tw": "CHT",
  "zh-hk": "CHT",
  ja: "JPN",
};
if (!localStorage.getItem("lang")) {
  // 多浏览器语言设定兼容方案
  let lang = (navigator.language || navigator.browserLanguage).toLowerCase();
  localStorage.setItem("lang", localMap[lang] || "CHS");
}
i18n.locale = localStorage.getItem("lang");

/* Vue cropper (splitted) */
// import { VueCropper } from "vue-cropper";
// Vue.use(VueCropper);

/* jquery (splitted) */
// import $ from "jquery";

/* echarts (splitted) */
// import echarts from "echarts";
// import echarts from "echarts/lib/echarts";
// import "echarts/lib/chart/sunburst";
// import "echarts/lib/component/legend";
// Vue.prototype.$echarts = echarts;

/* 如若需要使用字体，导入该文件即可。 */
// import "./ttf/cnfont.less"

/* Vue linkify */
import linkify from "vue-linkify";
Vue.directive("linkified", linkify);

/* Vue shadow dom */
import shadow from "../plugins/shadow.js";
Vue.use(shadow);

/* Common css */
import "./static/css/common.css";

/* console logs */
import "./log";

/* VM */
new Vue({
  i18n,
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");
