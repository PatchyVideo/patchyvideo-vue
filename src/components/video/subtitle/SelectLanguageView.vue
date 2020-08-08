<template>
  <el-dialog title="选择语言Select Language" :visible.sync="showSelectLanguageDialog" width="70%">
    <el-select v-model="selected_language" style="width: 100%;">
      <el-option v-for="item in availableLanguages" :key="item.label" :label="item.label" :value="item.value"></el-option>
    </el-select>
    <span slot="footer">
      <el-button @click="use_translation()">翻译</el-button>
      <el-button @click="showSelectLanguageDialog = false">关闭</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  props: {
    visible: { type: Boolean, default: false },
  },
  data() {
    return {
      showSelectLanguageDialog: this.visible,
      selected_language: "none",
      availableLanguages: [
        { value: "none", label: "<None>" },
        { value: "zh-CN", label: "简体中文" },
        { value: "zh-TW", label: "繁體中文" },
        { value: "ja", label: "日本語" },
        { value: "en", label: "English" },
        { value: "ko", label: "한국어" },
        { value: "cs", label: "čeština" },
        { value: "nl", label: "Nederlands" },
        { value: "fr", label: "français" },
        { value: "de", label: "Deutsch" },
        { value: "hu", label: "magyar nyelv" },
        { value: "it", label: "italiano" },
        { value: "pl", label: "polski" },
        { value: "pt", label: "português" },
        { value: "ro", label: "limba română" },
        { value: "ru", label: "русский язык" },
        { value: "es", label: "español" },
        { value: "tr", label: "Türk dili" },
        { value: "vi", label: "Tiếng Việt" },
      ],
      callback: null,
    };
  },
  watch: {
    visible(n) {
      this.showSelectLanguageDialog = n;
    },
    showSelectLanguageDialog(n) {
      if (n != this.visible) this.$emit("update:visible", n);
    },
  },
  methods: {
    use_translation() {
      this.showSelectLanguageDialog = false;
      this.callback(this.selected_language);
      this.$emit("language-selected", this.selected_language);
    },
  },
};
</script>

<style>
.ctext {
  width: 100%;
  outline: none;
}
</style>
