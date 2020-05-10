<!-- https://s2.hdslb.com/bfs/static/blive/blfe-dynamic-web/static/js/index.141cf916.js 18:25510 -->

<template>
  <div
    @mouseenter="
      (e) => {
        hover = true;
      }
    "
    @mouseleave="
      (e) => {
        hover = false;
      }
    "
    @mousemove="onMouseMove"
  >
    <div v-if="hover && loadStatus && !error" style="width: 200px; height: 125px; overflow: hidden;">
      <div class="progress-bar" :style="'height:' + prh + 'px;border-width: ' + Math.floor((prh - 2) / 2) + 'px 8px;'">
        <span ref="pspan" :style="'width:' + progress + '%'"></span>
      </div>
      <div
        v-if="loadStatus"
        class="bilibili-cover"
        :style="
          'background:url(/proxy/bili/cover/bfs/videoshot/' +
            data.image[0].replace('//i0.hdslb.com/bfs/videoshot/', '') +
            ');background-position: ' +
            x +
            'px ' +
            y +
            'px;background-size:' +
            data.img_x_len * width +
            'px;width:' +
            width +
            'px;height:' +
            (width / 16) * 9 +
            'px'
        "
      ></div>
    </div>
    <div
      v-else-if="hover && !loadStatus"
      v-loading="true"
      :style="'width:200px;height:125px;background:url(/images/covers/' + coverImage + ') center center no-repeat;background-size:100% 100%'"
    ></div>
    <div v-else :style="'width:200px;height:125px;background:url(/images/covers/' + coverImage + ') center center no-repeat;background-size:100% 100%'"></div>
  </div>
</template>

<script>
export default {
  props: {
    aid: {
      type: Number,
      required: true,
    },
    coverImage: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      imgLink: "",
      progress: 0,
      loadStatus: false,
      pic: "",
      x: 0,
      y: 0,
      size: 0,
      width: 200,
      hover: false,
      data: null,
      error: null,
      prefresh: null,
    };
  },
  computed: {
    prh() {
      return (this.width / 8) * 5 - (this.width / 16) * 9;
    },
  },
  watch: {
    hover() {
      if (this.hover && !this.loadStatus) {
        this.$axios({
          method: "get",
          url: `/proxy/bili/x/player/videoshot?aid=${this.aid}&index=1`,
        })
          .then((result) => {
            if (result.data.code === 0 && result.data.data) {
              this.data = result.data.data;
              if (this.prefresh && this.hover) {
                this.fresh(this.prefresh);
                this.prefresh = null;
              }
            } else {
              this.error = result.data.message;
            }
            this.loadStatus = true;
          })
          .catch((e) => {
            this.error = e.message;
            this.loadStatus = true;
          });
      }
    },
  },
  methods: {
    onMouseMove(e) {
      if (this.loadStatus && this.data) {
        this.fresh(e);
      } else {
        this.prefresh = e;
      }
    },
    fresh(e) {
      const i = Math.floor((e.offsetX / this.width) * this.data.index.length);
      const n = (this.data.img_y_size / this.data.img_x_size) * this.width;
      this.progress = Math.floor((e.offsetX / this.width) * 100);
      this.x = (-i % this.data.img_x_len) * this.width;
      this.y = -Math.floor(i / this.data.img_x_len) * n;
    },
  },
};
</script>

<style>
.bilibili-cover {
  left: 0;
}
.progress-bar {
  border-style: solid;
  border-color: #000;
  background: #444;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
}
.progress-bar > span {
  display: block;
  background: #fff;
  height: 2px;
}
</style>
