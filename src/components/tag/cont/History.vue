<template>
  <div v-loading="loading" class="bang">
    <ul>
      <li v-for="(item, index) in hisList" :key="index">
        <div v-if="item.add.length > 0 || item.del.length > 0">
          <div class="list-item">
            <div class="video-thumbnail">
              <img :src="'/images/covers/' + item.video_obj[0].item.cover_image" width="200px" height="125px" />
              <div class="Imgcover"></div>
            </div>
            <div class="video-title">
              <h4>
                <img :src="require('@/static/img/' + item.video_obj[0].item.site + '.png')" width="16px" style="margin-right: 2px; display: inline;" />
                <router-link target="_blank" :to="{ path: '/video', query: { id: item.vid.$oid } }" tag="a">{{ item.video_obj[0].item.title }}</router-link>
              </h4>
            </div>
            <div>
              <p>
                {{ $t("editor") }}
                <router-link :to="'/users/' + item.user_obj[0]._id.$oid">
                  <img :src="'be/images/userphotos/' + item.user_obj[0].profile.image" alt="头像" width="24px" height="24px" class="u-img" />
                  {{ item.user_obj[0].profile.username }}
                </router-link>
                &nbsp;{{ $t("edittime") }}{{ date2str(item.time.$date, GMT) }}
              </p>
              <div class="titleTag">
                <div v-if="item.add.length > 0" class="tag">
                  {{ $t("add") }}
                  <div v-for="(val, key) in item.add" :key="key" class="tag-div tag-add">
                    <p @click="gotoHome(val)">{{ val }}</p>
                  </div>
                </div>
                <div v-if="item.del.length > 0" class="tag">
                  {{ $t("del") }}
                  <div v-for="(val, key) in item.del" :key="key" class="tag-div tag-del">
                    <p @click="gotoHome(val)">{{ val }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <el-divider></el-divider>
        </div>
      </li>
    </ul>

    <!-- ElementUI 自带的分页器 -->
    <el-pagination
      background
      class="page-selector"
      layout="jumper, prev, pager, next, sizes"
      :current-page="page"
      :page-count="maxPage"
      :page-size="20"
      :page-sizes="[10, 20, 30, 40]"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    ></el-pagination>
  </div>
</template>

<script>
export default {
  data() {
    this.$i18n.locale = localStorage.getItem("lang");
    return {
      loading: true,

      hisList: [],
      dataNextPage: [],
      page: 1,
      maxPage: 50,
      pageSize: 20,
      GMT: 99, // 99 的时候为当前时区
    };
  },
  computed: {},
  created() {
    this.loadData();
  },

  methods: {
    // 点击标签显示标签的搜索结果
    gotoHome(key) {
      if (key != "") {
        this.$router.push({ path: "/home", query: { keyword: key } }).catch((err) => {
          return err;
        });
      } else {
        this.$router.push({ path: "/home" });
      }
    },
    handleCurrentChange(val) {
      this.page = val;
      this.loadData();
    },
    handleSizeChange(val) {
      let page = Math.floor((this.page * this.pageSize) / val);
      this.page = page || 1;
      this.pageSize = val;
      this.loadData();
    },
    userAvatar(i) {
      return "be/images/userphotos/" + i;
    },
    loadData() {
      this.loading = true;
      this.error = "";
      if (this.dataNextPage.length > 0) {
        this.hisList = this.dataNextPage;
        this.dataNextPage = [];
        this.loading = false;
      } else {
        this.axios({
          method: "post",
          url: "/be/video/raw_tag_log.do",
          data: {
            page: this.page,
            page_size: this.pageSize,
            lang: this.$i18n.locale,
          },
        })
          .then((result) => {
            let data = result.data.data;
            this.hisList = data;
            this.loading = false;
            // 回到顶部
            if ($("html").scrollTop()) {
              // 动画效果
              $("html").animate({ scrollTop: 0 }, 100);
            }
          })
          .catch(() => {
            this.$router.push({ path: "/404" });
          });
      }
      // 后页检测
      if (this.page == this.maxPage) {
        this.axios({
          method: "post",
          url: "/be/video/raw_tag_log.do",
          data: {
            page: this.page + 1,
            page_size: this.pageSize,
            lang: this.$i18n.locale,
          },
        }).then((result) => {
          if (result.data.data.length > 0) {
            this.dataNextPage = result.data.data;
            this.maxPage++;
          }
        });
      }
    },
    // 将时间戳转换为时间字符串
    // time: 时间戳 GMT:时区 (数字：-12~12)
    date2str(time, GMT) {
      let upload_time = new Date(time);
      // 获得当前时区
      let currentGMT = 0 - upload_time.getTimezoneOffset() / 60;
      if (GMT >= -12 && GMT <= 14) {
        // 时区差
        let GMToffset = GMT - (0 - currentGMT);
        // 设置为对应时区的时间
        upload_time.setTime(upload_time.getTime() + 1000 * 3600 * GMToffset);
        currentGMT = GMT;
      }
      let year = upload_time.getFullYear(); // getFullYear 方法以四位数字返回年份
      let month = upload_time.getMonth() + 1; // getMonth方法从 Date 对象返回月份 (0 ~ 11)，返回结果需要手动加一
      let days = upload_time.getDate(); // getDate 方法从 Date 对象返回一个月中的某一天 (1 ~ 31)
      let hours = upload_time.getHours(); // getHours 方法返回 Date 对象的小时 (0 ~ 23)
      let minutes = upload_time.getMinutes(); // getMinutes 方法返回 Date 对象的分钟 (0 ~ 59)
      let seconds = upload_time.getSeconds(); // getSeconds 方法返回 Date 对象的秒数 (0 ~ 59)

      return `${year}-${(Array(2).join(0) + month).slice(-2)}-${(Array(2).join(0) + days).slice(-2)} ${(Array(2).join(0) + hours).slice(-2)}:${(
        Array(2).join(0) + minutes
      ).slice(-2)}:${(Array(2).join(0) + seconds).slice(-2)} (GMT${currentGMT >= 0 ? "+" : ""}${currentGMT})`;
    },
  },
};
</script>
<style scoped lang="less">
/deep/ .el-select {
  input {
    text-align: center;
  }
}

.bang {
  text-align: left;
  width: 80%;
  margin: auto;
}
/deep/ .el-avatar {
  width: 100px !important;
  height: 100px !important;
}

.page-selector {
  display: block;
  text-align: center;
}

.list-item {
  margin: 24px 0;
  height: 100%;
  transition: all 0.3s ease;
  &:hover {
    /* background-color: rgba(255,255,255,0.3); */
    background-color: rgb(244, 244, 245);
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  }
  display: block;
  padding-top: 5px;
  padding-bottom: 5px;
  min-height: 125px;
  .video-thumbnail {
    padding-left: 2px;
    margin-right: 20px;
    float: left;
    position: relative;
    z-index: 1;
  }
  .video-thumbnail img {
    border-radius: 4px;
  }
  .u-img {
    vertical-align: middle;
    border-radius: 100px;
  }
}

.video-title {
  padding-bottom: 5px;
}
.titleTag {
  vertical-align: middle;
}
.titleTag p {
  cursor: pointer;
  color: #39c5bb;
}
.titleTag p:hover {
  color: #c539c5;
}
.tag {
  margin-top: 2px;
  margin-bottom: 2px;
  overflow: hidden;
  text-overflow: ellipsis;
}
.tag-div {
  padding: 0 12px;
  border-radius: 100px;
  border: 1px solid;
  margin-right: 8px;
  /* 使文字变为最多显示1行，多余的使用省略号代替 */
  display: -webkit-inline-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
}
.tag-add {
  border-color: lightgreen;
}
.tag-add > p {
  color: #67c23a;
}
.tag-del {
  border-color: lightcoral;
}
.tag-del > p {
  color: #f56c6c;
}
.tag-div:hover {
  border-color: #ff88a0;
}
.tag-div:hover {
  border-color: #ff88a0;
}
</style>
