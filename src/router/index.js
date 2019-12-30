import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/Home.vue";
import lists from "../views/Lists.vue";
import listdetail from "../views/ListDetail.vue";
import postvideo from "../views/PostVideo.vue";
import detail from "../views/Detail.vue";
import login from "../views/Login.vue";
import signup from "../views/SignUp.vue";
import edittag from "../views/Edittag.vue";
import store from "../store/index.js";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    redirect() {
      return "/home";
    }
  },
  {
    path: "/home",

    component: Home
  },
  {
    path: "/lists",

    component: lists
  },
  {
    path: "/listdetail",

    component: listdetail
  },
  {
    path: "/postvideo",

    component: postvideo
  },
  {
    path: "/video",

    component: detail
  },

  {
    path: "/login",

    component: login
  },
  {
    path: "/signup",

    component: signup
  },
  {
    path: "/edittag",

    component: edittag
  }
];

const router = new VueRouter({
  /*  mode: 'history',
  base: process.env.BASE_URL,*/
  routes
});

router.beforeEach((to, from, next) => {
  // to将要访问的路径
  // from从哪个路径跳转而来
  //next('/xxx')表示放行,或强制跳转到/xxx
  // console.log(store.state.username);
  if (to.path == "/login" || to.path == "/home") {
    // console.log("无权限页面放行");
    return next();
  }
  if (to.path == "/postvideo" || to.path == "/edittag") {
    if (store.state.username != "Login") {
      // console.log("已登录放行");
      return next();
    } else {
      // console.log("未登录不放行");
      return next("/login");
    }
  }
  next();
});
export default router;
