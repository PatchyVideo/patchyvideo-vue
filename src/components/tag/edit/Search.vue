<!--    vue组件：tagDetail.vue     -->
<!--
    组件：标签编辑页面的标签搜索页面
    大小：100% * 600px(最小高度)
    功能：编辑搜索出的标签的界面
    必要传入参数：暂无
    更新日志：
    1/26/2020：
      release
    1/27/2020：v1.0.1
      1.显示搜索结果的标签数量进行了优化
      2.修复了鼠标悬浮在标签别名的链接上面鼠标不变成小手的bug
    1/29/2020：v1.0.2
      1.表格的展开项中不同的标签名之间的间隔优化
      2.标签名在修改之后才会显示提交按钮
      3.搜索框在输入回车之后可以执行搜索功能
    ★待解决问题：
      1.各种语言的支持希望可以用v-for实现（现在由于v-if和v-for无法兼容实现不了）
-->

<template>
  <div v-loading="loading" class="content2">
    <!-- Author 页面特有的，作者详情的组件 -->
    <el-dialog :close-on-click-modal="false" :visible.sync="showAuthorData" width="70%">
      <author-data ref="AuthorData" :author-i-d="AuthorID"></author-data>
    </el-dialog>

    <!-- 标签列表的抬头 -->
    <div class="video-list-header">
      <p v-if="maxcount">{{ $t("tag_count_prompt", { count2: count2, maxcount: maxcount }) }}</p>
      <p v-else>{{ $t("no_tag_found") }}</p>
      <el-select id="select-order" v-model="couponSelected" class="video-list-header-el-select">
        <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
      </el-select>
    </div>
    <!-- 合并标签按钮 -->
    <div class="video-list-header">
      <el-button :disabled="mergeDst == -1 || mergeSrc == -1" class="video-list-header-el-select" @click="onMergeTagButtonClicked">{{
        $t("mergeTags")
      }}</el-button>
    </div>
    <!-- 添加标签列表 -->
    <div class="addTag">
      <el-input v-model="searchTag" :placeholder="$t('tag_prompt')" class="addTag-input" @keyup.enter.native="requestSearchedTags()"></el-input>
      <el-select v-model="searchCategory" :placeholder="$t('category_prompt')" size="small" class="addTag-select">
        <el-option v-for="item in tagCategories3" :key="item" :label="item" :value="item"></el-option>
      </el-select>
      <el-button type="info" @click="requestSearchedTags()">{{ $t("search") }}</el-button>
    </div>
    <!-- 表格正文 -->
    <el-table :data="tagData" style="width: 100%;">
      <!-- 表格的展开项 -->
      <el-table-column type="expand">
        <template slot-scope="props">
          <!-- 显示作者信息的按钮 -->
          <el-button v-if="props.row.category == 'Author'" class="showAuthorData" @click="openAuthorData(props.row.id)">{{ $t("author_detial") }}</el-button>
          <!-- 为现有标签添加新的语言 -->
          <div class="languageSuppot">
            <el-row>
              <el-col :span="3">
                <el-select v-model="newTagLanguage" :placeholder="$t('select_language')" size="mini" style="width: 95%;">
                  <el-option v-for="item in languagesList2(props.row.languages)" :key="item.value" :label="item.label" :value="item"></el-option>
                </el-select>
              </el-col>
              <el-col :span="4">
                <el-input v-model="new_Tag" size="small" style="width: 100%;" @keyup.enter.native="addTagLanguage(props.$index)"></el-input>
              </el-col>
              <el-col :span="4">
                <el-button type="primary" size="mini" round class="confirmChange" @click="addTagLanguage(props.$index)">{{ $t("add") }}</el-button>
              </el-col>
            </el-row>
          </div>
          <!-- 各种语言支持 -->
          <div class="languageSuppot">
            <el-row v-for="(value, name) in props.row.languages" :key="name">
              <el-col :span="3">
                <span class="languageSuppot_language">{{ getLabel(name) }}:</span>
              </el-col>
              <el-col :span="4">
                <el-input
                  v-model="tagEdit[props.$index].languages[name]"
                  size="small"
                  style="width: 100%;"
                  @keyup.enter.native="confirmChange(props.$index, name)"
                ></el-input>
              </el-col>
              <el-col :span="4">
                <el-button
                  v-if="tagEdit[props.$index].languages[name] != tagData[props.$index].languages[name]"
                  type="primary"
                  size="mini"
                  round
                  class="confirmChange"
                  @click="confirmChange(props.$index, name)"
                  >{{ $t("confirm") }}</el-button
                >
              </el-col>
            </el-row>
          </div>
          <!-- 标签别名 -->
          <div class="languageSuppot">
            <el-row v-for="(item, i) in tagData[props.$index].alias" :key="item">
              <el-col :span="3">
                <span class="languageSuppot_language">----:</span>
              </el-col>
              <el-col :span="4">
                <el-input
                  v-model="tagEdit[props.$index].alias[i]"
                  size="small"
                  style="width: 100%;"
                  @keyup.enter.native="confirmAliasChange(props.$index, i)"
                ></el-input>
              </el-col>
              <el-col :span="4">
                <el-button
                  v-if="tagEdit[props.$index].alias[i] != tagData[props.$index].alias[i]"
                  type="primary"
                  size="mini"
                  round
                  class="confirmChange"
                  @click="confirmAliasChange(props.$index, i)"
                  >{{ $t("confirm") }}</el-button
                >
                <el-button type="danger" size="mini" round class="confirmChange" @click="confirmAliasRemove(props.$index, i)">{{ $t("del") }}</el-button>
              </el-col>
            </el-row>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="count" :label="$t('num')" min-width="60"></el-table-column>
      <el-table-column :label="$t('category')" min-width="130">
        <template slot-scope="scope">
          <div
            class="category"
            :class="{
              Copyright: scope.row.category == 'Copyright',
              Soundtrack: scope.row.category == 'Soundtrack',
              Language: scope.row.category == 'Language',
              Character: scope.row.category == 'Character',
              Author: scope.row.category == 'Author',
              General: scope.row.category == 'General',
              Meta: scope.row.category == 'Meta',
            }"
          >
            {{ scope.row.category }}
          </div>
        </template>
      </el-table-column>
      <el-table-column :label="$t('tag')" min-width="550">
        <!-- 各种语言标签 -->
        <template slot-scope="scope">
          <span v-for="(value, name) in scope.row.languages" :key="name" class="tagLabel">
            {{ getLabel(name) }}:
            <span
              class="tagLink"
              :class="{
                Copyright: scope.row.category == 'Copyright',
                Soundtrack: scope.row.category == 'Soundtrack',
                Language: scope.row.category == 'Language',
                Character: scope.row.category == 'Character',
                Author: scope.row.category == 'Author',
                General: scope.row.category == 'General',
                Meta: scope.row.category == 'Meta',
              }"
              @click="gotoHome(scope.row.languages[name])"
              >{{ scope.row.languages[name].replace(/\_/g, " ") }}</span
            >
          </span>
          <!-- 标签别名 -->
          <span v-for="item in scope.row.alias" :key="item" class="tagLabel">
            -:
            <span
              class="tagLink"
              :class="{
                Copyright: scope.row.category == 'Copyright',
                Soundtrack: scope.row.category == 'Soundtrack',
                Language: scope.row.category == 'Language',
                Character: scope.row.category == 'Character',
                Author: scope.row.category == 'Author',
                General: scope.row.category == 'General',
                Meta: scope.row.category == 'Meta',
              }"
              @click="gotoHome(item)"
              >{{ item.replace(/\_/g, " ") }}</span
            >
          </span>
        </template>
      </el-table-column>
      <!-- 合并标签选项 -->
      <el-table-column prop :label="$t('mergeOpts')" min-width="130">
        <template slot-scope="scope">
          <el-select v-model="mergeArray[scope.$index]" placeholder="-" @change="(arg1) => onMergeOptionChanged(scope.row, scope.$index, arg1)">
            <el-option v-for="item in mergeOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </template>
      </el-table-column>
      <!-- 操作,一般隐藏 -->
      <el-table-column :label="$t('op')" min-width="200" fixed="right">
        <template slot-scope="scope">
          <div v-if="advancedOptions" class="tabs-op">
            <el-button type="danger" round @click="removeTag(scope.$index)">{{ $t("delete_tag") }}</el-button>
            <el-button type="primary" round @click="openDialog(scope.$index)">{{ $t("change_category") }}</el-button>
          </div>
          <div v-else>
            <el-button type="danger" round style="margin-left: 40px;" @click="advancedOptions = true">{{ $t("show_advance") }}</el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>

    <!-- ElementUI自带的分页器 -->
    <el-pagination
      background
      class="page-selector"
      layout="prev, pager, next, sizes"
      :current-page="page"
      :total="maxcount"
      :page-size="20"
      :page-sizes="[10, 20, 30, 40]"
      hide-on-single-page
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    ></el-pagination>

    <!-- 更改分类的弹出框 -->
    <el-dialog :title="$t('prompt')" :visible.sync="dialogVisible" width="20%">
      <div style="width: 80%; margin: 0 auto;">
        <el-select v-model="newTagCategorie" :placeholder="$t('select_categoty')" style="width: 100%;">
          <el-option v-for="item in tagCategories2" :key="item" :label="item" :value="item"></el-option>
        </el-select>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">{{ $t("cancel") }}</el-button>
        <el-button type="primary" @click="renameAlias()">{{ $t("confirm2") }}</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import AuthorData from "./AuthorData.vue";
import { getlanguagesList, getlanguagesListLabel } from "@/static/js/languagesList.js";
export default {
  components: { AuthorData },
  data() {
    this.$i18n.locale = localStorage.getItem("lang");
    return {
      // 搜索标签的内容
      searchTag: "",
      // 搜索标签的类别
      searchCategory: "",
      // 为现有标签添加新的语言
      newTagLanguage: "",
      // 为现有标签添加新的语言的内容
      new_Tag: "",
      // 语言列表(新建标签用)
      languagesList: getlanguagesList(),
      // 标签种类
      tagCategories: [],
      // 改变标签种类的时候的标签 ID
      tagIndex: "",
      // 改变标签种类的时候的标签种类
      tagCategorie: "",
      // 改变标签种类的时候的标签种类
      newTagCategorie: "",
      // 标签数据(展示用)
      tagData: [],
      // 标签数据（编辑用）：因为 vu e的双向绑定功能使得数据会实时变化
      // 导致编辑标签时输入框被清空的时候整个标签对应语言的名字会直接消失
      tagEdit: [],
      // 标签列表的排序规则
      options: [
        { value: "latest", label: this.$t("latest") },
        { value: "oldest", label: this.$t("oldest") },
        { value: "count", label: this.$t("count") },
        { value: "count_inv", label: this.$t("count_inv") },
      ],
      // 当前标签列表的排列顺序
      couponSelected: "latest",
      // 当前页数
      page: 1,
      // 全部分页数
      maxpage: 1,
      // 每一页的标签数量
      count: 20,
      // 每一页标签的真实数量
      count2: 0,
      // 标签的全部数量
      maxcount: 0,
      // 打开的作者详情的作者的 ID
      AuthorID: "ID",
      // 是否打开作者详情页面
      showAuthorData: false,
      // 页面是否显示高级选项
      advancedOptions: false,
      // 弹出框是否显示
      dialogVisible: false,
      // 合并标签选项
      mergeOptions: [
        { value: "-", label: "-" },
        { value: "dst", label: this.$t("dstTag") },
        { value: "src", label: this.$t("srcTag") },
      ],
      // 合并标签的源
      mergeSrc: -1,
      // 合并标签的目标
      mergeDst: -1,
      // 标记不同标签是否处于合并状态下的数组
      mergeArray: [],
      // 页面是否属于加载状态的判断
      loading: true,
    };
  },
  computed: {
    // 为现有标签添加新的语言时的语言列表
    languagesList2() {
      return function(list) {
        return this.addLanguageList(list);
      };
    },
    // 重命名标签类别时的标签种类列表
    tagCategories2() {
      let list = this.tagCategories;
      for (let i = 0; i < list.length; i++) {
        if (list[i] == this.tagCategorie) {
          list.splice(i, 1);
        }
      }
      return list;
    },
    // 搜索标签的时候的标签种类列表。其中 “-” 指的是所有种类
    tagCategories3() {
      let all = "-";
      let tagCategories = JSON.parse(JSON.stringify(this.tagCategories));
      tagCategories.push(all);
      return tagCategories;
    },
    // 根据语言列表的value获取label
    getLabel() {
      return (value) => {
        return getlanguagesListLabel(value);
      };
    },
  },
  watch: {
    page() {
      this.requestSearchedTags();
    },
    count() {
      this.requestSearchedTags();
      this.page = 1;
    },
    couponSelected() {
      this.handleCurrentChange(1);
      this.requestSearchedTags();
    },
  },
  created() {},
  mounted() {
    this.requestTagCategories();
  },
  methods: {
    // 请求标签种类数据
    requestTagCategories() {
      this.loading = true;
      this.axios({
        method: "post",
        url: "be/tags/query_categories.do",
        data: {},
      }).then((result) => {
        let categories = result.data.data.categories;
        for (let i = 0; i < categories.length; i++) {
          this.tagCategories.push(categories[i].name);
        }
        this.loading = false;
      });
    },
    // 请求搜索数据
    requestSearchedTags() {
      this.mergeSrc = -1;
      this.mergeDst = -1;
      let query = this.searchTag;
      let category = this.searchCategory;
      // 对全部数据种类进行兼容性调整
      if (category == "-") {
        category = "";
      }
      this.loading = true;
      this.axios({
        method: "post",
        url: "be/tags/query_tags_wildcard.do",
        data: {
          query: query,
          order: this.couponSelected,
          category: category,
          page: this.page,
          page_size: this.count,
        },
      }).then((result) => {
        this.tagData = result.data.data.tags;
        // 克隆对象，防止指针指向同一个对象之后形成双向绑定
        this.tagEdit = JSON.parse(JSON.stringify(result.data.data.tags));
        this.maxcount = result.data.data.count;
        this.count2 = this.tagEdit.length;
        this.loading = false;

        // 回到顶部
        if ($("html").scrollTop()) {
          //动画效果
          $("html").animate({ scrollTop: 0 }, 100);
        }
      });
    },
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
    // 为现有标签添加新的语言
    addTagLanguage(index) {
      this.loading = true;
      let tag = this.tagData[index].id;
      let new_tag = this.new_Tag;
      let language = this.newTagLanguage.value;
      // 校验数据
      if (language == undefined) {
        this.open2(this.$t("select_language"));
        this.loading = false;
        return false;
      }
      if (new_tag == "") {
        this.open2(this.$t("tag_name_prompt"));
        this.loading = false;
        return false;
      }
      if (language == "-") {
        this.addTagAlias(tag, new_tag);
        return false;
      }
      this.axios({
        method: "post",
        url: "be/tags/add_tag_language.do",
        data: {
          tag: tag,
          new_tag: new_tag,
          language: language,
        },
      }).then((result) => {
        if (result.data.status == "SUCCEED") {
          this.open(this.$t("add_succeed"));
          this.new_Tag = "";
          this.loading = false;
          this.requestSearchedTags();
        } else {
          if (result.data.data.reason == "TAG_ALREADY_EXIST") {
            this.loading = false;
            this.open2(this.$t("tag_already_exist"));
          } else {
            this.loading = false;
            this.open2(this.$t("add_failed"));
          }
        }
      });
    },
    // 计算该标签尚未添加的语言
    addLanguageList(list) {
      // 克隆对象，防止指针指向同一个对象之后形成双向绑定
      let list2 = JSON.parse(JSON.stringify(this.languagesList));
      let alias = { value: "-", label: "-" };
      for (let key in list) {
        for (let i = 0; i < list2.length; i++) {
          if (list2[i].value == key) {
            list2.splice(i, 1);
            break;
          }
        }
      }
      list2.push(alias);
      return list2;
    },
    // 添加标签别名
    addTagAlias(tag, new_tag) {
      this.loading = true;
      this.axios({
        method: "post",
        url: "be/tags/add_alias.do",
        data: {
          tag: tag,
          new_tag: new_tag,
        },
      }).then((result) => {
        if (result.data.status == "SUCCEED") {
          this.loading = false;
          this.open("添加成功！");
          this.new_Tag = "";
          this.requestSearchedTags();
        } else {
          if (result.data.data.reason == "ALIAS_ALREADY_EXIST") {
            this.loading = false;
            this.open2(this.$t("tag_already_exist"));
          } else {
            this.loading = false;
            this.open2(this.$t("add_failed"));
          }
        }
      });
    },
    // 删除标签
    removeTag(index) {
      let tag = this.tagEdit[index].id;
      this.$confirm(this.$t("delete_confirm_prompt"), this.$t("prompt"), {
        confirmButtonText: this.$t("confirm"),
        cancelButtonText: this.$t("cancel2"),
        type: "warning",
      })
        // 点击确定之后
        .then(() => {
          this.loading = true;
          this.axios({
            method: "post",
            url: "be/tags/remove_tag.do",
            data: {
              tag: tag,
            },
            withCredentials: true,
          }).then((result) => {
            if (result.data.status == "SUCCEED") {
              this.loading = false;
              this.open(this.$t("delete_succeed"));
              this.requestSearchedTags();
            } else {
              if (result.data.data.reason == "UNAUTHORISED_OPERATION") {
                this.open2(this.$t("unauthorised_prompt"));
              } else {
                this.open2(this.$t("delete_failed"));
              }
              this.loading = false;
            }
          });
        })
        // 点击取消之后
        .catch(() => {});
    },
    // 删除标签别名
    confirmAliasRemove(index, i) {
      let alias = this.tagEdit[index].alias[i];
      this.$confirm(this.$t("delete_alias_prompt"), this.$t("prompt"), {
        confirmButtonText: this.$t("confirm"),
        cancelButtonText: this.$t("cancel2"),
        type: "warning",
      })
        // 点击确定之后
        .then(() => {
          this.loading = true;
          this.axios({
            method: "post",
            url: "be/tags/remove_alias.do",
            data: {
              alias: alias,
            },
          }).then((result) => {
            if (result.data.status == "SUCCEED") {
              this.loading = false;
              this.open(this.$t("delete_succeed"));
              this.requestSearchedTags();
            } else {
              if (result.data.data.reason == "UNAUTHORISED_OPERATION") {
                this.open2(this.$t("unauthorised_prompt"));
              } else {
                this.open2(this.$t("delete_failed"));
              }
              this.loading = false;
            }
          });
        })
        // 点击取消之后
        .catch(() => {});
    },
    // 重命名标签
    confirmChange(index, language) {
      this.loading = true;
      let tag = this.tagData[index].languages[language];
      let new_tag = this.tagEdit[index].languages[language].replace(/ /g, "_");
      if (new_tag == "") {
        this.open2(this.$t("tag_name_prompt"));
        this.loading = false;
        return false;
      }
      this.axios({
        method: "post",
        url: "be/tags/rename_tag.do",
        data: {
          tag: tag,
          new_tag: new_tag,
          language: language,
        },
      }).then((result) => {
        if (result.data.status == "SUCCEED") {
          this.loading = false;
          this.open(this.$t("rename_succeed"));
          this.requestSearchedTags();
        } else {
          this.loading = false;
          this.open2(this.$t("rename_failed"));
        }
      });
    },
    // 重命名标签别名
    confirmAliasChange($index, i) {
      this.loading = true;
      let tag = this.tagData[$index].alias[i];
      let new_tag = this.tagEdit[$index].alias[i].replace(/ /g, "_");
      if (new_tag == "") {
        this.open2(this.$t("tag_name_prompt"));
        this.loading = false;
        return false;
      }
      this.axios({
        method: "post",
        url: "be/tags/rename_alias.do",
        data: {
          tag: tag,
          new_tag: new_tag,
        },
      }).then((result) => {
        if (result.data.status == "SUCCEED") {
          this.loading = false;
          this.open(this.$t("rename_succeed"));
          this.requestSearchedTags();
        } else {
          this.loading = false;
          this.open2(this.$t("rename_failed"));
        }
      });
    },
    // 重命名标签类别
    renameAlias() {
      let tag = this.tagData[this.tagIndex].id;
      let category = this.newTagCategorie;
      if (category == "") {
        this.open2(this.$t("select_categoty"));
        return false;
      }
      this.dialogVisible = false;
      this.loading = true;
      this.axios({
        method: "post",
        url: "be/tags/transfer_category.do",
        data: {
          tag: tag,
          category: category,
        },
      }).then((result) => {
        if (result.data.status == "SUCCEED") {
          this.open(this.$t("rename_succeed"));
          this.loading = false;
          this.$router.go(0);
        } else {
          this.loading = false;
          this.open2(this.$t("rename_failed"));
        }
      });
    },
    // 原标签和目标标签的下拉框修改时调用
    // 记录原标签和目标标签的标签 ID
    onMergeOptionChanged(item, index, value) {
      if (value == "dst") {
        this.mergeArray = this.mergeArray.map((item) => {
          if (item == "dst") {
            return undefined;
          } else return item;
        });
        this.mergeArray[index] = "dst";
        this.mergeDst = item.id;
      }
      if (value == "src") {
        this.mergeArray = this.mergeArray.map((item) => {
          if (item == "src") {
            return undefined;
          } else return item;
        });
        this.mergeArray[index] = "src";
        this.mergeSrc = item.id;
      }
    },
    // 合并标签
    onMergeTagButtonClicked() {
      this.loading = true;
      this.axios({
        method: "post",
        url: "/be/tags/merge_tag.do",
        data: {
          tag_dst: this.mergeDst,
          tag_src: this.mergeSrc,
        },
      })
        .then((result) => {
          this.loading = false;
          if (result.data.status == "FAILED") {
            if (result.data.data.reason == "UNAUTHORISED_OPERATION") {
              this.open2(this.$t("adminOnly"));
            } else {
              this.open2(this.$t("mergeFailed"));
            }
          } else {
            this.open(this.$t("mergeSuccessful"));
            this.requestSearchedTags();
          }
        })
        .catch((error) => {
          this.open2(this.$t("mergeFailed"));
          this.loading = false;
          console.log(error);
        });
      this.mergeArray = [];
    },
    // 打开对话框
    openDialog(index) {
      this.dialogVisible = true;
      this.tagIndex = index;
      this.tagCategorie = this.tagData[index].category;
    },
    // 打开作者详情对话框
    openAuthorData(ID) {
      this.AuthorID = ID;
      this.showAuthorData = true;
    },
    // 当前标签列表的页面切换的时候调用
    handleCurrentChange(val) {
      this.page = val;
    },
    // 当前页面显示标签条数切换的时候调用
    handleSizeChange(val) {
      this.count = val;
    },
    // 各种提示信息
    open(message) {
      this.$message({
        message: message,
        type: "success",
      });
    },
    open2(message) {
      this.$message({
        message: message,
        type: "error",
      });
    },
  },
};
</script>

<style scoped>
.tabs-op button {
  margin: auto;
  margin-right: 5px;
  margin-bottom: 5px;
}
.content2 {
  width: 100%;
  min-height: 600px;
  text-align: left;
}
.video-list-header {
  width: 100%;
  height: 50px;
}
.video-list-header p {
  display: inline-block;
  height: 25px;
  position: absolute;
  transform: translate(10%, 50%);
}
.video-list-header-el-select {
  width: 200px;
  display: inline-block;
  position: absolute;
  right: 50px;
}
/* .addTag {} */
.addTag-input {
  width: 200px;
}
.addTag-select {
  width: 200px;
  margin-left: 10px;
  margin-right: 10px;
}
.languageSuppot {
  margin-left: 150px;
  margin-top: 10px;
  font-size: 17px;
}
.showAuthorData {
  width: 100px;
  float: left;
}
.el-row {
  margin-bottom: 5px;
}
.el-row:last-child {
  margin-bottom: 0;
}
.languageSuppot_language {
  display: inline-block;
  margin-top: 5px;
}
.confirmChange {
  margin-left: 10px;
  margin-top: 2px;
}
.category {
  font-size: 18px;
}
.tagLabel {
  display: inline-block;
  margin-right: 20px;
  font-size: 18px;
}
.tagLink {
  cursor: pointer;
}
.page-selector {
  display: block;
  text-align: center;
  margin-top: 20px;
}
/* 针对类别调整颜色 */
.Copyright {
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
