<template>
  <div style="display:inline-flex;margin-right: 10px;">
    <!--<el-input :class="newClass" v-model="newValue" style="margin-right: 5px;">
      <template v-if="newValue">
        <template v-if="loading">
          <i slot="suffix" class="el-input__icon el-icon-loading" style="color:#E6A23C;"></i>
        </template>
        <template v-else>
          <i
            slot="suffix"
            class="el-input__icon el-icon-success"
            style="color:#67C23A;"
            v-if="nouse"
          ></i>
          <i slot="suffix" class="el-input__icon el-icon-error" style="color:#F56C6C;" v-else></i>
        </template>
      </template>
    </el-input>-->
    <el-autocomplete
      v-model="newValue"
      :fetch-suggestions="CheckAysnc"
      :trigger-on-focus="false"
      :popper-class="popperClass"
      :placeholder="placeholder"
      :highlight-first-item="true"
      @keyup.enter.native="addTag"
    >
      <template v-if="newValue">
        <template v-if="loading">
          <i slot="suffix" class="el-input__icon el-icon-loading" style="color:#E6A23C;"></i>
        </template>
        <template v-else>
          <i
            slot="suffix"
            class="el-input__icon el-icon-success"
            style="color:#67C23A;"
            v-if="nouse"
          ></i>
          <i slot="suffix" class="el-input__icon el-icon-error" style="color:#F56C6C;" v-else></i>
        </template>
      </template>
      <template slot-scope="{ item }">
        <div class="adviceList">
          <div
            class="name"
            v-bind:class="{
                          Copyright: item.cat == 2,
                          Language: item.cat == 5,
                          Character: item.cat == 1,
                          Author: item.cat == 3,
                          General: item.cat == 0,
                          Meta: item.cat == 4,
                          Soundtrack: item.cat == 6
                        }"
          >{{ item.tag }}</div>
          <div class="addr">{{ item.cnt }}</div>
        </div>
      </template>
    </el-autocomplete>
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
    popperClass: { type: String },
    placeholder: { type: String },
    value: { type: String },
    filter: { type: String },
    CheckStatus: { type: Number }
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
        if (typeof this.checkValueAsync == "function") {
          //this.CheckAysnc(newValue);
        } else {
          this.Check(newValue);
        }
      }
    }
  },
  methods: {
    Check(Value) {
      if (typeof this.checkValue == "undefined") {
        this.nouse = Value != "";
        this.$emit("update:CheckStatus", Value != "" ? 1 : -1);
      } else if (typeof this.checkValue == "string") {
        this.nouse = Value != this.checkValue;
        this.$emit("update:CheckStatus", Value != this.checkValue ? 1 : -1);
      }
      this.nouse = false;
      this.$emit("update:CheckStatus", -1);
    },
    CheckAysnc(Value, callback) {
      if (!Value) return false;
      this.$emit("update:CheckStatus", 0);
      this.loading = true;
      Value = Value.toLowerCase().replace(/\ /g, "_");
      this.checkValueAsync(Value, res => {
        var value = this.value;
        value=value.toLowerCase().replace(/\ /g, "_");
        if (Value != value) {
          this.$emit("update:CheckStatus", 0);
          this.loading = true;
          return false;
        }
        var data = res.map(v => {
          return v[this.filter];
        });
        var result = data.filter(v => {
          return v == Value;
        });
        this.nouse = result.length <= 0;
        this.$emit("update:CheckStatus", result.length <= 0 ? 1 : -1);
        this.loading = false;
        return callback(res);
      });
      this.nouse = false;
      this.$emit("update:CheckStatus", -1);
    }
  }
};
</script>