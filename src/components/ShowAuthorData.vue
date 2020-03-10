<!--    vue组件：ShowAuthorData.vue     -->
<!--
    组件：标签编辑页面作者详情
    大小：100%*400px（最小宽度）
    功能：编辑作者详情
    必要传入参数：作者标签ID
    其他说明：最好潜入在父组件的对话框组件中
    更新日志：
    ★待解决问题：
-->
<i18n>
{
  "CHS": {
    "author_type": "作者类型",
    "user_url": "官网/空间",
    "no_user_url": "暂无官网/空间地址",
    "enter_user_url_prompt": "在这里输入官网/空间地址",
    "add": "添加",
    "author_tags": "相关标签",
    "no_tag": "暂无标签",
    "no_desc": "暂无简介",
    "enter_tag_prompt": "请输入标签",
    "user_desc": "简介",
    "write_something": "写点儿什么吧~",
    "user_picture": "头像",
    "change_method": "切换上传方式",
    "upload_picture": "从这里上传头像",
    "file_too_large": "没反应？文件太大了哦",
    "upload_succeed": "上传成功！",
    "del": "删除",
    "no_url": "暂无URL",
    "enter_pic_url_prompt": "在这里输入头像的URL~",
    "back": "返回",
    "commit": "提交修改",
    "no_author_data": "暂无该作者数据",
    "individual": "个人",
    "group": "社团",
    "refresh": "刷新",
    "change_author_data": "修改内容",
    "select_author_type": "请选择作者类型!",
    "enter_url": "请输入至少一个地址!",
    "one_picture": "只能上传一个头像！",
    "update_succeed": "修改成功!",
    "tag_not_exist": "输入Tag必须存在于Tag库中!",
    "tag_add_succeed": "Tag添加成功!",
    "tag_already_exist": "Tag已存在！",
    "unknown_error": "未知错误"
  },
  "ENG": {
    "author_type": "Author Type",
    "user_url": "Author URLs",
    "no_user_url": "No URLs",
    "enter_user_url_prompt": "Enter author URLs here",
    "add": "Add",
    "author_tags": "Author tags",
    "no_tag": "No tags",
    "no_desc": "No description",
    "enter_tag_prompt": "Enter tag",
    "user_desc": "Description",
    "write_something": "Describe him/her",
    "user_picture": "Author Photo",
    "change_method": "Toggle Upload",
    "upload_picture": "Upload here",
    "file_too_large": "File too large",
    "upload_succeed": "Upload succeed",
    "del": "Delete",
    "no_url": "No URL",
    "enter_pic_url_prompt": "Enter URL to author photo",
    "back": "Back",
    "commit": "Commit",
    "no_author_data": "No author data found",
    "individual": "Individual",
    "group": "Doujin Circle",
    "refresh": "Refreash",
    "change_author_data": "Change",
    "select_author_type": "Please select author type",
    "enter_url": "Please enter URL",
    "one_picture": "Only one photo is allowed",
    "update_succeed": "Update succeed",
    "tag_not_exist": "Tag not exist",
    "tag_add_succeed": "Add tag succeed",
    "tag_already_exist": "Tag already exist",
    "unknown_error": "Unknown error, please report bug"
  }
}
</i18n>

<template>
  <div v-loading="loading">
    <!-- 头像&各种语言标签 -->
    <div class="AuthorName">
      <!-- 头像 -->
      <el-avatar fit="cover" style="margin-right:5px" :size="30" :src="author.avatar"></el-avatar>
      <span class="tagLabel" v-if="authorLanguages.CHS">
        简体中文:
        <span class="tagName" @click="gotoHome(authorLanguages.CHS)">
          {{
          authorLanguages.CHS
          }}
        </span>
      </span>
      <span class="tagLabel" v-if="authorLanguages.CHT">
        繁體中文:
        <span class="tagName" @click="gotoHome(authorLanguages.CHT)">
          {{
          authorLanguages.CHT
          }}
        </span>
      </span>
      <span class="tagLabel" v-if="authorLanguages.JPN">
        日本語:
        <span class="tagName" @click="gotoHome(authorLanguages.JPN)">
          {{
          authorLanguages.JPN
          }}
        </span>
      </span>
      <span class="tagLabel" v-if="authorLanguages.ENG">
        English:
        <span class="tagName" @click="gotoHome(authorLanguages.ENG)">
          {{
          authorLanguages.ENG
          }}
        </span>
      </span>
      <span class="tagLabel" v-if="authorLanguages.KOR">
        한국어:
        <span class="tagName" @click="gotoHome(authorLanguages.KOR)">
          {{
          authorLanguages.KOR
          }}
        </span>
      </span>
      <span class="tagLabel" v-if="authorLanguages.CSY">
        čeština:
        <span class="tagName" @click="gotoHome(authorLanguages.CSY)">
          {{
          authorLanguages.CSY
          }}
        </span>
      </span>
      <span class="tagLabel" v-if="authorLanguages.NLD">
        Nederlands:
        <span class="tagName" @click="gotoHome(authorLanguages.NLD)">
          {{
          authorLanguages.NLD
          }}
        </span>
      </span>
      <span class="tagLabel" v-if="authorLanguages.FRA">
        français:
        <span class="tagName" @click="gotoHome(authorLanguages.FRA)">
          {{
          authorLanguages.FRA
          }}
        </span>
      </span>
      <span class="tagLabel" v-if="authorLanguages.DEU">
        Deutsch:
        <span class="tagName" @click="gotoHome(authorLanguages.DEU)">
          {{
          authorLanguages.DEU
          }}
        </span>
      </span>
      <span class="tagLabel" v-if="authorLanguages.HUN">
        magyar nyelv:
        <span class="tagName" @click="gotoHome(authorLanguages.HUN)">
          {{
          authorLanguages.HUN
          }}
        </span>
      </span>
      <span class="tagLabel" v-if="authorLanguages.ITA">
        italiano:
        <span class="tagName" @click="gotoHome(authorLanguages.ITA)">
          {{
          authorLanguages.ITA
          }}
        </span>
      </span>
      <span class="tagLabel" v-if="authorLanguages.PLK">
        polski:
        <span class="tagName" @click="gotoHome(authorLanguages.PLK)">
          {{
          authorLanguages.PLK
          }}
        </span>
      </span>
      <span class="tagLabel" v-if="authorLanguages.PTB">
        português:
        <span class="tagName" @click="gotoHome(authorLanguages.PTB)">
          {{
          authorLanguages.PTB
          }}
        </span>
      </span>
      <span class="tagLabel" v-if="authorLanguages.ROM">
        limba română:
        <span class="tagName" @click="gotoHome(authorLanguages.ROM)">
          {{
          authorLanguages.ROM
          }}
        </span>
      </span>
      <span class="tagLabel" v-if="authorLanguages.RUS">
        русский язык:
        <span class="tagName" @click="gotoHome(authorLanguages.RUS)">
          {{
          authorLanguages.RUS
          }}
        </span>
      </span>
      <span class="tagLabel" v-if="authorLanguages.ESP">
        español:
        <span class="tagName" @click="gotoHome(authorLanguages.ESP)">
          {{
          authorLanguages.ESP
          }}
        </span>
      </span>
      <span class="tagLabel" v-if="authorLanguages.TRK">
        Türk dili:
        <span class="tagName" @click="gotoHome(authorLanguages.TRK)">
          {{
          authorLanguages.TRK
          }}
        </span>
      </span>
      <span class="tagLabel" v-if="authorLanguages.VIN">
        Tiếng Việt:
        <span class="tagName" @click="gotoHome(authorLanguages.VIN)">
          {{
          authorLanguages.VIN
          }}
        </span>
      </span>
      <!-- 标签别名 -->
      <span class="tagLabel" v-for="item in authorAlias" :key="item">
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
              <el-option
                v-for="item in authorTypes"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item :label="$t('user_url')" prop="userSpaces">
            <p v-for="(URL, index) in author.userSpaces" :key="URL">
              <a target="_blank" :href="URL" :key="URL">{{ URL }}</a>
              <el-button type="text" style="margin-left:5px" @click="deluserSpace(index)">删除</el-button>
            </p>
            <p v-if="!author.userSpaces.length">{{$t('no_user_url')}}</p>
          </el-form-item>
          <el-form-item>
            <el-input
              :placeholder="$t('enter_user_url_prompt')"
              clearable
              v-model="URLval"
              @keyup.enter.native="adduserSpace()"
            >
              <template slot="prepend"></template>
              <el-button slot="append" @click="adduserSpace()">{{$t('add')}}</el-button>
            </el-input>
          </el-form-item>
          <el-form-item :label="$t('author_tags')">
            <el-tag
              :disable-transitions="true"
              v-for="tag in author.commonTags"
              :key="tag"
              style="margin:10px;"
              closable
              @close="handleClose(tag)"
            >{{ tag }}</el-tag>
            <p v-if="!author.commonTags.length">{{$t('no_tag')}}</p>
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
              <el-button @click="addTag" slot="append" :loading="loading2">{{$t('add')}}</el-button>
            </el-autocomplete>
          </el-form-item>
          <el-form-item :label="$t('desc')" style="margin-top:5px">
            <el-input
              type="textarea"
              :autosize="{ minRows: 4 }"
              :placeholder="$t('write_something')"
              clearable
              v-model="author.desc"
            ></el-input>
          </el-form-item>
          <el-form-item :label="$t('user_picture')" style="margin-top:5px">
            <el-button @click="useFile = !useFile" style="float:right">{{$t('change_method')}}</el-button>
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
              <el-button size type="primary" style="margin-right:10px;">{{$t('change_method')}}</el-button>
              <div>{{$t('file_too_large')}}</div>
            </el-upload>
            <div v-else>
              <p v-if="avatarURL!=''">
                {{$t('upload_succeed')}}
                <el-button type="text" style="margin-left:5px" @click="avatarURL=''">{{$t('del')}}</el-button>
              </p>
              <p v-else>{{$t('no_url')}}</p>
              <el-input
                style="width:60%"
                :placeholder="$t('enter_pic_url_prompt')"
                clearable
                v-model="avatarIpt"
                @keyup.enter.native="uploadImageUrl"
              >
                <template slot="prepend"></template>
                <el-button slot="append" @click="uploadImageUrl" :loading="loading3">{{$t('add')}}</el-button>
              </el-input>
            </div>
          </el-form-item>
        </el-form>
      </div>
      <!-- 填补foot的空间的容器 -->
      <div style="width:100%;height:60px;"></div>
      <div class="foot">
        <el-button class="Edit" @click="edit = false">{{$t('back')}}</el-button>
        <el-button type="primary" class="Edit" @click="submitData()">{{$t('commit')}}</el-button>
      </div>
    </div>

    <!-- 详情页面 -->
    <div v-else class="content">
      <span v-if="!haveData">{{$t('no_author_data')}}</span>
      <div v-else class="main">
        <el-form ref="authorForm" :model="author" label-width="auto" :rules="rules">
          <el-form-item :label="$t('author_type')">
            <p v-if="author.authorType == 'individual'">{{$t('individual')}}</p>
            <p v-else>{{$t('group')}}</p>
          </el-form-item>
          <el-form-item :v-else="$t('user_url')" prop="userSpaces">
            <p v-for="URL in author.userSpaces" :key="URL">
              <a target="_blank" :href="URL" :key="URL">{{ URL }}</a>
            </p>
            <p v-if="!author.userSpaces.length">{{$t('no_user_url')}}</p>
          </el-form-item>
          <el-form-item :label="$t('author_tags')">
            <el-tag
              :disable-transitions="true"
              v-for="tag in author.commonTags"
              :key="tag"
              style="margin:10px;"
            >
              <span style="cursor: pointer;" @click="gotoHome(tag)">
                {{
                tag
                }}
              </span>
            </el-tag>
            <p v-if="!author.commonTags.length">{{$t('no_tag')}}</p>
          </el-form-item>
          <el-form-item :label="$t('user_desc')">
            <p v-if="author.desc == ''">{{$t('no_desc')}}</p>
            <p v-else style="white-space: pre-line;">{{ author.desc }}</p>
          </el-form-item>
        </el-form>
      </div>
      <!-- 填补foot的空间的容器 -->
      <div style="width:100%;height:60px;"></div>
      <div class="foot">
        <el-button class="Edit" @click="getAuthorData()">{{$t('refresh')}}</el-button>
        <el-button type="primary" class="Edit" @click="edit = true">{{$t('change_author_data')}}</el-button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ["AuthorID"],
  data() {
    this.$i18n.locale = localStorage.getItem('lang');
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
        avatar: require("../static/img/defaultAvatar.jpg")
      },
      // 输入框中作者空间的URL
      URLval: "",
      // 输入框中标签的名字
      iptVal: "",
      // 自动补全标签的内容
      taglist: [],
      // 作者的性质选项
      authorTypes: [
        { value: "individual", label: this.$t('individual') },
        { value: "group", label: this.$t('group') }
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
          { required: true, message: this.$t('select_author_type'), trigger: "change" }
        ],
        userSpaces: [
          { required: false, message: this.$t('enter_url'), trigger: "change" }
        ]
      },
      infoTip: [
        { name: "infoTip_1", isHidden: false },
        { name: "infoTip_2", isHidden: false },
        { name: "infoTip_3", isHidden: false }
      ],
      isInfoTipClick: false
    };
  },
  created() {
    this.getAuthorData();
  },
  methods: {
    // copied from LeftNavbar.vue
    gotoHome(key) {
      if (key != "") {
        this.$router
          .push({ path: "/home", query: { keyword: key } })
          .catch(err => {
            return err;
          });
      } else {
        this.$router.push({ path: "/home" });
      }
    },
    // 标签点击搜索功能
    gotoHome(key) {
      if (key != "") {
        this.$router
          .push({ path: "/home", query: { keyword: key } })
          .catch(err => {
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
          tagid: this.AuthorID,
          tag: this.AuthorID
        }
      })
        .then(result => {
          this.authorLanguages = result.data.data.tag_obj.languages;
          this.authorAlias = result.data.data.tag_obj.alias;

          this.axios({
            method: "post",
            url: "/be/authors/get_record.do",
            data: {
              tag: this.AuthorID,
              lang: localStorage.getItem('lang')
            }
          })
            .then(result => {
              if (result.data.status == "FAILED") {
                if (result.data.data.reason == "RECORD_NOT_FOUND") {
                  this.author.authorType = "individual";
                  this.author.commonTags = [];
                  this.author.userSpaces = [];
                  this.author.desc = "";
                  this.author.avatar = require("../static/img/defaultAvatar.jpg");
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
                  this.author.avatar =
                    "be/images/userphotos/" + result.data.data.record.avatar;
                } else {
                  this.author.avatar = require("../static/img/defaultAvatar.jpg");
                }
                this.avatarKey = [];
                this.avatarIpt = "";
                this.avatarURL = "";
              }
              this.loading = false;
            })
            .catch(err => {
              this.loading = false;
            });
        })
        .catch(err => {
          this.loading = false;
        });
    },
    // 添加作者空间
    adduserSpace() {
      if (this.URLval == "") {
        if (!this.nowSubmit) {
          this.open4(this.$('enter_url'));
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
      this.$message.warning(this.$t('one_picture'));
    },
    // 删除文件调用的函数
    beforeRemove(file, fileList) {
      // return this.$confirm(`确定移除 ${file.name}？`);
      this.avatarKey = [];
    },
    // 上传文件成功之后处理数据取消上传文件的校验规则
    uploadVideoCover(response, file, fileList) {
      var cover = {};
      cover.file_key = response.data.file_key;
      cover.name = file.name;
      this.avatarKey.push(cover);
    },
    // 上传头像URL
    uploadImageUrl() {
      this.loading3 = true;
      this.axios({
        method: "post",
        url: "/be/helper/upload_image_url.do",
        data: {
          url: this.avatarIpt,
          type: "userphoto"
        }
      })
        .then(result => {
          this.avatarURL = result.data.data.file_key;
          this.avatarIpt = "";
          this.loading3 = false;
        })
        .catch(err => {
          this.loading3 = false;
        });
    },
    // 提交修改
    submitData() {
      this.nowSubmit = true;
      this.adduserSpace();
      var avatar_file_key = "";
      if (this.useFile && this.avatarKey.length) {
        avatar_file_key = this.avatarKey[0].file_key;
      } else {
        avatar_file_key = this.avatarURL;
      }
      if (
        this.author.avatar != require("../static/img/defaultAvatar.jpg") &&
        avatar_file_key == ""
      ) {
        avatar_file_key = undefined;
      }
      this.loading = true;
      this.$refs.authorForm.validate(valid => {
        if (valid) {
          this.axios({
            method: "post",
            url: "/be/authors/create_or_modify.do",
            data: {
              author_type: this.author.authorType,
              tagid: this.AuthorID,
              common_tags: this.author.commonTags,
              user_spaces: this.author.userSpaces,
              desc: this.author.desc,
              avatar_file_key: avatar_file_key
            }
          })
            .then(result => {
              this.open2(this.$t('update_succeed'));
              this.getAuthorData();
              this.edit = false;
            })
            .catch(err => {
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
      /*   this.infoTipMark = true;*/
      var url = "/autocomplete/?q=" + queryString;
      this.axios({
        method: "get",
        url: url
      }).then(result => {
        this.taglist = result.data;
        cb(result.data);
      });
    },
    infoTipEvent(event) {
      //添加TAG行为消息提示
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
        //是否属于鼠标点击选中的Tag
      } else {
        if (this.infoTipMark === true) {
          //是否属于键盘回车选中的Tag
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
      let _that = this;
      this.axios({
        method: "post",
        url: "be/tags/query_tag_categories.do ",
        data: { tags: strToArray }
      })
        .then(res => {
          if (JSON.stringify(res.data.data.categorie_map) == "{}") {
            this.open4(this.$t('tag_not_exist'));
          } else if (this.author.commonTags.indexOf(this.iptVal) != -1) {
            //存在则不允许添加
            this.iptVal = "";
            this.open3();
          } else if (
            this.author.commonTags.indexOf(this.iptVal) === -1 &&
            this.iptVal != ""
          ) {
            //不存在则添加
            this.open2(this.$t('tag_add_succeed'));
            this.author.commonTags.push(this.iptVal);
            this.iptVal = "";
          }
          this.loading2 = false;
        })
        .catch(err => {
          this.loading2 = true;
        });
    },
    open2(message) {
      this.$message({
        message: message,
        type: "success"
      });
    },
    open3() {
      this.$message({
        message: this.$t('tag_already_exist'),
        type: "warning"
      });
    },
    open4(message) {
      this.$message.error(message);
    },
    open5() {
      this.$message({
        message: this.$t('update_succeed'),
        type: "success"
      });
    },
    open6() {
      this.$message({
        message: this.$t('unknown_error'),
        type: "error"
      });
    }
  },
  watch: {
    AuthorID() {
      this.edit = false;
      this.getAuthorData();
    }
  },
  components: {}
};
</script>

<style>
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

/* 自动补全框的css */
.adviceList {
  /* 针对webkit内核（如Safari）进行的调整 */
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
