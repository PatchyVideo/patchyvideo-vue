<!--    vue组件：LeftNavbar.vue     -->
<!--
    组件：左侧的标签导航栏
    大小：15% * 100%
    功能：home页面下对标签进行导航
    必要传入参数：
      1.从https://www.patchyvideo.com/listvideo.do请求来的数据的data.data.tags
      2.标题的名称(从vuex的"leftNavBarTitle"参数里获取)
    更新日志：
    12/1/2019: v1.0 
      release
    12/23/2019: v1.0.1
      1.实现了动态调整标题的功能
-->

<template>
  <div class="left-navbar">
    <div class="left_list">
      <h1>{{ title }}</h1>
      <ul ref="test">
        <li class="tag" v-for="(item,i) in msg">
          <router-link :to="'href=+/search?query='+i">{{i}}</router-link>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      newmsg: [],
      oldmsg: []
    };
  },
  created() {},
  methods: {},
  components: {},
  watch: {
    msg(newV, oldV) {
      //   console.log("监听到了左边区域Tag的MSG发生了改变");
      this.newmsg = newV;
      this.oldmsg = oldV;
    }
  },
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
.left_list ul:hover .tag {
  /*       width:expression(varWidth + "px")*/
}

.left_list li {
  width: 100%;
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
}
.left_list li a {
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
</style>