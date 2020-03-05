<template>
  <div style="display:inline-flex">
    <el-input :class="newClass" v-model="newValue" :value="newValue"></el-input>
    <el-tag type="success" v-if="newValue && nouse&&!loading">该标签可以添加</el-tag>
    <el-tag type="danger" v-else-if="newValue&&!nouse&&!loading">该标签已存在</el-tag>
  </div>
</template>
<script>
export default {
  props: {
    checkValue: { type: String },
    checkValueAsync: { type: Function },
    value: { type: String },
    newClass: { type: String }
  },
  created() {},
  data() {
    return {
      newValue: "",
      nouse: true,
      loading: false
    };
  },
  watch: {
    value(newValue) {
      this.newValue = newValue;
    },
    newValue(newValue, oldValue) {
      if (newValue !== oldValue) {
        this.$emit("input", this.newValue);
        this.Check(newValue);
      }
    }
  },
  methods: {
    Check(Value) {
      if (typeof this.checkValueAsync == "function") {
        if (!Value) return false;
        this.loading = true;
        Value = Value.replace(" ", "_");
        this.checkValueAsync(Value, res => {
          if (Value != this.value.replace(" ", "_")) return false;
          var result = res.filter(v => {
            return v == Value;
          });
          this.nouse = result.length <= 0;
          this.loading = false;
        });
      } else {
        if (typeof this.checkValue == "undefined") {
          this.nouse = Value != "";
        } else if (typeof this.checkValue == "string") {
          this.nouse = Value != this.checkValue;
        }
      }
      this.nouse = false;
    }
  }
};
</script>