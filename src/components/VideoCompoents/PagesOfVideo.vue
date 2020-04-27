<!--    vue组件：PagesOfVideo.vue     -->
<!--
    功能：视频详情中判断该视频在B站是否有分P
    必要传入参数：
      aid:string类型，视频的av号
    更新日志：
      4/28/2020: v1.0
        release;
-->
<i18n>
{
  "CHS": {
    "test":"test!"
  }
}
</i18n>


<template>
  <div class="PagesOfVideo">
    <!-- 确认是否发布分P的对话框 -->
    <el-dialog title="提示" :visible.sync="confirmPosting" width="30%">
      <span>你确定要使用当前标签发布" {{ postingPage.part }} "的索引吗？</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="confirmPosting = false">取 消</el-button>
        <el-button type="primary" @click="confirmPosting = false">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 正文 -->
    <div class="new_top">
      <h2 style="text-align: center;">视频选集</h2>
      <p v-if="videoPages>1">本视频有{{videoPages}}个分P</p>
      <p v-else>本视频没有分P</p>
    </div>
    <div
      class="PagesDetail"
      v-if="videoPages!=1"
      v-loading="loading"
      element-loading-text="加载分P中"
      element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(255,255,255,1)"
    >
      <div
        class="PageItems"
        v-for="(item,index) in pagesDetail"
        :key="index"
        @click="(()=>{if(!searchingIndex[index].loading)pageOpts(index)})"
      >
        <span>P{{ index+1 }}&nbsp;</span>
        <span class="PageName">{{item.part||""}}&nbsp;</span>
        <span v-if="searchingIndex[index].loading" style="color:#909399">
          获取索引状态中
          <i class="el-icon-loading"></i>
        </span>
        <div v-else style="display:inline">
          <span style="color:#67C23A;font-size:12px" v-if="pagesDetail[index].isPosted">存在索引</span>
          <span v-else>
            <span style="color:#F56C6C;font-size:12px">不存在索引!</span>
            <span class="PostNewIndex">点击添加此分P的索引</span>
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    // 视频的av号
    aid: { type: String }
  },
  data() {
    this.$i18n.locale = localStorage.getItem("lang");
    return {
      // 分P的数量
      videoPages: 0,
      // 分P信息详情
      pagesDetail: [],
      // 加载分P中的标志
      loading: false,
      // 每个分P的索引情况的查询加载中的标志
      // 注意，这里是一个对象数组，使用对象的loading属性进行判断
      searchingIndex: [],
      // 确认发布索引的提示框
      confirmPosting: false,
      // 需要发布索引的分P对象
      postingPage: {},
      // 对于未被索引的视频，发布索引中的标志
      indexPosting: false
    };
  },
  created() {},
  mounted() {},
  methods: {
    // 获取分P信息
    async getVideoPages() {
      this.loading = true;
      await this.axios({
        method: "get",
        url: `/proxy/bili/x/player/pagelist?aid=${this.aid}&jsonp=jsonp`
      })
        .then(res => {
          this.videoPages = res.data.data.length;
          this.pagesDetail = res.data.data;
          // 为每个分P增加一个URL属性方便查询
          for (const item of this.pagesDetail) {
            item.url = `https://www.bilibili.com/video/av${this.aid}?p=${item.page}`;
            this.searchingIndex.push({ loading: true });
            this.ifPosted(item.url, item.page - 1);
          }
        })
        .catch(err => {
          console.log(err);
        });
      this.loading = false;
    },
    // 获取分P是否已经被索引的信息
    async ifPosted(url, index) {
      await this.axios({
        method: "post",
        url: "be/getvideo_url.do",
        data: {
          url: url
        }
      })
        .then(res => {
          if (res.data.status == "SUCCEED") {
            this.pagesDetail[index].isPosted = true;
            this.pagesDetail[index].detail = res.data.data.video;
          } else {
            this.pagesDetail[index].isPosted = false;
          }
        })
        .catch(err => {
          this.pagesDetail[index].isPosted = false;
          console.log(err);
        });
      this.searchingIndex[index].loading = false;
    },
    // 点击分P执行的操作，如果存在分P则跳转至相应的视频详情页面，否则使用当前视频的标签发布索引
    pageOpts(index) {
      if (this.pagesDetail[index].isPosted) {
        this.$router.push({
          path: "/video",
          query: { id: this.pagesDetail[index].detail._id.$oid }
        });
      } else {
        // 回到顶部
        if ($("html").scrollTop()) {
          //动画效果
          $("html").animate({ scrollTop: 0 }, 100);
        }
        this.$router.push({
          path: "/postvideo",
          query: { use_tags: this.$route.query.id }
        });
        console.log("hi");

        // this.postingPage = this.pagesDetail[index];
        // this.confirmPosting = true;
      }
    }
  },
  watch: {
    aid() {
      this.getVideoPages();
    }
  },
  components: {}
};
</script>

<style scoped>
.PagesOfVideo {
  width: 100%;
  margin-top: 10px;
  margin-bottom: 10px;
}
.new_top {
  border-bottom: 3px solid #21c6ef;
}
.PagesDetail {
  min-height: 50px;
  max-height: 150px;
  overflow: auto;
}
.PageItems {
  line-height: 25px;
  margin-bottom: 5px;
  margin-top: 5px;
  transition: all 0.4s ease;
}
.PageItems:hover {
  background-color: rgb(244, 244, 245);
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}
.PageName {
  transition: all 0.4s ease;
  cursor: pointer;
}
.PageItems:hover .PageName {
  color: rgb(255, 166, 251);
}
.PostNewIndex {
  color: #606266;
  font-size: 15px;
  cursor: pointer;
  visibility: hidden;
  transition: all 0.2s ease;
  float: right;
}
.PostNewIndex:hover {
  color: #409eff;
}
.PageItems:hover .PostNewIndex {
  display: inline;
  visibility: visible;
}
</style>