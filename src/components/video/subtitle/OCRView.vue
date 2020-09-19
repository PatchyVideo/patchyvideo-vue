<template>
  <el-dialog :title="$t('subtitle_ocr')" :visible.sync="ovrv">
    <div>{{ $t("support_prompt") }}</div>
    <div v-loading="loading">{{ $t("ocr_status", { detail: trans(status), state: status }) }}</div>
    <span slot="footer">
      <el-button v-if="canReq(status)" @click="req">{{ $t("request_ocr") }}</el-button>
      <el-button @click="autoFetch">{{ eaf != 0 ? $t("disable_auto_refresh") : $t("enable_auto_refresh") }}</el-button>
      <el-button @click="fetch">{{ $t("refresh") }}</el-button>
      <el-button @click="ovrv = false">{{ $t("close") }}</el-button>
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
      if (!n && this.eaf != 0) this.autoFetch();
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
        NoRecord: this.$t("state_detail.NoRecord"),
        Queuing: this.$t("state_detail.Queuing"),
        Reserved: this.$t("state_detail.Reserved"),
        PendingDownload: this.$t("state_detail.PendingDownload"),
        Downloading: this.$t("state_detail.Downloading"),
        PendingProcess: this.$t("state_detail.PendingProcess"),
        Processing: this.$t("state_detail.Processing"),
        RecordExists: this.$t("state_detail.RecordExists"),
        RecordOutOfDate: this.$t("state_detail.RecordOutOfDate"),
        Error: this.$t("state_detail.Error"),
      };
      return sList[status] || this.$t("state_detail.Unknown");
    },
    canReq(status) {
      const sList = ["NoRecord", "RecordOutOfDate", "RecordExists", "Error"];
      return sList.indexOf(status) > -1;
    },
    async req() {
      if (await req(this.vid)) {
        this.$message({
          message: this.$t("request_succeed"),
          type: "info",
        });
      } else {
        this.$message({
          message: this.$t("request_failed"),
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
