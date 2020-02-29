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

<i18n>
{
  "CHS": {
  "tag": {
      "title":"标签",
      "video_action":"[使用标签发布视频]",
      "prompt_action":"[查看编辑标签历史]",
      "edit": "编辑"

      },
  "tag_history": {
      "prompt": "标签编辑历史",
      "add": "添加:",
      "del": "删除:",
      "empty": "暂无记录!"
    },
    "categories": {
      "General":"综合",
      "Character":"角色",
      "Copyright":"作品",
      "Author":"up主",
      "Meta":"元数据",
      "Language":"语言",
      "Soundtrack":"原曲"
    }
  },
  "ENG": {
    "tag": {
      "title":"Tag",
      "video_action":"[Publish videos with tags]",
      "prompt_action":"[ View edit tag history]",
      "edit":"Edited"

      },
    "tag_history": {
      "prompt": "Tag History",
      "add": "Added:",
      "del": "Removed:",
      "empty": "No record found"
    },
    "categories": {
      "General":"General",
      "Character":"Character",
      "Copyright":"Copyright",
      "Author":"Author",
      "Meta":"Meta",
      "Language":"Language",
      "Soundtrack":"Soundtrack"
    }
  }
}
</i18n>

<template>
  <div class="left-navbar">
    <!-- EditTags组件-->
    <EditTags
      ref="editTag"
      :msg="pid"
      :visible.sync="showTagPanel"
      v-if="showTagPanel"
      class="EditTags"
    ></EditTags>

    <!-- 作者详情组件 -->
    <el-dialog :close-on-click-modal="false" :visible.sync="showAuthorData" width="70%">
      <ShowAuthorData ref="AuthorData" :AuthorID="AuthorID"></ShowAuthorData>
    </el-dialog>

    <!-- 显示标签组件的对话框 -->
    <el-dialog :title="$t('tag_history.prompt')" :visible.sync="dialogVisible" width="70%">
      <div v-loading="loading2">
        <el-collapse>
          <el-collapse-item
            v-for="(item,index) in tagLog"
            :key="index"
            :title="tagLogDate(item.time.$date)"
          >
            <div>
              <div v-if="item.add.length">
                <span
                  style="margin-right:10px;margin-top:3px;color:#67C23A"
                >{{$t('tag_history.add')}}</span>
                <el-tag
                  type="success"
                  v-for="tag in item.add"
                  style="margin-right:5px;margin-top:3px"
                  :key="tag"
                >{{tag}}</el-tag>
                <br />
              </div>

              <div v-if="item.del.length">
                <span
                  style="margin-right:10px;margin-top:3px;color:#F56C6C"
                >{{$t('tag_history.del')}}</span>
                <el-tag
                  type="danger"
                  v-for="tag in item.del"
                  style="margin-right:5px;margin-top:3px"
                  :key="tag"
                >{{tag}}</el-tag>
                <br />
              </div>
              <div v-if="item.user_obj.length" style="margin-top:5px">
                <span v-for="user in item.user_obj" :key="user.profile.username" class="editer">
                  <el-avatar
                    fit="cover"
                    class="loginUser-userAvatar"
                    :size="20"
                    :src="'be/images/userphotos/'+user.profile.image"
                  ></el-avatar>
                  <router-link :to="'/users/'+user._id.$oid">{{ user.profile.username }}</router-link>
                </span>
              </div>
              <span v-if="item.del.length==0 && item.add.length==0">{{$t('tag_history.empty')}}</span>
            </div>
          </el-collapse-item>
        </el-collapse>
      </div>
    </el-dialog>

    <!-- 导航栏正文 -->
    <div class="left_list">
      <div class="titleTag">
        <h1>{{$t('tag.title')}}</h1>
        <div class="editTagButton">
          <el-button
            v-if="title == '标签' && isLogin == true"
            size="mini"
            @click="openEditTags"
            :disabled="showTagPanel"
          >{{$t('tag.edit')}}</el-button>
        </div>
        <p v-if="title == '标签' && isLogin == true" @click="postVideo">【{{$t('tag.video_action')}}】</p>
        <p v-if="title == '标签' && isLogin == true" @click="show_tag_log">【{{$t('tag.prompt_action')}}】</p>
      </div>
      <!-- 在Home页面渲染的侧导航条内容 -->
      <ul ref="test" v-if="title == '热门标签' || title == '相关标签' || title == 'Popular Tags'">
        <li class="tag belong-to-home" v-for="(val, key) in msg" :key="key">
          <!-- <router-link :to="'href=+/search?query='+i">{{i}}</router-link> -->
          <!-- 根据tag名称自动渲染tag颜色 -->
          <p
            v-bind:class="{
              Copyright: val == 'Copyright',
              Language: val == 'Language',
              Character: val == 'Character',
              Author: val == 'Author',
              General: val == 'General',
              Meta: val == 'Meta',
              Soundtrack:val == 'Soundtrack'
            }"
            @click="gotoHome(key)"
          >{{ key }}</p>
        </li>
      </ul>

      <!-- 在Detail页面渲染的侧导航条内容 -->
      <ul ref="test" v-if="title == '标签'">
        <li class="tag belong-to-detail" v-for="(key, val) in msg" :key="val">
          <h3>{{ tranTagCategories(val) }}</h3>
          <!-- 根据tag名称自动渲染tag颜色 -->
          <p
            v-for="item in key"
            :key="item"
            v-bind:class="{
              Copyright: val == 'Copyright',
              Language: val == 'Language',
              Character: val == 'Character',
              Author: val == 'Author',
              General: val == 'General',
              Meta: val == 'Meta',
              Soundtrack:val == 'Soundtrack'
            }"
          >
            <span @click="gotoHome(item)">{{ item }}</span>
            <el-button
              v-if="val == 'Author'"
              size="mini"
              style="margin-left:5px;"
              @click="openAuthorData(item)"
            >详情</el-button>
          </p>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import ShowAuthorData from "../components/ShowAuthorData.vue";
import EditTags from "../components/EditTags";
export default {
  data() {
    this.$i18n.locale = localStorage.getItem("lang");
    return {
      // 判断是否登录的标志
      isLogin: false,
      // tag编辑页面是否打开
      showTagPanel: false,
      // 标签编辑历史
      tagLog: [],
      // 历史标签信息页面打开的标志
      dialogVisible: false,
      // 加载标签历史信息的标志
      loading2: false,
      // 作者名
      Author: "",
      // 打开的作者详情的作者的ID
      AuthorID: "ID",
      // 是否打开作者详情页面
      showAuthorData: false
    };
  },
  computed: {},
  mounted() {
    // 查看是否登录
    if (
      JSON.stringify(this.$store.state.username) != "null" &&
      this.$store.state.username != ""
    ) {
      this.isLogin = true;
    }
  },
  methods: {
    // 点击标签显示标签的搜索结果
    gotoHome(key) {
      if (key != "") {
        this.$router
          .push({ path: "/home", query: { keyword: key } })
          .catch(err => {
            return err;
          });
      } else {
        this.$router.push({ path: "/home" });
      }
    },
    // 打开Tag编辑页面
    openEditTags() {
      /*  this.$refs.editTag.getCommonTags();*/
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
      this.$router.push({ path: "/postvideo", query: { use_tags: this.pid } });
    },
    // 查看标签编辑历史
    show_tag_log() {
      this.loading2 = true;
      this.dialogVisible = true;
      this.axios({
        method: "post",
        url: "/be/video/tag_log.do",
        data: { vid: this.pid, lang: localStorage.getItem("lang") }
      })
        .then(res => {
          this.tagLog = res.data.data;
          this.loading2 = false;
        })
        .catch(res => {
          this.loading2 = false;
        });
    },
    // 标签的修改日期
    tagLogDate(date) {
      var upload_time = new Date(date);
      // 设置为东八区的时间
      upload_time.setTime(upload_time.getTime());
      var y = upload_time.getFullYear(); //getFullYear方法以四位数字返回年份
      var M = upload_time.getMonth() + 1; // getMonth方法从 Date 对象返回月份 (0 ~ 11)，返回结果需要手动加一
      var d = upload_time.getDate(); // getDate方法从 Date 对象返回一个月中的某一天 (1 ~ 31)
      var h = upload_time.getHours(); // getHours方法返回 Date 对象的小时 (0 ~ 23)
      var m = upload_time.getMinutes(); // getMinutes方法返回 Date 对象的分钟 (0 ~ 59)
      var s = upload_time.getSeconds(); // getSeconds方法返回 Date 对象的秒数 (0 ~ 59)
      return (
        y +
        "-" +
        // 数字不足两位自动补零，下同
        (Array(2).join(0) + M).slice(-2) +
        "-" +
        (Array(2).join(0) + d).slice(-2) +
        " " +
        (Array(2).join(0) + h).slice(-2) +
        ":" +
        (Array(2).join(0) + m).slice(-2) +
        ":" +
        (Array(2).join(0) + s).slice(-2)
      );
    }
  },
  components: { EditTags, ShowAuthorData },
  watch: {
    // 如果标签编辑界面被关闭，则重新请求页面数据
    showTagPanel() {
      if (this.showTagPanel == false) {
        this.$parent.searchVideo();
      }
    }
  },
  computed: {
    // 导航条的标题
    title() {
      if (this.$parent.ifSearch == true && this.$route.path == "/home") {
        return "相关标签";
      } else {
        return this.$store.state.leftNavBarTitle;
      }
    },
    // 视频的pid
    pid() {
      return this.$store.state.videoPid;
    },
    // 翻译标签名
    tranTagCategories() {
      return function(name) {
        var map = {
          General: this.$t("General"),
          Character: this.$t("Character"),
          Copyright: this.$t("Copyright"),
          Author: this.$t("Author"),
          Meta: this.$t("Meta"),
          Language: this.$t("Language"),
          Soundtrack: this.$t("Soundtrack")
        };
        return map[name];
      };
    }
  },
  props: ["msg"]
};
</script>

<style scoped>
.belong-to-home p {
  display: inline;
}
.belong-to-detail {
}
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
.editTagButton {
  width: 50%;
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
</style>
