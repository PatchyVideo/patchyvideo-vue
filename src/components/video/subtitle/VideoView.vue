<template>
  <div>
    <DownView
      :vid="vid"
      :format="stvdata.format"
      :lang="stvdata.lang"
      :size="stvdata.size"
      :content="stvdata.content || ''"
      :author="stvdata.meta ? stvdata.meta.created_by : ''"
      :visible.sync="stv"
    ></DownView>

    <UpView :vid="vid" :visible.sync="stuv"></UpView>

    <div class="new_top">
      <h2 style="text-align:center">字幕文件<span class="tr">测试版</span></h2>
      <div class="flex-b">
        <div>本视频有{{ stList.length }}个字幕</div>
        <div class="up" @click="openup">上传字幕</div>
      </div>
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
import DownView from "./DownView";
import UpView from "./UpView";
import { list as stapiList, get as stapiGet } from "./st.js";
import filesize from "filesize";

export default {
  components: {
    DownView,
    UpView,
  },
  props: {
    vid: { type: String, required: true },
  },
  data() {
    return {
      stList: [],
      stv: false,
      stvdata: {},
      stvcache: {},
      stuv: false,
    };
  },
  async created() {
    this.stList = await stapiList(this.vid);
  },
  methods: {
    filesize,
    async show(subid) {
      if (!this.stvcache[subid]) {
        this.stvcache[subid] = await stapiGet(subid);
      }
      this.stvdata = this.stvcache[subid];
      this.stv = true;
    },
    openup() {
      this.stuv = true;
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
