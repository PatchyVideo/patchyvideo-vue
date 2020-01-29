<!--    vue组件：TopNavbar.vue     -->
<!--
    组件：左侧的热门标签导航栏
    大小：100% * 70px
    功能：网站主导航栏
    必要传入参数：无
    文件依赖：jquery.textcomplete.js
    更新日志：
    12/1/2019: v1.0 
      release
    12/3/2019：v1.0.1
      1.修复了导航栏因为边框导致网站宽度大于浏览器宽度的问题
    12/7/2019: v1.0.2
      1.新增退出登录效果
    12/14/2019: v1.0.3
      1.导航条中文化完成
    12/30/2019: v1.0.4
      1.导航条登录功能完善
    12/31/2019：v1.0.5
      1.导航条注册链接完成
    1/9/2020：v1.0.6
      1.搜索框部分功能完成（搜索功能完成，还差正则表达式的匹配）
    1/21/2020：v1.0.5
      1.用户信息调取方式改为使用cookie储存
    1/27/2020：v1.0.6
      1.搜索框会自动填写搜索中的标签
      2.搜索框按下回车会直接搜索
    1/28/2020：v1.0.7
      1.搜索框的自动补全功能完成
    ★待解决问题：
      1.搜索框在自动补全的时候焦点总是在文本的最右边（改变selectionStart和selectionEnd属性不知道为什么不起作用）
      2.搜索框的css渲染待补全（搜索结果与关键字重合的地方加粗、加下划线等）
      2.用户个人界面未完善
      3.用户头像显示
-->

<template>
  <div class="top-navbar w" id="top-navbar">
    <!-- 左面的四个页面链接 -->
    <div class="nav_left">
      <ul>
        <li>
          <router-link to="/home" @click.native="cleanIptV">主页</router-link>
        </li>
        <li>
          <router-link to="/lists">播放列表</router-link>
        </li>
        <li>
          <router-link to="/postvideo">发布视频</router-link>
        </li>
        <li>
          <router-link to="/edittag">标签</router-link>
        </li>
      </ul>
    </div>

    <!-- 右面的功能性界面 -->
    <div class="nav_right">
      <ul>
        <!-- 下拉框和搜索框 -->
        <li id="s1">
          <!-- 谜之作用的下拉框（？） -->
          <select class="form_select">
            <option value="0">标签</option>
          </select>
          <!-- 搜索框 -->
          <div id="search-bar-query">
            <el-autocomplete
              id="ipt"
              ref="ipt"
              v-model="iptVal"
              :fetch-suggestions="querySearchAsync"
              :trigger-on-focus="false"
              popper-class="my-autocomplete"
              placeholder="请输入标签"
              @select="handleSelect"
              @keyup.enter.native="gotoHome"
            >
              <template slot-scope="{ item }">
                <el-row>
                  <el-col
                    :span="18"
                    v-bind:class="{Copyright:item.cat==2,
                                    Language:item.cat==5,
                                    Character:item.cat==1,
                                    Author:item.cat==3,
                                    General:item.cat==0,
                                    Meta:item.cat==4}"
                  >
                    <div class="name">{{ item.tag }}</div>
                  </el-col>
                  <el-col :span="6">
                    <div class="addr">{{ item.cnt }}</div>
                  </el-col>
                </el-row>
              </template>
            </el-autocomplete>
          </div>
          <input id="search-bar-submit" type="submit" value="搜索" @click="gotoHome" />
        </li>

        <!-- 登录和注册按钮 -->
        <div class="loginUser" v-show="!isLogin">
          <li>
            <router-link to="/login">登录</router-link>
          </li>
          <li>
            <router-link to="/signup">注册</router-link>
          </li>
        </div>

        <!-- 登录成功后的用户界面 -->
        <div class="userHome" v-show="isLogin">
          <li>
            <router-link to="/users/me">
              {{
              this.$store.state.username
              }}
            </router-link>
          </li>
          <li>
            <a @click="dialogVisible = true" style="cursor:pointer">登出</a>

            <!-- 退出登录的弹出框 -->
            <el-dialog
              title="提示"
              :visible.sync="dialogVisible"
              width="30%"
              :before-close="handleClose"
            >
              <p>你确定要退出登录吗?</p>
              <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="cleanLocalStorage">确 定</el-button>
              </span>
            </el-dialog>
          </li>
        </div>
      </ul>
    </div>
  </div>
</template>

<script>
import TextComplete from "v-textcomplete";
export default {
  data() {
    return {
      // 控制退出登录的弹出框
      dialogVisible: false,
      // 判断是否登录
      isLogin: false,
      // 搜索框的内容，不知道为什么在自动补全之后会被清空
      iptVal: "",
      // 搜索框的内容，在自动补全的时候作为备份使用，防止搜索框内容被清空
      // ps：iptVal2在计算属性里，所以请勿随便更改变量名
      iptVal3: "",
      // 进行搜索的时候关键字的开头位置(起始位置)
      startlocation: 0,
      // 进行搜索的时候光标的位置(终止位置)
      endlocation: 0,
      // 搜索框正则匹配规则,现已废弃
      strategies: [
        {
          id: "tags",
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
          search(term, callback) {
            $.getJSON(
              `https://patchyvideo.com/autocomplete/?q=${term}`,
              function(data) {
                data = $.map(data, function(ele) {
                  ele["term"] = term;
                  ele["color"] = getCategoryIdColor(ele["cat"]);
                  return ele;
                });
                var retdata = match_keywords(term).concat(data);
                callback(retdata);
              }
            );
          },
          template(value) {
            var term_start_pos = value.tag.indexOf(value.term);
            prefix = value.tag.substring(0, term_start_pos);
            suffix = value.tag.substring(term_start_pos + value.term.length);
            highlighted_term = `${prefix}<b><u>${value.term}</u></b>${suffix}`;
            if (value.cnt == -1) {
              return `<span style="color: ${value.color};"><span style="margin-right: 6em;">${highlighted_term}</span></span>`;
            }
            return `<span style="color: ${value.color};"><span style="margin-right: 6em;">${highlighted_term}</span></span><span style="float:right;">${value.cnt}</span>`;
          },
          replace(value) {
            return value.tag + " ";
          },
          index: 1
        }
      ]
    };
  },
  computed: {
    // 搜索的关键字
    iptVal2() {
      return this.$store.state.TopNavbarSearching;
    }
  },
  created() {
    // 查看是否登录
    if (
      JSON.stringify(this.$store.state.username) != "null" &&
      this.$store.state.username != ""
    ) {
      this.isLogin = true;
    }
    this.getCookie();
    this.iptVal = this.iptVal2;
  },
  mounted() {},
  updated() {},
  methods: {
    // 退出时清除所有数据
    cleanLocalStorage: function() {
      this.isLogin = false;
      // 清除所有session值(退出登录)
      sessionStorage.clear();
      // 清除用户名
      this.$store.commit("clearUserName");
      // 清除本地数据
      localStorage.setItem("username", "");
      // 清除cookie
      this.clearCookie();
      // 回到主界面
      if (this.$store.state.bgcMark != "home") {
        this.$router.push("/home");
      } else {
        location.reload();
      }
      this.dialogVisible = false;
    },
    // 控制退出登录的弹出框自带函数
    handleClose(done) {
      this.$confirm("确认关闭？")
        .then(_ => {
          done();
        })
        .catch(_ => {});
    },
    // 点击搜索按钮使home页面显示搜索结果
    gotoHome() {
      if (this.iptVal != "") {
        this.$router
          .push({ path: "/home", query: { keyword: this.iptVal } })
          .catch(err => {
            return err;
          });
      } else {
        this.$router.push({ path: "/home" });
      }
    },
    // 清除搜索结果
    cleanIptV() {
      this.$store.commit("getTopNavbarSearching", "");
    },
    //清除cookie
    clearCookie: function() {
      this.setCookie("", -1);
    },
    // 设置cookie
    // 储存变量为username
    setCookie(username, days) {
      var date = new Date(); //获取时间
      date.setTime(date.getTime() + 24 * 60 * 60 * 1000 * days); //保存的天数
      //字符串拼接cookie
      window.document.cookie =
        "username" + ":" + username + ";path=/;expires=" + date.toGMTString();
    },
    // 获取cookie
    getCookie: function() {
      if (document.cookie.length > 0) {
        var arr = document.cookie.split("; ");
        for (var i = 0; i < arr.length; i++) {
          var arr2 = arr[i].split(":");
          //判断查找相对应的值
          if (arr2[0] == "username") {
            if (arr2[1] != "") {
              this.isLogin = true;
              this.$store.commit("getUserName", arr2[1]);
              return true;
            }
          }
        }
      }
      this.$store.commit("getUserName", "");
      return false;
    },
    // --------------------------------------------------危险提示--------------------------------------------------
    //                                   此函数因为直接操纵dom可能导致网站受到攻击!
    // --------------------------------------------------危险提示--------------------------------------------------
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

      // 对输入框现在的数据进行备份
      this.iptVal3 = this.iptVal;
      this.startlocation = startlocation;
      this.endlocation = endlocation;

      var url = "https://patchyvideo.com/autocomplete/?q=" + query;
      this.axios({
        method: "get",
        url: url
      }).then(result => {
        this.taglist = result.data;
        cb(result.data);
      });
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
    handleSelect(item) {
      // 切割字符串，并在中间加入搜索到的标签拼接成新的输入框的内容
      var iptVal1 = this.iptVal3.slice(0, this.startlocation);
      var iptVal2 = this.iptVal3.slice(this.endlocation);
      var iptVal = iptVal1 + item.tag + " " + iptVal2;
      this.iptVal = iptVal;
      // 光标设置焦点事件
      var endlocation = $("#ipt").focus();
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

<style scoped>
@import "../static/css/common.css";

.top-navbar {
  margin: 0 auto;
  height: 70px;
  width: calc(100% - 20px);
  display: flex !important;
  align-items: center;
  overflow: hidden;
  position: relative;
  background-color: #fff;
  box-shadow: 0 2px 20px #a78c97;
}

.top-navbar li a {
  text-decoration: none;
  color: #761226;
  transition: all 0.4s ease;
}

.top-navbar a:hover {
  color: #ff88a0;
}

.nav_right li#s1 {
  width: 600px;
  height: 70px;
  line-height: 70px;
  position: relative;
  top: 0px;
  right: 50px;
}

.nav_left {
  width: 50%;
  text-align: left;
  padding-left: 20px;
}

.nav_right {
  width: 60%;
}

.nav_left li {
  height: 70px;
  line-height: 70px;
  display: inline-block;
  margin-left: 6%;
  text-align: center;
  font-size: 19px;
}

.nav_right li {
  height: 70px;
  line-height: 70px;
  float: left;
  margin-left: 2%;
  /* display: inline-block; */
  text-align: center;
  font-size: 19px;
}

.form_select {
  width: 120px;
  height: 20px;
  padding-left: 5px;
  text-rendering: auto;
  color: black;
  letter-spacing: normal;
  word-spacing: normal;
  display: inline-block;
  box-sizing: border-box;
  align-items: center;
  white-space: pre;
  background-color: white;
  cursor: pointer;
  outline: none;
  border-style: solid;
  border-color: white;
  position: relative;
  right: 74px;
  transition: all 0.6s ease;
}
.form_select:hover {
  outline: none;
  border-style: solid;
  border-color: #d1d1d1;
  box-shadow: 0px 0px 10px 5px white, 0px 0px 10px dodgerblue,
    0px 0px 20px dodgerblue;
  color: dodgerblue;
}
#search-bar-query {
  width: 220px;
  height: 50px;
  outline: none;
  border: none;
  position: absolute;
  right: 74px;
  top: 34%;
  transform: translateY(-50%);
  transition: all 0.6s ease;
}

#search-bar-submit {
  display: block;
  background: #c5464a;
  text-shadow: 0 0 10px #fff, 0 0 20px #fff, 0 0 30px #fff, 0 0 40px #c5464a,
    0 0 70px #c5464a, 0 0 80px #c5464a, 0 0 100px #c5464a, 0 0 150px #c5464a;
  width: 74px;
  color: white;
  height: 38px;
  outline: none;
  border: none;
  cursor: pointer;
  position: absolute;
  right: 0px;
  top: 50%;
  transform: translateY(-50%);
  transition: all 0.6s ease;
}

#search-bar-submit:hover {
  background-color: royalblue;
  text-shadow: 0 0 10px #fff, 0 0 20px #fff, 0 0 30px #fff, 0 0 40px #228dff,
    0 0 70px #228dff, 0 0 80px #228dff, 0 0 100px #228dff, 0 0 150px #228dff;
}

.my-autocomplete {
  li {
    line-height: normal;
    padding: 0px;
  }

  .highlighted .addr {
    color: #ddd;
  }
}
.name {
  text-overflow: ellipsis;
  overflow: hidden;
  text-align: left;
}
.addr {
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
</style>
