<!--    vue组件：LeftNavbar.vue     -->
<!--
    组件：左侧的标签导航栏
    大小：15%（最小150px） * 100%
    功能：home页面下对标签进行导航
    包含组件：EditTags.vue
    必要传入参数：
      1.标题的名称(从vuex的"leftNavBarTitle"参数里获取)
      2.（Home页面下）从https://www.patchyvideo.com/listvideo.do请求来的数据的data.data.tags
      3.（Detail页面下）从https://www.patchyvideo.com/getvideo.do请求来的数据的data.data.tag_by_category
    更新日志：
    12/1/2019: v1.0 
      release
    12/23/2019: v1.0.1
      1.实现了动态调整标题的功能
    12/30/2019：v1.0.2
      1.实现了根据tag类型自动渲染tag颜色的功能
      2.实现了将Home页面渲染的导航栏和Detail页面渲染的导航栏分开的功能
    1/8/2020：v1.0.3
      1.实现了点击标签进行搜索的功能
      2.删掉了一些冗余的代码和变量
    1/30/2020：v1.0.4
      1.实现了在视频详情页面编辑标签，使用标签发布视频的功能
    2/1/2020：v1.0.5
      1.获取登录信息的时机调整
    2/4/2020：v1.0.6
      1.侧导航栏的标题在搜索界面会变成“相关标签”
    ★待解决问题：
      暂无
-->

<template>
  <div class="left-navbar">
    <!-- EditTags组件 -->
    <EditTags v-if="showTagPanel" ref="editTag" :msg="pid" :visible.sync="showTagPanel" class="EditTags"></EditTags>

    <!-- 作者详情组件 -->
    <el-dialog :close-on-click-modal="false" :visible.sync="showAuthorData" width="70%">
      <ShowAuthorData ref="AuthorData" :author-i-d="AuthorID"></ShowAuthorData>
    </el-dialog>

    <!-- 显示标签组件的对话框 -->
    <el-dialog :title="$t('tag_history.prompt')" :visible.sync="dialogVisible" width="70%">
      <div v-loading="loading2">
        <el-collapse>
          <el-collapse-item v-for="(item, index) in tagLog" :key="index" :title="tagLogDate(item.time.$date)">
            <div>
              <div v-if="item.add.length">
                <span style="margin-right: 10px; margin-top: 3px; color: #67c23a;">{{ $t("tag_history.add") }}</span>
                <el-tag v-for="tag in item.add" :key="tag" type="success" style="margin-right: 5px; margin-top: 3px;">{{ tag }}</el-tag>
                <br />
              </div>

              <div v-if="item.del.length">
                <span style="margin-right: 10px; margin-top: 3px; color: #f56c6c;">{{ $t("tag_history.del") }}</span>
                <el-tag v-for="tag in item.del" :key="tag" type="danger" style="margin-right: 5px; margin-top: 3px;">{{ tag }}</el-tag>
                <br />
              </div>
              <div v-if="item.user_obj.length" style="margin-top: 5px;">
                <span v-for="user in item.user_obj" :key="user.profile.username" class="editer">
                  <el-avatar fit="cover" class="loginUser-userAvatar" :size="20" :src="'be/images/userphotos/' + user.profile.image"></el-avatar>
                  <router-link :to="'/users/' + user._id.$oid">{{ user.profile.username }}</router-link>
                </span>
              </div>
              <span v-if="item.del.length == 0 && item.add.length == 0">{{ $t("tag_history.empty") }}</span>
            </div>
          </el-collapse-item>
        </el-collapse>
      </div>
    </el-dialog>

    <!-- 导航栏正文 -->
    <div class="left_list">
      <!-- 导航栏标题 -->
      <div class="titleTag">
        <h1>{{ title }}</h1>
        <div class="editTagButton">
          <el-button v-if="$route.path === '/video' && isLogin == true" size="mini" :disabled="showTagPanel" @click="openEditTags">{{
            $t("tag.edit")
          }}</el-button>
        </div>
        <p v-if="$route.path === '/video' && isLogin == true" @click="postVideo">
          {{ $t("tag.video_action") }}
        </p>
        <p v-if="$route.path === '/video'" @click="show_tag_log">
          {{ $t("tag.prompt_action") }}
        </p>
      </div>

      <!-- 在Home页面渲染的侧导航条内容 -->
      <ul v-if="$route.path === '/home' && name === 'main'" class="tag-ul">
        <li v-for="(val, key) in msg" :key="key" class="tag">
          <el-tooltip :disabled="overflowed.indexOf(key) == -1" effect="light" :content="key.replace(/_/g, ' ')" placement="left">
            <div class="tag belong-to-home">
              <div class="tag-div">
                <!-- 存在标签颜色 -->
                <div v-if="colorTagList.indexOf(val) != -1">
                  <p :ref="val" :class="val" @click="gotoHome(key)" @click.middle="gotoHome(key, true)">
                    {{ key.replace(/_/g, " ") }}
                  </p>
                </div>
                <!-- 其他情况 -->
                <div v-else>
                  <p @click="gotoHome(key)" @click.middle="gotoHome(key, true)">
                    {{ key.replace(/_/g, " ") }}
                  </p>
                </div>
              </div>
            </div>
          </el-tooltip>
        </li>
      </ul>
      <ul v-if="$route.path === '/home' && name === 'sub'" class="tag-ul">
        <li v-for="(val, key) in msg" :key="key" class="tag belong-to-home">
          <div class="tag-div">
            <!-- <router-link :to="'href=+/search?query='+i">{{i}}</router-link> -->
            <!-- 根据tag名称自动渲染tag颜色 -->
            <!-- 存在标签颜色 -->
            <div v-if="colorTagList.indexOf(val) != -1">
              <p :class="val" @click="gotoHome(val)" @click.middle="gotoHome(val, true)">
                {{ val }}
              </p>
            </div>
            <!-- 其他情况 -->
            <div v-else>
              <p @click="gotoHome(val)" @click.middle="gotoHome(val, true)">
                {{ val }}
              </p>
            </div>
          </div>
        </li>
      </ul>
      <!-- 在Detail页面渲染的侧导航条内容 -->
      <ul v-if="$route.path === '/video'">
        <li v-for="(key, val) in msg" :key="val" class="belong-to-detail">
          <h3 style="display: block;">{{ tranTagCategories(val) }}</h3>
          <!-- 根据tag名称自动渲染tag颜色 -->
          <div class="tag-ul">
            <div v-for="item in key" :key="item" :class="val != 'Author' && 'tag'">
              <el-tooltip :disabled="overflowed.indexOf(item) == -1" effect="light" :content="item.replace(/_/g, ' ')" placement="left">
                <!-- 存在标签颜色 -->
                <div v-if="colorTagList.indexOf(val) != -1 && val != 'Author'">
                  <div class="tag-div">
                    <p :ref="val" :class="val">
                      <span @click.left="gotoHome(item)" @click.middle="gotoHome(item, true)">{{ item.replace(/_/g, " ") }}</span>
                    </p>
                  </div>
                  <div v-if="isLogin && subTags" style="display: inline; overflow:hidden;">
                    <el-button v-show="subTags.indexOf(item) == -1" size="mini" style="margin-left: 5px; display: inline;" @click="subscribeToTag(item)">{{
                      $t("tag.subscribe")
                    }}</el-button>
                    <el-button v-show="subTags.indexOf(item) != -1" size="mini" class="sub-btn" @click="unsubscribeToTag(item)">
                      <span class="subed">{{ $t("tag.subscribed") }}</span>
                      <span class="unsub">{{ $t("tag.unsubscribe") }}</span>
                    </el-button>
                  </div>
                </div>
                <div v-else-if="val == 'Author'">
                  <p :ref="val" :class="val" style="display: inline;">
                    <span @click.left="gotoHome(item)" @click.middle="gotoHome(item, true)">{{ item.replace(/_/g, " ") }}</span>
                  </p>
                  <el-button v-if="val == 'Author'" size="mini" style="margin-left: 5px; display: inline;" @click="openAuthorData(item)">{{
                    $t("tag.author_detail")
                  }}</el-button>
                  <div v-if="isLogin && subTags" style="display: inline; overflow:hidden;">
                    <el-button v-show="subTags.indexOf(item) == -1" size="mini" style="margin-left: 5px; display: inline;" @click="subscribeToTag(item)">{{
                      $t("tag.subscribe")
                    }}</el-button>
                    <el-button v-show="subTags.indexOf(item) != -1" size="mini" class="sub-btn" @click="unsubscribeToTag(item)">
                      <span class="subed">{{ $t("tag.subscribed") }}</span>
                      <span class="unsub">{{ $t("tag.unsubscribe") }}</span>
                    </el-button>
                  </div>
                </div>
                <!-- 其他情况 -->
                <div v-else>
                  <p>
                    <span @click.left="gotoHome(item)" @click.middle="gotoHome(item, true)">{{ item.replace(/_/g, " ") }}</span>
                  </p>
                  <div v-if="isLogin && subTags" style="display: inline; overflow:hidden;">
                    <el-button v-show="subTags.indexOf(item) == -1" size="mini" style="margin-left: 5px; display: inline;" @click="subscribeToTag(item)">{{
                      $t("tag.subscribe")
                    }}</el-button>
                    <el-button v-show="subTags.indexOf(item) != -1" size="mini" class="sub-btn" @click="unsubscribeToTag(item)">
                      <span class="subed">{{ $t("tag.subscribed") }}</span>
                      <span class="unsub">{{ $t("tag.unsubscribe") }}</span>
                    </el-button>
                  </div>
                </div>
              </el-tooltip>
            </div>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import ShowAuthorData from "@/components/tag/edit/AuthorData";
import EditTags from "@/components/tag/edit/Edit";
import { toGMT as tagLogDate } from "@/static/js/toGMT";
// import pvTag from "../components/GeneralComponents/pv-tag.vue";
export default {
  components: {
    EditTags,
    ShowAuthorData,
    // pvTag
  },
  props: {
    msg: {
      type: [Object, Array],
      required: true,
    },
    name: {
      type: String,
      default: "",
    },
    subTags: {
      type: Array,
      required: false,
    },
  },
  data() {
    this.$i18n.locale = localStorage.getItem("lang");
    return {
      // 判断是否登录的标志
      isLogin: false,
      // tag 编辑页面是否打开
      showTagPanel: false,
      // 标签编辑历史
      tagLog: [],
      // 历史标签信息页面打开的标志
      dialogVisible: false,
      // 加载标签历史信息的标志
      loading2: false,
      // 作者名
      Author: "",
      // 打开的作者详情的作者的 ID
      AuthorID: "ID",
      // 是否打开作者详情页面
      showAuthorData: false,
      // Tag 颜色列表
      colorTagList: ["Copyright", "Language", "Character", "General", "Meta", "Soundtrack", "Author"],
      // 溢出元素表
      overflowed: [],
      onresizehandler: null,
    };
  },
  computed: {
    // 导航条的标题
    title() {
      if (this.$parent.ifSearch == true && this.$route.path == "/home") {
        return this.$t("tag.title3");
      } else if (this.$store.state.leftNavBarTitle == 1) {
        return this.$t("tag.title");
      } else if (this.$store.state.leftNavBarTitle == 2) {
        return this.$t("tag.title2");
      } else {
        return this.$t("tag.title");
      }
    },
    // 视频的 pid
    pid() {
      return this.$route.query.id || "";
    },
    // 翻译标签名
    tranTagCategories() {
      return function(name) {
        let map = {
          General: this.$t("General"),
          Character: this.$t("Character"),
          Copyright: this.$t("Copyright"),
          Author: this.$t("Author"),
          Meta: this.$t("Meta"),
          Language: this.$t("Language"),
          Soundtrack: this.$t("Soundtrack"),
        };
        return map[name];
      };
    },
    // 标签的修改日期
    tagLogDate,
  },
  watch: {
    // 如果标签编辑界面被关闭，则重新请求页面数据
    showTagPanel() {
      if (this.showTagPanel == false) {
        this.$parent.searchVideo();
      }
    },
    // 当标签发生变动时刷新溢出属性
    msg() {
      this.$nextTick(function() {
        this.freshOverflow();
      });
    },
  },
  mounted() {
    // 查看是否登录
    if (JSON.stringify(this.$store.state.username) != "null" && this.$store.state.username != "") {
      this.isLogin = true;
    }
    this.$nextTick(function() {
      this.freshOverflow();
    });
    // 监听resize
    let _this = this;
    this.onresizehandler = function() {
      _this.freshOverflow();
    };
    window.addEventListener("resize", this.onresizehandler);
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.onresizehandler);
  },
  methods: {
    // 添加标签订阅
    subscribeToTag(tag) {
      this.axios({
        method: "post",
        url: "/be/subs/add.do",
        data: {
          query: tag,
        },
      }).then(() => {
        this.$emit("subscribe-changed");
      });
    },
    // 取消标签订阅
    unsubscribeToTag(tag) {
      this.axios({
        method: "post",
        url: "/be/subs/del_tag.do",
        data: {
          tag: tag,
        },
      }).then(() => {
        this.$emit("subscribe-changed");
      });
    },
    // 点击标签显示标签的搜索结果
    gotoHome(key, _blank = false) {
      if (key != "") {
        if (_blank) {
          let routerPath = this.$router.resolve({
            path: "/home",
            query: { keyword: key },
          });
          window.open(routerPath.href, "_blank");
        } else {
          this.$router.push({
            path: "/home",
            query: { keyword: key },
          });
        }
      } else {
        this.$router.push({ path: "/home" });
      }
    },
    // 打开Tag编辑页面
    openEditTags() {
      // this.$refs.editTag.getCommonTags();
      this.showTagPanel = true;
    },
    // 打开作者详情对话框
    openAuthorData(ID) {
      this.AuthorID = ID;
      this.Author = ID;
      this.showAuthorData = true;
    },
    // 使用视频已有的标签发布视频
    postVideo() {
      this.$router.push({
        path: "/postvideo",
        query: { use_tags: this.pid },
      });
    },
    // 查看标签编辑历史
    show_tag_log() {
      this.loading2 = true;
      this.dialogVisible = true;
      this.axios({
        method: "post",
        url: "/be/video/tag_log.do",
        data: { vid: this.pid, lang: localStorage.getItem("lang") },
      })
        .then((res) => {
          this.tagLog = res.data.data;
          this.loading2 = false;
        })
        .catch(() => {
          this.loading2 = false;
        });
    },
    // 更新溢出项
    freshOverflow() {
      this.overflowed = [];
      this.colorTagList.forEach((i) => {
        if (this.$refs[i]) {
          this.$refs[i].forEach((i2) => {
            if (Math.floor(this.getTextSize(i2.innerText, "100%", '"Avenir", Helvetica, Arial, sans-serif').width) > i2.offsetWidth) {
              this.overflowed.push(i2.innerText);
            }
          });
        }
      });
    },
    // 计算文本宽度
    getTextSize(text, fontSize, fontFamily) {
      let span = document.createElement("span");
      let result = {};
      result.width = span.offsetWidth;
      result.height = span.offsetHeight;
      span.style.visibility = "hidden";
      span.style.fontSize = fontSize ? fontSize : "";
      span.style.fontFamily = fontFamily ? fontFamily : "";
      span.style.display = "inline-block";
      document.body.appendChild(span);
      if (typeof span.textContent != "undefined") {
        span.textContent = text;
      } else {
        span.innerText = text;
      }
      result.width = parseFloat(window.getComputedStyle(span).width) - result.width;
      result.height = parseFloat(window.getComputedStyle(span).height) - result.height;
      document.body.removeChild(span);
      return result;
    },
  },
};
</script>

<style scoped>
.belong-to-home p {
  display: inline;
}
/* .belong-to-detail {} */
.left_list ul li p {
  cursor: pointer;
}
.left_list ul li p:hover {
  color: #ff88a0;
}
.left_list li {
  transition: all 2s ease;
}
.left_list ul {
  transition: all 2s ease;
  padding-right: 6px;
  padding: 20px;
  font-size: 100%;
  color: #999;
  text-decoration: none;
  box-sizing: border-box;
  margin-block-end: 1em;
  margin-inline-start: 0px;
  margin-inline-end: 0px;
  padding-inline-start: 20px;
  font-size: 100%;
  line-height: 1.25em;
  width: 100%;
  word-break: break-all;
}
.left_list h1 {
  font-family: Tahoma, Verdana, Helvetica, sans-serif;
  line-height: 1.5em;
  padding-left: 20px;
  margin-top: 20px;
  margin-right: 10px;
  color: #000;
  display: inline-block;
}
.left_list h3 {
  font-family: Tahoma, Verdana, Helvetica, sans-serif;
  color: #000;
  line-height: 1.2em;
  margin-top: 10px;
  margin-bottom: 10px;
}
.left_list li p {
  line-height: 30px;
  text-decoration: none;
}
.left_list li a:hover {
  background-color: #f0ebf1;
}
.left-navbar {
  position: relative;
  width: 15%;
  min-width: 150px;
  margin-right: 10px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}
.titleTag p {
  cursor: pointer;
  margin-top: 10px;
  margin-left: 15px;
  color: #39c5bb;
}
.titleTag p:hover {
  color: #c539c5;
}
.tag {
  display: inline-block;
}
.tag-div {
  padding: 0 12px;
  border-radius: 100px;
  border: 1px solid #a4a4a4;
  margin: 0 10px 8px 0;
  /* 使文字变为最多显示1行，多余的使用省略号代替 */
  display: -webkit-inline-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}
.tag-div:hover {
  border-color: #ff88a0;
}
.editTagButton {
  text-align: left;
  display: inline-block;
}
.EditTags {
  position: relative;
  left: 300%;
}
.editer {
  margin-right: 5px;
  margin-top: 3px;
  display: flex;
  align-items: center;
}
/* 针对列表调整颜色 */
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
.sub-btn {
  margin-left: 5px;
  display: inline;
  overflow: hidden;
}
.sub-btn .unsub {
  margin-left: 5px;
  display: none;
}
.sub-btn:hover .subed {
  display: none;
}
.sub-btn:hover .unsub {
  display: inline;
}
</style>
