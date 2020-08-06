<template>
  <div>
    <el-dialog
      :title="stv ? `字幕文件：${stvdata.format.toUpperCase()} ${stvdata.lang}(${filesize(stvdata.size)})` : '字幕文件'"
      :visible.sync="stv"
      width="70%"
    >
      <textarea v-model="stvdata.content" class="ctext" readonly rows="20" spellcheck="false"></textarea>
      <span slot="footer">
        <el-button @click="copy(stvdata.content)">复制</el-button>
        <el-button @click="dl(stvdata)">下载</el-button>
        <el-button @click="stv = false">关闭</el-button>
      </span>
    </el-dialog>

    <div class="new_top">
      <h2 style="text-align:center">字幕文件</h2>
      <p>本视频有{{ stList.length }}个字幕</p>
    </div>
    <div>
      <div v-for="st in stList" :key="st._id.$oid">
        <span class="format" v-text="st.format"></span> <span v-text="st.lang"></span><span class="size">({{ filesize(st.size) }})</span> by
        <span v-text="st.meta.created_by || '求闻转译志'"></span> <span class="gets" @click="show(st._id.$oid)">获取</span>
      </div>
    </div>
  </div>
</template>

<script>
import stapi from "./st.js";
import filesize from "filesize";
import { copyToClipboardText, createAndDownloadFile } from "@/static/js/generic";

export default {
  props: {
    vid: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      stList: [],
      stv: false,
      stvdata: {},
      stvcache: {},
    };
  },
  async created() {
    this.stList = await stapi.list(this.vid);
  },
  methods: {
    filesize(size) {
      return filesize(size);
    },
    async show(subid) {
      if (!this.stvcache[subid]) {
        this.stvcache[subid] = await stapi.get(subid);
      }
      this.stvdata = this.stvcache[subid];
      this.stv = true;
    },
    copy(c) {
      if (copyToClipboardText(c)) {
        this.$message({
          message: "复制成功",
          type: "success",
        });
      }
    },
    dl(d) {
      if (createAndDownloadFile(`${this.vid}_${d.lang}_${d.meta.created_by || "求闻转译志"}.${d.format}`, d.content)) {
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
.new_top {
  border-bottom: 3px solid #21c6ef;
}
.format {
  text-transform: uppercase;
  background-color: orange;
  color: white;
  padding: 2px;
  border-radius: 0.25rem;
}
.size {
  color: gray;
}
.ctext {
  width: 100%;
  outline: none;
}
.gets {
  cursor: pointer;
  color: green;
}
</style>
