<!--
    更新日志：
    1/11/2020：v1.0
     新增保存功能 TAG校验功能，功能基本已完成
    1/27/2020：v1.0.1
      1.新增标签补全功能
    1/30/2020：v1.0.2
      1.新增在视频详情页面修改视频标签的功能
     使用方法：
     需要父组件绑定 1.msg属性 值为视频的Pid
                    2.visible.sync属性 值为布尔值，true打开，false关闭。默认false关闭.
    ★更改内容：
      1/28/2020：
        1.HTML:新的输入框
        2.CSS:#ipt和#add进行修改(原来的全部注释掉了),在最下方新增了css(从哪里开始已标记)
        3.JavaScript:第300行新增一句:this.iptVal = ""(加入标签成功之后输入框清空);
        新增方法handleSelect和querySearchAsync;新增变量taglist
      1/30/2020：
        1.JavaScript：saveTag方法修改，实现对于视频标签编辑的兼容;、
        新增方法：open5和open6
      2/8/2020：
        1.created添加代码（216~221行）
        2.新增方法：getCommonTags2

-->

<template>
  <transition mode="out-in">
    <div v-if="visible" class="EditTags" :class="{ active: msg != '' }">
      <el-dialog
        v-if="dialogVisible"
        :visible.sync="dialogVisible"
        width="30%"
        :destroy-on-close="true"
        :modal-append-to-body="false"
        :before-close="handleClose"
      >
        <span style="font-size: 19px; color: #5e6d82;">{{ $t("issave") }}</span>
        <p></p>
        <span slot="footer" class="dialog-footer">
          <el-button @click="closeTagPanel(true)">{{ $t("cancel") }}</el-button>
          <el-button type="primary" @click="saveTag()">{{ $t("save") }}</el-button>
        </span>
      </el-dialog>
      <div id="tag">
        <a
          href="javascript:;"
          @click="
            dialogVisible = true;
            closeTagPanel(JSON.stringify(tagsOrigin) === JSON.stringify(tags));
          "
        >
          <i v-if="this.$route.path != '/postvideo'" id="close" class="el-icon-close"></i>
        </a>
        <div class="minibox">
          <div class="m_bg"></div>
          <div class="m_a activeTag">
            <ul v-for="v in tagCategoriesAll" :key="v" class="Taglist" :class="v">
              <span v-for="(i, item) in TagCategoriesData" :key="item">
                <div v-if="i === v" class="item" :class="{ selected: -1 === tagsForRec.indexOf(item) }" @click.stop="selected(i, item)">
                  <div>
                    <p :class="`val_` + item">{{ item }}</p>
                    <a href="javascript:;" @click.stop="deleteObj(i, item)">
                      <i class="el-icon-close"></i>
                    </a>
                  </div>
                </div>
              </span>
            </ul>
          </div>

          <div class="m_b">
            <div id="m_b_box">
              <!-- <input
                id="ipt"
                v-model="iptVal"
                @focus="infoTipEvent(true)"
                @blur="infoTipEvent(false)"
              />-->
              <!-- 新输入框，带有自动补全功能 -->
              <div id="ipt">
                <!--<el-autocomplete
                  v-model="iptVal"
                  :fetch-suggestions="querySearchAsync"
                  :trigger-on-focus="false"
                  popper-class="my-autocomplete"
                  :placeholder="$t('enter_tag')"
                  @select="handleSelect"
                  @focus="infoTipEvent(true)"
                  @blur="infoTipEvent(false)"
                  @keyup.enter.native="addTag"
                >
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
                      >{{ item.tag }}</div>
                      <div class="addr">{{ item.cnt }}</div>
                    </div>
                  </template>
                </el-autocomplete>-->
                <el-autocomplete
                  v-model="iptVal"
                  :fetch-suggestions="querySearchAsync2"
                  :trigger-on-focus="false"
                  popper-class="my-autocomplete"
                  :placeholder="$t('enter_tag')"
                  @select="handleSelect2"
                  @focus="infoTipEvent(true)"
                  @blur="infoTipEvent(false)"
                  @keyup.enter.native="addTag"
                >
                  <template slot-scope="{ item }">
                    <div class="adviceList">
                      <div
                        class="name"
                        :class="{
                          Copyright: item.cat == 2,
                          Language: item.cat == 5,
                          Character: item.cat == 1,
                          Author: item.cat == 3,
                          General: item.cat == 0,
                          Meta: item.cat == 4,
                          Soundtrack: item.cat == 6,
                        }"
                        v-html="item.tag || ConvertLangRes(item.langs)"
                      ></div>
                      <div class="addr">{{ item.cnt }}</div>
                    </div>
                  </template>
                </el-autocomplete>
                <a href="javascript:;" @click="addTag">
                  <i id="add" class="el-icon-plus"></i>
                </a>
              </div>
            </div>
            <span class="tag_title infoTip_1" :class="{ hidden: infoTip[0].isHidden }">{{ $t("edit_common_tags") }}</span>
            <span class="tag_title infoTip_2" :class="{ show: infoTip[1].isHidden }">{{ $t("tag_already_exist") }}</span>
            <span class="tag_title infoTip_3" :class="{ show: infoTip[2].isHidden }">{{ $t("tag_not_exist") }}</span>
          </div>
          <div class="m_c">
            <div>
              <span>{{ $t("recommnad_tags") }}</span>
              <transition mode="out-in">
                <ul v-show="recTagsWatch" class="recTag Taglist">
                  <li v-for="(i, item) in recTags" :key="item" class="item">
                    <a href="javascript:;" @click="getiptVal(i, item)">
                      <p class="val_${str[i]}">{{ Object.keys(i)[0] }}</p>
                      <!--           <i class="el-icon-close"></i>-->
                    </a>
                  </li>
                </ul>
              </transition>
            </div>
          </div>
        </div>
        <a href="javascript:;">
          <a v-if="this.$route.path != '/postvideo'" id="save" style="font-size: 28px;" @click="saveTag()">{{ $t("save") }}</a>
        </a>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  components: {},
  props: {
    msg: {
      type: String,
      default: "",
    },
    really: {
      type: Boolean,
      default: false,
    },
    visible: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    this.$i18n.locale = localStorage.getItem("lang");
    return {
      dialogVisible: false,
      tags: [],
      tagsOrigin: [],
      tagsForRec: [],
      tagCategoriesAll: [],
      TagCategoriesData: {},
      recTags: [],
      iptVal: "",
      pid: "",
      infoTip: [
        { name: "infoTip_1", isHidden: false },
        { name: "infoTip_2", isHidden: false },
        { name: "infoTip_3", isHidden: false },
      ],
      recTagsWatch: true,
      firstFlag: true,
      msgMark: false,
      animeMark: 0,
      isInfoTipClick: false,
      infoTipMark: false,
      // 自动补全标签的内容
      taglist: [],
      onkeydownhandler: null,
    };
  },
  watch: {
    tags(n) {
      this.$emit("getEditTagsData", n);
    },
    tagsForRec(newVal, oldVal) {
      if (JSON.stringify(oldVal) != "[]" || this.animeMark != 0) {
        this.recTagsWatch = false;
        this.getRecTags(newVal);
        // let _that = this;
        // setTimeout(function() {
        //   _that.recTagsWatch = !_that.recTagsWatch;
        //   _that.getRecTags(newVal);
        // }, 300);
      }
    },
    msg() {
      if (this.msg != "") {
        this.getCommonTags();
      }
    },
    really(v) {
      if (v === true) {
        // this.$emit("getEditTagsData", this.tags);
      }
    },
  },
  created() {
    let that = this;
    // 当前页面监视键盘输入
    this.onkeydownhandler = function(e) {
      // 事件对象兼容
      let e1 = e || event || window.event || arguments.callee.caller.arguments[0];
      // 键盘按键判断: 左箭头 -37; 上箭头 -38; 右箭头 -39; 下箭头 -40
      // 左
      if (e1 && e1.keyCode == 27) {
        if (that.$route.path === "/video" || that.$route.path === "/listdetail") {
          that.closeTagPanel(true);
        }
      }
    };
    window.addEventListener("keydown", this.onkeydownhandler);
    if (this.msg != "") {
      this.getCommonTags(); // 防止组件更新时没有调用
    }
    // 判断是否为从播放列表添加的视频，如果是则获取标签
    if (this.$route.path === "/postvideo") {
      if (this.$route.query.pid) {
        this.getCommonTags2();
      } else {
        this.getRecTags("");
      }
    }
    this.axios({
      method: "post",
      url: "be/tags/query_categories.do",
      data: {},
    }).then((result) => {
      let categories = result.data.data.categories;
      for (let i = 0; i < categories.length; i++) {
        this.tagCategoriesAll.push(categories[i].name);
      }
    });
  },
  mounted() {},
  updated() {
    let _that = this;
    let infoTipObj = document.getElementsByClassName("el-autocomplete-suggestion");
    for (let i = 0; i < infoTipObj.length; ++i) {
      infoTipObj[i].onclick = function() {
        _that.isInfoTipClick = true;
      };
    }
  },
  beforeDestroy() {
    window.removeEventListener("keydown", this.onkeydownhandler);
  },
  methods: {
    // watchAutoComplete(){
    //   let m  =  Array.from(document.getElementsByClassName("el-autocomplete-suggestion el-popper my-autocomplete"));
    //   let  m_Mark =[];
    //   for(let i =0;i<m.length;++i){
    //     m_Mark[i] = m[i].style.display;
    //   }
    //   this.infoTipMark =m_Mark;
    //   /!* console.log(m_Mark); *!/
    // },
    handleClose(done) {
      done();
    },
    open1() {
      this.$message("这是一条消息提示");
    },
    open2() {
      this.$message({
        message: this.$t("tag_add_succeed"),
        type: "success",
      });
    },

    open3() {
      this.$message({
        message: this.$t("tag_already_exist"),
        type: "warning",
      });
    },

    open4() {
      this.$message.error(this.$t("tag_not_exist"));
    },
    open5() {
      this.$message({
        message: this.$t("tag_modify_succeed"),
        type: "success",
      });
    },
    open6() {
      this.$message({
        message: this.$t("unknown_error"),
        type: "error",
      });
    },
    getCommonTags() {
      if (this.msg === "") {
        return;
      }
      if (this.$route.path === "/listdetail") {
        this.axios({
          method: "post",
          url: "be/list/getcommontags.do",
          data: { pid: this.msg, lang: localStorage.getItem("lang") },
        })
          .then((res) => {
            this.tags = res.data.data; // 原始数据
            this.tagsForRec = JSON.parse(JSON.stringify(this.tags)); // 深拷贝，推荐 Tag 数据用
            this.tagsOrigin = JSON.parse(JSON.stringify(this.tags)); // 得到原始 Tag 数据
            this.getTagCategories(this.tags); // 范围转换后展示原始数据
            this.getRecTags(this.tags); // 获取推荐 TAG
          })
          .catch(() => {});
      }
      if (this.$route.path === "/video" || this.$route.path === "/postvideo") {
        this.axios({
          method: "post",
          url: "be/videos/gettags.do",
          data: { video_id: this.msg, lang: localStorage.getItem("lang") },
        })
          .then((res) => {
            this.tags = res.data.data; // 原始数据
            this.tagsForRec = JSON.parse(JSON.stringify(this.tags)); // 深拷贝，推荐 Tag 数据用
            this.tagsOrigin = JSON.parse(JSON.stringify(this.tags)); // 得到原始 Tag 数据
            this.getTagCategories(this.tags); // 范围转换后展示原始数据
            this.getRecTags(this.tags); // 获取推荐 TAG
          })
          .catch(() => {});
      }
    },
    // 从视频列表里添加视频的时候添加视频列表的共有标签
    getCommonTags2() {
      this.axios({
        method: "post",
        url: "be/list/getcommontags.do",
        data: { pid: this.$route.query.pid, lang: localStorage.getItem("lang") },
      })
        .then((res) => {
          this.tags = res.data.data; // 原始数据
          this.tagsForRec = JSON.parse(JSON.stringify(this.tags)); // 深拷贝，推荐 Tag 数据用
          this.tagsOrigin = JSON.parse(JSON.stringify(this.tags)); // 得到原始 Tag 数据
          this.getTagCategories(this.tags); // 范围转换后展示原始数据
          this.getRecTags(this.tags); // 获取推荐 TAG
        })
        .catch(() => {});
    },
    getTagCategories(str) {
      this.axios({
        method: "post",
        url: "be/tags/query_tag_categories.do ",
        data: { tags: str },
      })
        .then((res) => {
          this.TagCategoriesData = res.data.data.categorie_map;
          // if(this.$route.path === "/postvideo"){
          //   this.animeMark =0;
          // }
          if (this.firstFlag === true) {
            this.animeMark = 0;
            this.firstFlag = false;
          }
          if (this.msgMark === true) {
            // msgMark 为 True 证明是添加 TAG
            this.open2();
          }
          this.msgMark = false;
        })
        .catch(() => {});
    },
    getTagCategoriesForAdd(str) {
      let strToArray = str.split();
      this.axios({
        method: "post",
        url: "be/tags/query_tag_categories.do ",
        data: { tags: strToArray },
      })
        .then((res) => {
          if (JSON.stringify(res.data.data.categorie_map) == "{}") {
            this.open4();
          } else if (this.tags.indexOf(this.iptVal) != -1) {
            // 存在则不允许添加
            // this.infoTip[1].isHidden=true;
            this.iptVal = "";
            this.open3();
            // setTimeout(function() {
            //   _that.infoTip[1].isHidden = false;
            // }, 2000);
          } else if (this.tags.indexOf(this.iptVal) === -1 && this.iptVal) {
            // 不存在则添加
            this.tags.push(this.iptVal);
            // 如果所有的标签都没有被选中，那下次一添加的标签被选中
            if (this.tagsForRec.length == 0) {
              this.tagsForRec.push(this.iptVal);
            }
            // 默认添加的所有标签都被选中
            // this.tagsForRec.push(this.iptVal);
            // 默认添加的所有标签不被选中
            this.msgMark = true;
            this.getTagCategories(this.tags);
            this.iptVal = "";
            // this.$emit("getEditTagsData", this.tags);
          }
          this.getRecTags(this.tagsForRec);
        })
        .catch(() => {});
    },
    getRecTags(tags) {
      this.axios({
        method: "post",
        url: "be/tags/get_related_tags.do",
        data: {
          tags: tags,
          exclude: this.tags,
          lang: localStorage.getItem("lang"),
        },
      })
        .then((res) => {
          this.recTags = res.data.data.tags;
          this.recTagsWatch = true;
          // if (this.animeMark != 0) {
          //   this.recTagsWatch = !this.recTagsWatch;
          // }
          this.animeMark++;
        })
        .catch(() => {});
    },
    deleteObj(i, item) {
      this.$delete(this.TagCategoriesData, item);
      this.tags.forEach(function(value, index, array) {
        if (value == item) {
          array.splice(index, 1);
          return;
        }
      });

      this.tagsForRec.forEach(function(value, index, array) {
        if (value == item) {
          array.splice(index, 1);
          return;
        }
      });
    },
    selected(i, item) {
      // 选中取消高亮后渲染剩余的对应推荐 TAG
      if (this.tagsForRec.indexOf(item) != -1) {
        this.tagsForRec.splice(this.tagsForRec.indexOf(item), 1);
        return;
      }
      if (this.tagsForRec.indexOf(item) === -1) {
        this.tagsForRec.push(item);
        return;
      }
    },
    getiptVal(i) {
      this.iptVal = Object.keys(i)[0];

      this.getTagCategoriesForAdd(this.iptVal);
    },
    addTag() {
      // console.log("添加Tag之前的值——————是否鼠标点中:"+this.isInfoTipClick+"---是否键盘选中:"+this.infoTipMark);
      // if(this.isInfoTipClick ===true){ // 是否鼠标点中了
      //   if (this.infoTipMark === true) { // 是否属于键盘回车添加的Tag
      //     this.infoTipMark = false;
      //     this.isInfoTipClick = false;
      //     return;
      //   }
      // }
      if (this.isInfoTipClick === true) {
        // 是否属于鼠标点击选中的 Tag
      } else {
        if (this.infoTipMark === true) {
          // 是否属于键盘回车选中的 Tag
          this.infoTipMark = false;
          this.isInfoTipClick = false;
          return;
        }
      }
      this.infoTip[0].isHidden = true;
      this.getTagCategoriesForAdd(this.iptVal);
      this.isInfoTipClick = false;

      // this.watchAutoComplete();
      // {
      //   let count = 0;
      //   for(let i=0;i<this.infoTipMark.length;++i){
      //     if( this.infoTipMark[i].toString()=="none"){
      //       count++
      //     }
      //   }
      //   if(count!=this.infoTipMark.length){
      //     return;
      //   }
      // }
      // 方案二,所有操作都在函数的成功和失败回调中进行，代码冗余
      // this.infoTip[0].isHidden = true;
      // this.getTagCategoriesForAdd(this.iptVal);
      // 方案一已废弃，
      // console.time("start");
      // console.log("开始计算时间");
      // this.infoTip[0].isHidden = true; // 第一轮 Event Loop 同步任务立即执行
      // this.getTagCategories(this.iptVal); // 进入函数发现有 promise 函数初始化后排微任务
      // let _that = this;
      // setTimeout(
      //   function() // 异步宏任务 ,先挂起,将代码移出本次执行,放入任务队列,等到下一轮Event Loop
      //   {
      //     console.log("开始执行定时器");
      //     if (_that.islegalIptVal == "BAD") {
      //       console.log("添加的TAG必须在现有的数据库中存在");
      //       return;
      //     }
      //     if (_that.tags.indexOf(_that.iptVal) === -1) {
      //       // Tag是否合法未作检测，无接口
      //       _that.tags.push(_that.iptVal);
      //       _that.getTagCategories(_that.tags);
      //       return;
      //     }
      //     if (_that.tags.indexOf(_that.iptVal) != -1) {
      //       console.log("true");
      //       _that.infoTip[1].isHidden = true;
      //       setTimeout(function() {
      //         _that.infoTip[1].isHidden = false;
      //       }, 2000);
      //       return;
      //     }
      //   },
      //   600
      // );
      // console.log("end"); // 同步任务立即执行，执行完后开始执行 this.getTagCategories() 函数中微任务
      // 第一轮 Event Loop 结束 开始第二轮执行 setTimeout
    },
    saveTag() {
      if (/*this.msg===""*/ this.$route.path === "/postvideo") {
        // 如果没有 pid,则处在提交视频界面，返回给父组件 tags
        this.$emit("getEditTagsData", this.tags);
        // this.closeTagPanel();
      }
      // 如果有 pid 按照正常路线走
      // 提交视频的标签
      else if (this.$route.path === "/video") {
        this.axios({
          method: "post",
          url: "be/videos/edittags.do",
          data: { video_id: this.msg, tags: this.tags },
        }).then(() => {
          this.open5();
          this.closeTagPanel(true);
        });
      }
      // 提交视频列表的标签
      else {
        this.axios({
          method: "post",
          url: "be/list/setcommontags.do",
          data: { pid: this.msg, tags: this.tags },
        }).then(() => {
          this.open5();
          this.closeTagPanel(true);
        });
      }
    },
    closeTagPanel(b) {
      if (b === true) {
        this.$emit("update:visible", false);
      }
    },
    infoTipEvent(event) {
      // this.isInfoTipClick = true;
      // 添加 TAG 行为消息提示
      if (event == true) {
        this.infoTip[0].isHidden = true;
        return;
      }
      if (event == false) {
        this.infoTip[0].isHidden = false;
        return;
      }
    },
    ConvertLangRes(langs, hastran = true) {
      if (!langs) return;
      let LangList = [
        { id: 1, lang: "CHS" },
        { id: 2, lang: "CHT" },
        { id: 5, lang: "ENG" },
        { id: 10, lang: "JPN" },
      ];
      let level = [10, 5, 1, 2];
      let Lang = "";
      let mainLang = "";
      let subLang = "";
      // 经过一系列计算得出主副语言

      // 匹配当前语言的 ID
      let CurrLangID = LangList.find((x) => {
        return x.lang == this.$i18n.locale;
      });
      CurrLangID = CurrLangID ? CurrLangID.id : 1;

      //匹配对应 ID 的内容
      let CurrLangWord = langs.find((x) => {
        return x.l == CurrLangID;
      });
      if (!CurrLangWord) {
        for (let i = 0; i < level.length; i++) {
          CurrLangWord = langs.find((x) => {
            return x.l == level[i];
          });
          if (CurrLangWord) break;
        }
      }
      mainLang = CurrLangWord.w;

      if (hastran) {
        // 副语言匹配
        // 优先级：日语，英语，简体中文，繁体中文
        let SubLangWord = null;
        for (let i = 0; i < level.length; i++) {
          if (level[i] == CurrLangWord.l) continue;
          SubLangWord = langs.find((x) => {
            return x.l == level[i];
          });
          if (SubLangWord) break;
        }
        subLang = SubLangWord ? SubLangWord.w : mainLang;

        // 合成语言
        Lang = `${mainLang.replace(/_/g, " ")}`;
        Lang += `<span style='font-size:8px;color: gray;display: block;'>${subLang.replace(/_/g, " ")}</span>`;
      } else {
        Lang = mainLang;
      }
      return Lang;
    },
    // 下面是消息补全框的方法
    querySearchAsync(queryString, cb) {
      // this.infoTipMark = true;
      let url = "/autocomplete/?q=" + queryString;
      this.axios({
        method: "get",
        url: url,
      }).then((result) => {
        this.taglist = result.data;
        cb(result.data);
      });
    },
    querySearchAsync2(queryString, cb) {
      // this.infoTipMark = true;
      let url = "/be/autocomplete/ql?q=" + queryString;
      this.axios({
        method: "get",
        url: url,
      }).then((result) => {
        this.taglist = result.data;
        cb(result.data);
      });
    },
    handleSelect(item) {
      this.iptVal = item.tag;
      this.infoTipMark = true;
      // console.log("选中时的值为" + this.infoTipMark);
      // console.log("选中");
    },
    handleSelect2(item) {
      this.iptVal = this.ConvertLangRes(item.langs, false);
      this.infoTipMark = true;
      // console.log("选中时的值为" + this.infoTipMark);
      // console.log("选中");
    },
    // 消息提示
  },
};
</script>

<style lang="less" scoped>
.v-enter,
.v-leave-to {
  opacity: 0;
}

.v-enter-active,
.v-leave-active {
  transition: all 0.8s ease;
}

* {
  font-family: "Microsoft YaHei", "Lantinghei SC", "Open Sans", Arial, "Hiragino Sans GB", "STHeiti", "WenQuanYi Micro Hei", "SimSun", sans-serif;
}

i {
  font-size: 19px;
  &:hover {
    color: #1b9af7;
  }
}
div {
  transition: all 0.6s ease;
}
.active {
  position: relative;
  z-index: 100;
}
/*.EditTags {
  position: relative;
  z-index: 100;
}*/
.hidden {
  display: none !important;
}
.show {
  display: block !important;
}
.closed {
  display: none;
}
.selected {
  background-color: rgba(200, 200, 200, 0.5) !important;
}
div {
  #tag {
    /* width: 1200px;
    height: 923px;*/
    width: 1100px;
    height: 720px;
    /* background: url("/static/img/test3.png") no-repeat center;*/
    background-color: #fff;
    background-size: 70% 105%;
    text-align: center;
    box-shadow: 0 5px 15px -5px rgba(0, 0, 0, 0.5);
    display: block;
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    /* 	另一张背景图，可以试试
                    background:url("./static/img/test1.jpg") no-repeat  right;
                        background-size: 83% 108%;

                        */
    /*  padding: 50px;*/

    #close {
      position: absolute;
      font-size: 36px;
      right: 5px;
      transform: translateX(-50%);
      top: 5px;
      color: #265778;
      z-index: 999;
      &:hover {
        color: #1b9af7;
      }
    }
    .minibox {
      display: block;
      height: 100%;
      display: flex;
      margin-top: 0px;
      flex-direction: column;
      // .m_bg {}
      .m_a {
        transition: all 0.6s ease;
        background-color: rgba(215, 176, 184, 0.2);
        flex: 1;
        max-height: 50%;
        overflow: auto;
        padding-top: 35px;

        box-sizing: border-box;
        ul {
          .item {
            background-color: #fff;
            display: inline-block;
            zoom: 1;
            height: 20px;
            padding: 12px;
            margin-bottom: 10px;
            margin-left: 10px;
            text-align: center;
            vertical-align: middle;
            cursor: pointer;
            list-style: none;
            border-radius: 20px;
            box-shadow: 0 5px 15px -5px rgba(0, 0, 0, 0.5);
            p {
              display: inline;
              margin-right: 4px;
            }
          }
        }

        .Copyright {
          li {
            p {
              color: #a0a;
            }
          }
        }
        .Language {
          li {
            p {
              color: #585455;
            }
          }
        }
        .Character {
          li {
            p {
              color: #0a0;
            }
          }
        }
        .Author {
          li {
            p {
              color: #a00;
            }
          }
        }
        .General {
          li {
            p {
              color: #0073ff;
            }
          }
        }
        .Meta {
          li {
            p {
              color: #f80;
            }
          }
        }
        .Soundtrack {
          li {
            p {
              color: #ff7792;
            }
          }
        }
      }
      .m_b {
        transition: all 0.6s ease;
        background-color: rgba(215, 176, 184, 0.2);
        box-sizing: border-box;
        flex: 0.5;
        max-height: 12%;
        perspective: 2000px;
        position: relative;

        #m_b_box {
          height: 100%;
          /*              perspective: 500px; */
          box-sizing: border-box;
          #ipt {
            outline: none;
            border: none;
            position: absolute;
            left: 50%;
            top: 30%;
            transform: translate(-50%, -50%);
            transition: all 0.6s ease;

            // width: 30%;
            // height: 30%;
            // outline: none;
            // background: white;
            // border: none;
            // padding-left: 8px;
            /*box-shadow: 0 0 10px #fff !important;*/
            // box-shadow: 0 5px 15px -5px rgba(0, 0, 0, 0.5);
            // transform: translateY(50%) rotateX(0deg) !important;
            // transform-origin: left top !important;
          }
          #add {
            display: inline-block;
            background: rgba(255, 255, 255, 0.9);
            border: 1px solid #dcdfe6;
            border-left: none;
            color: black;
            font-size: 36px;
            transition: all 0.3s ease;
            margin: 0;
            padding: 0;
            transform: translateY(24%);

            // transition: all 0.3s ease;
            // transform: translateY(60%);
            // margin: 0;
            // padding: 0;
            // vertical-align: center;
            // color: white;
            &:hover {
              background: rgba(0, 0, 0, 0.6);
              color: white;
            }
          }
        }
        .tag_title {
          //三个
          position: absolute;
          bottom: 0;
          left: 50%;
          transform: translate(-50%, -50%);
          color: white;
          text-shadow: 0 0 10px #fff, 0 0 40px #ff7777, 0 0 70px #ff7777, 0 0 80px #ff7777;
          transition: all 0.5s ease;
        }
        .infoTip_1 {
          //编辑标签
          color: white;
          /*   text-shadow: 0 0 10px #fff, 0 0 40px #ff7777, -1px 0 #ff7777,
            -1px 1px #ff7777;*/
          text-shadow: 0 0 10px #fff, 0 0 40px #ff7777, 0 0 70px #ff7777, 0 0 80px #ff7777;

          display: block;
        }
        .infoTip_2 {
          //标签已存在
          display: none;
        }
        .infoTip_3 {
          //标签不存在
          display: none;
        }
      }
      .m_c {
        transition: all 0.6s ease;
        box-sizing: border-box;
        flex: 1;
        max-height: 40%;
        overflow: auto;
        &:hover {
          background-color: rgba(50, 50, 50, 0.4);
        }
        div {
          transition: all 0.6s ease;
          span {
            //推荐标签
            margin: 20px 0px;
            color: #404d5b;
            display: inline-block;
            line-height: 25px;
            font-weight: 800;
            font-size: 25px;
            transition: all 0.1s ease;
          }
          .recTag {
            max-height: 160px;
            overflow: auto;
            li {
              background-color: #fff;
              display: inline-block;
              zoom: 1;
              height: 20px;
              padding: 12px;
              margin-bottom: 10px;
              margin-left: 10px;
              text-align: center;
              vertical-align: middle;
              cursor: pointer;
              list-style: none;
              border-radius: 20px;
              box-shadow: 0 5px 15px -5px rgba(0, 0, 0, 0.5);
              p {
                display: inline;
                margin-right: 4px;
              }
            }
          }
        }
      }
    }
    #save {
      position: absolute;
      bottom: 22px;
      left: 50%;
      font-size: 40px;
      transform: translateX(-50%);
      transition: all 0.3s ease;
      color: #265778;
      margin-top: 20px;
      &:hover {
        color: skyblue;
      }
    }
  }
}

// 新增的css
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
