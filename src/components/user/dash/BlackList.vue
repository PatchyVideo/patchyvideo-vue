<template>
  <div v-loading="loading" class="black-list">
    <el-radio-group ref="radiog" v-model="radio">
      <el-card class="box-card" :class="{ select: radio !== 3 }" @click.native="selectDiv(3)">
        <div slot="header" class="clearfix">
          <el-radio :label="3">
            <span :class="{ white: radio !== 3 }">{{ $t("default_blacklist") }}</span>
          </el-radio>
        </div>
        <div v-for="v in defaultBlackData" :key="v" class="text item">
          <el-tag>{{ v }}</el-tag>
        </div>

        <el-button style="padding: 3px 0; color: #f64c59;" type="text" @click.native="changeBlackList('default')">{{ $t("use") }}</el-button>
      </el-card>

      <el-card class="box-card" :class="{ select: radio !== 6 }" @click.native="selectDiv(6)">
        <div slot="header" class="clearfix">
          <el-radio :label="6">
            <span :class="{ white: radio !== 6 }">{{ $t("custom_blacklist") }}</span>
          </el-radio>
        </div>
        <div v-if="!textareaVisble && !inputVisible && !dynamicTags.length" class="text item" :class="{ white: radio !== 6 }">
          <h4>{{ $t("blacklist_empty_prompt") }}</h4>
        </div>
        <div v-for="tag in dynamicTags" :key="tag" class="text item">
          <el-tag closable :disable-transitions="false" @close="handleClose(tag)">{{ tag }}</el-tag>
        </div>
        <el-autocomplete
          v-if="inputVisible"
          id="ipt"
          ref="saveTagInput"
          v-model="inputValue"
          :fetch-suggestions="querySearchAsync"
          :trigger-on-focus="false"
          :placeholder="$t('Input_tags')"
          class="input-new-tag"
          size="small"
          style="margin: 20px 0px; width: 60%;"
          @select="handleSelect"
          @keyup.enter.native="handleInputConfirm"
          @blur="handleInputConfirm"
        >
          <template slot-scope="{ item }">
            <div class="adviceList">
              <div
                class="name"
                :class="{
                  Copyright: item.cat === 2,
                  Language: item.cat === 5,
                  Character: item.cat === 1,
                  Author: item.cat === 3,
                  General: item.cat === 0,
                  Meta: item.cat === 4,
                  Soundtrack: item.cat === 6,
                }"
              >
                {{ item.tag }}
              </div>
              <div v-if="item.cnt != null" class="addr">{{ item.cnt }}</div>
            </div>
          </template>
        </el-autocomplete>
        <!--<el-input
          class="input-new-tag"
          v-if="inputVisible"
          v-model="inputValue"
          ref="saveTagInput"
          size="small"
          @keyup.enter.native="handleInputConfirm"
          @blur="handleInputConfirm"
          style="margin: 20px 0px; width: 70%;"
        ></el-input>-->
        <el-input
          v-if="textareaVisble"
          ref="saveTagTextArea"
          v-model="textareaValue"
          type="textarea"
          :autosize="{ minRows: 8 }"
          :placeholder="$t('blacklist_enter_prompt')"
          style="margin: 20px 0px;"
          @blur="handleTextAreaConfirm"
        ></el-input>

        <div style="display: flex;">
          <el-button v-if="!inputVisible && !textareaVisble" class="button-new-tag" type="primary" size="small" @click="showInput">{{
            $t("add_blacklist")
          }}</el-button>
          <el-button v-if="dynamicTags.length" class="button-new-tag" type="danger" size="small" @click="removeBlackDataAll">{{
            $t("remove_all_blacklist")
          }}</el-button>
          <el-button v-if="!textareaVisble && !inputVisible" class="button-new-tag" type="primary" size="small" @click="showTextarea">{{
            $t("load_blacklist")
          }}</el-button>
        </div>

        <el-button style="padding: 3px 0; color: #f64c59;" type="text" @click.native="changeBlackList(dynamicTags)">{{ $t("use") }}</el-button>
      </el-card>
    </el-radio-group>
  </div>
</template>

<script>
export default {
  components: {},
  data() {
    this.$i18n.locale = localStorage.getItem("lang");
    return {
      defaultBlackData: [],
      blackData: [],
      radio: 3,
      dynamicTags: [],
      inputVisible: false,
      textareaVisble: false,
      inputValue: "",
      textareaValue: "",
      loading: true,
    };
  },
  created() {
    this.getDefaultBlackList();
  },
  mounted() {
    this.$refs.radiog.$children[0].$children[0]._radioGroup.handleKeydown = function() {
      return false;
    };
  },
  methods: {
    handleClose(tag) {
      this.dynamicTags.splice(this.dynamicTags.indexOf(tag), 1);
    },

    showInput() {
      this.inputVisible = true;
      this.$nextTick(() => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },
    showTextarea() {
      this.textareaVisble = true;
      this.$nextTick(() => {
        this.$refs.saveTagTextArea.$refs.textarea.focus();
      });
    },
    handleInputConfirm() {
      setTimeout(() => {
        let inputValue = this.inputValue;
        if (inputValue) {
          this.loading = true;
          this.axios({
            method: "post",
            url: "be/tags/query_tag_categories.do ",
            data: { tags: [inputValue] },
          }).then((res) => {
            if (JSON.stringify(res.data.data.categorie_map) === "{}") {
              this.$message.error(this.$t("tag_notexist_prompt"));
              this.inputValue = "";
              this.loading = false;
              return;
            } else if (this.dynamicTags.indexOf(inputValue) !== -1) {
              this.$message({
                message: this.$t("tag_already_exist_prompt"),
                type: "warning",
              });
              this.inputValue = "";
              return;
            } else if (this.dynamicTags.indexOf(inputValue) === -1) {
              this.dynamicTags.push(inputValue);
              this.inputVisible = false;
              this.inputValue = "";
              this.loading = false;
              return;
            }
            this.loading = false;
          });
        }
        this.inputVisible = false;
        this.inputValue = "";
      }, 100);
    },
    handleTextAreaConfirm() {
      let textareaValueForAraay = this.textareaValue.replace(/[\s|,]/g, ",");
      let textareaValue = Array.from(new Set(textareaValueForAraay.split(",")));
      textareaValue.map((item, index, array) => {
        if (item.toString() === "") {
          array.splice(index, 1);
        }
      });
      if (textareaValue) {
        this.axios({
          method: "post",
          url: "be/tags/query_tag_categories.do ",
          data: { tags: textareaValue },
        }).then((res) => {
          if (textareaValue.length === 0) {
            this.textareaVisble = false;
            return;
          }
          if (JSON.stringify(res.data.data.categorie_map) === "{}" && textareaValue.length !== 0) {
            this.$message.error(this.$t("tag_notexist_prompt"));
            this.inputValue = "";
            return;
          } else {
            let array = [];
            for (let i in res.data.data.categorie_map) {
              array.push(i);
            }
            let perfect = new Set(array.concat(this.dynamicTags));
            this.dynamicTags = Array.from(perfect);
          }
        });
      }

      this.textareaVisble = false;
      this.textareaValue = "";
    },
    querySearchAsync(queryString, cb) {
      let url = "/be/autocomplete/ql?q=" + queryString;
      this.axios({
        method: "get",
        url: url,
      }).then((result) => {
        this.taglist = result.data;
        cb(result.data);
      });
    },
    // 搜索输入框内的搜索文字是否包含网站内容
    createFilter(query) {
      return (sites) => {
        return sites.tag.toLowerCase().indexOf(query.toLowerCase()) === 0;
      };
    },
    handleSelect(item) {
      this.inputValue = item.tag;
    },
    getDefaultBlackList() {
      this.axios({
        method: "post",
        url: "be/tags/get_default_blacklist.do",
        data: { lang: localStorage.getItem("lang") },
      }).then((res) => {
        this.defaultBlackData = res.data.data.tags;
        this.getBlackList();
      });
    },
    selectDiv(i) {
      this.radio = i;
    },
    removeBlackDataAll() {
      this.dynamicTags = [];
    },
    getBlackList() {
      this.axios({
        method: "post",
        url: "be/user/get_blacklist.do",
        data: { lang: localStorage.getItem("lang") },
      }).then((res) => {
        this.blackData = res.data.data;
        if (res.data.data === "default" || JSON.stringify(this.defaultBlackData) === JSON.stringify(this.blackData)) {
          this.dynamicTags = [];
          this.radio = 3;
          this.loading = false;
          return;
        }
        if (JSON.stringify(this.defaultBlackData) !== JSON.stringify(this.blackData)) {
          this.radio = 6;
        }
        this.dynamicTags = this.blackData;
        this.loading = false;
      });
    },
    changeBlackList(data) {
      this.loading = true;
      this.axios({
        method: "post",
        url: "be/user/changeblacklist.do",
        data: { blacklist: data },
      }).then(() => {
        this.$message({
          message: this.$t("update_successed"),
          type: "success",
        });
        this.getBlackList();

        this.loading = false;
      });
    },
  },
};
</script>

<style scoped lang="less">
.white {
  color: black;
}
.select {
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.1);
  transform: translate3d(0, -2px, 0);
  opacity: 0.4;
  transition: all 0.5s ease;
  /* background: radial-gradient(#614B82, #00B1DD); */
}
.el-card {
  max-height: 800px;
  overflow: auto;
  transition: all 0.4s ease;
}
.button-new-tag {
  display: block;
  margin: 20px auto;
}
.el-radio-group {
  width: 100%;
  display: flex !important;
  align-items: self-start;
  .el-radio {
    width: 30%;
  }
}
.el-tag {
  margin: 0px 3px;
}
// .black-list {}
.text item {
  background-color: #99a9bf;
}
.el-carousel__item h3 {
  color: #475669;
  font-size: 14px;
  opacity: 0.75;
  line-height: 200px;
  margin: 0;
}

.el-carousel__item:nth-child(2n) {
  background-color: #99a9bf;
}

.el-carousel__item:nth-child(2n + 1) {
  background-color: #d3dce6;
}

.text {
  font-size: 14px;
}

.item {
  margin-bottom: 18px;
}

.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}
.clearfix:after {
  clear: both;
}

.box-card {
  flex: 0 0 41%;

  height: 100%;
  margin: 0 auto;
}
.Copyright {
  color: #a0a;
}
.Language {
  color: #585455;
}
.Character {
  color: #0a0;
}
.Author {
  color: #a00;
}
.General {
  color: #0073ff;
}
.Meta {
  color: #f80;
}
.Soundtrack {
  color: #ff7792;
}
</style>
