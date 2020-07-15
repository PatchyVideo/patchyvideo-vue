<template>
  <div v-loading="loading">
    <!-- 头像&各种语言标签 -->
    <div class="AuthorName">
      <!-- 头像 -->
      <el-avatar fit="cover" style="margin-right: 5px;" :size="30" :src="author.avatar"></el-avatar>
      <span v-for="(value, name) in authorLanguages" :key="name" class="tagLabel">
        {{ getLabel(name) }}:
        <span class="tagName" @click="gotoHome(authorLanguages[name])">{{ authorLanguages[name] }}</span>
      </span>
      <!-- 标签别名 -->
      <span v-for="item in authorAlias" :key="item" class="tagLabel">
        -:
        <span class="tagName" @click="gotoHome(item)">{{ item }}</span>
      </span>
    </div>
    <!-- 编辑信息页面 -->
    <div v-if="edit" class="content">
      <div class="main">
        <el-form ref="authorForm" :model="author" label-width="auto" :rules="rules">
          <el-form-item :label="$t('author_type')" prop="authorType">
            <el-select v-model="author.authorType">
              <el-option v-for="item in authorTypes" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item :label="$t('user_url')" prop="userSpaces">
            <p v-for="(URL, index) in author.userSpaces" :key="URL">
              <a :key="URL" target="_blank" rel="noopener noreferrer" :href="URL">{{ URL }}</a>
              <el-button type="text" style="margin-left: 5px;" @click="deluserSpace(index)">删除</el-button>
            </p>
            <p v-if="!author.userSpaces.length">{{ $t("no_user_url") }}</p>
          </el-form-item>
          <el-form-item>
            <el-input v-model="URLval" :placeholder="$t('enter_user_url_prompt')" clearable @keyup.enter.native="adduserSpace()">
              <template slot="prepend"></template>
              <el-button slot="append" @click="adduserSpace()">
                {{ $t("add") }}
              </el-button>
            </el-input>
          </el-form-item>
          <el-form-item :label="$t('author_tags')">
            <el-tag v-for="tag in author.commonTags" :key="tag" :disable-transitions="true" style="margin: 10px;" closable @close="handleClose(tag)">{{
              tag
            }}</el-tag>
            <p v-if="!author.commonTags.length">{{ $t("no_tag") }}</p>
          </el-form-item>
          <el-form-item>
            <el-autocomplete
              v-model="iptVal"
              :fetch-suggestions="querySearchAsync"
              :trigger-on-focus="false"
              popper-class="my-autocomplete"
              :placeholder="$t('enter_tag_prompt')"
              @select="handleSelect"
              @focus="infoTipEvent(true)"
              @blur="infoTipEvent(false)"
              @keyup.enter.native="addTag"
            >
              <template slot-scope="{ item }">
                <div class="adviceList">
                  <div
                    class="name"
                    :class="{
                      Copyright: item.cat == 2,
                      Language: item.cat == 5,
                      Character: item.cat == 1,
                      Author: item.cat == 3,
                      General: item.cat == 0,
                      Meta: item.cat == 4,
                      Soundtrack: item.cat == 6,
                    }"
                  >
                    {{ item.tag }}
                  </div>
                  <div class="addr">{{ item.cnt }}</div>
                </div>
              </template>
              <el-button slot="append" :loading="loading2" @click="addTag">
                {{ $t("add") }}
              </el-button>
            </el-autocomplete>
          </el-form-item>
          <el-form-item :label="$t('desc')" style="margin-top: 5px;">
            <el-input v-model="author.desc" type="textarea" :autosize="{ minRows: 4 }" :placeholder="$t('write_something')" clearable></el-input>
          </el-form-item>
          <el-form-item :label="$t('user_picture')" style="margin-top: 5px;">
            <el-button style="float: right;" @click="useFile = !useFile">
              {{ $t("change_method") }}
            </el-button>
            <el-upload
              v-if="useFile"
              action="be/helper/upload_image.do"
              :before-remove="beforeRemove"
              :on-success="uploadVideoCover"
              :limit="1"
              :on-exceed="handleExceed"
              :file-list="avatarKey"
              :data="avatarData"
            >
              <el-button type="primary" style="margin-right: 10px;">
                {{ $t("upload_picture") }}
              </el-button>
              <div>{{ $t("file_too_large") }}</div>
            </el-upload>
            <div v-else>
              <p v-if="avatarURL != ''">
                {{ $t("upload_succeed") }}
                <el-button type="text" style="margin-left: 5px;" @click="avatarURL = ''">{{ $t("del") }}</el-button>
              </p>
              <p v-else>{{ $t("no_url") }}</p>
              <el-input v-model="avatarIpt" style="width: 60%;" :placeholder="$t('enter_pic_url_prompt')" clearable @keyup.enter.native="uploadImageUrl">
                <template slot="prepend"></template>
                <el-button slot="append" :loading="loading3" @click="uploadImageUrl">{{ $t("add") }}</el-button>
              </el-input>
            </div>
          </el-form-item>
        </el-form>
      </div>
      <!-- 填补 foot 的空间的容器 -->
      <div style="width: 100%; height: 60px;"></div>
      <div class="foot">
        <el-button class="Edit" @click="edit = false">
          {{ $t("back") }}
        </el-button>
        <el-button type="primary" class="Edit" @click="submitData()">
          {{ $t("commit") }}
        </el-button>
      </div>
    </div>

    <!-- 详情页面 -->
    <div v-else class="content">
      <span v-if="!haveData">{{ $t("no_author_data") }}</span>
      <div v-else class="main">
        <el-form ref="authorForm" :model="author" label-width="auto" :rules="rules">
          <el-form-item :label="$t('author_type')">
            <p v-if="author.authorType == 'individual'">{{ $t("individual") }}</p>
            <p v-else>{{ $t("group") }}</p>
          </el-form-item>
          <el-form-item :v-else="$t('user_url')" prop="userSpaces">
            <p v-for="URL in author.userSpaces" :key="URL">
              <a :key="URL" target="_blank" rel="noopener noreferrer" :href="URL">{{ URL }}</a>
            </p>
            <p v-if="!author.userSpaces.length">{{ $t("no_user_url") }}</p>
          </el-form-item>
          <el-form-item :label="$t('author_tags')">
            <el-tag v-for="tag in author.commonTags" :key="tag" :disable-transitions="true" style="margin: 10px;">
              <span style="cursor: pointer;" @click="gotoHome(tag)">{{ tag }}</span>
            </el-tag>
            <p v-if="!author.commonTags.length">{{ $t("no_tag") }}</p>
          </el-form-item>
          <el-form-item :label="$t('user_desc')">
            <p v-if="author.desc == ''">{{ $t("no_desc") }}</p>
            <p v-else v-linkified style="white-space: pre-line;">{{ author.desc }}</p>
          </el-form-item>
        </el-form>
      </div>
      <!-- 填补 foot 的空间的容器 -->
      <div style="width: 100%; height: 60px;"></div>
      <div class="foot">
        <el-button class="Edit" @click="getAuthorData()">
          {{ $t("refresh") }}
        </el-button>
        <el-button type="primary" class="Edit" @click="edit = true">
          {{ $t("change_author_data") }}
        </el-button>
      </div>
    </div>
  </div>
</template>

<script>
import { getlanguagesList, getlanguagesListLabel } from "@/static/js/languagesList.js";
export default {
  components: {},
  props: {
    authorID: {
      type: String,
      required: true,
    },
  },
  data() {
    this.$i18n.locale = localStorage.getItem("lang");
    return {
      // 作者的标签名
      authorLanguages: "",
      // 作者的别名
      authorAlias: "",
      // 上传的头像（文件上传）
      avatarKey: [],
      // 上传的头像（输入框内）
      avatarIpt: "",
      // 上传的头像（URL）
      avatarURL: "",
      // 上传头像的方式
      useFile: true,
      // 头像上传绑定的信息
      avatarData: { type: "userphoto" },
      // 作者的信息
      author: {
        // 作者的性质
        authorType: "individual",
        // 作者的关联tag
        commonTags: [],
        // 作者的空间
        userSpaces: [],
        // 作者简介
        desc: "",
        // 作者头像
        avatar: require("@/static/img/defaultAvatar.jpg"),
      },
      // 输入框中作者空间的URL
      URLval: "",
      // 输入框中标签的名字
      iptVal: "",
      // 自动补全标签的内容
      taglist: [],
      // 作者的性质选项
      authorTypes: [
        { value: "individual", label: this.$t("individual") },
        { value: "group", label: this.$t("group") },
      ],
      // 作者是否有资料的标志
      haveData: false,
      // 是否进入编辑页面的标志
      edit: false,
      // 添加tag功能加载中的标志
      loading2: false,
      // 添加URL时加载的标志
      loading3: false,
      // 对话框加载的标志
      loading: false,
      // 是否出于提交的时刻
      nowSubmit: false,
      // 表单校验规则
      rules: {
        authorType: [
          {
            required: true,
            message: this.$t("select_author_type"),
            trigger: "change",
          },
        ],
        userSpaces: [{ required: false, message: this.$t("enter_url"), trigger: "change" }],
      },
      infoTip: [
        { name: "infoTip_1", isHidden: false },
        { name: "infoTip_2", isHidden: false },
        { name: "infoTip_3", isHidden: false },
      ],
      isInfoTipClick: false,
      // 语言列表
      languagesList: getlanguagesList(),
    };
  },
  computed: {
    // 根据语言列表的value获取label
    getLabel() {
      return (value) => {
        return getlanguagesListLabel(value);
      };
    },
  },
  watch: {
    authorID() {
      this.edit = false;
      this.getAuthorData();
    },
  },
  created() {
    this.getAuthorData();
  },
  methods: {
    // 标签点击搜索功能
    gotoHome(key) {
      if (key != "") {
        this.$router.push({ path: "/home", query: { keyword: key } }).catch((err) => {
          return err;
        });
      } else {
        this.$router.push({ path: "/home" });
      }
    },
    // 获取作者记录
    getAuthorData() {
      this.loading = true;
      this.axios({
        method: "post",
        url: "/be/tags/get_tag.do",
        data: {
          tagid: this.authorID,
          tag: this.authorID,
        },
      })
        .then((result) => {
          this.authorLanguages = result.data.data.tag_obj.languages;
          this.authorAlias = result.data.data.tag_obj.alias;

          this.axios({
            method: "post",
            url: "/be/authors/get_record.do",
            data: {
              tag: this.authorID,
              lang: localStorage.getItem("lang"),
            },
          })
            .then((result) => {
              if (result.data.status == "FAILED") {
                if (result.data.data.reason == "RECORD_NOT_FOUND") {
                  this.author.authorType = "individual";
                  this.author.commonTags = [];
                  this.author.userSpaces = [];
                  this.author.desc = "";
                  this.author.avatar = require("@/static/img/defaultAvatar.jpg");
                  this.avatarKey = [];
                  this.avatarIpt = "";
                  this.avatarURL = "";
                  this.haveData = false;
                  this.loading = false;
                }
              } else {
                this.haveData = true;
                this.author.desc = result.data.data.record.desc;
                this.author.authorType = result.data.data.record.type;
                this.author.userSpaces = result.data.data.record.urls;
                this.author.commonTags = result.data.data.record.common_tags[0];
                if (result.data.data.record.avatar != "") {
                  this.author.avatar = "be/images/userphotos/" + result.data.data.record.avatar;
                } else {
                  this.author.avatar = require("@/static/img/defaultAvatar.jpg");
                }
                this.avatarKey = [];
                this.avatarIpt = "";
                this.avatarURL = "";
              }
              this.loading = false;
            })
            .catch(() => {
              this.loading = false;
            });
        })
        .catch(() => {
          this.loading = false;
        });
    },
    // 添加作者空间
    adduserSpace() {
      if (this.URLval == "") {
        if (!this.nowSubmit) {
          this.open4(this.$t("enter_url"));
        }
        return;
      }
      this.author.userSpaces.push(this.URLval);
      this.URLval = "";
    },
    // 删除作者空间
    deluserSpace(index) {
      this.author.userSpaces.splice(index, 1);
    },
    // 删除标签
    handleClose(tag) {
      this.author.commonTags.splice(this.author.commonTags.indexOf(tag), 1);
    },
    // 超出限制大小时调用的函数
    handleExceed() {
      this.$message.warning(this.$t("one_picture"));
    },
    // 删除文件调用的函数
    beforeRemove() {
      // return this.$confirm(`确定移除 ${file.name}？`);
      this.avatarKey = [];
    },
    // 上传文件成功之后处理数据取消上传文件的校验规则
    uploadVideoCover(response, file) {
      let cover = {};
      cover.file_key = response.data.file_key;
      cover.name = file.name;
      this.avatarKey.push(cover);
    },
    // 上传头像 URL
    uploadImageUrl() {
      this.loading3 = true;
      this.axios({
        method: "post",
        url: "/be/helper/upload_image_url.do",
        data: {
          url: this.avatarIpt,
          type: "userphoto",
        },
      })
        .then((result) => {
          this.avatarURL = result.data.data.file_key;
          this.avatarIpt = "";
          this.loading3 = false;
        })
        .catch(() => {
          this.loading3 = false;
        });
    },
    // 提交修改
    submitData() {
      this.nowSubmit = true;
      this.adduserSpace();
      let avatar_file_key = "";
      if (this.useFile && this.avatarKey.length) {
        avatar_file_key = this.avatarKey[0].file_key;
      } else {
        avatar_file_key = this.avatarURL;
      }
      if (this.author.avatar != require("@/static/img/defaultAvatar.jpg") && avatar_file_key == "") {
        avatar_file_key = undefined;
      }
      this.loading = true;
      this.$refs.authorForm.validate((valid) => {
        if (valid) {
          this.axios({
            method: "post",
            url: "/be/authors/create_or_modify.do",
            data: {
              author_type: this.author.authorType,
              tagid: this.authorID,
              common_tags: this.author.commonTags,
              user_spaces: this.author.userSpaces,
              desc: this.author.desc,
              avatar_file_key: avatar_file_key,
            },
          })
            .then(() => {
              this.open2(this.$t("update_succeed"));
              this.getAuthorData();
              this.edit = false;
            })
            .catch(() => {
              this.open6();
              this.loading = false;
            });
        } else {
          this.loading = false;
          return false;
        }
      });
    },
    // 下面是消息补全框的方法
    querySearchAsync(queryString, cb) {
      // this.infoTipMark = true;
      let url = "/autocomplete/?q=" + queryString;
      this.axios({
        method: "get",
        url: url,
      }).then((result) => {
        this.taglist = result.data;
        cb(result.data);
      });
    },
    infoTipEvent(event) {
      // 添加 TAG 行为消息提示
      if (event == true) {
        this.infoTip[0].isHidden = true;
        return;
      }
      if (event == false) {
        this.infoTip[0].isHidden = false;
        return;
      }
    },
    handleSelect(item) {
      this.iptVal = item.tag;
      this.infoTipMark = true;
    },
    addTag() {
      if (this.isInfoTipClick === true) {
        // 是否属于鼠标点击选中的 Tag
      } else {
        if (this.infoTipMark === true) {
          // 是否属于键盘回车选中的 Tag
          this.infoTipMark = false;
          this.isInfoTipClick = false;
          return;
        }
      }
      this.infoTip[0].isHidden = true;
      this.getTagCategoriesForAdd(this.iptVal);
      this.isInfoTipClick = false;
    },
    getTagCategoriesForAdd(str) {
      this.loading2 = true;
      let strToArray = str.split();
      this.axios({
        method: "post",
        url: "be/tags/query_tag_categories.do ",
        data: { tags: strToArray },
      })
        .then((res) => {
          if (JSON.stringify(res.data.data.categorie_map) == "{}") {
            this.open4(this.$t("tag_not_exist"));
          } else if (this.author.commonTags.indexOf(this.iptVal) != -1) {
            // 存在则不允许添加
            this.iptVal = "";
            this.open3();
          } else if (this.author.commonTags.indexOf(this.iptVal) === -1 && this.iptVal != "") {
            // 不存在则添加
            this.open2(this.$t("tag_add_succeed"));
            this.author.commonTags.push(this.iptVal);
            this.iptVal = "";
          }
          this.loading2 = false;
        })
        .catch(() => {
          this.loading2 = true;
        });
    },
    open2(message) {
      this.$message({
        message: message,
        type: "success",
      });
    },
    open3() {
      this.$message({
        message: this.$t("tag_already_exist"),
        type: "warning",
      });
    },
    open4(message) {
      this.$message.error(message);
    },
    open5() {
      this.$message({
        message: this.$t("update_succeed"),
        type: "success",
      });
    },
    open6() {
      this.$message({
        message: this.$t("unknown_error"),
        type: "error",
      });
    },
  },
};
</script>

<style scoped>
.content {
  width: 100%;
  min-height: 400px;
  margin: 0px;
}
.AuthorName {
  border-bottom-style: solid;
  border-bottom-width: 1px;
  border-bottom-color: #dcdfe6;
  margin-bottom: 10px;
  padding-bottom: 10px;
}
.tagLabel {
  display: inline-block;
  margin-right: 20px;
  font-size: 18px;
}
.tagName {
  color: #ff7792;
  cursor: pointer;
}
.foot {
  width: 100%;
  border-top-style: solid;
  border-top-width: 1px;
  border-top-color: #dcdfe6;
  padding-top: 10px;
  text-align: right;
  position: absolute;
  bottom: 0px;
}
.Edit {
  width: 200px;
}

/* 自动补全框的 css */
.adviceList {
  /* 针对 webkit 内核（如 Safari）进行的调整 */
  display: -webkit-flex;
  display: flex;
}
.highlighted .addr {
  color: #ddd;
}
.name {
  flex: 0 0 80%;
  font-size: 14px;
  line-height: 150%;
  white-space: normal;
  word-break: break-all;
  overflow: hidden;
  text-align: left;
}
.addr {
  flex: 0 0 20%;
  line-height: 150%;
  font-size: 12px;
  color: #b4b4b4;
  text-align: right;
}
/* 针对tag类别调整颜色 */
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
.el-form-item {
  margin-bottom: 0px;
}
</style>
