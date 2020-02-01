<!--    vue组件：LeftNavbar.vue     -->
<!--
    组件：左侧的标签导航栏
    大小：15% * 100%
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
    ★待解决问题：
      暂无
-->

<template>
  <div class="left-navbar">
    <!-- EditTags组件-->
    <EditTags :msg="pid" :visible.sync="showTagPanel" class="EditTags"></EditTags>

    <div class="left_list">
      <div class="titleTag">
        <h1>{{ title }}</h1>
        <div class="editTagButton">
          <el-button v-if="title=='标签'&&isLogin==true" size="mini" @click="openEditTags">编辑</el-button>
        </div>
        <p v-if="title=='标签'&&isLogin==true" @click="postVideo">【使用标签发布视频】</p>
      </div>
      <!-- 在Home页面渲染的侧导航条内容 -->
      <ul ref="test" v-if="title=='热门标签'">
        <li class="tag belong-to-home" v-for="(val,key) in msg" :key="key">
          <!-- <router-link :to="'href=+/search?query='+i">{{i}}</router-link> -->
          <!-- 根据tag名称自动渲染tag颜色 -->
          <p
            v-bind:class="{Copyright:val=='Copyright',
            Language:val=='Language',
            Character:val=='Character',
            Author:val=='Author',
            General:val=='General',
            Meta:val=='Meta'}"
            @click="gotoHome(key)"
          >{{key}}</p>
        </li>
      </ul>

      <!-- 在Detail页面渲染的侧导航条内容 -->
      <ul ref="test" v-if="title=='标签'">
        <li class="tag belong-to-detail" v-for="(key, val) in msg" :key="val">
          <h3>{{ val }}</h3>
          <!-- 根据tag名称自动渲染tag颜色 -->
          <p
            v-for="item in key"
            :key="item"
            v-bind:class="{Copyright:val=='Copyright',
            Language:val=='Language',
            Character:val=='Character',
            Author:val=='Author',
            General:val=='General',
            Meta:val=='Meta'}"
            @click="gotoHome(item)"
          >{{ item }}</p>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import EditTags from "../components/EditTags";
export default {
  data() {
    return {
      // 判断是否登录的标志
      isLogin: false,
      // tag编辑页面是否打开
      showTagPanel: false
    };
  },
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
      this.showTagPanel = true;
    },
    // 使用视频已有的标签发布视频
    postVideo() {
      this.$router.push({ path: "/postvideo", query: { use_tags: this.pid } });
    }
  },
  components: { EditTags },
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
      return this.$store.state.leftNavBarTitle;
    },
    // 视频的pid
    pid() {
      return this.$store.state.videoPid;
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

  margin-block-end: 1em;
  margin-inline-start: 0px;
  margin-inline-end: 0px;
  padding-inline-start: 20px;
  font-size: 100%;
  line-height: 1.25em;
  width: 200px;
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
</style>