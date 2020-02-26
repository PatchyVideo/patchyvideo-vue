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
<template>
  <div v-loading="loading">
    <!-- 各种语言标签 -->
    <div class="AuthorName">
      <span class="tagLabel" v-if="authorLanguages.CHS">
        简体中文:
        <span class="tagName" @click="gotoHome(authorLanguages.CHS)">{{
          authorLanguages.CHS
        }}</span>
      </span>
      <span class="tagLabel" v-if="authorLanguages.CHT">
        繁體中文:
        <span class="tagName" @click="gotoHome(authorLanguages.CHT)">{{
          authorLanguages.CHT
        }}</span>
      </span>
      <span class="tagLabel" v-if="authorLanguages.JPN">
        日本語:
        <span class="tagName" @click="gotoHome(authorLanguages.JPN)">{{
          authorLanguages.JPN
        }}</span>
      </span>
      <span class="tagLabel" v-if="authorLanguages.ENG">
        English:
        <span class="tagName" @click="gotoHome(authorLanguages.ENG)">{{
          authorLanguages.ENG
        }}</span>
      </span>
      <span class="tagLabel" v-if="authorLanguages.KOR">
        한국어:
        <span class="tagName" @click="gotoHome(authorLanguages.KOR)">{{
          authorLanguages.KOR
        }}</span>
      </span>
      <span class="tagLabel" v-if="authorLanguages.CSY">
        čeština:
        <span class="tagName" @click="gotoHome(authorLanguages.CSY)">{{
          authorLanguages.CSY
        }}</span>
      </span>
      <span class="tagLabel" v-if="authorLanguages.NLD">
        Nederlands:
        <span class="tagName" @click="gotoHome(authorLanguages.NLD)">{{
          authorLanguages.NLD
        }}</span>
      </span>
      <span class="tagLabel" v-if="authorLanguages.FRA">
        français:
        <span class="tagName" @click="gotoHome(authorLanguages.FRA)">{{
          authorLanguages.FRA
        }}</span>
      </span>
      <span class="tagLabel" v-if="authorLanguages.DEU">
        Deutsch:
        <span class="tagName" @click="gotoHome(authorLanguages.DEU)">{{
          authorLanguages.DEU
        }}</span>
      </span>
      <span class="tagLabel" v-if="authorLanguages.HUN">
        magyar nyelv:
        <span class="tagName" @click="gotoHome(authorLanguages.HUN)">{{
          authorLanguages.HUN
        }}</span>
      </span>
      <span class="tagLabel" v-if="authorLanguages.ITA">
        italiano:
        <span class="tagName" @click="gotoHome(authorLanguages.ITA)">{{
          authorLanguages.ITA
        }}</span>
      </span>
      <span class="tagLabel" v-if="authorLanguages.PLK">
        polski:
        <span class="tagName" @click="gotoHome(authorLanguages.PLK)">{{
          authorLanguages.PLK
        }}</span>
      </span>
      <span class="tagLabel" v-if="authorLanguages.PTB">
        português:
        <span class="tagName" @click="gotoHome(authorLanguages.PTB)">{{
          authorLanguages.PTB
        }}</span>
      </span>
      <span class="tagLabel" v-if="authorLanguages.ROM">
        limba română:
        <span class="tagName" @click="gotoHome(authorLanguages.ROM)">{{
          authorLanguages.ROM
        }}</span>
      </span>
      <span class="tagLabel" v-if="authorLanguages.RUS">
        русский язык:
        <span class="tagName" @click="gotoHome(authorLanguages.RUS)">{{
          authorLanguages.RUS
        }}</span>
      </span>
      <span class="tagLabel" v-if="authorLanguages.ESP">
        español:
        <span class="tagName" @click="gotoHome(authorLanguages.ESP)">{{
          authorLanguages.ESP
        }}</span>
      </span>
      <span class="tagLabel" v-if="authorLanguages.TRK">
        Türk dili:
        <span class="tagName" @click="gotoHome(authorLanguages.TRK)">{{
          authorLanguages.TRK
        }}</span>
      </span>
      <span class="tagLabel" v-if="authorLanguages.VIN">
        Tiếng Việt:
        <span class="tagName" @click="gotoHome(authorLanguages.VIN)">{{
          authorLanguages.VIN
        }}</span>
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
        <el-form
          ref="authorForm"
          :model="author"
          label-width="auto"
          :rules="rules"
        >
          <el-form-item label="作者类型" prop="authorType">
            <el-select v-model="author.authorType">
              <el-option
                v-for="item in authorTypes"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="官网/空间" prop="userSpaces">
            <p v-for="(URL, index) in author.userSpaces" :key="URL">
              <a target="_blank" :href="URL" :key="URL">{{ URL }}</a>
              <el-button
                type="text"
                style="margin-left:5px"
                @click="deluserSpace(index)"
                >删除</el-button
              >
            </p>
            <p v-if="!author.userSpaces.length">暂无官网/空间地址</p>
          </el-form-item>
          <el-form-item>
            <el-input
              placeholder="在这里输入官网/空间地址"
              clearable
              v-model="URLval"
              @keyup.enter.native="adduserSpace()"
            >
              <template slot="prepend"></template>
              <el-button slot="append" @click="adduserSpace()">添加</el-button>
            </el-input>
          </el-form-item>
          <el-form-item label="相关标签">
            <el-tag
              :disable-transitions="false"
              v-for="tag in author.commonTags"
              :key="tag"
              style="margin:10px;"
              closable
              @close="handleClose(tag)"
              >{{ tag }}</el-tag
            >
            <p v-if="!author.commonTags.length">暂无标签</p>
          </el-form-item>
          <el-form-item>
            <el-autocomplete
              v-model="iptVal"
              :fetch-suggestions="querySearchAsync"
              :trigger-on-focus="false"
              popper-class="my-autocomplete"
              placeholder="请输入标签"
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
                      Meta: item.cat == 4
                    }"
                  >
                    {{ item.tag }}
                  </div>
                  <div class="addr">{{ item.cnt }}</div>
                </div>
              </template>
              <el-button @click="addTag" slot="append" :loading="loading2"
                >添加</el-button
              >
            </el-autocomplete>
          </el-form-item>
          <el-form-item label="简介" style="margin-top:5px">
            <el-input
              type="textarea"
              :autosize="{ minRows: 4 }"
              placeholder="写点儿什么吧~"
              clearable
              v-model="author.desc"
            ></el-input>
          </el-form-item>
        </el-form>
      </div>
      <!-- 填补foot的空间的容器 -->
      <div style="width:100%;height:60px;"></div>
      <div class="foot">
        <el-button class="Edit" @click="edit = false">返回</el-button>
        <el-button type="primary" class="Edit" @click="submitData()"
          >提交修改</el-button
        >
      </div>
    </div>

    <!-- 详情页面 -->
    <div v-else class="content">
      <span v-if="!haveData">暂无该作者数据</span>
      <div v-else class="main">
        <el-form
          ref="authorForm"
          :model="author"
          label-width="auto"
          :rules="rules"
        >
          <el-form-item label="作者类型">
            <p v-if="author.authorType == 'individual'">个人</p>
            <p v-else>社团</p>
          </el-form-item>
          <el-form-item label="官网/空间" prop="userSpaces">
            <p v-for="URL in author.userSpaces" :key="URL">
              <a target="_blank" :href="URL" :key="URL">{{ URL }}</a>
            </p>
            <p v-if="!author.userSpaces.length">暂无官网/空间地址</p>
          </el-form-item>
          <el-form-item label="相关标签">
            <el-tag
              :disable-transitions="false"
              v-for="tag in author.commonTags"
              :key="tag"
              style="margin:10px;"
              ><span style="cursor: pointer;" @click="gotoHome(tag)">{{
                tag
              }}</span></el-tag
            >
            <p v-if="!author.commonTags.length">暂无标签</p>
          </el-form-item>
          <el-form-item label="简介">
            <p v-if="author.desc == ''">暂无简介</p>
            <p v-else v-linkified style="white-space: pre-line;">
              {{ author.desc }}
            </p>
          </el-form-item>
        </el-form>
      </div>
      <!-- 填补foot的空间的容器 -->
      <div style="width:100%;height:60px;"></div>
      <div class="foot">
        <el-button class="Edit" @click="getAuthorData()">刷新</el-button>
        <el-button type="primary" class="Edit" @click="edit = true"
          >修改内容</el-button
        >
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ["AuthorID"],
  data() {
    return {
      // 作者的标签名
      authorLanguages: "",
      // 作者的别名
      authorAlias: "",
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
        avatar: ""
      },
      // 输入框中作者空间的URL
      URLval: "",
      // 输入框中标签的名字
      iptVal: "",
      // 自动补全标签的内容
      taglist: [],
      // 作者的性质选项
      authorTypes: [
        { value: "individual", label: "个人" },
        { value: "group", label: "社团" }
      ],
      // 作者是否有资料的标志
      haveData: false,
      // 是否进入编辑页面的标志
      edit: false,
      // 添加tag功能加载中的标志
      loading2: false,
      // 对话框加载的标志
      loading: false,
      // 表单校验规则
      rules: {
        authorType: [
          { required: true, message: "请选择作者类型!", trigger: "change" }
        ],
        userSpaces: [
          { required: true, message: "请输入至少一个地址!", trigger: "change" }
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
              tag: this.AuthorID
            }
          })
            .then(result => {
              if (result.data.status == "FAILED") {
                if (result.data.data.reason == "RECORD_NOT_FOUND") {
                  this.author.authorType = "individual";
                  this.author.commonTags = [];
                  this.author.userSpaces = [];
                  this.author.desc = "";
                  this.haveData = false;
                  this.loading = false;
                }
              } else {
                this.haveData = true;
                this.author.desc = result.data.data.record.desc;
                this.author.authorType = result.data.data.record.type;
                this.author.userSpaces = result.data.data.record.urls;
                this.author.commonTags = result.data.data.record.common_tags[0];
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
        this.open4("请输入地址!");
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
    // 提交修改
    submitData() {
      this.loading = true;
      this.$refs.authorForm.validate(valid => {
        if (valid) {
          this.axios({
            method: "post",
            url: " /be/authors/create_or_modify.do",
            data: {
              author_type: this.author.authorType,
              tagid: this.AuthorID,
              common_tags: this.author.commonTags,
              user_spaces: this.author.userSpaces,
              desc: this.author.desc
            }
          })
            .then(result => {
              this.open2("修改成功!");
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
            this.open4("输入Tag必须存在于Tag库中!");
          } else if (this.author.commonTags.indexOf(this.iptVal) != -1) {
            //存在则不允许添加
            this.iptVal = "";
            this.open3();
          } else if (
            this.author.commonTags.indexOf(this.iptVal) === -1 &&
            this.iptVal != ""
          ) {
            //不存在则添加
            this.open2("Tag添加成功!");
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
        message: "Tag已存在！",
        type: "warning"
      });
    },
    open4(message) {
      this.$message.error(message);
    },
    open5() {
      this.$message({
        message: "修改成功！",
        type: "success"
      });
    },
    open6() {
      this.$message({
        message: "未知错误",
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
.el-form-item {
  margin-bottom: 0px;
}
</style>
