import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import axios from "axios";
import VueAxios from "vue-axios";
import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
import "font-awesome/css/font-awesome.min.css";
/*import echarts from "echarts";*/
import login from "./views/Login.vue";
import $ from "jquery";
let echarts = require('echarts/lib/echarts');
require('echarts/lib/chart/sunburst');
require('echarts/lib/component/legend');
/*以上三个包为按需导入的图表必须项*/

import { VueCropper } from "vue-cropper";
Vue.config.productionTip = false;
Vue.use(VueAxios, axios);
Vue.use(ElementUI);
Vue.use(VueCropper);
Vue.prototype.$axios = axios;
Vue.prototype.$echarts = echarts;

Vue.config.keyCodes.Left_Arrow = 37;
Vue.config.keyCodes.Right_Arrow = 39;
Vue.config.keyCodes.Up_Arrow = 38;
Vue.config.keyCodes.Dw_Arrow = 40;


var vm = new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
