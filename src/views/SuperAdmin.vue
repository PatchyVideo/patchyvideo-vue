<!--

    组件：管理员页面
    更新日志：
    2/16/2020:
    待完成
-->

<i18n>
{
  "CHS": {
    "user_management":"用户管理",
    "log_view":"日志查看",
    "para_settings":"网站参数设置",
    "scripts":"网站脚本"
  },
  "ENG": {
    "user_management":"User management",
    "log_view":"Log view",
    "para_settings":"Site parameter settings",
    "scripts":"Web site scripts"
  }
}
</i18n>


<template>
  <div>
    <topnavbar></topnavbar>
    <el-container>
      <el-header>
        Header
        <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane :label="$t('user_management')" name="first">
            <usermanagemennt></usermanagemennt>
          </el-tab-pane>

          <!-- 日志查看 -->
          <el-tab-pane :label="$t('log_view')" name="second">
            <h1>{{$t('log_view')}}</h1>

            <!-- 表单 -->
            <div class="log-form">
              日志类型
              <el-select v-model="log.form.type" placeholder="请选择日志类型">
                <el-option label="原始日志" value="1"></el-option>
                <el-option label="整合后的日志" value="2"></el-option>
              </el-select>时间范围
              <el-date-picker
                v-model="log.form.timeRange"
                type="datetimerange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                value-format="yyyy-MM-dd HH:mm:ss"
              ></el-date-picker>
              <el-select v-model="log.order" class="select">
                <el-option
                  v-for="item in log.form.options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
              <el-button type="primary" @click="getLog">查找</el-button>
            </div>

            <el-table :data="log.data" border style="width: 100%">
              <el-table-column
                prop="time.$date"
                label="日期"
                sortable
                :formatter="formatterDate"
                width="180"
              ></el-table-column>
              <el-table-column prop="_id.$oid" label="I D" width="300"></el-table-column>
              <el-table-column prop="level" label="level" width="100"></el-table-column>
              <el-table-column prop="ip" label="ip" width="300"></el-table-column>
              <el-table-column prop="endpoint" label="endpoint" width="300"></el-table-column>
              <el-table-column prop="path" label="path" width="300"></el-table-column>
            </el-table>
          </el-tab-pane>

          <el-tab-pane :label="$t('para_settings')" name="third">{{$t('para_settings')}}</el-tab-pane>
          <el-tab-pane :label="$t('scripts')" name="fourth">{{$t('scripts')}}</el-tab-pane>
        </el-tabs>

		<el-pagination
		background
        @current-change="handleCurrentChange"
		layout="prev, pager, next"
		:total="1000">
		</el-pagination>
      </el-header>
      <el-main></el-main>
    </el-container>
    <!-- <Footer></Footer> -->
  </div>
</template>

<script>
import topnavbar from "../components/TopNavbar.vue";
import Footer from "../components/Footer.vue";
import usermanagemennt from "../components/admincompoents/UserManagement.vue";
export default {
  data() {
    this.$i18n.locale = localStorage.getItem("lang");
    return {
      activeName: "second",
      log: {
        //每页的log条目数量
        size:10,
        // 当前页码
        curPageNum:1,
        // 排序方式
        order: "latest",
        form: {
          name: "",
          types: ["viewlogs.do", "viewlogs_aggregated.do"],
          type: "2",
          timeRange: [],
          options: [
            { value: "latest", label: "时间正序" },
            { value: "oldest", label: "时间倒序" }
          ]
        },
        data: []
      }
    };
  },
  created() {
    this.log.form.timeRange = [
      this.dateFormat(
        "yyyy-MM-dd HH:mm:ss",
        new Date(new Date().getTime() - 24 * 60 * 60 * 1000)
      ),
      this.dateFormat("yyyy-MM-dd HH:mm:ss", new Date())
    ];
  },
  methods: {
    handleCurrentChange(val) {
      console.log(val);
      this.getLog();
      this.log.curPageNum = val;
    },
    handleClick(tab, event) {
      // console.log(tab, event);
    },
    getLog() {
	 // FIXME:后端接口会返回 date_from 字段到 最近时间的所有数据，字段 date_to 好像没有起到作用
      this.axios({
        method: "post",
        url: "/be/admin/" + this.log.form.types[this.log.form.type - 1],
        data: {
          page: this.log.curPageNum,
          page_size: this.log.size,
          date_from: this.toUTCTime("2020-03-03 19:00:00"),
          date_to: this.toUTCTime("2020-03-03 20:00:00"),
          order: this.log.order
        }
      })
        .then(ret => {
          console.log(ret.data);
          this.log.data = ret.data.data;
          // return ret.data.data.video;
        })
        .catch(err => {
          console.log("err:", err);
        });
    },
    formatterDate(row) {
        console.log(row.time.$date);
        
      return this.dateFormat("yyyy-MM-dd HH:mm:ss", new Date(row.time.$date));
    },
    /**
     *格式化日期
     */
    dateFormat(fmt, date) {
      let ret;
      const opt = {
        "y+": date.getFullYear().toString(), // 年
        "M+": (date.getMonth() + 1).toString(), // 月
        "d+": date.getDate().toString(), // 日
        "H+": date.getHours().toString(), // 时
        "m+": date.getMinutes().toString(), // 分
        "s+": date.getSeconds().toString() // 秒
        // 有其他格式化字符需求可以继续添加，必须转化成字符串
      };
      for (let k in opt) {
        ret = new RegExp("(" + k + ")").exec(fmt);
        if (ret) {
          fmt = fmt.replace(
            ret[1],
            ret[1].length == 1 ? opt[k] : opt[k].padStart(ret[1].length, "0")
          );
        }
      }
      return fmt;
    },

    /**
     * 将本地时间字符串 -> UTC时间字符串
     * @param {string date}
     * @return: UTC
     */
    toUTCTime(date) {
      var UTC = new Date(new Date(date).getTime() - 8 * 3600 * 1000);
      return this.dateFormat("yyyy-MM-dd HH:mm:ss", UTC);
    }
  },
  components: { topnavbar, Footer, usermanagemennt }
};
</script>

<style scoped>
.el-header,
.el-footer {
  background-color: #b3c0d1;
  color: #333;
  text-align: center;
  line-height: 60px;
}
.el-main {
  background-color: #e9eef3;
  color: #333;
  text-align: center;
  line-height: 160px;
}
.log-form {
  width: 80%;
  margin: auto;
}
.el-tabs{
  width: 80%;
  margin: auto;
}
</style>