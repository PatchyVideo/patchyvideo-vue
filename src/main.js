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
import linkify from 'vue-linkify';

let echarts = require('echarts/lib/echarts')
require('echarts/lib/chart/sunburst')
require('echarts/lib/component/legend')
/*以上三个包为按需导入的图表必须项*/

import { VueCropper } from "vue-cropper";
import VueI18n from 'vue-i18n';
Vue.config.productionTip = false;
Vue.use(VueAxios, axios);
Vue.use(ElementUI);
Vue.use(VueCropper);
Vue.use(VueI18n);
Vue.directive('linkified', linkify);
Vue.prototype.$axios = axios;
Vue.prototype.$echarts = echarts;

/*Vue.config.keyCodes.Left_Arrow = 37;
Vue.config.keyCodes.Right_Arrow = 39;
Vue.config.keyCodes.Up_Arrow = 38;
Vue.config.keyCodes.Dw_Arrow = 40;*/
/*
keyCode 37 = Left
keyCode 38 = Up
keyCode 39 = Right
keyCode 40 = Down
*/
const i18n = new VueI18n({
  locale: 'CHS', // set locale
  fallbackLocale: 'ENG',
})

//多浏览器语言识别兼容，统一小写
const localMap = {
  'en':'ENG',
  'en-us': 'ENG',
  'en-gb':'ENG',
  'zh': 'CHS',
  'zh-cn': 'CHS',
  'zh-tw':'CHT',
  'zh-hk':'CHT',
  'ja':'JPN'
}

console.log('巴瓦鲁魔法服务器启动！');
console.log('%cPatchy%cVideo','color:#9c71b2;font-size:2rem;font-family: Arial,Helvetica,sans-serif;padding: 5px 5px;font-weight: 700;','color:#ffb458;font-size:2rem;font-family: Arial,Helvetica,sans-serif;padding: 5px 10px;font-weight: 700;');
console.log('朋友，你知道东方Project吗？我让你加群，好吗？QQ群：757676234')
console.log("....,[[[[[[[[[`......................... ..          .. ....O@@@.... ........=^....................\n................................. O..... ..          .. ....O@@@.... ........=^....................\n................................. O..... ..          .. ....O@@@.... ........=^....................\n................................. O..... ..          .. ....O@@@.... ........=^....................\n...........,O^................... O..... ..          .. ....O@@@.... ........=^....................\n.........,ooO^................... *..... ..          .. .,*@@OO@@@]..........=^....................\n.........=ooO^..................]@@@]]@@@@[[[[[[[[[[[[*@@@@@@@*....*@`.......=^....................\n.........=ooO^..........,]@@@[@@O*[...........................,@.....**.....,**....................\n.........=ooO^......,**[...,*[.......................@.........@^.....*@],@[..@]`..................\n.........=ooO^....**`..]O[`........]*O[[[[[[*O]]....=O^........@......=**@*......,*@]..............\n.........=ooO^..,@`.*[.........,*[...............,*`=^,*`....**...*...=^.............**............\n.........=OO@`.,@.=^.,]*O[[[`@`.....................*@****,*.********.@................**..........\n............**[.,**`......,*...,]]OO@@@@@@@OO]]]`....,@**************@..................*^.........\n............@*O`.......*.*]@OooooO@OOOO*[[[*,[[OOOOO@`,*@`********,@*^*................**^.........\n..........,@`.........*.@*oooo**@OO[*************,*OOO*@`.,[OOOO[@[[[[[OO*]]...........*=*.........\n........**`..]@**@O`.***.,**o*@O`*******************OO@^@.**......*`**........[O`....****@@@@@@@@@@\n......,@,O*ooooo@OOO^.*****.*@O***=************=^*****O@*^****.....,*.****.......@*`....=@@^.......\n......*@*ooooo*@OOOOOO@@@@@**=^**.*.............O*****=@*.*****......@@@@@]]......@*@O@@OOO@^......\n........*@ooo*@[*`********@**O.***^***OOO=OOO^=`O`...***`.*****.*....*OOOOOOOO@**`.O.*@OO*@@` .....\n..........*@OO^`....**,`*=**OO***O^=OOOOOOOOOO=O=*=O**`..*@*].....,*OOOOOOOOOOO@*o*@*.,@OOO@@*.....\n............***^....*`O***OOO^*=O@*=OOOOOOOOOOOOO@`OOO,***O@.**=O^*********=OOO@@*o**`*.@@O^*.[@`..\n...........,@,**=o**^*O**@OO@^*OO@@*OOOOOOOOOOO@OOOOOOO***=@^O**O@*=*****,`**OOO@@=*.***.O,`.,@`...\n...........*^**^oooooOO^=@O^=^OOOOO@OOOOOOOOOOO@@^@OOOOOO^=O*=OOO@*=OO****OO*OOO@OO@*`.**,*,@[.    \n...........@`@@oooo*OOO^=@^.=*@O***@OooooooOOOOO@.OOOOOOOO*O@OOOO@*=OOOO^*OOOOOO@OOOOOO@*`=*.......\n@@@@@@@@@@@@@@Oooo*OOOOO=*..,@*@@`=^@OOOOOooooO^@.=OOOOooOOO@[@OO@*OOOOOO*=OOOOO@OOOOOO@O**@    ...\n@@@@@@@@@@@@.@@@*][OOOO@O^......,.............,`..,@@O**@*oo@..@O^=OOOOOOOOOOOOO@OOOOOO@*[`........\n           ..,...,@@@@@@@....,]]][...................,`...[*@...O`OOOOOOOO@OOO@@@OOOOOO@*@@]]`.....\n           ......@*OOOO^,`*@@@@@@`..................,*]`.......=^@OOOOOOOO@OOO@@@OOOOOO*OOOOO],*@]]\n...............,@*oooo*^.=@@@@@@@*.................,@@]]`.....=@*@oOOOOOO@@OOO@@@OOOOOOO@]......[*O\n..............*@*oooo**.*,*``,.....................O@@@@@@@@@`...OOOO@@@@@@@@@@@@OOOOOOOOOO@@@*]]`.\n..........,@OOoOOOOOo@`,=,^*=*``.......................[[@@@@`...O==OoOOOOOo^@@@@@OOOOOOOO@@@@@@@@@\n..........@OOOO.,OOOo@...............................****`***^*]=*ooooooooooo@@@@@@OOOOOOOOOOOOOOO@\n.........=@@OOOOO*OOOo@`...............................,.[=*^*,.=@*oooooooooo@@@@@@OOOOOOOOOOOOOOOO\n.... ....****OOOOOOOOOOO@].....................................*O*OoOOOOOOOOO@Oo@@@@OOOOOOOOOOOOOOO\n.... ...@**oO@*@@@@O@@@*...[O]........,OOO]`.................,]@OOO...OOOOOOOOOOo@@@OOOOOOOOOOOOOOO\n.....,@*^[*o*@@@ooo*@@^........,*@*]].,[OOO*`...........,]@@@@^=OOOO]OO*OOOOO@OOo@@@@OO@@@OOOOOOO@@\n...*@[`.=OO=OOOO@=o=@@*...........,^**,*@@@@@*@@@@@@@O@@@@[`...=OO@@OOOOOOOOO@*[..@@@@OO@@@@@@@@@@@\n.@@@@@OO@*^..,@@[@@@`@.*.........=`O.*******,..=^@[*.............*@O@**@@@@[.**...@@@@@@O@@@@@*[[[`\n,@@@@OOO@@^..,@`****=*.........*[=O[.@`****]OO@@[.[*^,*.............,*...,@@@OO@@*O@**@@@@OO@@]]*..\n...***..**,@@@*.***,@]]]]]]O**]*@@@@[.****,`@^]@@^.,*@^=^.........**=^..]@OOOOOOOO@*O]*.,[@@@@@@@@@\n.... ....**********@@@]]@**@[`.**************..*,O@@*,@*=`......****=****@OOOOOOO**oo@@*.***.......\n.... .....   .....****..*.********.................**.*@],**]`........**,@**[*@,*@*ooo*O@....   . .\n.... .....   ....................................... .**,@@@@@`,*`*[[@^.**oooo*@OOO@@@@@.*....... .\n.... .....   ........................................... ........[[[[[***=@=**@OOOOOO@*.****.......\n.... .....   .............................................. ..       .....,@*`@O@@OOOOO@.***.......\n.... .....   .............................................. ..       .......**.*@@@@@@@@`*.        \n.... .....   .............................................. ..       .......................       ");
if (!localStorage.getItem('lang')) {
  //多浏览器语言设定兼容方案
  var lang = (navigator.language || navigator.browserLanguage).toLowerCase();
  localStorage.setItem('lang', localMap[lang] || 'CHS');
}
i18n.locale = localStorage.getItem('lang');

var vm = new Vue({
  i18n,
  router,
  store,
  render: h => h(App)
}).$mount("#app");
