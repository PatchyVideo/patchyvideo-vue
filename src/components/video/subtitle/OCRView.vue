<template>
  <el-dialog title="字幕识别" :visible.sync="ovrv">
    <div>注意：目前只支持Bilibili和YouTube</div>
    <div v-loading="loading">识别状态：{{ trans(status) }}({{ status }})</div>
    <span slot="footer">
      <el-button v-if="canReq(status)" @click="req">申请识别</el-button>
      <el-button @click="autoFetch">{{ eaf != 0 ? "关闭自动刷新" : "开启自动刷新" }}</el-button>
      <el-button @click="fetch">刷新</el-button>
      <el-button @click="ovrv = false">关闭</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { query, req } from "./ocr.js";

export default {
  props: {
    vid: { type: String, required: true },
    visible: { type: Boolean, default: false },
  },
  data() {
    return {
      ovrv: this.visible,
      status: "UNKNOWN",
      eaf: 0,
      loading: false,
    };
  },
  watch: {
    visible(n) {
      this.ovrv = n;
      if (n) this.fetch();
    },
    ovrv(n) {
      if (n != this.visible) this.$emit("update:visible", n);
    },
  },
  destroyed() {
    if (this.eaf != 0) this.autoFetch();
  },
  methods: {
    async fetch() {
      this.loading = true;
      this.status = await query(this.vid);
      this.loading = false;
    },
    trans(status) {
      const sList = {
        NoRecord: "该视频不存在于视频识别系统的纪录中",
        Queuing: "该视频在队列中等待识别器处理",
        Reserved: "某个识别器拿到了该视频的独家识别授权",
        PendingDownload: "该视频在识别器的等待下载队列中",
        Downloading: "该视频正在被识别器下载",
        PendingProcess: "该视频在识别器的等待识别队列中",
        Processing: "该视频正在被识别器处理",
        RecordExists: "该视频已经被识别器处理过，字幕已经上传",
        RecordOutOfDate: "该视频已经被识别器处理过，但是视频内容被作者修改了，需要重新识别",
        Error: "识别器出错，多次重试均失败，请联系管理员处理",
      };
      return sList[status] || "未知状态";
    },
    canReq(status) {
      const sList = ["NoRecord", "RecordOutOfDate", "RecordExists", "Error"];
      return sList.indexOf(status) > -1;
    },
    async req() {
      if (await req(this.vid)) {
        this.$message({
          message: "申请已提交！请等待识别。等待期间可以按刷新按钮刷新状态。",
          type: "info",
        });
      } else {
        this.$message({
          message: "申请提交失败，可能是队列繁忙或没有权限",
          type: "error",
        });
      }
    },
    autoFetch() {
      if (this.eaf != 0) {
        clearInterval(this.eaf);
        this.eaf = 0;
      } else {
        this.eaf = setInterval(() => {
          this.fetch();
        }, 5000);
      }
    },
  },
};
</script>

<style>
.ctext {
  width: 100%;
  outline: none;
}
</style>
