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
        class="u2b-cover"
        :style="
          'background-image: url(/proxy/u2b/i9ytimg/sb/' +
            imgUrl.replace('$N', 'M' + pn) +
            ');background-position: ' +
            x +
            'px ' +
            y +
            'px;background-size: ' +
            parseInt(data[3]) * width +
            'px;width: ' +
            width +
            'px;height: ' +
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
    v: {
      type: String,
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
      imgUrl: "",
      data: null,
      error: null,
      prefresh: null,
      pn: 0,
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
        this.axios({
          method: "get",
          url: `/proxy/u2b/watch?v=${this.v}`,
        })
          .then((result) => {
            const data = result.data.match(/"storyboards":{"playerStoryboardSpecRenderer":{"spec":"([^"]+)"}}/)[1];
            const cdata = data.split("|").map((v) => v.split("#"));
            this.imgUrl = cdata[0][0].replace("$L", "1").replace("https://i9.ytimg.com/sb/", "") + "&sigh=" + cdata[2][7].replace("$", "%24");
            this.data = cdata[2];
            console.log(cdata);
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
      const i = Math.floor((e.offsetX / this.width) * this.data[2]);
      const n = (this.data[1] / this.data[0]) * this.width;
      this.progress = (e.offsetX / this.width) * 100;
      this.x = ((-i % 100) % this.data[3]) * this.width;
      this.y = -Math.floor((i % 100) / this.data[3]) * n;
      this.pn = Math.floor(i / 100);
    },
  },
};
</script>

<style scoped>
.u2b-cover {
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
