import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import axios from "axios";
import VueAxios from "vue-axios";
import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
import "font-awesome/css/font-awesome.min.css";
import echarts from "echarts";
import login from "./views/Login.vue";
import $ from "jquery";
import { VueCropper } from "vue-cropper";
Vue.config.productionTip = false;
Vue.use(VueAxios, axios);
Vue.use(ElementUI);
Vue.use(VueCropper);
Vue.prototype.$axios = axios;
Vue.prototype.$echarts = echarts;

var vm = new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
