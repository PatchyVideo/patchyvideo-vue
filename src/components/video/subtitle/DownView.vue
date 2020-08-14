<template>
  <el-dialog :title="stv ? `字幕文件：${format.toUpperCase()} ${lang}(${filesize(size)})` : '字幕文件'" :visible.sync="stv" width="70%">
    <textarea :value="content" class="ctext" readonly rows="20" spellcheck="false"></textarea>
    <span slot="footer">
      <el-button @click="copy()">复制</el-button>
      <el-button @click="dl()">下载</el-button>
      <el-button @click="stv = false">关闭</el-button>
    </span>
  </el-dialog>
</template>

<script>
import filesize from "filesize";
import { copyToClipboardText, createAndDownloadFile } from "@/static/js/generic";

export default {
  props: {
    vid: { type: String, required: true },
    title: { type: String, required: true },
    format: { type: String, default: "srt" },
    lang: { type: String, default: "UNKNOWN" },
    size: { type: Number, default: 0 },
    content: { type: String, required: true },
    author: { type: String, required: true },
    visible: { type: Boolean, default: false },
  },
  data() {
    return {
      stv: this.visible,
    };
  },
  watch: {
    visible(n) {
      this.stv = n;
    },
    stv(n) {
      if (n != this.visible) this.$emit("update:visible", n);
    },
  },
  methods: {
    filesize,
    copy() {
      if (copyToClipboardText(this.content)) {
        this.$message({
          message: "复制成功",
          type: "success",
        });
      }
    },
    dl() {
      if (createAndDownloadFile(`${this.title}_${this.vid}_${this.lang}_${this.author || "求闻转译志"}.${this.format}`, this.content)) {
        this.$message({
          message: "下载已触发，请保存文件",
          type: "info",
        });
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
