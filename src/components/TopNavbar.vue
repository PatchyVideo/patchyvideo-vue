<!--    vue组件：TopNavbar.vue     -->
<!--
    组件：页面顶部的导航栏
    大小：100% * 80px
    功能：网站主导航栏
    必要传入参数：无
    更新日志：
-->

<i18n>
{
  "CHS": {
    "navbar": {
      "index": "首页",
      "playlist": "播放列表",
      "postvideo": "发布视频",
      "edittag": "标签"
    },

    "search": {
      "tag_text": "标签/文本",
      "text": "仅文本",
      "prompt": "请输入标签",
      "button": "搜索"
    },
    "user": {
      "signup": "注册",
      "login": "登录",
      "message": "消息",
      "logout": "退出",
      "logout_prompt": "你确定要退出登陆吗?",
      "login_expire_prompt": "登录已过期，请新登录！"
    },
    "prompt": {
      "msg": "提示",
      "ok": "确 定",
      "cancel": "取 消"
    }
  },
  "ENG": {
    "navbar": {
      "index": "Home",
      "playlist": "Playlists",
      "postvideo": "Post Video",
      "edittag": "Tags"
    },

    "search": {
      "tag_text": "Tag/Text",
      "text": "Text Only",
      "prompt": "Search...",
      "button": "Search"
    },
    "user": {
      "signup": "Sign up",
      "login": "Log in",
      "message": "Messages",
      "logout": "Log out",
      "logout_prompt": "Are you sure you want to log out?",
      "login_expire_prompt": "Your session has expired. Please relogin"
    },
    "prompt": {
      "msg": "Are you sure?",
      "ok": "OK",
      "cancel": "Cancel"
    }
  },
  "CHT": {
    "navbar": {
      "index": "首頁",
      "playlist": "播放列表",
      "postvideo": "發布視頻",
      "edittag": "標簽"
    },

    "search": {
      "tag_text": "標簽/文本",
      "text": "僅文本",
      "prompt": "請輸入標簽",
      "button": "搜索"
    },
    "user": {
      "signup": "註冊",
      "login": "登錄",
      "message": "消息",
      "logout": "退出",
      "logout_prompt": "妳確定要退出登陸嗎?",
      "login_expire_prompt": "登錄已過期，請新登錄！"
    },
    "prompt": {
      "msg": "提示",
      "ok": "確 定",
      "cancel": "取 消"
    }
  }
}
</i18n>

<template>
  <div>
    <!-- 退出登录的弹出框 -->
    <el-dialog
      :title="$t('prompt.msg')"
      :modal-append-to-body="false"
      :visible.sync="dialogVisible"
      width="30%"
      v-loading="loading"
    >
      <p>{{$t('user.logout_prompt')}}</p>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">{{$t('prompt.cancel')}}</el-button>
        <el-button type="primary" @click="cleanLocalStorage">{{$t('prompt.ok')}}</el-button>
      </span>
    </el-dialog>
    <div class="top-navbar">
      <!-- 网站icon &标题 -->
      <div class="iconAndTitle">
        <img class="patchyvideo-icon" src="../static/img/patchyvideo.svg" />
        <span class="patchyvideo-title">Patchy Video</span>
      </div>

      <!-- 左面的四个页面链接 -->
      <div class="nav_left">
        <div class="navItem">
          <router-link to="/home" @click.native="cleanIptV">{{$t('navbar.index')}}</router-link>
        </div>
        <div class="navItem">
          <router-link to="/lists">{{$t('navbar.playlist')}}</router-link>
        </div>
        <div class="navItem">
          <router-link to="/postvideo">{{$t('navbar.postvideo')}}</router-link>
        </div>
        <div class="navItem">
          <router-link to="/edittag">{{$t('navbar.edittag')}}</router-link>
        </div>
        <div class="navItem">
          <router-link to="/logscontributes">历史和贡献</router-link>
        </div>
      </div>

      <!-- 搜索框 -->
      <div class="search-bar-query">
        <el-autocomplete
          id="ipt"
          ref="ipt"
          v-model="iptVal"
          :fetch-suggestions="querySearchAsync2"
          :trigger-on-focus="false"
          :placeholder="$t('search.prompt')"
          @select="handleSelect2"
          @keyup.enter.native="gotoHome"
        >
          <!-- 搜索条件 -->
          <el-select v-model="searchType" slot="prepend">
            <el-option :label="$t('search.tag_text')" value="tag"></el-option>
            <el-option :label="$t('search.text')" value="text"></el-option>
          </el-select>
          <!-- 自动补全的模板 -->
          <template slot-scope="{ item }">
            <div class="adviceList">
              <div
                class="name"
                v-bind:class="{
                      Copyright: item.cat == 2,
                      Language: item.cat == 5,
                      Character: item.cat == 1,
                      Author: item.cat == 3,
                      General: item.cat == 0,
                      Meta: item.cat == 4,
                      Soundtrack: item.cat == 6
                    }"
                v-html="item.tag||ConvertLangRes(item.langs)"
              ></div>
              <div class="addr" v-if="item.cnt != null">{{ item.cnt }}</div>
            </div>
          </template>
          <!-- 搜索按钮 -->
          <el-button slot="append" icon="el-icon-search" @click="gotoHome"></el-button>
        </el-autocomplete>
      </div>

      <div>
        <!-- 登录和注册按钮 -->
        <div class="loginUser" v-if="!isLogin">
          <router-link
            to="/login"
            class="loginUser-login"
            @click.native="login"
          >{{$t('user.login')}}</router-link>
          <router-link to="/signup" class="loginUser-signup">{{$t('user.signup')}}</router-link>
        </div>

        <!-- 登录成功后的用户界面 -->
        <div class="userHome" v-else>
          <div @click="gotoUserPage">
            <el-avatar fit="cover" class="loginUser-userAvatar" :size="40" :src="userAvatar"></el-avatar>
          </div>
          <router-link
            class="loginUser-login"
            style="max-width:100px;overflow: hidden;"
            to="/users/me"
          >
            {{
            this.$store.state.username
            }}
          </router-link>
          <el-badge :value="messagesNum" :hidden="!messagesNum" class="item">
            <router-link
              target="_blank"
              class="loginUser-message"
              to="/messages"
            >{{$t('user.message')}}</router-link>
          </el-badge>
          <a
            class="loginUser-signup"
            @click="dialogVisible = true"
            style="cursor:pointer"
          >{{$t('user.logout')}}</a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import TextComplete from "v-textcomplete";
export default {
  inject: ["reload"],
  data() {
    this.$i18n.locale = localStorage.getItem("lang");
    return {
      // 控制退出登录的弹出框
      dialogVisible: false,
      // 判断是否登录
      isLogin: false,
      // 搜索框的搜索类型(标签+文本或仅文本)
      searchType: "tag",
      // 搜索框的内容，不知道为什么在自动补全之后会被清空
      iptVal: "",
      // 搜索框的内容，在自动补全的时候作为备份使用，防止搜索框内容被清空
      // ps：iptVal2在计算属性里，所以请勿随便更改变量名
      iptVal3: "",
      // 进行搜索的时候关键字的开头位置(起始位置)
      startlocation: 0,
      // 进行搜索的时候光标的位置(终止位置)
      endlocation: 0,
      // 退出登录时退出框处于加载状态的判断
      loading: false,
      // 网站推荐栏以及关键字推荐栏
      sites: [
        { tag: "site:acfun", cat: 6, cnt: null },
        { tag: "site:bilibili", cat: 6, cnt: null },
        { tag: "site:nicovideo", cat: 6, cnt: null },
        { tag: "site:twitter", cat: 6, cnt: null },
        { tag: "site:youtube", cat: 6, cnt: null },
        { tag: "site:zcool", cat: 6, cnt: null },
        { tag: "site:ipfs", cat: 6, cnt: null },
        { tag: "AND", cat: 6, cnt: null },
        { tag: "OR", cat: 6, cnt: null },
        { tag: "NOT", cat: 6, cnt: null },
        { tag: "date:", cat: 6, cnt: null },
        { tag: "tags:", cat: 6, cnt: null }
      ],
      infoTipMark: false,
      // 未读信息的数量
      messagesNum: 0,
      // 控制读取未读信息方法的变量
      queryMessages: ""
    };
  },
  computed: {
    // 搜索的关键字
    iptVal2() {
      return this.$store.state.TopNavbarSearching;
    },
    // 搜索的关键字
    userAvatar() {
      if (this.$store.state.userAvatar == "default") {
        return require("../static/img/defaultAvatar.jpg");
      } else {
        return "be/images/userphotos/" + this.$store.state.userAvatar;
      }
    }
  },
  created() {
    // 查看是否在别的设备上登录过
    if (this.$store.state.ifTruelyLogin == 0) {
      this.checkUser();
    }
    this.getCookie();
    // 查看是否登录
    if (
      JSON.stringify(this.$store.state.username) != "null" &&
      this.$store.state.username != ""
    ) {
      this.isLogin = true;
      if (this.$route.path != "/messages") this.getUnreadCount();
      // 每2min查询一次未读消息
      // 注意,这里的this.getUnreadCount不能加括号!
      this.queryMessages = setInterval(this.getUnreadCount, 120000);
    }
    this.iptVal = this.iptVal2;
  },
  mounted() {},
  updated() {},
  methods: {
    // 测试用户的登录状态
    checkUser() {
      this.axios({
        method: "post",
        url: "be/user/whoami",
        data: {}
      }).then(result => {
        if (result.data.data == "UNAUTHORISED_OPERATION" && this.getCookie()) {
          this.axios({
            method: "post",
            url: "/be/logout.do",
            data: {}
          }).then(result => {
            this.open(this.$t("user.login_expire_prompt"));
            this.isLogin = false;
            // 清除所有session值(退出登录)
            sessionStorage.clear();
            // 清除用户名
            this.$store.commit("clearUserName");
            // 清除本地数据
            localStorage.setItem("username", "");
            // 清除cookie
            this.clearCookie();
            // 改变用户登录状态
            this.$store.commit("changeifTruelyLogin", "2");
          });
        } else {
          this.$store.commit("changeifTruelyLogin", "1");
        }
      });
    },
    // 登录跳转
    login() {
      this.$store.commit("changeifRouter", "0");
    },
    // 退出时清除所有数据
    cleanLocalStorage() {
      this.loading = true;
      this.axios({
        method: "post",
        url: "/be/logout.do",
        data: {}
      }).then(result => {
        this.isLogin = false;
        // 清除所有session值(退出登录)
        sessionStorage.clear();
        // 清除用户名
        this.$store.commit("clearUserName");
        // 清除本地数据
        localStorage.setItem("username", "");
        // 清除cookie
        this.clearCookie();
        // 刷新界面
        location.reload();
        this.loading = false;
        this.dialogVisible = false;
      });
    },
    // 跳转至个人界面
    gotoUserPage() {
      this.$router.push({ path: "/users/me" });
    },
    // 点击搜索按钮使home页面显示搜索结果
    gotoHome() {
      //如果回车搜索之前有选中建议框的数据，则取消这次搜索
      if (this.infoTipMark === true) {
        this.infoTipMark = false;
        return;
      }
      if (this.iptVal != "") {
        this.$router
          .push({
            path: "/home",
            query: { keyword: this.iptVal, qtype: this.searchType }
          })
          .catch(err => {
            return err;
          });
      } else {
        // 对于在home页面时无参数搜索的兼容
        if (JSON.stringify(this.$route.query) == "{}") return;
        this.$router.push({ path: "/home" });
      }
    },
    // 清除搜索结果
    cleanIptV() {
      this.$store.commit("getTopNavbarSearching", "");
      /*    this.reload();*/
    },
    //清除cookie
    clearCookie: function() {
      this.setCookie("", -1);
      this.setCookie("session", -1);
      this.setCookie("userAvatar", -1);
    },
    // 设置cookie
    // 储存变量为username
    setCookie(username, days) {
      var date = new Date(); //获取时间
      date.setTime(date.getTime() + 24 * 60 * 60 * 1000 * days); //保存的天数
      //字符串拼接cookie
      window.document.cookie =
        "username" + ":" + username + ";path=/;expires=" + date.toGMTString();
      window.document.cookie =
        "userAvatar" + "=" + username + ";path=/;expires=" + date.toGMTString();
    },
    // 获取cookie
    getCookie: function() {
      if (document.cookie.length > 0) {
        var arr = document.cookie.split("; ");
        for (var i = 0; i < arr.length; i++) {
          var arr3 = arr[i].split("=");
          //判断查找相对应的值
          if (arr3[0] == "userAvatar") {
            this.$store.commit("getUserAvatar", arr3[1]);
          }
          var arr2 = arr[i].split(":");
          //判断查找相对应的值
          if (arr2[0] == "username") {
            if (arr2[1] != "") {
              this.isLogin = true;
              this.$store.commit("getUserName", arr2[1]);
            }
          }
        }
        return true;
      }
      this.$store.commit("getUserName", "");
      return false;
    },
    // 获取未读通知数量
    getUnreadCount() {
      this.axios({
        method: "post",
        url: "be/notes/list_unread.do",
        data: {}
      })
        .then(result => {
          this.messagesNum = result.data.data.notes.length;
        })
        .catch(error => {
          console.log(error);
        });
    },
    // 消息补全框的方法
    querySearchAsync(queryString, cb) {
      // 这里的get(0)是将jq对象转换为原生js对象
      // selectionStart是获取光标当前位置
      var endlocation = $("#ipt").get(0).selectionStart;
      // 切割输入框内的字符串，切割下光标左面的字符串
      var query = queryString.slice(0, endlocation);
      // 获取所需要搜索的字符串的开头在搜索框内字符串的位置
      var startlocation = this.match(query);
      // 切割下所需要查询的字符串
      query = query.slice(startlocation, endlocation);
      // 字符串为空格的话不搜索
      if (this.isNull(query)) {
        cb([]);
        return;
      }

      // 备份参数防止出现玄学问题
      var query2 = query;
      // 搜索是否包含sites变量的关键字
      var results = this.sites.filter(this.createFilter(query2));

      // 对输入框现在的数据进行备份
      this.iptVal3 = this.iptVal;
      this.startlocation = startlocation;
      this.endlocation = endlocation;

      var url = "/autocomplete/?q=" + query;
      this.axios({
        method: "get",
        url: url
      }).then(result => {
        if (result.status == "FALIED") {
          cb([]);
          return;
        }
        var resultList = results.concat(result.data);
        cb(resultList);
      });
    },
    querySearchAsync2(queryString, cb) {
      // 这里的get(0)是将jq对象转换为原生js对象
      // selectionStart是获取光标当前位置
      var endlocation = $("#ipt").get(0).selectionStart;
      // 切割输入框内的字符串，切割下光标左面的字符串
      var query = queryString.slice(0, endlocation);
      // 获取所需要搜索的字符串的开头在搜索框内字符串的位置
      var startlocation = this.match(query);
      // 切割下所需要查询的字符串
      query = query.slice(startlocation, endlocation);
      // 字符串为空格的话不搜索
      if (this.isNull(query)) {
        cb([]);
        return;
      }

      // 备份参数防止出现玄学问题
      var query2 = query;
      // 搜索是否包含sites变量的关键字
      var results = this.sites.filter(this.createFilter(query2));

      // 对输入框现在的数据进行备份
      this.iptVal3 = this.iptVal;
      this.startlocation = startlocation;
      this.endlocation = endlocation;

      var url = "/be/autocomplete/ql?q=" + query;
      this.axios({
        method: "get",
        url: url
      }).then(result => {
        if (result.status == "FALIED") {
          cb([]);
          return;
        }
        var resultList = results.concat(result.data);
        cb(resultList);
      });
    },
    // 搜索输入框内的搜索文字是否包含网站内容
    createFilter(query) {
      return sites => {
        return sites.tag.toLowerCase().indexOf(query.toLowerCase()) === 0;
      };
    },
    // 搜索输入框内的搜索文字，返回搜索关键字所在的起始位置
    match(text) {
      var i = text.length;
      while (i--) {
        if (
          text.charAt(i) == " " ||
          text.charAt(i) == "\t" ||
          text.charAt(i) == "\n" ||
          text.charAt(i) == "\v" ||
          text.charAt(i) == "\f" ||
          text.charAt(i) == "\r" ||
          // 把括号转化成ascII码判断,否则谜之报错
          text.charAt(i).charCodeAt() == 41
        ) {
          return i + 1;
        } else if (text.charAt(i).charCodeAt() == 40) {
          if (i > 0 && text.charAt(i - 1) == "_") {
            continue;
          } else {
            return i + 1;
          }
        }
      }
      return 0;
    },
    // 判断字符串是否全为空格
    isNull(str) {
      if (str == "") return true;
      var regu = "^[ ]+$";
      var re = new RegExp(regu);
      return re.test(str);
    },
    ConvertLangRes(langs, hastran = true) {
      if (!langs) return;
      var LangList = [
        { id: 1, lang: "CHS" },
        { id: 2, lang: "CHT" },
        { id: 5, lang: "ENG" },
        { id: 10, lang: "JPN" }
      ];
      var level = [10, 5, 1, 2];
      var Lang = "";
      var mainLang = "";
      var subLang = "";
      //经过一系列计算得出主副语言

      //匹配当前语言的ID
      var CurrLangID = LangList.find(x => {
        return x.lang == this.$i18n.locale;
      });
      CurrLangID = CurrLangID ? CurrLangID.id : 1;

      //匹配对应ID的内容
      var CurrLangWord = langs.find(x => {
        return x.l == CurrLangID;
      });
      if (!CurrLangWord) {
        for (var i = 0; i < level.length; i++) {
          CurrLangWord = langs.find(x => {
            return x.l == level[i];
          });
          if (CurrLangWord) break;
        }
      }
      mainLang = CurrLangWord.w;

      if (hastran) {
        /*
      副语言匹配
      优先级：日语，英语，简体中文，繁体中文
      */
        var SubLangWord = null;
        for (var i = 0; i < level.length; i++) {
          if (level[i] == CurrLangWord.l) continue;
          SubLangWord = langs.find(x => {
            return x.l == level[i];
          });
          if (SubLangWord) break;
        }
        subLang = SubLangWord ? SubLangWord.w : mainLang;

        //合成语言
        Lang = `${mainLang.replace(/\_/g, " ")}`;
        Lang += `<span style='font-size:8px;color: gray;display: block;'>${subLang.replace(
          /\_/g,
          " "
        )}</span>`;
      } else {
        Lang = mainLang;
      }
      return Lang;
    },
    handleSelect(item) {
      // 切割字符串，并在中间加入搜索到的标签拼接成新的输入框的内容
      var iptVal1 = this.iptVal3.slice(0, this.startlocation);
      var iptVal2 = this.iptVal3.slice(this.endlocation);
      var iptVal = iptVal1 + item.tag + " " + iptVal2;
      this.iptVal = iptVal;
      // 光标设置焦点事件
      var endlocation = $("#ipt").focus();
      this.infoTipMark = true;
    },
    open(message) {
      this.$message({
        message: message,
        type: "error"
      });
    },
    handleSelect2(item) {
      // 切割字符串，并在中间加入搜索到的标签拼接成新的输入框的内容
      var iptVal1 = this.iptVal3.slice(0, this.startlocation);
      var iptVal2 = this.iptVal3.slice(this.endlocation);
      var iptVal =
        iptVal1 +
        (item.tag || this.ConvertLangRes(item.langs, false)) +
        " " +
        iptVal2;
      this.iptVal = iptVal;
      // 光标设置焦点事件
      var endlocation = $("#ipt").focus();
      this.infoTipMark = true;
    },
    open(message) {
      this.$message({
        message: message,
        type: "error"
      });
    }
  },
  watch: {
    iptVal2() {
      this.iptVal = this.iptVal2;
    }
  },
  components: { TextComplete }
};
</script>

<style scoped lang="less">
.top-navbar {
  height: 60px;
  padding: 10px;
  width: calc(100% - 20px);
  display: flex;
  display: -webkit-flex;
  align-items: center;
  justify-content: space-between;
  overflow: hidden;
  position: relative;
  background-color: rgb(255, 255, 255);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
}
.iconAndTitle {
  display: flex;
  display: -webkit-flex;
  align-items: center;
}
.patchyvideo-icon {
  height: 30px;
}
.patchyvideo-title {
  font-size: 25px;
  font-weight: 800;
  letter-spacing: -0.5px;
}
.nav_left {
  display: flex;
  display: -webkit-flex;
  flex-direction: row;
  justify-content: space-around;
}
.navItem {
  margin: 10px;
  font-size: 20px;
}
.navItem a {
  color: rgb(46, 46, 46);
}
.navItem a:hover {
  color: rgb(255, 166, 251);
}

.search-bar-query .el-select {
  width: 110px;
}

.loginUser {
  width: 50%;
  display: flex;
  display: -webkit-flex;
  align-items: center;
}
.userHome {
  display: flex;
  display: -webkit-flex;
  align-items: center;
}
.loginUser-userAvatar {
  margin: 5px;
}
.loginUser-login {
  margin: 5px;
  white-space: nowrap;
  text-overflow: ellipsis;
  font-size: 20px;
}
.loginUser-message {
  margin: 5px;
  white-space: nowrap;
  font-size: 20px;
}
.loginUser-signup {
  margin: 5px;
  white-space: nowrap;
  font-size: 20px;
}

.adviceList {
  /* 针对webkit内核（如Safari）进行的调整 */
  display: -webkit-flex;
  display: flex;
}
.highlighted .addr {
  color: #ddd;
}
.name {
  flex: 0 0 80%;
  font-size: 14px;
  line-height: 150%;
  white-space: normal;
  word-break: break-all;
  overflow: hidden;
  text-align: left;
}
.addr {
  flex: 0 0 20%;
  line-height: 150%;
  font-size: 12px;
  color: #b4b4b4;
  text-align: right;
}
/* 针对tag类别调整颜色 */
.Copyright {
  color: #a0a;
}
.Language {
  color: #585455;
}
.Character {
  color: #0a0;
}
.Author {
  color: #a00;
}
.General {
  color: #0073ff;
}
.Meta {
  color: #f80;
}
.Soundtrack {
  color: #ff7792;
}
</style>
