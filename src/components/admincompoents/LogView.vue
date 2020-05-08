<i18n>
{
  "CHS": {
    "log_view":"日志查看",
    "log_type":" 日志类型: ",
    "log_time_range":" 时间范围: "
  },
  "ENG": {
    "log_view":"Log view"
  }
}
</i18n>
<template>
  <div v-loading="loading">
    <h1>{{ $t("log_view") }}</h1>

    <!-- 表单 -->
    <div class="log-form">
      <!-- 日志类型 -->
      <span>{{ $t("log_type") }}</span>
      <el-select v-model="log.form.type" placeholder="请选择日志类型">
        <el-option label="原始日志" value="1"></el-option>
        <el-option label="整合后的日志" value="2"></el-option>
      </el-select>

      <!-- 时间范围 -->
      <span>{{ $t("log_time_range") }}</span>
      <el-date-picker
        v-model="log.form.timeRange"
        type="datetimerange"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        value-format="yyyy-MM-dd HH:mm:ss"
      ></el-date-picker>

      <!-- 时间顺序 -->
      <el-select v-model="log.order" class="select">
        <el-option v-for="item in log.form.options" :key="item.value" :label="item.label" :value="item.value"></el-option>
      </el-select>
      <!-- 操作名 -->
      <el-input class="opts" placeholder="操作名(可选)" v-model="log.form.op" clearable></el-input>

      <el-button type="primary" @click="getLog()">查找</el-button>

      <br />

      <!-- level查看 -->
      <div class="tag-box">
        <span>level：</span>
        <el-tag @click="e => onLevelsChange()" style="margin: 0 5px;cursor: pointer;" :type="log.form.visibleLevels.includes('') ? '' : 'info'">全部</el-tag>
        <el-tag
          v-for="item in log.form.allLevels"
          :key="item"
          style="margin: 0 5px;cursor: pointer;"
          @click="e => onLevelsChange(item)"
          :type="log.form.visibleLevels.includes(item) ? '' : 'info'"
          >{{ item }}</el-tag
        >
      </div>
    </div>

    <!-- 表格 -->
    <el-table :data="log.data" border style="width: 100%">
      <!-- 展开项 -->
      <el-table-column type="expand">
        <template slot-scope="props">
          <p>日志详情：</p>
          <!-- IP属性，MSG独有 -->
          <div v-if="props.row.ip" class="detailItems">
            <span>
              <strong>IP:</strong>
              {{ props.row.ip }}
            </span>
          </div>
          <!-- args属性，MSG独有 -->
          <div v-if="props.row.args" class="detailItems">
            <span>
              <strong>args:</strong>
            </span>
            <span v-if="!props.row.args.length">NULL</span>
            <span v-for="(item, index) in props.row.args" :key="index">{{ item }}</span>
          </div>
          <!-- endpoint属性，MSG独有 -->
          <div v-if="props.row.endpoint" class="detailItems">
            <span>
              <strong>endpoint:</strong>
            </span>
            <span v-if="!props.row.endpoint.length">NULL</span>
            <span v-for="(item, index) in props.row.endpoint" :key="index">{{ item }}</span>
          </div>
          <!-- path属性，MSG独有 -->
          <div v-if="props.row.path" class="detailItems">
            <span>
              <strong>path:</strong>
            </span>
            <span v-if="!props.row.path.length">NULL</span>
            <span>{{ props.row.path }}</span>
          </div>
          <!-- user属性，WARN，SEC，ERR持有，但现阶段只能返回用户ID -->
          <div v-if="props.row.user" class="detailItems">
            <span>
              <strong>userID:</strong>
              <router-link :to="'/users/' + props.row.user.$oid" target="_blank">{{ props.row.user.$oid }}</router-link>
            </span>
          </div>
          <!-- obj属性，显示为json数据 -->
          <div v-if="props.row.obj" class="detailItems">
            <p>
              <strong>obj:</strong>
            </p>
            <pre class="objCode">{{ props.row.obj }}</pre>
          </div>
          <!-- subevents属性，显示为json数据 -->
          <div v-if="props.row.subevents ? props.row.subevents.length : 0" class="detailItems">
            <p>
              <strong>subevents:</strong>
            </p>
            <pre class="objCode">{{ props.row.subevents }}</pre>
          </div>
        </template>
      </el-table-column>
      <!-- 日期 -->
      <el-table-column prop="time.$date" label="日期" :formatter="formatterDate" width="180"></el-table-column>
      <!-- Level -->
      <el-table-column label="level" width="100">
        <template slot-scope="scope">
          <span v-bind:class="scope.row.level">{{ scope.row.level }}</span>
        </template>
      </el-table-column>
      <!-- subevents，由于版面关系只渲染“有”，并用黄色标记 -->
      <el-table-column label="subevents" width="120">
        <template slot-scope="scope">
          <span v-bind:class="{ WARN: scope.row.subevents ? scope.row.subevents.length : 0 }">{{
            scope.row.subevents ? scope.row.subevents.length : 0 ? "YES" : " "
          }}</span>
        </template>
      </el-table-column>
      <!-- op -->
      <el-table-column prop="op" label="op" width="180"></el-table-column>
      <!-- obj -->
      <el-table-column label="obj">
        <template slot-scope="scope">
          <span v-for="(val, key, index) in scope.row.obj" :key="index">
            <strong>{{ key }}</strong>
            : {{ val }};
          </span>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页器 -->
    <el-pagination background @current-change="handleCurrentChange" layout="prev, pager, next" :page-count="100"></el-pagination>
  </div>
</template>

<script>
export default {
  data() {
    this.$i18n.locale = localStorage.getItem("lang");
    return {
      log: {
        // 每页的 log 条目数量
        size: 50,
        // 当前页码
        curPageNum: 1,
        // 排序方式
        order: "latest",
        // 表单的内容
        form: {
          name: "",
          types: ["viewlogs.do", "viewlogs_aggregated.do"],
          type: "1",
          timeRange: [],
          options: [
            { value: "latest", label: "时间正序" },
            { value: "oldest", label: "时间倒序" }
          ],
          allLevels: ["SEC", "MSG", "WARN", "ERR"],
          visibleLevels: [""],
          op: ""
        },
        // 表格的内容
        data: [],
        // 加载状态
        loading: false
      }
    };
  },
  created() {
    // 初始化时间域为打开此页面的前七天到打开页面的时间
    this.log.form.timeRange = [
      this.dateFormat("yyyy-MM-dd HH:mm:ss", new Date(new Date().getTime() - 7 * 24 * 60 * 60 * 1000)),
      this.dateFormat("yyyy-MM-dd HH:mm:ss", new Date())
    ];
    this.getLog();
  },
  methods: {
    // 获取日志信息
    getLog() {
      this.loading = true;
      this.axios({
        method: "post",
        url: "/be/admin/" + this.log.form.types[this.log.form.type - 1],
        data: {
          page: this.log.curPageNum,
          page_size: this.log.size,
          date_from: this.toUTCTime(this.log.form.timeRange[0]) + " GMT+8",
          date_to: this.toUTCTime(this.log.form.timeRange[1]) + " GMT+8",
          order: this.log.order,
          op: this.log.form.op,
          levels: JSON.stringify(this.log.form.visibleLevels) == '[""]' ? ["SEC", "MSG", "WARN", "ERR"] : this.log.form.visibleLevels
        }
      })
        .then(ret => {
          this.log.data = ret.data.data;
          this.loading = false;
        })
        .catch(err => {
          this.loading = false;
        });
    },
    // 格式化日期
    formatterDate(row) {
      return this.dateFormat("yyyy-MM-dd HH:mm:ss", new Date(row.time.$date));
    },
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
          fmt = fmt.replace(ret[1], ret[1].length == 1 ? opt[k] : opt[k].padStart(ret[1].length, "0"));
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
    },
    // 切换level选项时调用
    onLevelsChange(id = "") {
      if (id == "") {
        this.log.form.visibleLevels = [""];
      } else {
        if (this.log.form.visibleLevels.includes(id)) {
          const index = this.log.form.visibleLevels.indexOf(id);
          this.log.form.visibleLevels.splice(index, 1);
        } else {
          this.log.form.visibleLevels.push(id);
          const index = this.log.form.visibleLevels.indexOf("");
          if (index > -1) {
            this.log.form.visibleLevels.splice(index, 1);
          }
        }
      }
      if (this.log.form.visibleLevels.length == 0) {
        this.log.form.visibleLevels = [""];
      }
      this.getLog();
    },
    handleCurrentChange(val) {
      this.log.curPageNum = val;
      this.getLog();
    }
  }
};
</script>

<style scoped>
.select {
  margin: 0 5px 0 5px;
}
.log-form {
  /* display: flex; */
}
.tag-box {
  margin: 10px 0 10px 0;
  display: inline-block;
}
.opts {
  width: 300px;
  margin: 0 5px 0 0;
}
.detailItems {
  margin: 5px 0 5px 0;
}
.objCode {
  display: inline-block;
  margin: 5px 0 5px 0;
  padding: 7px;
  background-color: #606266;
  color: #ffffff;
  border-radius: 4px;
}
.WARN {
  color: #e6a23c;
}
.ERR {
  color: #f56c6c;
}
</style>
