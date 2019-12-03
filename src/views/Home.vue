<!--    vue页面：Home.vue     -->
<!--
    页面：paychyvideo的主页面
    功能：展示网站收录的所有视频
    包含组件：LeftNavbar.vue、TopNavbar.vue、Foot.vue
    更新日志：
    12/1/2019: v1.0 
      release
    12/3/2019: v1.0.1 
      1.修复了页面宽度大于浏览器默认宽度的问题 
      2.增加了播放列表的背景图片 
      3.调整了介绍的排版，从原来的最多显示三行到现在的最多显示四行，剩下的内容使用省略号代替
-->
<template>
  <div>
    <topnavbar />

    <div class="w main-page-background-img">
      <left_navbar :msg="tags"></left_navbar>
      <div class="content">
        <div class="video-list-header">
          <p>Showing {{count}} out of {{maxcount}} videos</p>
          <el-select id="select-order" v-model="couponSelected" @change="getCouponSelected">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </div>

        <ul>
          <li class="list-item" v-for="item in listvideo" :key="item._id.$oid">
            <div class="video-thumbnail">
              <img
                src="/images/covers/f5da2d4dd9eac171d47eb1100339cbad90e4648556a2f99a.png"
                width="200px"
                height="125px"
              />
            </div>
            <div class="video-detail">
              <h4>
                <router-link
                  :to="{path:'/video',query:{id:item._id.$oid}}"
                  tag="a"
                >{{item.item.title}}</router-link>
              </h4>
              <p>{{item.item.desc}}</p>
              <div>
                <img :src="'./img/'+item.item.site+'.ico'" width="16px" />
                <a :href="item.item.url" id="link_5dd0262f9052645806fc1d54">{{item.item.url}}</a>
                <i
                  onclick="javascript:copyToClipboard($('#link_5dd0262f9052645806fc1d54'));"
                  class="fa fa-copy fa-lg"
                ></i>
              </div>
            </div>
          </li>
        </ul>
        <p class="page-selector"></p>
      </div>
    </div>

    <Footer></Footer>
  </div>
</template>

<script>
import topnavbar from "../components/TopNavbar.vue";
import left_navbar from "../components/LeftNavbar.vue";
import Footer from "../components/Footer.vue";
var test = 0;
export default {
  data() {
    return {
      testNum: [],
      combo1: 1, //判断用户是否多次点击
      combo2: 1, //判断用户是否多次点击
      pageif: 1, //分页判断
      options: [
        { value: "latest      ", label: "Latest Post  " },
        { value: "oldest      ", label: "Oldest Post  " },
        { value: "video_latest", label: "Latest Upload" },
        { value: "video_oldest", label: "Oldest Upload" }
      ],
      couponSelected: "",
      page: 1,
      maxpage: 1,
      count: 0,
      maxcount: 0,
      tags: [],
      listvideo: []
    };
  },
  created() {
    this.$store.commit("changeBgc", "home");
    this.couponSelected = this.options[0].value;
    this.getListViedeo(this.page);
  },

  mounted() {},
  updated() {
    if (this.pageif == 1) {
      const p_obj = $(".page-selector");
      p_obj.empty();
      console.log("清空上一次分页栏...");
      console.log("重新创建分页栏...");
      this.objcreate(this.page, this.maxpage);
    }
    console.log("——————updated————");
    console.log(this.$route.params);
  },
  methods: {
    getCouponSelected: function() {
      console.log(this.couponSelected);
    },
    objcreate: function(selected_page, page_count) {
      var that = this;
      const p_obj = $(".page-selector");

      if (selected_page > page_count || page_count < 1) return null;

      if (page_count == 1) {
        p_obj.append($(`<span>‹</span>`));
        p_obj.append($(`<span>1</span>`));
        p_obj.append($(`<span>›</span>`));
        return p_obj;
      }

      if (selected_page == 1) {
        p_obj.append($(`<span>‹</span>`));
        p_obj.append($(`<span>1</span>`));
      } else {
        p_obj.append($(`<a  id="${selected_page - 1}")>‹</a>`));
        p_obj.append($(`<a  id="1">1</a>`));
      }
      var start = Math.max(2, selected_page - 4);
      var end = Math.min(page_count - 1, selected_page + 4);
      if (start > 2) p_obj.append($(`<span>...</span>`));
      for (let i = start; i <= end; ++i) {
        if (i == selected_page) p_obj.append($(`<span>${i}</span>`));
        else p_obj.append($(`<a id="${i}">${i}</a>`));
      }
      if (end < page_count - 1) p_obj.append($(`<span>...</span>`));
      if (selected_page == page_count) {
        p_obj.append($(`<span>${page_count}</span>`));
        p_obj.append($(`<span>›</span>`));
      } else {
        p_obj.append($(`<a id="${page_count}">${page_count}</a>`));
        p_obj.append($(`<a id="${selected_page + 1}">›</a>`));
      }
      $(".page-selector>a,.page-selector>span").css({
        display: "inline-block",
        "width        ": "30px        ",
        "height       ": "30px        ",
        cursor: " pointer",
        "margin-left": "10px",
        "border-radius": "50%         ",
        "font-size    ": "30px        "
      });
      p_obj.on("click", "a", function() {
        console.log($(this).attr("id"));
        /*    $(this).trigger("create");*/
        that.page = parseInt($(this).attr("id"));
      });
      return p_obj;
    },
    listvideoToStore() {
      this.$store.commit("getwhichPage", this.page);
      this.$store.commit("getVideoObj", this.listvideo);
    },
    goToPage(page) {},
    getListViedeo: function(e) {
      console.log(
        "combo1:" +
          this.combo1 +
          "______combo2:" +
          this.combo2 +
          "________page:" +
          e
      );
      test++;
      console.log("请求了" + test + "次");
      this.axios({
        method: "post",
        url: "https://www.patchyvideo.com/listvideo.do",
        data: { page: e, page_size: 20 }
      }).then(result => {
        console.log("请求第：" + this.page + "页的数据");
        console.log(result.data.data);

        if (this.maxcount == 0) {
          //第一次请求接口
          this.maxcount = result.data.data.count;
          this.maxpage = Math.ceil(result.data.data.count / 20); //取得总页数制作分页
          this.$store.commit("getMaxPage", this.maxpage);
        }
        this.count = result.data.data.videos.length;
        this.listvideo = result.data.data.videos;
        this.tags = result.data.data.tags;
      });
    }
  },
  watch: {
    pageif(v1, v2) {
      console.log("监听到pageif发生了改变");
      const p_obj = $(".page-selector");
      p_obj.empty();
      console.log("清空上一次分页栏...");
      this.objcreate(this.page, this.maxpage);
      console.log("重新创建分页栏...");
    },
    page(v) {
      console.log("监听到page发生了改变");
      console.log("重新请求新的页面数据...");
      this.getListViedeo(this.page);
      this.pageif++;
    },
    listvideo() {
      this.listvideoToStore();
    }
  },
  components: { left_navbar, topnavbar, Footer }
};
</script>

<style scoped>
.content {
  background-color: #ffffffc9;
  /* width: 85%; */
}
/* .footer {
  height: 100px;
  width: calc(100% - 20px);
  background-color: #fff;
  border-top: 1px solid #c5464a;
  text-align: left;
  line-height: 100px;
  font-size: 14px;
  color: #73777a;
  letter-spacing: 0.5px;
} */
.page-selector {
  display: block;
  text-align: center;
}
.page-selector span {
  display: block;
  width: 100px;
  height: 100px;
  background-color: black;
}
.page-selector > a {
  cursor: pointer;
  margin-left: 10px;
  display: inline-block;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  font-size: 20px;
}
.video-list-header p {
  display: inline;
}

.video-detail > p {
  font-size: 1rem;
  line-height: 1.1rem;
  white-space: pre-wrap;
  overflow: hidden;
  height: 4.3rem;
  /* 使文字变为最多显示4行，多余的使用省略号代替 */
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 4;
  -webkit-box-orient: vertical;
}
.video-detail > div {
  position: absolute;
  bottom: 0px;
  left: 220px;
}
.video-detail {
  height: 125px;
  position: relative;
}
.video-thumbnail {
  margin-right: 20px;
  float: left;
}
.list-item {
  padding-bottom: 10px;
}
.fa-copy:hover {
  color: olive;
}
.video-list-header p {
  display: inline-block;
  height: 25px;
  position: absolute;
  transform: translate(10%, 50%);
}
.video-list-header select {
  height: 25px;
  font: 12px Arial;
  padding: 1px 3px 0 3px;
  vertical-align: middle;
  margin-bottom: 1px;
  float: right;
}
.video-list-header {
  width: 100%;
  height: 50px;
}
.el-select {
  width: 200px;
  display: inline-block;
  position: absolute;
  right: 0px;
}
.left-navbar {
  position: relative;
  width: 15%;
  margin-right: 10px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}
:root {
  --view-height: 50px;
}
.w {
  text-align: left;
}
.main-page-background-img {
  background-image: url("./../static/img/imoto3.jpg");
  background-repeat: no-repeat;
  background-color: rgb(255, 255, 255);
  min-height: 1000px;
  width: 85%;
}
</style>