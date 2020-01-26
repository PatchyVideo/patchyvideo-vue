<!--    vue组件：LeftNavbar.vue     -->
<!--
    组件：左侧的标签导航栏
    大小：15% * 100%
    功能：home页面下对标签进行导航
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
    ★待解决问题：
      暂无
-->

<template>
  <div class="left-navbar">
    <div class="left_list">
      <h1>{{ title }}</h1>
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
export default {
  data() {
    return {};
  },
  created() {
    console.log(this.msg);
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
    }
  },
  components: {},
  watch: {},
  computed: {
    // 导航条的标题
    title() {
      return this.$store.state.leftNavBarTitle;
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
  color: #000;
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