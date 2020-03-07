<template>
  <div style="display:inline-flex;margin-right: 10px;">
    <el-input :class="newClass" v-model="newValue" :value="newValue" style="margin-right: 5px;">
    <template v-if="newValue">
      <template v-if="loading">
        <i slot="suffix" class="el-input__icon el-icon-loading" style="color:#E6A23C;"></i>
      </template>
      <template v-else>
        <i slot="suffix" class="el-input__icon el-icon-success" style="color:#67C23A;" v-if="nouse"></i>
        <i slot="suffix" class="el-input__icon el-icon-error" style="color:#F56C6C;" v-else></i>
      </template>
    </template>
    </el-input>
    <!--<template v-if="newValue">
      <template v-if="loading">
        <i type="warning">{{query||'加载中'}}</i>
      </template>
      <template v-else>
        <i type="success" v-if="nouse">{{success||'正确'}}</i>
        <i type="danger" v-else>{{fail||'错误'}}</i>
      </template>
    </template>-->
  </div>
</template>
<script>
export default {
  props: {
    checkValue: { type: String },
    checkValueAsync: { type: Function },
    value: { type: String },
    newClass: { type: String },
    success: { type: String },
    fail: { type: String },
    query: { type: String }
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