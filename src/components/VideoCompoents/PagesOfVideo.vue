<!--    vue组件：PagesOfVideo.vue     -->
<!--
    功能：视频详情中判断该视频在B站是否有分P
    必要传入参数：
      aid:string类型，视频的av号
    其他说明：
      组件会
    更新日志：
      4/28/2020: v1.0
        release;
-->
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
      <p v-if="videoPages > 1">本视频有{{ videoPages }}个分P</p>
      <p v-else>本视频没有分P</p>
    </div>
    <div
      v-if="videoPages != 1"
      v-loading="loading"
      class="PagesDetail"
      element-loading-text="加载分P中"
      element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(255,255,255,1)"
    >
      <div
        v-for="(item, index) in pagesDetailOfThisPage"
        :key="index"
        class="PageItems"
        :class="{ PageItemsActive: item.id == $route.query.id }"
        @click="
          () => {
            if (!item.loading) pageOpts(item.page - 1);
          }
        "
        @click.middle="
          () => {
            if (!item.loading) pageOpts(item.page - 1, true);
          }
        "
      >
        <span>P{{ item.page }}&nbsp;</span>
        <span class="PageName">{{ item.part || "" }}&nbsp;</span>
        <span v-if="item.loading" style="color: #909399;">
          获取索引状态中
          <i class="el-icon-loading"></i>
        </span>
        <div v-else style="display: inline;">
          <span v-if="item.isPosted" style="color: #67c23a; font-size: 12px;">已索引</span>
          <span v-else>
            <span style="color: #f56c6c; font-size: 12px;">未索引!</span>
            <span class="PostNewIndex">点击添加此分P的索引</span>
          </span>
        </div>
      </div>
    </div>

    <!-- 分P分页 -->
    <div style="text-align: center;">
      <el-pagination
        layout="prev, pager, next"
        :total="videoPages"
        :current-page.sync="currentPage"
        :page-size="pageCount"
        :hide-on-single-page="true"
        @current-change="ifPosted"
      ></el-pagination>
    </div>
  </div>
</template>

<script>
export default {
  components: {},
  props: {
    // 视频的av号
    aid: {
      type: Number,
      required: true,
    },
  },
  data() {
    this.$i18n.locale = localStorage.getItem("lang");
    return {
      // 分P的数量
      videoPages: 0,
      // 分P信息详情(所有分P)
      pagesDetail: [],
      // 当前显示的分P的页数
      currentPage: 1,
      // 每一页的分P数量
      pageCount: 20,
      // 加载分P中的标志
      loading: false,
      // 确认发布索引的提示框
      confirmPosting: false,
      // 需要发布索引的分P对象
      postingPage: {},
      // 对于未被索引的视频，发布索引中的标志
      indexPosting: false,
    };
  },
  computed: {
    // 分P信息详情（当前页）
    pagesDetailOfThisPage() {
      return this.pagesDetail.slice((this.currentPage - 1) * this.pageCount, Math.min(this.videoPages, this.currentPage * this.pageCount));
    },
  },
  watch: {
    aid() {
      this.getVideoPages();
    },
  },
  created() {},
  mounted() {},
  methods: {
    // 获取分P信息
    async getVideoPages() {
      this.loading = true;
      await this.axios({
        method: "get",
        url: `/proxy/bili/x/player/pagelist?aid=${this.aid}&jsonp=jsonp`,
      })
        .then((res) => {
          this.videoPages = res.data.data.length;
          this.pagesDetail = res.data.data;
          // 为每个分P增加一个URL属性方便查询
          for (const item of this.pagesDetail) {
            item.url = `https://www.bilibili.com/video/av${this.aid}?p=${item.page}`;
            item.loading = true;
          }
          this.ifPosted();
        })
        .catch((err) => {
          console.log(err);
        });
      this.loading = false;
    },
    // 获取分P是否已经被索引的信息
    async ifPosted() {
      await this.axios({
        method: "post",
        url: "be/getvideo_url_batch.do",
        data: {
          urls: this.pagesDetailOfThisPage.map((item) => item.url),
        },
      })
        .then((res) => {
          if (res.data.status == "SUCCEED") {
            // 因为pagesDetailOfThisPage是计算属性不能直接修改，这里直接修改pagesDetail
            this.pagesDetail = this.pagesDetail.map((item, index) => {
              if (index >= (this.currentPage - 1) * this.pageCount && index < Math.min(this.videoPages, this.currentPage * this.pageCount)) {
                if (res.data.data[index - (this.currentPage - 1) * this.pageCount].exist) {
                  item.isPosted = true;
                  item.id = res.data.data[index - (this.currentPage - 1) * this.pageCount].id.$oid;
                } else {
                  item.isPosted = false;
                }
              }
              return item;
            });
          } else {
            this.pagesDetail = this.pagesDetail.map((item, index) => {
              if (index >= (this.currentPage - 1) * this.pageCount && index < Math.min(this.videoPages, this.currentPage * this.pageCount)) {
                item.isPosted = false;
              }
              return item;
            });
          }
        })
        .catch((err) => {
          console.log(err);
          this.pagesDetail = this.pagesDetail.map((item, index) => {
            if (index >= (this.currentPage - 1) * this.pageCount && index < Math.min(this.videoPages, this.currentPage * this.pageCount)) {
              item.isPosted = false;
            }
            return item;
          });
        });
      this.pagesDetail = this.pagesDetail.map((item, index) => {
        if (index >= (this.currentPage - 1) * this.pageCount && index < Math.min(this.videoPages, this.currentPage * this.pageCount)) {
          item.loading = false;
        }
        return item;
      });
    },
    // 点击分P执行的操作，如果存在分P则跳转至相应的视频详情页面，否则使用当前视频的标签发布索引
    pageOpts(index, _blank = false) {
      if ($("html").scrollTop() && !_blank) {
        // 回到顶部
        //动画效果
        $("html").animate({ scrollTop: 0 }, 100);
      }
      if (this.pagesDetail[index].isPosted) {
        if (_blank) {
          let routerPath = this.$router.resolve({
            path: "/video",
            query: {
              id: this.pagesDetail[index].id,
            },
          });
          window.open(routerPath.href, "_blank");
        } else
          this.$router
            .push({
              path: "/video",
              query: {
                id: this.pagesDetail[index].id,
              },
            })
            .catch(() => {});
      } else {
        let routerPath = this.$router.resolve({
          path: "/postvideo",
          query: {
            use_tags: this.$route.query.id,
            url: this.pagesDetail[index].url,
            type: this.$parent.myVideoData.video.item.repost_type,
          },
        });
        window.open(routerPath.href, "_blank");

        // this.postingPage = this.pagesDetail[index];
        // this.confirmPosting = true;
      }
    },
  },
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
  max-height: 300px;
  overflow: auto;
}
.PageItems {
  line-height: 25px;
  margin-bottom: 5px;
  margin-top: 5px;
  transition: all 0.4s ease;
}
.PageItemsActive {
  background-color: rgba(223, 223, 223, 0.87);
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

<i18n folder></i18n>
