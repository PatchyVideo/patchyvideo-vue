<template>
  <div>
    <!-- 修改参数的提示框 -->
    <el-dialog :title="$t('para_change.title')" :visible.sync="dialogVisible" width="30%">
      <i18n path="para_change.value" tag="span" style="white-space: pre;">
        <strong place="targetPara">{{ targetPara }}</strong>
        <code place="newTargetPara">{{ data[targetPara] }}</code>
      </i18n>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">{{ $t("_common.botton.cancel") }}</el-button>
        <el-button type="primary" @click="setPara">{{ $t("_common.botton.confirm") }}</el-button>
      </span>
    </el-dialog>

    <h1>
      {{ $t("para_settings") }}
      <a class="el-icon-refresh" @click="getPara()"></a>
    </h1>

    <el-switch
      v-model="isEdit"
      :active-text="$t('para_switch.active-text')"
      :inactive-text="$t('para_switch.inactive-text')"
      active-color="#13ce66"
      inactive-color="#ff4949"
    ></el-switch>
    <div v-loading="loading">
      <el-form ref="form" :model="data" label-width="60px" :disabled="!isEdit">
        <el-form-item v-for="(item, index) in data" :key="index" :label="index">
          <el-input v-model="data[index]" style="width: 600px;" :placeholder="item"></el-input>
          <el-button
            v-if="isEdit"
            type="primary"
            @click="
              dialogVisible = true;
              targetPara = index;
            "
            >{{ $t("para_update") }}</el-button
          >
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    this.$i18n.locale = localStorage.getItem("lang");
    return {
      // 是否处于编辑状态的判断
      isEdit: false,
      // 确认窗口弹出的标志
      dialogVisible: false,
      // 每次点击更新按钮时想要更新的目标参数（一次更新一个参数）
      targetPara: "",
      // 参数列表
      data: {
        BILICOOKIE_SESSDATA: "",
        BILICOOKIE_bili_jct: "",
        DEFAULT_BLACKLIST: "",
        DEFAULT_BLACKLIST_POPULAR_TAG: "",
        YOUTUBE_API_KEYS: "",
      },
      // 加载状态
      loading: false,
    };
  },
  mounted() {
    this.getPara();
  },
  methods: {
    // 获取参数的值
    async getPara() {
      this.loading = true;
      await this.axios({
        method: "post",
        url: "/be/config/listconfig.do",
        data: {},
      })
        .then((ret) => {
          this.data = ret.data.data;
        })
        .catch(() => {});
      this.loading = false;
    },
    // 设置参数的值
    async setPara() {
      this.loading = true;
      this.dialogVisible = false;
      await this.axios({
        method: "post",
        url: "/be/config/setconfig.do",
        data: {
          attr: this.targetPara,
          data: this.data[this.targetPara],
        },
      })
        .then(() => {})
        .catch(() => {});
      this.loading = false;
    },
  },
};
</script>

<style scoped></style>
