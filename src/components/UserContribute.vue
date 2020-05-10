<!--
    页面：paychyvideo的个人索引视频贡献页面
    功能：展示用户贡献的所有视频索引信息以及TAG数据统计
    更新日志：
    12/31/2019: v1.0

    ★待解决问题：
     因个人界面接口较特殊，需登录后才能获取，登录需携带Cookie，请先在官网登录后再打开此页面。
     本地登录提示错误暂未做处理。
     没做分页，默认展示所有视频，如果用户视频多，数据可能会很庞大会有卡顿现象。
-->

<i18n>
{
  "CHS": {
    "no_data": "暂无数据",
    "video_list": "视频索引列表",
    "video_count": "共有{videoCount}个视频"
  },
  "ENG": {
    "no_data": "No data",
    "video_list": "Video list",
    "video_count": "Total {videoCount} videos"
  },
  "CHT": {
    "no_data": "暫無數據",
    "video_list": "視頻索引列表",
    "video_count": "共有{videoCount}個視頻"
  }
}
</i18n>

<template>
  <div>
    <div v-loading="loading" class="bigbox standard">
      <el-container>
        <el-aside>
          <p v-if="videoCount == 0" class="nulldata-left">{{ $t("no_data") }}</p>
          <canvas id="myChart" width="800" height="800"></canvas>
        </el-aside>
        <el-main>
          <p v-if="videoCount == 0" class="nulldata-right">{{ $t("no_data") }}</p>
          <div v-if="videoCount != 0" class="minibox">
            <div class="minibox_top">
              <h3>{{ $t("video_list") }}</h3>
              <span>{{ $t("video_count", { videoCount: videoCount }) }}</span>
              <i :class="{ 'el-icon-s-grid': flag, 'el-icon-menu': !flag }" @click="changeLine"></i>
            </div>

            <div v-if="flag" class="video_lineUp">
              <router-link
                v-for="i in videoData"
                :key="i._id.$oid"
                class="list-item"
                target="_blank"
                :to="{ path: '/video', query: { id: i._id.$oid } }"
                tag="a"
              >
                <img :src="'/images/covers/' + i.item.cover_image" alt />
                <h4>
                  <router-link :to="{ path: '/video', query: { id: i._id.$oid } }">{{ i.item.title }}</router-link>
                </h4>
              </router-link>
            </div>
            <div v-if="!flag" class="video_straightColumn">
              <router-link
                v-for="i in videoData"
                :key="i._id.$oid"
                class="list-item"
                target="_blank"
                :to="{ path: '/video', query: { id: i._id.$oid } }"
                tag="a"
              >
                <img :src="'/images/covers/' + i.item.cover_image" alt />
                <div class="list-item_content">
                  <h4>
                    <router-link :to="{ path: '/video', query: { id: i._id.$oid } }">{{ i.item.title }}</router-link>
                  </h4>
                  <p>{{ i.item.desc }}</p>
                  <a :href="i.item.url">{{ i.item.url }}</a>
                </div>
              </router-link>
            </div>
          </div>

          <el-pagination
            v-if="videoCount != 0"
            background
            class="page-selector"
            layout="jumper, prev, pager, next, sizes"
            :current-page="page"
            :total="videoCount"
            :page-size="20"
            :page-sizes="[10, 20, 30, 40]"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          ></el-pagination>
        </el-main>
      </el-container>
    </div>
  </div>
</template>

<script>
export default {
  components: {},
  data() {
    this.$i18n.locale = localStorage.getItem("lang");
    return {
      flag: true, // 视频排列顺序，默认栅格
      TagData: [], // 所有视频的 TAG 数据
      videoCount: 0, // 视频总数
      page: 1,
      count: 20,
      videoData: [], // 视频数据
      // 绘制图表用，使用教程移至：https://www.echartsjs.com/zh/tutorial.html#
      CopyrightObj: [],
      GeneralObj: [],
      CharacterObj: [],
      // CopyrightObj: [],
      AuthorObj: [],
      MetaObj: [],
      LanguageObj: [],
      SoundtrackObj: [],
      // 绘制图表用，统计 TAG 占比
      General_count: 0,
      Character_count: 0,
      Copyright_count: 0,
      Author_count: 0,
      Meta_count: 0,
      Language_count: 0,
      SoundtrackObj_count: 0,

      loading: true // 读取状态
    };
  },
  watch: {
    $route() {
      location.reload();
    },
    page() {
      this.loading = true;
      this.getData(this.page, this.count);
    },
    count() {
      this.getData(this.page, this.count);
    }
  },
  created() {
    this.getMaxCount();
  },

  mounted() {},

  methods: {
    handleCurrentChange(val) {
      this.page = val;
    },
    handleSizeChange(val) {
      this.count = val;
    },
    getMaxCount() {
      // 2020/2/16 修改后 第一次请求请求第一页数据总数 20 个视频。
      if (this.$route.params.id == "me") {
        this.axios({
          method: "post",
          url: "be/listmyvideo.do",
          withCredentials: true, // 携带 cookie 当配置了 withCredentials = true 时，必须在后端增加 response 头信息 Access-Control-Allow-Origin，且必须指定域名，而不能指定为*
          async: true,
          data: {
            page: 1,
            page_size: 20,
            lang: localStorage.getItem("lang")
          }
        })
          .then(result => {
            this.TagData = result.data.data.tags;
            this.videoData = result.data.data.videos;
            this.getTagCategories();
            this.videoCount = result.data.data.count;
            this.loading = false;
          })
          .catch(() => {});
        return;
      }
      if (this.$route.params.id != "me") {
        this.axios({
          method: "post",
          url: "be/listyourvideo.do",
          data: {
            page: 1,
            page_size: 20,
            uid: this.$route.params.id,
            lang: localStorage.getItem("lang")
          }
        })
          .then(result => {
            this.TagData = result.data.data.tags;

            this.videoData = result.data.data.videos;
            this.getTagCategories();
            this.videoCount = result.data.data.count;
            this.loading = false;
          })
          .catch(() => {});
        return;
      }
    },
    getData(e, count) {
      if (this.$route.params.id == "me") {
        this.axios({
          method: "post",
          url: "be/listmyvideo.do",
          withCredentials: true, // 携带 cookie 当配置了 withCredentials = true 时，必须在后端增加 response 头信息 Access-Control-Allow-Origin，且必须指定域名，而不能指定为*
          async: true,
          data: {
            page: e,
            page_size: count,
            lang: localStorage.getItem("lang")
          }
        })
          .then(result => {
            this.TagData = result.data.data.tags;
            this.videoData = result.data.data.videos;
            this.getTagCategories();
            this.videoCount = result.data.data.count;
            this.loading = false;
          })
          .catch(() => {});
        return;
      }
      if (this.$route.params.id != "me") {
        this.axios({
          method: "post",
          url: "be/listyourvideo.do",
          data: {
            page: e,
            page_size: count,
            uid: this.$route.params.id,
            lang: localStorage.getItem("lang")
          }
        })
          .then(result => {
            this.TagData = result.data.data.tags;

            this.videoData = result.data.data.videos;
            this.getTagCategories();
            this.videoCount = result.data.data.count;
            this.loading = false;
          })
          .catch(() => {});
        return;
      }
    },
    getTagCategories() {
      // 绘制图表用
      let AarryAll = [];
      let Aarryname = [];
      for (let i in this.TagData) {
        AarryAll.push({
          value: this.TagData[i].count,
          name: this.TagData[i].tag
        });
        Aarryname.push(this.TagData[i].tag);
      }

      this.axios({
        async: true,
        method: "post",
        url: "be/tags/query_tag_categories.do",
        data: {
          tags: Aarryname
        }
      }).then(result => {
        this.totallNum(result.data.data.categorie_map);
        this.drawLine();
      });
    },
    getcount(name) {
      // 统计计数
      return this.TagData.filter(element => {
        if (element.tag == name) {
          return element.count;
        }
      })[0].count;
    },
    totallNum(arr) {
      this.CopyrightObj = [];
      this.GeneralObj = [];
      this.CharacterObj = [];
      this.AuthorObj = [];
      this.MetaObj = [];
      this.LanguageObj = [];
      this.SoundtrackObj = [];

      // 依次将接口获取的原数据按照 echarts 中的数据规范转换
      for (let i in arr) {
        if (arr[i] == "Copyright") {
          this.Copyright_count++;
          this.CopyrightObj.push({ value: this.getcount(i), name: i });
        }
        if (arr[i] == "General") {
          this.General_count++;
          this.GeneralObj.push({ value: this.getcount(i), name: i });
        }
        if (arr[i] == "Character") {
          this.Character_count++;
          this.CharacterObj.push({ value: this.getcount(i), name: i });
        }
        if (arr[i] == "Author") {
          this.Author_count++;
          this.AuthorObj.push({ value: this.getcount(i), name: i });
        }
        if (arr[i] == "Meta") {
          this.Meta_count++;
          this.MetaObj.push({ value: this.getcount(i), name: i });
        }
        if (arr[i] == "Language") {
          this.Language_count++;
          this.LanguageObj.push({ value: this.getcount(i), name: i });
        }
        if (arr[i] == "Soundtrack ") {
          this.SoundtrackObj_count++;
          this.SoundtrackObj.push({ value: this.getcount(i), name: i });
        }
      }
      if (Object.keys(arr).length > 10) {
        for (let i in this.CopyrightObj) {
          // 东方占比太大导致图形过度密集，可去除
          if (this.CopyrightObj[i].name == "东方") {
            this.CopyrightObj.splice(this.CopyrightObj.indexOf(this.CopyrightObj[i]), 1);
          }
        }
      }
    },
    drawLine() {
      // 基于准备好的 dom，初始化 echarts 实例
      // 绘制图表
      // console.log(this.$echarts);
      let myChart = this.$echarts.init(document.getElementById("myChart"));
      myChart.setOption({
        series: {
          type: "sunburst",
          highlightPolicy: "ancestor",
          radius: [0, "95%"],
          sort: null,

          data: [
            {
              name: "General",
              // value: this.General_count,
              children: this.GeneralObj
            },
            {
              name: "Character",
              // value: this.Character_count,
              children: this.CharacterObj
            },
            {
              name: "Copyright",
              // value: this.Copyright_count,
              children: this.CopyrightObj
            },
            {
              name: "Author",
              // value: this.Author_count,
              children: this.AuthorObj
            },
            {
              name: "Meta",
              // value: this.Meta_count,
              children: this.MetaObj
            },
            {
              name: "Language",
              // value: this.Meta_count,
              children: this.LanguageObj
            },
            {
              name: "Soundtrack",
              // value: this.Meta_count,
              children: this.SoundtrackObj
            }
          ]
        }
      });
    },
    changeLine() {
      // 切换视频排列顺序
      this.flag = !this.flag;
    }
  }
};
</script>

<style lang="less" scoped>
@media screen and(max-width: 1810px) {
  .video_lineUp {
    display: flex;
    /* justify-content: space-around; */
    justify-content: flex-start;
    flex-direction: row;
    flex-wrap: wrap;
    overflow: auto;
    max-height: 700px;
    box-sizing: border-box;
    .list-item {
      box-shadow: 0 1px 10px rgba(0, 0, 0, 0.1);
      flex: 0 0 48% !important;
      box-sizing: border-box;
      margin: 10px 5px 5px;
      transition: all 0.3s ease;
      img {
        min-width: 233px;
        min-height: 145px;

        // min-width: 233px;
        // min-height: 145px;
      }
      h4 {
        margin: auto;
        width: 233px;
        height: 46px;
        overflow: hidden;
        text-overflow: ellipsis;
        // a {}
      }
      &:hover {
        box-shadow: 0 15px 30px rgba(0, 0, 0, 0.1);
        background-color: #f4f4f5;
      }
    }
  }
}
@media screen and(max-width: 1541px) {
  .video_lineUp {
    display: flex;
    /* justify-content: space-around; */
    justify-content: flex-start;
    flex-direction: row;
    flex-wrap: wrap;
    overflow: auto;
    max-height: 700px;
    box-sizing: border-box;
    .list-item {
      box-shadow: 0 1px 10px rgba(0, 0, 0, 0.1);
      flex: 0 0 95% !important;
      box-sizing: border-box;
      margin: 10px 5px 5px;
      transition: all 0.3s ease;
      img {
        min-width: 233px;
        min-height: 145px;
      }
      h4 {
        margin: auto;
        width: 233px;
        height: 46px;
        overflow: hidden;
        text-overflow: ellipsis;
        // a {}
      }
      &:hover {
        box-shadow: 0 15px 30px rgba(0, 0, 0, 0.1);
        background-color: #f4f4f5;
      }
    }
  }
}
.v-enter,
.v-leave-to {
  opacity: 0;
}

.v-enter-active,
.v-leave-active {
  transition: all 0.8s ease;
}

.bigbox {
  height: 100%;
  display: flex;
  background-color: white;
  opacity: 0.9;
}
.el-pagination {
  transform: translateY(50%);
}
.el-container {
  .el-aside {
    width: 50% !important;
    min-width: 800px;
    .nulldata-left {
      position: absolute;
      top: 50%;
      left: 25%;
      transform: translate(-50%, 50%);
    }
  }

  .el-main {
    width: 50%;
    /* min-width: 800px; */
    overflow: auto;
    border: 1px solid #e5e9ef;
    box-sizing: border-box;
    .nulldata-right {
      position: absolute;
      top: 50%;
      right: 25%;
      transform: translate(50%, 50%);
    }
  }
}
// #myChart {}
.minibox {
  .minibox_top {
    position: relative;
    h3 {
      height: 50px;
      line-height: 50px;
    }
    i {
      font-size: 30px;
      line-height: 50px;
      width: 50px;
      height: 100%;
      position: absolute;
      right: 0px;
      top: 0px;
      transition: all 0.2s ease;
      &:hover {
        color: #1b9af7;
      }
    }
  }

  .video_lineUp {
    display: flex;
    /* justify-content: space-around; */
    justify-content: flex-start;
    flex-direction: row;
    flex-wrap: wrap;
    overflow: auto;
    max-height: 700px;
    box-sizing: border-box;
    .list-item {
      box-shadow: 0 1px 10px rgba(0, 0, 0, 0.1);
      flex: 0 0 31%;
      box-sizing: border-box;
      margin: 10px 5px 5px;
      transition: all 0.3s ease;
      img {
        width: 80%;
        height: 72%;
        min-width: 233px;
        min-height: 145px;

        // min-width: 233px;
        // min-height: 145px;
      }
      h4 {
        margin: auto;
        width: 233px;
        height: 46px;
        overflow: hidden;
        text-overflow: ellipsis;
        // a {}
      }
      &:hover {
        box-shadow: 0 15px 30px rgba(0, 0, 0, 0.1);
        background-color: #f4f4f5;
      }
    }
  }
  .video_straightColumn {
    flex-wrap: wrap;
    overflow: auto;
    max-height: 700px;
    .list-item {
      box-shadow: 0 1px 10px rgba(0, 0, 0, 0.1);
      height: 220px;

      margin: 10px 5px 5px;
      display: flex;
      flex-direction: row;
      box-sizing: border-box;
      padding: 5px 10px;
      border-bottom: 1px solid #e5e9ef;
      transition: all 0.3s ease;
      &:hover {
        // background-color: #dddddd;
        // color: #333333;
        box-shadow: 0 15px 30px rgba(0, 0, 0, 0.1);
        transform: translate3d(0, -2px, 0);
      }
      img {
        width: 320px;
        height: 199px;
      }
      .list-item_content {
        max-width: 55%;
        height: 199px;
        flex: 1;
        h4 {
          font-size: 23px;
          line-height: 23px;
          height: 23px;
        }
        p {
          height: 150px;
          overflow: hidden;
          box-sizing: border-box;
          padding: 10px 20px;
          margin-bottom: 7px;
        }
        a {
          display: inline-block;
          width: 88%;
          height: 26px;
          text-align: left;
          overflow: hidden;
          font-size: 18px;
          line-height: 26px;
        }
      }
    }
  }
}

.grid-content {
  background-color: cornflowerblue;
}
</style>
