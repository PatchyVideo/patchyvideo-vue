
<template>
  <div class="bang" v-loading="loading">
    <h2 v-if="this.error">网络受到了异常波动！魔法代码：{{ btoa(this.error) }}</h2>

    <ul>
      <li v-for="(item, index) in hisList" v-bind:key="index">
        <div v-if="item.add.length>0||item.del.length>0">
          <div class="list-item">
            <div class="video-thumbnail">
              <img
                :src="'/images/covers/'+item.video_obj[0].item.cover_image"
                width="200px"
                height="125px"
              />
              <div class="Imgcover"></div>
            </div>
            <div class="video-title">
              <h4>
                <img
                  :src="require('../static/img/' + item.video_obj[0].item.site + '.png')"
                  width="16px"
                  style="margin-right:2px;display:inline;"
                />
                <router-link
                  target="_blank"
                  :to="{ path: '/video', query: { id: item.vid.$oid } }"
                  tag="a"
                >{{ item.video_obj[0].item.title }}</router-link>
              </h4>
            </div>
            <div>
              <p>
                编辑者：
                <router-link :to="'/users/'+item.user_obj[0]._id.$oid">
                  <img
                    :src="'be/images/userphotos/'+item.user_obj[0].profile.image"
                    alt="头像"
                    width="24px"
                    height="24px"
                    class="u-img"
                  />
                  {{ item.user_obj[0].profile.username }}
                </router-link>
                &nbsp;编辑时间：{{ date2str(item.time.$date,GMT) }}
              </p>
              <div class="titleTag">
                <div v-if="item.add.length>0" class="tag">
                  添加：
                  <div class="tag-div tag-add" v-for="(val, key) in item.add" :key="key">
                    <p @click="gotoHome(val)">{{ val }}</p>
                  </div>
                </div>
                <div v-if="item.del.length>0" class="tag">
                  删除：
                  <div class="tag-div tag-del" v-for="(val, key) in item.del" :key="key">
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

    <!-- ElementUI自带的分页器 -->
    <el-pagination
      background
      class="page-selector"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      layout="jumper, prev, pager, next, sizes"
      :current-page="this.page"
      :page-count="this.maxPage"
      :page-size="20"
      :page-sizes="[10, 20, 30, 40]"
    ></el-pagination>
  </div>
</template>

<script>
export default {
  data() {
    this.$i18n.locale = localStorage.getItem("lang");
    return {
      loading: true,
      error: "",
      hisList: [],
      dataNextPage: [],
      page: 1,
      maxPage: 50,
      pageSize: 20,
      GMT: 99 //99的时候为当前时区
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
        this.$router
          .push({ path: "/home", query: { keyword: key } })
          .catch(err => {
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
      var page = Math.floor((this.page * this.pageSize) / val);
      this.page = page ? page : 1;
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
            lang: this.$i18n.locale
          }
        })
          .then(result => {
            var data = result.data.data;
            this.hisList = data;
            this.loading = false;
          })
          .catch(error => {
            this.error = error.message;
            this.hisList = [];
            this.loading = false;
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
            lang: this.$i18n.locale
          }
        }).then(result => {
          if (result.data.data.length > 0) {
            this.dataNextPage = result.data.data;
            this.maxPage++;
          }
        });
      }
    },
    btoa(str) {
      return btoa(str);
    },
    //将时间戳转换为时间字符串
    //time:时间戳 GMT:时区(数字：-12~12)
    date2str(time, GMT) {
      var upload_time = new Date(time);
      // 获得当前时区
      var currentGMT = 0 - upload_time.getTimezoneOffset() / 60;
      console.log(GMT);
      if (GMT >= -12 && GMT <= 14) {
        // 时区差
        var GMToffset = GMT - (0 - currentGMT);
        // 设置为对应时区的时间
        upload_time.setTime(upload_time.getTime() + 1000 * 3600 * GMToffset);
        currentGMT = GMT;
      }
      var year = upload_time.getFullYear(); //getFullYear方法以四位数字返回年份
      var month = upload_time.getMonth() + 1; // getMonth方法从 Date 对象返回月份 (0 ~ 11)，返回结果需要手动加一
      var days = upload_time.getDate(); // getDate方法从 Date 对象返回一个月中的某一天 (1 ~ 31)
      var hours = upload_time.getHours(); // getHours方法返回 Date 对象的小时 (0 ~ 23)
      var minutes = upload_time.getMinutes(); // getMinutes方法返回 Date 对象的分钟 (0 ~ 59)
      var seconds = upload_time.getSeconds(); // getSeconds方法返回 Date 对象的秒数 (0 ~ 59)

      return `${year}-${(Array(2).join(0) + month).slice(-2)}-${(
        Array(2).join(0) + days
      ).slice(-2)} ${(Array(2).join(0) + hours).slice(-2)}:${(
        Array(2).join(0) + minutes
      ).slice(-2)}:${(Array(2).join(0) + seconds).slice(-2)} (GMT${
        currentGMT >= 0 ? "+" : ""
      }${currentGMT})`;
    }
  }
};
</script>
<style  scoped lang="less">
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
    /*background-color: rgba(255,255,255,0.3);*/
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

