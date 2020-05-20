/* Lib */
import merge from "lodash/merge";

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

// Common i18n
import cmCHS from "../i18n/patchyvideo-vue/CHS/common.json";
import cmCHT from "../i18n/patchyvideo-vue/CHT/common.json";
import cmENG from "../i18n/patchyvideo-vue/ENG/common.json";
const commoni18n = {
  CHS: { _common: cmCHS },
  CHT: { _common: cmCHT },
  ENG: { _common: cmENG },
};

// Element-UI i18n
import elCHS from "element-ui/lib/locale/lang/zh-CN.js";
import elCHT from "element-ui/lib/locale/lang/zh-TW.js";
import elENG from "element-ui/lib/locale/lang/en.js";
const elementi18n = {
  CHS: elCHS,
  CHT: elCHT,
  ENG: elENG,
};

const i18n = new VueI18n({
  locale: "CHS", // set locale
  fallbackLocale: "CHS",
  messages: merge(elementi18n, commoni18n),
});

import ElementLocale from "element-ui/lib/locale";
ElementLocale.i18n((key, value) => i18n.t(key, value));

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
