<template>
  <div>
    <DownView
      :vid="vid"
      :title="title"
      :format="stvdata.format"
      :lang="stvdata.lang"
      :size="stvdata.size"
      :content="stvdata.content || ''"
      :author="stvdata.meta ? stvdata.meta.created_by : ''"
      :visible.sync="stv"
    ></DownView>

    <UpView :vid="vid" :visible.sync="stuv"></UpView>

    <EditView v-if="stev" :subid="stevid" :origin="stevdata" :visible.sync="stev"></EditView>

    <OCRView :vid="vid" :visible.sync="ocrv"></OCRView>

    <SelectLanguageView ref="selectLanguageViewRef" :visible.sync="selectLangugaeVisible"></SelectLanguageView>

    <div class="new_top">
      <h2 style="text-align:center">字幕文件<span class="tr">测试版</span></h2>
      <div class="flex-b">
        <div>本视频有{{ stList.length }}个字幕</div>
        <div><span class="up" @click="openup">上传字幕</span> <span class="up" @click="fetch">刷新</span> <span class="up" @click="qs">字幕识别</span></div>
      </div>
    </div>
    <div v-loading="loading">
      <div v-for="st in stList" :key="st._id.$oid">
        <span class="format" v-text="st.format"></span>&nbsp;
        <span v-text="st.lang"></span>
        <span class="size">({{ filesize(st.size) }})</span>
        &nbsp;by&nbsp;<span v-if="st.meta.created_by" v-text="st.meta.created_by"></span
        ><span v-else><a href="https://github.com/PatchyVideo/MMDOCR-HighPerformance">求闻转译志</a></span
        >&nbsp; <span v-if="st.autogen" title="生成器版本">({{ st.version }})</span>&nbsp; <span class="gets" @click="show(st._id.$oid)">获取</span>&nbsp;
        <span class="gets" @click="edit(st._id.$oid)">编辑</span>&nbsp;
        <span class="gets" @click="use(st._id.$oid)">使用</span>
      </div>
    </div>
  </div>
</template>

<script>
import DownView from "./DownView";
import UpView from "./UpView";
import EditView from "./EditView";
import OCRView from "./OCRView";
import SelectLanguageView from "./SelectLanguageView";
import { list as stapiList, get as stapiGet, get_translated as stapiGetTranslated } from "./st.js";
import filesize from "filesize";

export default {
  components: {
    DownView,
    UpView,
    EditView,
    OCRView,
    SelectLanguageView,
  },
  props: {
    vid: { type: String, required: true },
    title: { type: String, required: true },
  },
  data() {
    return {
      loading: true,
      stList: [],
      stv: false,
      stvdata: {},
      stuv: false,
      stevdata: {},
      stevid: "",
      stev: false,
      ocrv: false,
      selectLangugaeVisible: false,
    };
  },
  async created() {
    await this.fetch();
  },
  methods: {
    filesize,
    async show(subid) {
      this.stvdata = await stapiGet(subid);
      this.stv = true;
    },
    async edit(subid) {
      this.stevdata = await stapiGet(subid);
      this.stevid = subid;
      this.stev = true;
    },
    use(subid) {
      this.$emit("selection-changed", subid);
    },
    openup() {
      this.stuv = true;
    },
    select_language(callback) {
      this.$refs.selectLanguageViewRef.callback = callback;
      this.selectLangugaeVisible = true;
      return this.$refs.selectLanguageViewRef.selected_language;
    },
    async get_subtitle_content(subid) {
      return await stapiGet(subid);
    },
    async get_translated(content, lang, translator) {
      return await stapiGetTranslated(content, lang, translator);
    },
    async fetch() {
      this.loading = true;
      this.stList = await stapiList(this.vid);
      this.loading = false;
    },
    qs() {
      this.ocrv = true;
    },
  },
};
</script>

<style>
.new_top {
  position: relative;
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
.gets {
  cursor: pointer;
  color: green;
}
.flex-b {
  display: flex;
  justify-content: space-between;
}
.up {
  cursor: pointer;
}
.tr {
  font-size: 12px;
  vertical-align: top;
  background: #d5eef8;
  padding: 1px 2px;
  border-radius: 0.25rem;
}
</style>
