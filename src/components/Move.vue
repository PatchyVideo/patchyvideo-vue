
<i18n>
{
  "CHS": {
    "move_up": "上移",
    "move_down": "下移"
  },
  "ENG": {
    "move_up": "Move Up",
    "move_down": "Move Down"
  }
}
</i18n>

<template>
  <div>
    <!--  <i class="fa fa-arrow-up move-up" aria-hidden="true" @click="moveUp()"></i>
    <i class="fa fa-arrow-down move-down" aria-hidden="true"  @click="moveDown"></i>
    -->

    <el-tooltip class="item move-up-box" effect="dark" :content="$t('move_up')" placement="top">
      <el-button>
        <i class="fa fa-arrow-up move-up" aria-hidden="true" @click="moveUp()"></i>
      </el-button>
    </el-tooltip>

    <el-tooltip class="item move-down-box" effect="dark" :content="$t('move_down')" placement="bottom">
      <el-button>
        <i class="fa fa-arrow-down move-down" aria-hidden="true" @click="moveDown"></i>
      </el-button>
    </el-tooltip>
  </div>
</template>

<script>
export default {
  data() {
    this.$i18n.locale = localStorage.getItem('lang');
    return {};
  },
  methods: {
    moveUp() {
      // console.log(this.msg);
      this.axios({
        method: "post",
        url: "be/list/moveup.do",
        data: this.msg
      }).then(res => {
        if (res.data.status == "SUCCEED") {
          //方案一：全局刷新、会有闪屏，且所有数据重新请求，不好。
          //this.$router.go(0);
          //方案二:VueX来监听子组件的值。

          this.$store.commit("refreshPage");
        }
      });
    },

    moveDown() {
      this.axios({
        method: "post",
        url: "be/list/movedown.do",
        data: this.msg
      }).then(res => {
        if (res.data.status == "SUCCEED") {
          //方案一：全局刷新、会有闪屏，且所有数据重新请求，不好。
          //this.$router.go(0);
          //方案二:VueX来监听子组件的值。
          this.$store.commit("refreshPage");
        }
      });
    }
  },
  props: ["msg"],
  components: {}
};
</script>

<style scoped>
div {
  display: flex;
  flex-direction: column;
}
.move-up-box {
  flex: 1;
}
.move-down-box {
  width: 100%;
  flex: 1;
}

/deep/ .el-button {
  padding: 0px;
  border: 0px;
}
i {
  height: 40px;
}
</style>