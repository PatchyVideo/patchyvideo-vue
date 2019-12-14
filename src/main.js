import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import axios from "axios";
import VueAxios from "vue-axios";
import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
import "font-awesome/css/font-awesome.min.css";
Vue.use(ElementUI);
// console.log(this);

import login from "./views/Login.vue";
import $ from "jquery";
Vue.config.productionTip = false;
Vue.use(VueAxios, axios);

Vue.prototype.$axios = axios;

var vm = new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
