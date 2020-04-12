<i18n>
{
  "CHS": {
	"para_settings":"网站参数设置"
  },
  "ENG": {
	"para_settings":"Site parameter settings "
  }
}
</i18n>
<template>
  <div>
    可以查询，更新部分没敢测试
    <el-dialog title="提示" :visible.sync="dialogVisible" width="30%" :before-close="handleClose">
      <span>
        你确定要修改参数
        <kbd>{{targetPara}}</kbd> 为：
      </span>
      <br />
      <code>{{data[targetPara]}}</code>
      <br />
      <span>吗？</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="setPara">确 定</el-button>
      </span>
    </el-dialog>

    <h1>{{$t('para_settings')}}</h1>
    <el-switch
      v-model="isEdit"
      active-text="编辑"
      inactive-text="查看"
      active-color="#13ce66"
      inactive-color="#ff4949"
    ></el-switch>
    <el-form ref="form" :model="data" label-width="60px" :disabled="!isEdit">
      <el-form-item :label="index" v-for="(item, index) in data" :key="index">
        <el-input style="width:600px" :placeholder="item" v-model="data[index]"></el-input>
        <el-button type="primary" v-if="isEdit" @click="dialogVisible=true;targetPara=index">更新</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  data() {
    this.$i18n.locale = localStorage.getItem("lang");
    return {
      isEdit: false,
      dialogVisible: false,
      // 每次点击更新按钮时想要更新的目标参数（一次更新一个参数）
      targetPara: "",
      data: {
        BILICOOKIE_SESSDATA: "",
        BILICOOKIE_bili_jct: "",
        DEFAULT_BLACKLIST: "",
        DEFAULT_BLACKLIST_POPULAR_TAG: "",
        YOUTUBE_API_KEYS: ""
      }
    };
  },
  mounted() {
    this.getPara();
  },
  methods: {
    getPara() {
      this.axios({
        method: "post",
        url: "/be/config/listconfig.do",
        data: {}
      }).then(ret => {
        this.data = ret.data.data;
      });
    },
    setPara() {
      this.dialogVisible = false;
      this.axios({
        method: "post",
        url: "/be/config/setconfig.do",
        data: {
          attr: this.targetPara,
          data: this.data[this.targetPara]
        }
      }).then(ret => {
        this.data = ret.data.data;
        console.log(ret.data.data);
      });
    },
    handleClose(done) {
      this.$confirm("确认关闭？")
        .then(_ => {
          done();
        })
        .catch(_ => {});
    }
  }
};
</script>

<style scoped>
</style>