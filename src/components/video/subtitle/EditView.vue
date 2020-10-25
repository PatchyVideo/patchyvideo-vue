<template>
  <el-dialog :title="$t('edit_subtitle')" :visible.sync="stev" width="70%">
    <el-row :gutter="20">
      <el-col :span="8">
        <h3 class="bbg">{{ $t("subtitle_properties") }}</h3>
        <div class="option">
          {{ $t("subtitle_type") }}<span v-if="stype != origin.format">{{ $t("edited") }}</span
          >：
          <el-select v-model="stype" size="small">
            <el-option v-for="item in stypes" :key="item" :label="item" :value="item"></el-option>
          </el-select>
        </div>
        <div class="option">
          {{ $t("subtitle_lang") }}<span v-if="slang != origin.lang">{{ $t("edited") }}</span
          >：
          <el-select v-model="slang" size="small">
            <el-option v-for="item in slangs" :key="item" :label="item" :value="item"></el-option>
          </el-select>
        </div>
      </el-col>
      <el-col :span="16">
        <h3 class="bbg">
          {{ $t("subtitle_content") }}<span :class="{ war: getBytes() > 8388608 }">(~{{ getSize() }})</span
          ><span v-if="content != origin.content">{{ $t("edited") }}</span>
        </h3>
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
      <el-button @click="del">{{ $t("delete") }}</el-button>
      <el-button @click="edit">{{ $t("submit") }}</el-button>
      <el-button @click="stev = false">{{ $t("close") }}</el-button>
    </span>
  </el-dialog>
</template>

<script>
import filesize from "filesize";
import { changeMeta, changeContent, del } from "./st.js";

export default {
  props: {
    subid: { type: String, required: true },
    origin: { type: Object, required: true },
    visible: { type: Boolean, default: false },
  },
  data() {
    return {
      stev: this.visible,
      stypes: ["srt", "vtt", "ass"],
      stype: this.origin.format || "srt",
      slangs: ["CHS", "CHT", "CSY", "NLD", "ENG", "FRA", "DEU", "HUN", "ITA", "JPN", "KOR", "PLK", "PTB", "ROM", "RUS", "ESP", "TRK", "VIN", "UNKNOWN"],
      slang: this.origin.lang || "UNKNOWN",
      dragging: false,
      content: this.origin.content || "",
    };
  },
  watch: {
    visible(n) {
      this.stev = n;
    },
    stev(n) {
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
    async edit() {
      if (this.stype != this.origin.format || this.slang != this.origin.lang) {
        if (!(await changeMeta(this.subid, this.slang, this.stype))) {
          this.$message({
            message: this.$t("update_failed"),
            type: "error",
          });
          return;
        }
      }
      if (this.content != this.origin.content) {
        if (!(await changeContent(this.subid, this.content))) {
          this.$message({
            message: this.$t("update_failed"),
            type: "error",
          });
          return;
        }
      }
      this.$message({
        message: this.$t("update_succeed"),
        type: "success",
      });
      this.stev = false;
    },
    async del() {
      return this.$confirm(this.$t("delete_prompt"), this.$t("confirm"), {
        confirmButtonText: this.$t("ok"),
        cancelButtonText: this.$t("cancel"),
        type: "warning",
      })
        .then(async () => {
          if (await del(this.subid)) {
            this.$message({
              type: "success",
              message: this.$t("delete_succeed"),
            });
            this.stev = false;
          } else {
            this.$message({
              message: this.$t("delete_failed"),
              type: "error",
            });
          }
        })
        .catch(() => {});
    },
    getSize() {
      return filesize(this.getBytes());
    },
    getBytes() {
      return new Blob([this.content]).size;
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
.war {
  color: orange;
}
</style>
