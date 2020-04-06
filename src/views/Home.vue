<!--    vue页面：Home.vue     -->
<!--
    页面：paychyvideo的主页面
    功能：展示网站收录的所有视频/展示搜索结果
    包含组件：LeftNavbar.vue、TopNavbar.vue、Foot.vue
    其他说明：显示搜索结果的时候要用query变量向页面传入关键字
    更新日志：
    12/1/2019: v1.0
      release
    12/3/2019: v1.0.1
      1.修复了页面宽度大于浏览器默认宽度的问题
      2.增加了播放列表的背景图片
      3.调整了介绍的排版，从原来的最多显示三行到现在的最多显示四行，剩下的内容使用省略号代替
    12/7/2019: v1.0.2
      1.修改了分页器设计,使用了ElementUI的标准样式,并可以调整页面显示的视频数量或者跳到某一页
      2.新增加载界面,切换页面的时候网站会有加载效果
      3.视频列表刷新(翻页,改变页面显示的视频数量)的时候会自动返回网页顶部
   12/10/2019: v1.0.3
      1.点击播放列表的时候打开新的窗口而不是在本窗口跳转页面
      2.精简了一下css的代码,修改了复制图标的css样式
    12/14/2019: v1.0.4
      1.实现了播放列表里链接的复制功能
      2.对或许视频列表的接口进行了修改，可以进行视频的排序了
    12/27/2019: v1.0.5
      1.修复了“getListVideo”方法名的拼写错误,注释进行优化
      2.去掉了“getListVideo”方法里视频列表是否第一次请求的判断
    12/29/2019: v1.0.5
      1.修复了网站链接前的小图标无法正常显示的问题,同时调整了图标间的距离
    1/8/2020：v1.0.6
      1.现在home页面也可以显示搜索结果
      2.现在播放列表进行重新排序/搜索标签时播放列表页数会跳转到第一页
    1/9/2020：v1.0.7
      1.修改了当前页面下的网站标题
    1/25/2020：v1.0.8
      1.去除了一些冗余的代码（pagechange()及其调用）
    1/27/2020：v1.0.9
      1.显示搜索结果的标签数量进行了优化
    1/29/2020：v1.0.10
      1.对搜索关键字出现非法字符的情况进行了兼容
    2/5/2020：v1.0.11
      1.页面中文优化
    2/7/2020：v1.0.12
      1.新增“输入的查询不能与NOT连用”的错误情况
    2/9/2020：v1.0.13
      1.优化了搜索逻辑，不会在出现请求多次相同接口的情况。
    ★待解决问题：
      1.播放列表里链接的复制功能因为涉及到对dom的直接操作，所以可能会有被抓住漏洞的风险
-->



<template>
  <div>
    <topnavbar />
    <!-- home页面的正文 -->
    <el-tabs type="border-card" v-model="activeName" @tab-click="handleClick">
      <el-tab-pane :label="labelInfo[0]" name="first"  >
        <i @click="changeLine" :class="{'el-icon-s-grid':flag,'el-icon-menu':!flag}"></i>
        <homemain v-if="activeName === 'first' && !flag"></homemain>
        <girdhomemain v-if="activeName === 'first' && flag"></girdhomemain>
      </el-tab-pane>
      <el-tab-pane :label="labelInfo[1]"  name="second" v-if="isLogin()">
        <subscribed v-if="activeName === 'second'"></subscribed>
      </el-tab-pane>

    </el-tabs>
    <Footer></Footer>
  </div>
</template>

<script>
  import topnavbar from "../components/TopNavbar.vue";
  import left_navbar from "../components/LeftNavbar.vue";
  import subscribed from  "../components/homecompoents/Subscribed.vue";
  import homemain from  "../components/homecompoents/HomeMain.vue";
  import girdhomemain from  "../components/homecompoents/GirdHomeMain.vue";
  import Footer from "../components/Footer.vue";
  import { copyToClipboardText } from "../static/js/generic";
  export default {
    data() {
      this.$i18n.locale = localStorage.getItem("lang");
      return {
        activeName: "first",
        // true表示网格视图，false表示列表视图
        flag:false,
        label:["主页"],
        labelInfo:["主页","订阅"]

      };
    },
    created() {

      if(this.$store.state.homeVideoDisplayStatus===0){
        this.flag =false;
      }else if(this.$store.state.homeVideoDisplayStatus===1){
        this.flag =true;
      }
/*      this.flag =this.$store.state.homeVideoDisplayStatus;*/
/*        this.flag = !localStorage.getItem("homeVideoDisplayStatus");*/

    },
    computed: {},
    mounted() {

    },
    updated() {},
    methods:{
      isLogin() {
        if (
                JSON.stringify(this.$store.state.username) !== "null" &&
                this.$store.state.username !== ""
        ) {
          return true;
        } else {
          return false;
        }
      },
      handleClick(e){
      },
      // 切换网格/列表视图
      changeLine(){
        this.flag = !this.flag;
        //   1表示网格，0表示列表
        if(this.flag===true){
          localStorage.setItem("homeVideoDisplayStatus",1);
          this.$store.commit("changeHomeVDS",1);
        }else{
          localStorage.setItem("homeVideoDisplayStatus",0);
          this.$store.commit("changeHomeVDS",0);
        }
      }
    },
    watch:{
      $route(newV, oldV) {
        this.activeName ="first";
      }
    },
    components: { left_navbar, topnavbar, Footer,subscribed,homemain,girdhomemain }
  };
</script>

<style lang="less" scoped>
  /deep/ .el-tabs__header,.is-top{
    width: 100% !important;
    margin: auto;
  }
  /deep/ .el-tabs__nav-scroll{
    width: 80% !important;
    margin: auto;
  }

.main-page-background-img {
  background-repeat: no-repeat;
  min-height: 800px;
  width: 85%;
  margin-top: 20px;
}

.blacklist_prompt {
  font-size: 14px;
  color: #606266;
}
i{
    position: absolute;
    font-size: 30px;
    top: 62px;
    right: 80px;
}
</style>
