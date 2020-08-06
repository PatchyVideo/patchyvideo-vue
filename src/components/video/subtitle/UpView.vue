<template>
  <el-dialog title="上传字幕" :visible.sync="stuv" width="70%">
    <el-row :gutter="20">
      <el-col :span="8">
        <h3 class="bbg">字幕属性</h3>
        <div class="option">
          字幕类型：
          <el-select v-model="stype" size="small">
            <el-option v-for="item in stypes" :key="item" :label="item" :value="item"></el-option>
          </el-select>
        </div>
        <div class="option">
          字幕语言：
          <el-select v-model="slang" size="small">
            <el-option v-for="item in slangs" :key="item" :label="item" :value="item"></el-option>
          </el-select>
        </div>
      </el-col>
      <el-col :span="16">
        <h3 class="bbg">字幕内容(~{{ getSize() }})</h3>
        粘贴字幕文件内容或将文件拖入输入区（上限8MB）
        <div class="etr">
          <textarea
            v-model="content"
            class="ctext"
            rows="20"
            spellcheck="false"
            @dragenter="dragenter"
            @dragleave="dragleave"
            @dragover.prevent="
              (e) => {
                e.dataTransfer.dropEffect = 'copy';
              }
            "
            @drop.prevent="drop"
          ></textarea>
          <div :class="{ et: true, vb: !dragging }"><h2 class="ct">拖入以上传</h2></div>
        </div>
      </el-col>
    </el-row>
    <span slot="footer">
      <el-button @click="upload">上传</el-button>
      <el-button @click="$emit('update:stuv', false)">关闭</el-button>
    </span>
  </el-dialog>
</template>

<script>
import filesize from "filesize";
import { upload } from "./st.js";

export default {
  props: {
    vid: { type: String, required: true },
    visible: { type: Boolean, default: false },
  },
  data() {
    return {
      stuv: this.visible,
      stypes: ["srf", "vtt", "ass"],
      stype: "srf",
      slangs: ["CHS", "CHT", "CSY", "NLD", "ENG", "FRA", "DEU", "HUN", "ITA", "JPN", "KOR", "PLK", "PTB", "ROM", "RUS", "ESP", "TRK", "VIN", "UNKOWN"],
      slang: "CHS",
      dragging: false,
      content: "",
    };
  },
  watch: {
    visible(n) {
      this.stuv = n;
    },
    stuv(n) {
      if (n != this.visible) this.$emit("update:visible", n);
    },
  },
  methods: {
    dragenter() {
      this.dragging = true;
    },
    dragleave() {
      this.dragging = false;
    },
    drop(e) {
      this.dragging = false;
      const file = e.dataTransfer.files[0];
      if (!file) return;
      const filetype = file.name.substring(file.name.lastIndexOf(".") + 1);
      if (this.stypes.indexOf(filetype) != 0) {
        this.stype = filetype;
      }
      const reader = new FileReader();
      reader.onload = (e) => {
        this.content = e.target.result;
      };
      reader.readAsText(file);
    },
    async upload() {
      const r = await upload(this.vid, this.slang, this.stype, this.content);
      if (r) {
        this.$message({
          message: `上传成功！字幕ID：${r}`,
          type: "success",
        });
      }
    },
    getSize() {
      return filesize(new Blob([this.content]).size);
    },
  },
};
</script>

<style>
.ctext {
  border: 1px solid gray;
  width: 100%;
  outline: none;
}
.bbg {
  border-bottom: 2px solid #21c6ef;
}
.option {
  margin: 4px 0;
}
.etr {
  position: relative;
}
.et {
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  background: #e2e2e2;
  pointer-events: none;
  transition: 0.3s all;
}
.ct {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  pointer-events: none;
}
.vb {
  opacity: 0%;
}
</style>
