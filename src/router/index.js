import Vue from "vue";
import VueRouter from "vue-router";
import store from "../store/index.js";
import axios from "axios";
import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
import "../static/css/base.css";
import { Loading, Message } from "element-ui";
const error = () => import("../views/404.vue");
const Home = () => import("../views/Home.vue");
const detail = () => import("../views/Detail.vue");
const lists = () => import("../views/Lists.vue");
const createVideoList = () => import("../views/CreateVideoList.vue");
const listdetail = () => import("../views/ListDetail.vue");
const postvideo = () => import("../views/PostVideo.vue");
const login = () => import("../views/Login.vue");
const signup = () => import("../views/SignUp.vue");
const forgetPassword = () => import("../views/ForgetPassword.vue");
const resetpassword = () => import("../views/ResetPassword.vue");
const edittag = () => import("../views/Edittag.vue");
const User = () => import("../views/User");
const superadmin = () => import("../views/SuperAdmin.vue");
const ipfs = () => import("../views/IPFS.vue");
const ipfs_player = () => import("../views/IPFS_player.vue");
const Messages = () => import("../views/Messages.vue");
const ContributionLogs = () => import("../views/ContributionLogs.vue");
// 测试用页面
const test = () => import("../views/About.vue");

Vue.use(VueRouter);
Vue.use(ElementUI);

var loading;
function startLoading() {
  //使用Element loading-start 方法
  loading = Loading.service({
    lock: true,
    text: "少女祈祷中...."
    //customClass: 'eloading'
    //background: 'rgba(0, 0, 0, 0.7)'
  });
  return loading;
}
function endLoading() {
  //使用Element loading-close 方法
  loading.close();
}

//吾有一言，请诸位倾听
const yiyan = [
  "看板娘freesia要出小恶魔",
  "我只是个路过的博丽巫女，给我记住了！",
  "是在这里死亡呢，还是死后留在这里呢，还请选择吧",
  "是~这~样~的~吗~",
  "rm -rf /",
  "curl https://thvideo.tv",
  "魔理沙偷走了重要的服务器",
  "パチュリーズ・ベストヒットGSK - IOSYS",
  "先代巫女末年，略复不省事，人多怨之。因自叹曰：“人言我愦愦，后人当思此愦愦。”后灵梦为幻想乡，人多思之。",
  "萃香坐神社中，目博丽巫女，抚箱而叹曰：“愁肠长辘辘，壶中酒不空。”时守矢巫女方至，博丽指之，曰：“不效此辈，乃至于斯。”早苗于是阴怨灵梦。",
  "蕾米之心，日益骄固。冰精叫，雾湖举。芙兰一炬，可怜焦土。",
  "蕾米莉亚问七曜贤者：“博丽、守矢，巫女也，吾将从之，则何如？”对曰：“以雾之湖为池，赤馆为城，十六夜为政于内，美铃御敌于外，谨修内德，彰喻教化，近和妖精， 远化毛玉，则幻想乡之事，未可知也。",
  "博丽巫女下大图书馆，屠破时钟塔，赤馆震恐。蕾米莉亚乃素服自缚，牵羊而出，迎之馆门。巫女大喜，执羊而走，曰：“本为些许柴米，不意竟得此羊！”赤馆遂全。",
  "七曜贤者责蕾米曰：“姊之为姊，未曾初见教芙兰也。”蕾米答曰：“吾自教之耳。”芙兰从旁过，闻言对曰：“幸无所成。”",
  "博丽巫女常忧其贫，而八云氏多讥之。一日见巫女，巫女以清茶待之。八云于是笑曰：“身居陋室，箪食瓢饮，欲效先贤乎？”，则曰：“吾忧其贫，或忧其老。贫者易安，老者难回。”",
  "幽幽子饥甚，遣妖梦外出抄掠。妖梦掳米斯蒂娅等归。及见幽幽子，众皆垂泪。幽幽子不忍，持之手为涕泣良久。于是亲解其缚，执手躬自送诸庖厨。",
  "色は匂へど  いつか散りぬるを",
  "月には叢雲 華には風と",
  "ずっとその手を離さないでねと微笑った 君とはぐれた",
  "ヒフミ ヒフミ ヒフミ ヒフミ ヒヒフ",
  "上海 上海 上海 上海 蓬莱 蓬莱 蓬莱 蓬莱 フランス オランダ チベット 京都 ロンドン ロシアン オルレアン",
  "「叡智」　が、ありますように。「志操」　と、ありますように。「希望」　で、ありますように。やがて　「世界」になりますように。",
  "芽生え終えた生命よ 彷徨いの冥で逢おう",
  "我做东方整活页面，好吗？",
  "八云紫又过了一个17岁生日",
  "console.log('TOUHOU GUICHU YINMAD');",
  "或问八云氏：“忆君少时，为博丽结界，数有功焉。今老矣，奈何愦愦竟日也？”对曰：“功遂身退，天之道也。吾其身退，逐成巫女之名矣。”",
  "女巫！八卦炉！Best Match！Are you ready？普通的黑白魔法使！魔理沙魔理沙魔理沙！Yeah~",
  "我幽幽子，就是饿死，死外边，从白玉楼跳下去，也绝对不碰米斯蒂娅一根毛！A moment later.... 真香诶",
  "芙兰以姊无威仪，固多轻之。常于众而论，曰：“使吾为赤馆，当抚四方。”七曜贤者闻之，见芙兰曰：“向使君为赤馆，将何如？”曰：“以力以威，以平四境。”对曰：“如此则殆矣。赤馆虽强，人不过其万一，地不过方十里，惟修内德，穆上下，使知礼而不加饥馑已矣。”芙兰乃愧，终不复轻姊。",
  "芙兰游学于人里，从慧音学史，十日竟反。蕾米不说，曰：“学如积万仞之山，日增尺寸，乃有所长，归何为？”芙兰曰：“今日十五，不归何为？”",
  "Humpty Dumpty sat on a wall. Humpty Dumpty had a great fall. All the king's horses and king's men. Couldn't put Humpty together again.",
  "Windows正在更新中，你的电脑将重启多次，请坐和放宽。",
  "Windows更新失败，正在滚回以前的版本...",
  "幽幽子桑，白玉楼的樱花开了",
  "回首 切切低語向苍茫，客星擦過天際夜朦朧，昏暗黎明前悠悠昤唱傳誦之歌 破長空。",
  "一句不经意平凡话语，剪断最后的一根神经，我的天空开始崩坏离析。",
  "慧音东游，见四妖精辩日，问其故。桑尼曰：“我以日始出时去人近，而日中时远也。” 露娜以日初出远，而日中时近也。 斯塔曰：“日初出大如车盖，及日中则如盘盂，此不为远者小而近者大乎？” 冰精则驳之：“日初出沧沧凉凉，及其日中如探汤，此不为近者热而远者凉乎？” 慧音不能决也。众妖精笑曰：“孰为汝多知乎？”"
];

//整活页面
var page;
function startPage() {
  var random = Math.floor(Math.random() * 100, 2) % yiyan.length;
  page = Loading.service({
    lock: true,
    text: `${yiyan[random]}`,
    customClass: "eloading"
    //background: 'rgba(0, 0, 0, 0.7)'
  });
}
function endPage() {
  page.close();
}

/*
Vue-router在3.1之后把$router.push()方法改为了Promise。所以假如没有回调函数，错误信息就会交给全局的路由错误处理，
vue-router是先报了一个Uncaught (in promise)的错误(因为push没加回调)，然后再点击路由的时候才会触发NavigationDupli
 cated的错误(路由出现的错误，全局错误处理打印了出来)。

方案1
固定vue-router版本到3.0.7以下。这个方案没什么说的，就是简单粗暴，没有任何理由。但是你能确保以后不升级vue-router吗？

方案2
禁止全局路由错误处理打印，这个也是vue-router开发者给出的解决方案：
const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push (location, onResolve, onReject) {
  return originalPush.call(this, location).catch(err => {
    return err
  })
}

方案3(高成本高收益)
vue-router的开发者也给出了解决方法，你需要为每个router.push增加回调函数。
router.push('/location').catch(err => {err})
对于我们来说这个解决方案的成本可能很高，但是是值得的。在vue-router 3.1版本之前的push调用时不会返回任何信息，假如push之后路由出现了问题也不会有任何的错误信息。
如果你使用方案1固定了vue-router的版本，那么以后的项目需要路由的回调时你根本无从下手。

方案4
如果你使用了Element-UI，并且方案2无法解决你的问题。那么你只能用方案1来固定你的vue-router版本了。
这是因为Element-UI的el-menu在重复点击路由的时候报的错误，而且这个错误是Element-UI内部的路由问题，你无法通过方案2和3去解决。
只能选择暂时不升级Vue-router。

好消息是Element-UI已经有了解决方案，预计在2.13.0版本会解决这个问题。参考Github上issue#17269。
*/

const routes = [
  {
    path: "*",
    redirect: "/404"
  },
  {
    path: "/",
    redirect() {
      return "/home";
    }
  },
  {
    path: "/404",

    component: error
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
    path: "/createVideoList",
    component: createVideoList
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
    path: "/forgetPassword",
    component: forgetPassword
  },
  {
    path: "/resetpassword",
    component: resetpassword
  },
  {
    path: "/edittag",

    component: edittag
  },
  {
    path: "/users/:id",
    component: User
  },
  {
    path: "/superadmin",
    component: superadmin
  },
  {
    path: "/ipfs",
    component: ipfs
  },
  {
    path: "/ipfs/player",
    component: ipfs_player
  },
  {
    path: "/messages",
    component: Messages
  },
  {
    path: "/logscontributes",
    component: ContributionLogs
  },
  {
    path: "/test",
    component: test
  }
];

const router = new VueRouter({
  /*  mode: 'history',
  base: process.env.BASE_URL,*/
  routes
});

// -------------------------危险提示-------------------------
//   此函数将用户名保存在本地数据中且未加密，有泄露的风险！！！
// -------------------------危险提示-------------------------
router.beforeEach((to, from, next) => {
  if (to.path == "/404") {
    return next();
  }
  //和后端对接，当后端维护时拦截路由
  startLoading();
  axios({
    method: "get",
    url: "/be/alive.txt"
    //url: "http://127.0.0.1:9800/"
  })
    .then(result => {
      endLoading();
      // 开始执行路由

      // to将要访问的路径
      // from从哪个路径跳转而来
      //next('/xxx')表示放行,或强制跳转到/xxx

      if (to.path == "/messages" && !getCookie()) {
        return next("/home");
      }
      if (
        to.path == "/postvideo" ||
        to.path == "/edittag" ||
        to.path == "/users/me" ||
        to.path == "/createVideoList" ||
        // 增加一个 superadmin 路由
        to.path == "/superadmin"
      ) {
        if (getCookie() && store.state.ifTruelyLogin != 2) {
          // console.log("已登录放行");
          return next();
        } else {
          // console.log("未登录不放行");
          // 保存跳转状态
          store.commit("changeifRouter", "1");
          store.commit("changerouterPath", to.path);
          if (to.path == "/postvideo") {
            if (to.query !== undefined) {
              store.commit("changerouterparams", to.query);
            }
          }
          return next("/login");
        }
      }
      next();
    })
    .catch(ex => {
      endLoading();
      var res = ex.response;
      if (res) {
        if (res.status == 404) {
          return next("/404");
        } else if (res.status == 502) {
          startPage();
          Message({
            message: "巴瓦鲁魔法服务器正在跃迁中",
            type: "warning",
            duration: 0
          });
          return false;
        } else if (res.status == 500) {
          startPage();
          Message.error({
            message: "巴瓦鲁魔法服务器哮喘犯了",
            type: "error",
            duration: 0
          });
          return false;
        } else if (res.status == 503) {
          startPage();
          Message({
            message: "巴瓦鲁魔法服务器正在睡觉",
            type: "error",
            duration: 0
          });
          return false;
        } else if (res.status == 403) {
          startPage();
          Message({
            message: "你被帕秋莉禁止进入巴瓦鲁魔法服务器",
            type: "error",
            duration: 0
          });
          return false;
        }
      }
      // 跳转到未知错误页面
      startPage();
      Message({
        message: "巴瓦鲁魔法服务器被隙间了",
        type: "error",
        duration: 0
      });
      return false;
    });
});

// 获取cookie
function getCookie() {
  if (document.cookie.length > 0) {
    var arr = document.cookie.split("; ");
    for (var i = 0; i < arr.length; i++) {
      var arr2 = arr[i].split(":");
      //判断查找相对应的值
      if (arr2[0] == "username") {
        if (arr2[1] != "") {
          return true;
        }
      }
    }
  }
  return false;
}
export default router;
