<template>
  <el-dialog title="上传字幕" :visible.sync="stuv" width="70%">
    <el-row :gutter="20">
      <el-col :span="8">
        <h3 class="bbg">{{ $t("subtitle_properties") }}</h3>
        <div class="option">
          {{ $t("subtitle_type") }}
          <el-select v-model="stype" size="small">
            <el-option v-for="item in stypes" :key="item" :label="item" :value="item"></el-option>
          </el-select>
        </div>
        <div class="option">
          {{ $t("subtitle_lang") }}
          <el-select v-model="slang" size="small">
            <el-option v-for="item in slangs" :key="item" :label="item" :value="item"></el-option>
          </el-select>
        </div>
      </el-col>
      <el-col :span="16">
        <h3 class="bbg">{{ $t("subtitle_size", { size: getSize() }) }}</h3>
        {{ $t("paste_prompt") }}
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
          <div :class="{ et: true, vb: !dragging }">
            <h2 class="ct">{{ $t("drag_upload") }}</h2>
          </div>
        </div>
      </el-col>
    </el-row>
    <span slot="footer">
      <el-button @click="upload">{{ $t("upload") }}</el-button>
      <el-button @click="stuv = false">{{ $t("close") }}</el-button>
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
      stypes: ["srt", "vtt", "ass"],
      stype: "srt",
      slangs: ["CHS", "CHT", "CSY", "NLD", "ENG", "FRA", "DEU", "HUN", "ITA", "JPN", "KOR", "PLK", "PTB", "ROM", "RUS", "ESP", "TRK", "VIN", "UNKNOWN"],
      slang: "UNKNOWN",
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
      if (this.stypes.indexOf(filetype) > -1) {
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
          message: this.$t("upload_succeed", { r: r }),
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
