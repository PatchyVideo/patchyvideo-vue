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
    >
      <template v-if="newValue">
        <template v-if="loading">
          <i slot="suffix" class="el-input__icon el-icon-loading" style="color:#E6A23C;"></i>
        </template>
        <template v-else>
          <i slot="suffix" class="el-input__icon el-icon-success" style="color:#67C23A;" v-if="nouse"></i>
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
            v-html="item.tag || ConvertLangRes(item.langs)"
          ></div>
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
          // this.CheckAysnc(newValue);
        } else {
          this.Check(newValue);
        }
      }
    }
  },
  methods: {
    Check(Value) {
      if (typeof this.checkValue == "undefined") {
        this.nouse = Value;
        this.$emit("update:CheckStatus", this.nouse ? 1 : -1);
      } else if (typeof this.checkValue == "string") {
        this.nouse = Value != this.checkValue;
        this.$emit("update:CheckStatus", this.nouse ? 1 : -1);
      }
      this.nouse = false;
      this.$emit("update:CheckStatus", -1);
    },
    CheckAysnc(Value, callback) {
      if (!Value) return false;
      this.$emit("update:CheckStatus", 0);
      this.loading = true;
      Value = Value.replace(/ /g, "_");
      this.checkValueAsync(Value, res => {
        let value = this.value;
        value = value.replace(/ /g, "_");
        if (Value != value) {
          this.$emit("update:CheckStatus", 0);
          this.loading = true;
          return false;
        }
        let resultarr = [];
        res.map(v => v.langs.map(val => resultarr.push(val.w)));
        let result = resultarr.filter(v => v == Value);
        this.nouse = result.length <= 0;
        this.$emit("update:CheckStatus", result.length <= 0 ? 1 : -1);
        this.loading = false;
        return callback(res);
      });
      this.nouse = false;
      this.$emit("update:CheckStatus", -1);
    },
    ConvertLangRes(langs, hastran = true) {
      if (!langs) return;
      let LangList = [
        { id: 1, lang: "CHS" },
        { id: 2, lang: "CHT" },
        { id: 5, lang: "ENG" },
        { id: 10, lang: "JPN" }
      ];
      let level = [10, 5, 1, 2];
      let Lang = "";
      let mainLang = "";
      let subLang = "";
      // 经过一系列计算得出主副语言

      // 匹配当前语言的 ID
      let CurrLangID = LangList.find(x => {
        return x.lang == this.$i18n.locale;
      });
      CurrLangID = CurrLangID ? CurrLangID.id : 1;

      // 匹配对应 ID 的内容
      let CurrLangWord = langs.find(x => {
        return x.l == CurrLangID;
      });
      if (!CurrLangWord) {
        for (let i = 0; i < level.length; i++) {
          CurrLangWord = langs.find(x => {
            return x.l == level[i];
          });
          if (CurrLangWord) break;
        }
      }
      mainLang = CurrLangWord.w;

      if (hastran) {
        // 副语言匹配
        // 优先级：日语，英语，简体中文，繁体中文
        let SubLangWord = null;
        for (let i = 0; i < level.length; i++) {
          if (level[i] == CurrLangWord.l) continue;
          SubLangWord = langs.find(x => {
            return x.l == level[i];
          });
          if (SubLangWord) break;
        }
        subLang = SubLangWord ? SubLangWord.w : mainLang;

        // 合成语言
        Lang = `${mainLang.replace(/_/g, " ")}`;
        Lang += `<span style='font-size:8px;color: gray;display: block;'>${subLang.replace(/_/g, " ")}</span>`;
      } else {
        Lang = mainLang;
      }
      return Lang;
    }
  }
};
</script>
<style scoped>
.adviceList {
  /* 针对 webkit 内核（如 Safari）进行的调整 */
  display: -webkit-flex;
  display: flex;
}
.addr {
  flex: 0 0 20%;
  line-height: 150%;
  font-size: 12px;
  color: #b4b4b4;
  text-align: right;
}
/* 针对类别调整颜色 */
.Copyright {
  /* font-size: 13px;
  background-color: rgb(170, 0, 170);
  color: #ffffff;
  cursor: pointer;
  border: 2px solid;
  padding: 4px;
  border-radius: 25px; */
  color: #a0a;
  cursor: pointer;
}
.Language {
  color: #585455;
  cursor: pointer;
}
.Character {
  color: #0a0;
  cursor: pointer;
}
.Author {
  color: #a00;
  cursor: pointer;
}
.General {
  color: #0073ff;
  cursor: pointer;
}
.Meta {
  color: #f80;
  cursor: pointer;
}
.Soundtrack {
  color: #ff7792;
  cursor: pointer;
}
</style>
