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

<i18n>
{
  "CHS": {
    "tag_count_prompt": "显示 {count2} / {maxcount} 个标签",
    "no_tag_found": "没有搜索到标签",
    "tag_prompt": "搜索标签（可不填）",
    "category_prompt": "请选择类别（可不选）",
    "search": "搜索标签",
    "author_detial": "作者详情",
    "select_language": "请选择语言",
    "add": "添加",
    "confirm": "确认",
    "del": "删除",
    "num": "数量",
    "category": "类别",
    "tag": "标签",
    "op": "操作",
    "delete_tag": "删除标签",
    "change_category": "更改分类",
    "show_advance": "显示高级操作",
    "prompt": "提示",
    "select_categoty": "请选择标签分类",
    "cancel": "取 消",
    "cancel2": "取消",
    "confirm2": "确 定",
    "latest": "按照时间正序",
    "oldest": "按照时间倒序",
    "count": "按照使用数量倒序",
    "count_inv": "按照使用数量正序",
    "tag_name_prompt": "请填写标签名称！",
    "add_succeed": "添加成功！",
    "tag_already_exist": "此标签已经存在！",
    "add_failed": "添加失败，请重试！",
    "delete_confirm_prompt": "此操作将永久删除该标签, 是否继续?",
    "delete_succeed": "删除成功！",
    "unauthorised_prompt": "抱歉,只有管理员或者标签的创建者有权修改标签!",
    "delete_failed": "删除失败，请重试！",
    "delete_alias_prompt": "此操作将永久删除该标签的别名, 是否继续?",
    "rename_succeed": "修改成功！",
    "rename_failed": "修改失败，请重试！"
  },
  "ENG": {
    "tag_count_prompt": "Showing {count2} / {maxcount} tags",
    "no_tag_found": "No tag found",
    "tag_prompt": "Partial tag (Optional)",
    "category_prompt": "Category (Optional)",
    "search": "Search",
    "author_detial": "Author Data",
    "select_language": "Select Language",
    "add": "Add",
    "confirm": "Confirm",
    "del": "Delete",
    "num": "Count",
    "category": "Category",
    "tag": "Tag",
    "op": "Operations",
    "delete_tag": "Delete Tag",
    "change_category": "Change category",
    "show_advance": "Show Advance",
    "prompt": "Confirm",
    "select_categoty": "Select Category",
    "cancel": "Cancel",
    "cancel2": "Cancel",
    "confirm2": "Confirm",
    "latest": "Latest",
    "oldest": "Oldest",
    "count": "Most used",
    "count_inv": "least used",
    "tag_name_prompt": "Enter tag name",
    "add_succeed": "Add succeed",
    "tag_already_exist": "Tag already exist",
    "add_failed": "Add failed",
    "delete_confirm_prompt": "This tag will be deleted permanently, are you sure you want to proceed?",
    "delete_succeed": "Delete succeed",
    "unauthorised_prompt": "Only admin and tag creator can delete tag",
    "delete_failed": "Delete failed",
    "delete_alias_prompt": "This alias will be deleted permanently, are you sure you want to proceed?",
    "rename_succeed": "Update succeed",
    "rename_failed": "Update failed"
  },
  "CHT": {
    "tag_count_prompt": "顯示 {count2} / {maxcount} 個標簽",
    "no_tag_found": "沒有搜索到標簽",
    "tag_prompt": "搜索標簽（可不填）",
    "category_prompt": "請選擇類別（可不選）",
    "search": "搜索標簽",
    "author_detial": "作者詳情",
    "select_language": "請選擇語言",
    "add": "添加",
    "confirm": "確認",
    "del": "刪除",
    "num": "數量",
    "category": "類別",
    "tag": "標簽",
    "op": "操作",
    "delete_tag": "刪除標簽",
    "change_category": "更改分類",
    "show_advance": "顯示高級操作",
    "prompt": "提示",
    "select_categoty": "請選擇標簽分類",
    "cancel": "取 消",
    "cancel2": "取消",
    "confirm2": "確 定",
    "latest": "按照時間正序",
    "oldest": "按照時間倒序",
    "count": "按照使用數量倒序",
    "count_inv": "按照使用數量正序",
    "tag_name_prompt": "請填寫標簽名稱！",
    "add_succeed": "添加成功！",
    "tag_already_exist": "此標簽已經存在！",
    "add_failed": "添加失敗，請重試！",
    "delete_confirm_prompt": "此操作將永久刪除該標簽, 是否繼續?",
    "delete_succeed": "刪除成功！",
    "unauthorised_prompt": "抱歉,只有管理員或者標簽的創建者有權修改標簽!",
    "delete_failed": "刪除失敗，請重試！",
    "delete_alias_prompt": "此操作將永久刪除該標簽的別名, 是否繼續?",
    "rename_succeed": "修改成功！",
    "rename_failed": "修改失敗，請重試！"
  }
}
</i18n>

<template>
  <div class="content2" v-loading="loading">
    <!-- Author页面特有的，作者详情的组件 -->
    <el-dialog :close-on-click-modal="false" :visible.sync="showAuthorData" width="70%">
      <ShowAuthorData ref="AuthorData" :AuthorID="AuthorID"></ShowAuthorData>
    </el-dialog>

    <!-- 标签列表的抬头 -->
    <div class="video-list-header">
      <p v-if="maxcount">{{$t('tag_count_prompt', {count2: count2, maxcount: maxcount})}}</p>
      <p v-else>{{$t('no_tag_found')}}</p>
      <el-select id="select-order" v-model="couponSelected" class="video-list-header-el-select">
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        ></el-option>
      </el-select>
    </div>
    <!-- 合并标签按钮 -->
    <div class="video-list-header">
      <el-button
        @click="onMergeTagButtonClicked"
        :disabled="mergeDst == -1 || mergeSrc == -1"
        class="video-list-header-el-select"
      >合并标签</el-button>
    </div>
    <!-- 添加标签列表 -->
    <div class="addTag">
      <el-input
        v-model="searchTag"
        :placeholder="$t('tag_prompt')"
        class="addTag-input"
        @keyup.enter.native="requestSearchedTags()"
      ></el-input>
      <el-select
        v-model="searchCategory"
        :placeholder="$t('category_prompt')"
        size="small"
        class="addTag-select"
      >
        <el-option v-for="item in tagCategories3" :key="item" :label="item" :value="item"></el-option>
      </el-select>
      <el-button type="info" @click="requestSearchedTags()">{{$t('search')}}</el-button>
    </div>
    <!-- 表格正文 -->
    <el-table :data="tagData" style="width: 100%">
      <!-- 表格的展开项 -->
      <el-table-column type="expand">
        <template slot-scope="props">
          <!-- 显示作者信息的按钮 -->
          <el-button
            class="showAuthorData"
            v-if="props.row.category == 'Author'"
            @click="openAuthorData(props.row.id)"
          >{{$t('author_detial')}}</el-button>
          <!-- 为现有标签添加新的语言 -->
          <div class="languageSuppot">
            <el-row>
              <el-col :span="3">
                <el-select
                  v-model="newTagLanguage"
                  :placeholder="$t('select_language')"
                  size="mini"
                  style="width:95%"
                >
                  <el-option
                    v-for="item in languagesList2(props.row.languages)"
                    :key="item.value"
                    :label="item.label"
                    :value="item"
                  ></el-option>
                </el-select>
              </el-col>
              <el-col :span="4">
                <el-input
                  v-model="new_Tag"
                  size="small"
                  style="width:100%"
                  @keyup.enter.native="addTagLanguage(props.$index)"
                ></el-input>
              </el-col>
              <el-col :span="4">
                <el-button
                  type="primary"
                  size="mini"
                  round
                  class="confirmChange"
                  @click="addTagLanguage(props.$index)"
                >{{$t('add')}}</el-button>
              </el-col>
            </el-row>
          </div>
          <!-- 各种语言支持 -->
          <div class="languageSuppot">
            <el-row v-if="props.row.languages.CHS">
              <el-col :span="3">
                <span class="languageSuppot_language">简体中文:</span>
              </el-col>
              <el-col :span="4">
                <el-input
                  v-model="tagEdit[props.$index].languages.CHS"
                  size="small"
                  style="width:100%"
                  @keyup.enter.native="confirmChange(props.$index, 'CHS')"
                ></el-input>
              </el-col>
              <el-col :span="4">
                <el-button
                  type="primary"
                  size="mini"
                  round
                  class="confirmChange"
                  @click="confirmChange(props.$index, 'CHS')"
                  v-if="
                    tagEdit[props.$index].languages.CHS !=
                      tagData[props.$index].languages.CHS
                  "
                >{{$t('confirm')}}</el-button>
              </el-col>
            </el-row>
            <el-row v-if="props.row.languages.CHT">
              <el-col :span="3">
                <span class="languageSuppot_language">繁體中文:</span>
              </el-col>
              <el-col :span="4">
                <el-input
                  v-model="tagEdit[props.$index].languages.CHT"
                  size="small"
                  style="width:100%"
                  @keyup.enter.native="confirmChange(props.$index, 'CHT')"
                ></el-input>
              </el-col>
              <el-col :span="4">
                <el-button
                  type="primary"
                  size="mini"
                  round
                  class="confirmChange"
                  @click="confirmChange(props.$index, 'CHT')"
                  v-if="
                    tagEdit[props.$index].languages.CHT !=
                      tagData[props.$index].languages.CHT
                  "
                >{{$t('confirm')}}</el-button>
              </el-col>
            </el-row>
            <el-row v-if="props.row.languages.JPN">
              <el-col :span="3">
                <span class="languageSuppot_language">日本語:</span>
              </el-col>
              <el-col :span="4">
                <el-input
                  v-model="tagEdit[props.$index].languages.JPN"
                  size="small"
                  style="width:100%"
                  @keyup.enter.native="confirmChange(props.$index, 'JPN')"
                ></el-input>
              </el-col>
              <el-col :span="4">
                <el-button
                  type="primary"
                  size="mini"
                  round
                  class="confirmChange"
                  @click="confirmChange(props.$index, 'JPN')"
                  v-if="
                    tagEdit[props.$index].languages.JPN !=
                      tagData[props.$index].languages.JPN
                  "
                >{{$t('confirm')}}</el-button>
              </el-col>
            </el-row>
            <el-row v-if="props.row.languages.ENG">
              <el-col :span="3">
                <span class="languageSuppot_language">English:</span>
              </el-col>
              <el-col :span="4">
                <el-input
                  v-model="tagEdit[props.$index].languages.ENG"
                  size="small"
                  style="width:100%"
                  @keyup.enter.native="confirmChange(props.$index, 'ENG')"
                ></el-input>
              </el-col>
              <el-col :span="4">
                <el-button
                  type="primary"
                  size="mini"
                  round
                  class="confirmChange"
                  @click="confirmChange(props.$index, 'ENG')"
                  v-if="
                    tagEdit[props.$index].languages.ENG !=
                      tagData[props.$index].languages.ENG
                  "
                >{{$t('confirm')}}</el-button>
              </el-col>
            </el-row>
            <el-row v-if="props.row.languages.KOR">
              <el-col :span="3">
                <span class="languageSuppot_language">한국어:</span>
              </el-col>
              <el-col :span="4">
                <el-input
                  v-model="tagEdit[props.$index].languages.KOR"
                  size="small"
                  style="width:100%"
                  @keyup.enter.native="confirmChange(props.$index, 'KOR')"
                ></el-input>
              </el-col>
              <el-col :span="4">
                <el-button
                  type="primary"
                  size="mini"
                  round
                  class="confirmChange"
                  @click="confirmChange(props.$index, 'KOR')"
                  v-if="
                    tagEdit[props.$index].languages.KOR !=
                      tagData[props.$index].languages.KOR
                  "
                >{{$t('confirm')}}</el-button>
              </el-col>
            </el-row>
            <el-row v-if="props.row.languages.CSY">
              <el-col :span="3">
                <span class="languageSuppot_language">čeština:</span>
              </el-col>
              <el-col :span="4">
                <el-input
                  v-model="tagEdit[props.$index].languages.CSY"
                  size="small"
                  style="width:100%"
                  @keyup.enter.native="confirmChange(props.$index, 'CSY')"
                ></el-input>
              </el-col>
              <el-col :span="4">
                <el-button
                  type="primary"
                  size="mini"
                  round
                  class="confirmChange"
                  @click="confirmChange(props.$index, 'CSY')"
                  v-if="
                    tagEdit[props.$index].languages.CSY !=
                      tagData[props.$index].languages.CSY
                  "
                >{{$t('confirm')}}</el-button>
              </el-col>
            </el-row>
            <el-row v-if="props.row.languages.NLD">
              <el-col :span="3">
                <span class="languageSuppot_language">Nederlands:</span>
              </el-col>
              <el-col :span="4">
                <el-input
                  v-model="tagEdit[props.$index].languages.NLD"
                  size="small"
                  style="width:100%"
                  @keyup.enter.native="confirmChange(props.$index, 'NLD')"
                ></el-input>
              </el-col>
              <el-col :span="4">
                <el-button
                  type="primary"
                  size="mini"
                  round
                  class="confirmChange"
                  @click="confirmChange(props.$index, 'NLD')"
                  v-if="
                    tagEdit[props.$index].languages.NLD !=
                      tagData[props.$index].languages.NLD
                  "
                >{{$t('confirm')}}</el-button>
              </el-col>
            </el-row>
            <el-row v-if="props.row.languages.FRA">
              <el-col :span="3">
                <span class="languageSuppot_language">français:</span>
              </el-col>
              <el-col :span="4">
                <el-input
                  v-model="tagEdit[props.$index].languages.FRA"
                  size="small"
                  style="width:100%"
                  @keyup.enter.native="confirmChange(props.$index, 'FRA')"
                ></el-input>
              </el-col>
              <el-col :span="4">
                <el-button
                  type="primary"
                  size="mini"
                  round
                  class="confirmChange"
                  @click="confirmChange(props.$index, 'FRA')"
                  v-if="
                    tagEdit[props.$index].languages.FRA !=
                      tagData[props.$index].languages.FRA
                  "
                >{{$t('confirm')}}</el-button>
              </el-col>
            </el-row>
            <el-row v-if="props.row.languages.DEU">
              <el-col :span="3">
                <span class="languageSuppot_language">Deutsch:</span>
              </el-col>
              <el-col :span="4">
                <el-input
                  v-model="tagEdit[props.$index].languages.DEU"
                  size="small"
                  style="width:100%"
                  @keyup.enter.native="confirmChange(props.$index, 'DEU')"
                ></el-input>
              </el-col>
              <el-col :span="4">
                <el-button
                  type="primary"
                  size="mini"
                  round
                  class="confirmChange"
                  @click="confirmChange(props.$index, 'DEU')"
                  v-if="
                    tagEdit[props.$index].languages.DEU !=
                      tagData[props.$index].languages.DEU
                  "
                >{{$t('confirm')}}</el-button>
              </el-col>
            </el-row>
            <el-row v-if="props.row.languages.HUN">
              <el-col :span="3">
                <span class="languageSuppot_language">magyar nyelv:</span>
              </el-col>
              <el-col :span="4">
                <el-input
                  v-model="tagEdit[props.$index].languages.HUN"
                  size="small"
                  style="width:100%"
                  @keyup.enter.native="confirmChange(props.$index, 'HUN')"
                ></el-input>
              </el-col>
              <el-col :span="4">
                <el-button
                  type="primary"
                  size="mini"
                  round
                  class="confirmChange"
                  @click="confirmChange(props.$index, 'HUN')"
                  v-if="
                    tagEdit[props.$index].languages.HUN !=
                      tagData[props.$index].languages.HUN
                  "
                >{{$t('confirm')}}</el-button>
              </el-col>
            </el-row>
            <el-row v-if="props.row.languages.ITA">
              <el-col :span="3">
                <span class="languageSuppot_language">italiano:</span>
              </el-col>
              <el-col :span="4">
                <el-input
                  v-model="tagEdit[props.$index].languages.ITA"
                  size="small"
                  style="width:100%"
                  @keyup.enter.native="confirmChange(props.$index, 'ITA')"
                ></el-input>
              </el-col>
              <el-col :span="4">
                <el-button
                  type="primary"
                  size="mini"
                  round
                  class="confirmChange"
                  @click="confirmChange(props.$index, 'ITA')"
                  v-if="
                    tagEdit[props.$index].languages.ITA !=
                      tagData[props.$index].languages.ITA
                  "
                >{{$t('confirm')}}</el-button>
              </el-col>
            </el-row>
            <el-row v-if="props.row.languages.PLK">
              <el-col :span="3">
                <span class="languageSuppot_language">polski:</span>
              </el-col>
              <el-col :span="4">
                <el-input
                  v-model="tagEdit[props.$index].languages.PLK"
                  size="small"
                  style="width:100%"
                  @keyup.enter.native="confirmChange(props.$index, 'PLK')"
                ></el-input>
              </el-col>
              <el-col :span="4">
                <el-button
                  type="primary"
                  size="mini"
                  round
                  class="confirmChange"
                  @click="confirmChange(props.$index, 'PLK')"
                  v-if="
                    tagEdit[props.$index].languages.PLK !=
                      tagData[props.$index].languages.PLK
                  "
                >{{$t('confirm')}}</el-button>
              </el-col>
            </el-row>
            <el-row v-if="props.row.languages.PTB">
              <el-col :span="3">
                <span class="languageSuppot_language">português:</span>
              </el-col>
              <el-col :span="4">
                <el-input
                  v-model="tagEdit[props.$index].languages.PTB"
                  size="small"
                  style="width:100%"
                  @keyup.enter.native="confirmChange(props.$index, 'PTB')"
                ></el-input>
              </el-col>
              <el-col :span="4">
                <el-button
                  type="primary"
                  size="mini"
                  round
                  class="confirmChange"
                  @click="confirmChange(props.$index, 'PTB')"
                  v-if="
                    tagEdit[props.$index].languages.PTB !=
                      tagData[props.$index].languages.PTB
                  "
                >{{$t('confirm')}}</el-button>
              </el-col>
            </el-row>
            <el-row v-if="props.row.languages.ROM">
              <el-col :span="3">
                <span class="languageSuppot_language">limba română:</span>
              </el-col>
              <el-col :span="4">
                <el-input
                  v-model="tagEdit[props.$index].languages.ROM"
                  size="small"
                  style="width:100%"
                  @keyup.enter.native="confirmChange(props.$index, 'ROM')"
                ></el-input>
              </el-col>
              <el-col :span="4">
                <el-button
                  type="primary"
                  size="mini"
                  round
                  class="confirmChange"
                  @click="confirmChange(props.$index, 'ROM')"
                  v-if="
                    tagEdit[props.$index].languages.ROM !=
                      tagData[props.$index].languages.ROM
                  "
                >{{$t('confirm')}}</el-button>
              </el-col>
            </el-row>
            <el-row v-if="props.row.languages.RUS">
              <el-col :span="3">
                <span class="languageSuppot_language">русский язык:</span>
              </el-col>
              <el-col :span="4">
                <el-input
                  v-model="tagEdit[props.$index].languages.RUS"
                  size="small"
                  style="width:100%"
                  @keyup.enter.native="confirmChange(props.$index, 'RUS')"
                ></el-input>
              </el-col>
              <el-col :span="4">
                <el-button
                  type="primary"
                  size="mini"
                  round
                  class="confirmChange"
                  @click="confirmChange(props.$index, 'RUS')"
                  v-if="
                    tagEdit[props.$index].languages.RUS !=
                      tagData[props.$index].languages.RUS
                  "
                >{{$t('confirm')}}</el-button>
              </el-col>
            </el-row>
            <el-row v-if="props.row.languages.ESP">
              <el-col :span="3">
                <span class="languageSuppot_language">español:</span>
              </el-col>
              <el-col :span="4">
                <el-input
                  v-model="tagEdit[props.$index].languages.ESP"
                  size="small"
                  style="width:100%"
                  @keyup.enter.native="confirmChange(props.$index, 'ESP')"
                ></el-input>
              </el-col>
              <el-col :span="4">
                <el-button
                  type="primary"
                  size="mini"
                  round
                  class="confirmChange"
                  @click="confirmChange(props.$index, 'ESP')"
                  v-if="
                    tagEdit[props.$index].languages.ESP !=
                      tagData[props.$index].languages.ESP
                  "
                >{{$t('confirm')}}</el-button>
              </el-col>
            </el-row>
            <el-row v-if="props.row.languages.TRK">
              <el-col :span="3">
                <span class="languageSuppot_language">Türk dili:</span>
              </el-col>
              <el-col :span="4">
                <el-input
                  v-model="tagEdit[props.$index].languages.TRK"
                  size="small"
                  style="width:100%"
                  @keyup.enter.native="confirmChange(props.$index, 'TRK')"
                ></el-input>
              </el-col>
              <el-col :span="4">
                <el-button
                  type="primary"
                  size="mini"
                  round
                  class="confirmChange"
                  @click="confirmChange(props.$index, 'TRK')"
                  v-if="
                    tagEdit[props.$index].languages.TRK !=
                      tagData[props.$index].languages.TRK
                  "
                >{{$t('confirm')}}</el-button>
              </el-col>
            </el-row>
            <el-row v-if="props.row.languages.VIN">
              <el-col :span="3">
                <span class="languageSuppot_language">Tiếng Việt:</span>
              </el-col>
              <el-col :span="4">
                <el-input
                  v-model="tagEdit[props.$index].languages.VIN"
                  size="small"
                  style="width:100%"
                  @keyup.enter.native="confirmChange(props.$index, 'VIN')"
                ></el-input>
              </el-col>
              <el-col :span="4">
                <el-button
                  type="primary"
                  size="mini"
                  round
                  class="confirmChange"
                  @click="confirmChange(props.$index, 'VIN')"
                  v-if="
                    tagEdit[props.$index].languages.VIN !=
                      tagData[props.$index].languages.VIN
                  "
                >{{$t('confirm')}}</el-button>
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
                  style="width:100%"
                  @keyup.enter.native="confirmAliasChange(props.$index, i)"
                ></el-input>
              </el-col>
              <el-col :span="4">
                <el-button
                  type="primary"
                  size="mini"
                  round
                  class="confirmChange"
                  @click="confirmAliasChange(props.$index, i)"
                  v-if="
                    tagEdit[props.$index].alias[i] !=
                      tagData[props.$index].alias[i]
                  "
                >{{$t('confirm')}}</el-button>
                <el-button
                  type="danger"
                  size="mini"
                  round
                  class="confirmChange"
                  @click="confirmAliasRemove(props.$index, i)"
                >{{$t('del')}}</el-button>
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
            v-bind:class="{
              Copyright: scope.row.category == 'Copyright',
              Soundtrack: scope.row.category == 'Soundtrack',
              Language: scope.row.category == 'Language',
              Character: scope.row.category == 'Character',
              Author: scope.row.category == 'Author',
              General: scope.row.category == 'General',
              Meta: scope.row.category == 'Meta'
            }"
          >{{ scope.row.category }}</div>
        </template>
      </el-table-column>
      <el-table-column :label="$t('tag')" min-width="550">
        <!-- 各种语言标签 -->
        <template slot-scope="scope">
          <span class="tagLabel" v-if="scope.row.languages.CHS">
            简体中文:
            <span
              class="tagLink"
              v-bind:class="{
                Copyright: scope.row.category == 'Copyright',
                Soundtrack: scope.row.category == 'Soundtrack',
                Language: scope.row.category == 'Language',
                Character: scope.row.category == 'Character',
                Author: scope.row.category == 'Author',
                General: scope.row.category == 'General',
                Meta: scope.row.category == 'Meta'
              }"
              @click="gotoHome(scope.row.languages.CHS)"
            >{{ scope.row.languages.CHS.replace(/\_/g, " ") }}</span>
          </span>
          <span class="tagLabel" v-if="scope.row.languages.CHT">
            繁體中文:
            <span
              class="tagLink"
              v-bind:class="{
                Copyright: scope.row.category == 'Copyright',
                Soundtrack: scope.row.category == 'Soundtrack',
                Language: scope.row.category == 'Language',
                Character: scope.row.category == 'Character',
                Author: scope.row.category == 'Author',
                General: scope.row.category == 'General',
                Meta: scope.row.category == 'Meta'
              }"
              @click="gotoHome(scope.row.languages.CHT)"
            >{{ scope.row.languages.CHT.replace(/\_/g, " ") }}</span>
          </span>
          <span class="tagLabel" v-if="scope.row.languages.JPN">
            日本語:
            <span
              class="tagLink"
              v-bind:class="{
                Copyright: scope.row.category == 'Copyright',
                Soundtrack: scope.row.category == 'Soundtrack',
                Language: scope.row.category == 'Language',
                Character: scope.row.category == 'Character',
                Author: scope.row.category == 'Author',
                General: scope.row.category == 'General',
                Meta: scope.row.category == 'Meta'
              }"
              @click="gotoHome(scope.row.languages.JPN)"
            >{{ scope.row.languages.JPN.replace(/\_/g, " ") }}</span>
          </span>
          <span class="tagLabel" v-if="scope.row.languages.ENG">
            English:
            <span
              class="tagLink"
              v-bind:class="{
                Copyright: scope.row.category == 'Copyright',
                Soundtrack: scope.row.category == 'Soundtrack',
                Language: scope.row.category == 'Language',
                Character: scope.row.category == 'Character',
                Author: scope.row.category == 'Author',
                General: scope.row.category == 'General',
                Meta: scope.row.category == 'Meta'
              }"
              @click="gotoHome(scope.row.languages.ENG)"
            >{{ scope.row.languages.ENG.replace(/\_/g, " ") }}</span>
          </span>
          <span class="tagLabel" v-if="scope.row.languages.KOR">
            한국어:
            <span
              class="tagLink"
              v-bind:class="{
                Copyright: scope.row.category == 'Copyright',
                Soundtrack: scope.row.category == 'Soundtrack',
                Language: scope.row.category == 'Language',
                Character: scope.row.category == 'Character',
                Author: scope.row.category == 'Author',
                General: scope.row.category == 'General',
                Meta: scope.row.category == 'Meta'
              }"
              @click="gotoHome(scope.row.languages.KOR)"
            >{{ scope.row.languages.KOR.replace(/\_/g, " ") }}</span>
          </span>
          <span class="tagLabel" v-if="scope.row.languages.CSY">
            čeština:
            <span
              class="tagLink"
              v-bind:class="{
                Copyright: scope.row.category == 'Copyright',
                Soundtrack: scope.row.category == 'Soundtrack',
                Language: scope.row.category == 'Language',
                Character: scope.row.category == 'Character',
                Author: scope.row.category == 'Author',
                General: scope.row.category == 'General',
                Meta: scope.row.category == 'Meta'
              }"
              @click="gotoHome(scope.row.languages.CSY)"
            >{{ scope.row.languages.CSY.replace(/\_/g, " ") }}</span>
          </span>
          <span class="tagLabel" v-if="scope.row.languages.NLD">
            Nederlands:
            <span
              class="tagLink"
              v-bind:class="{
                Copyright: scope.row.category == 'Copyright',
                Soundtrack: scope.row.category == 'Soundtrack',
                Language: scope.row.category == 'Language',
                Character: scope.row.category == 'Character',
                Author: scope.row.category == 'Author',
                General: scope.row.category == 'General',
                Meta: scope.row.category == 'Meta'
              }"
              @click="gotoHome(scope.row.languages.NLD)"
            >{{ scope.row.languages.NLD.replace(/\_/g, " ") }}</span>
          </span>
          <span class="tagLabel" v-if="scope.row.languages.FRA">
            français:
            <span
              class="tagLink"
              v-bind:class="{
                Copyright: scope.row.category == 'Copyright',
                Soundtrack: scope.row.category == 'Soundtrack',
                Language: scope.row.category == 'Language',
                Character: scope.row.category == 'Character',
                Author: scope.row.category == 'Author',
                General: scope.row.category == 'General',
                Meta: scope.row.category == 'Meta'
              }"
              @click="gotoHome(scope.row.languages.FRA)"
            >{{ scope.row.languages.FRA.replace(/\_/g, " ") }}</span>
          </span>
          <span class="tagLabel" v-if="scope.row.languages.DEU">
            Deutsch:
            <span
              class="tagLink"
              v-bind:class="{
                Copyright: scope.row.category == 'Copyright',
                Soundtrack: scope.row.category == 'Soundtrack',
                Language: scope.row.category == 'Language',
                Character: scope.row.category == 'Character',
                Author: scope.row.category == 'Author',
                General: scope.row.category == 'General',
                Meta: scope.row.category == 'Meta'
              }"
              @click="gotoHome(scope.row.languages.DEU)"
            >{{ scope.row.languages.DEU.replace(/\_/g, " ") }}</span>
          </span>
          <span class="tagLabel" v-if="scope.row.languages.HUN">
            magyar nyelv:
            <span
              class="tagLink"
              v-bind:class="{
                Copyright: scope.row.category == 'Copyright',
                Soundtrack: scope.row.category == 'Soundtrack',
                Language: scope.row.category == 'Language',
                Character: scope.row.category == 'Character',
                Author: scope.row.category == 'Author',
                General: scope.row.category == 'General',
                Meta: scope.row.category == 'Meta'
              }"
              @click="gotoHome(scope.row.languages.HUN)"
            >{{ scope.row.languages.HUN.replace(/\_/g, " ") }}</span>
          </span>
          <span class="tagLabel" v-if="scope.row.languages.ITA">
            italiano:
            <span
              class="tagLink"
              v-bind:class="{
                Copyright: scope.row.category == 'Copyright',
                Soundtrack: scope.row.category == 'Soundtrack',
                Language: scope.row.category == 'Language',
                Character: scope.row.category == 'Character',
                Author: scope.row.category == 'Author',
                General: scope.row.category == 'General',
                Meta: scope.row.category == 'Meta'
              }"
              @click="gotoHome(scope.row.languages.ITA)"
            >{{ scope.row.languages.ITA.replace(/\_/g, " ") }}</span>
          </span>
          <span class="tagLabel" v-if="scope.row.languages.PLK">
            polski:
            <span
              class="tagLink"
              v-bind:class="{
                Copyright: scope.row.category == 'Copyright',
                Soundtrack: scope.row.category == 'Soundtrack',
                Language: scope.row.category == 'Language',
                Character: scope.row.category == 'Character',
                Author: scope.row.category == 'Author',
                General: scope.row.category == 'General',
                Meta: scope.row.category == 'Meta'
              }"
              @click="gotoHome(scope.row.languages.PLK)"
            >{{ scope.row.languages.PLK.replace(/\_/g, " ") }}</span>
          </span>
          <span class="tagLabel" v-if="scope.row.languages.PTB">
            português:
            <span
              class="tagLink"
              v-bind:class="{
                Copyright: scope.row.category == 'Copyright',
                Soundtrack: scope.row.category == 'Soundtrack',
                Language: scope.row.category == 'Language',
                Character: scope.row.category == 'Character',
                Author: scope.row.category == 'Author',
                General: scope.row.category == 'General',
                Meta: scope.row.category == 'Meta'
              }"
              @click="gotoHome(scope.row.languages.PTB)"
            >{{ scope.row.languages.PTB.replace(/\_/g, " ") }}</span>
          </span>
          <span class="tagLabel" v-if="scope.row.languages.ROM">
            limba română:
            <span
              class="tagLink"
              v-bind:class="{
                Copyright: scope.row.category == 'Copyright',
                Soundtrack: scope.row.category == 'Soundtrack',
                Language: scope.row.category == 'Language',
                Character: scope.row.category == 'Character',
                Author: scope.row.category == 'Author',
                General: scope.row.category == 'General',
                Meta: scope.row.category == 'Meta'
              }"
              @click="gotoHome(scope.row.languages.ROM)"
            >{{ scope.row.languages.ROM.replace(/\_/g, " ") }}</span>
          </span>
          <span class="tagLabel" v-if="scope.row.languages.RUS">
            русский язык:
            <span
              class="tagLink"
              v-bind:class="{
                Copyright: scope.row.category == 'Copyright',
                Soundtrack: scope.row.category == 'Soundtrack',
                Language: scope.row.category == 'Language',
                Character: scope.row.category == 'Character',
                Author: scope.row.category == 'Author',
                General: scope.row.category == 'General',
                Meta: scope.row.category == 'Meta'
              }"
              @click="gotoHome(scope.row.languages.RUS)"
            >{{ scope.row.languages.RUS.replace(/\_/g, " ") }}</span>
          </span>
          <span class="tagLabel" v-if="scope.row.languages.ESP">
            español:
            <span
              class="tagLink"
              v-bind:class="{
                Copyright: scope.row.category == 'Copyright',
                Soundtrack: scope.row.category == 'Soundtrack',
                Language: scope.row.category == 'Language',
                Character: scope.row.category == 'Character',
                Author: scope.row.category == 'Author',
                General: scope.row.category == 'General',
                Meta: scope.row.category == 'Meta'
              }"
              @click="gotoHome(scope.row.languages.ESP)"
            >{{ scope.row.languages.ESP.replace(/\_/g, " ") }}</span>
          </span>
          <span class="tagLabel" v-if="scope.row.languages.TRK">
            Türk dili:
            <span
              class="tagLink"
              v-bind:class="{
                Copyright: scope.row.category == 'Copyright',
                Soundtrack: scope.row.category == 'Soundtrack',
                Language: scope.row.category == 'Language',
                Character: scope.row.category == 'Character',
                Author: scope.row.category == 'Author',
                General: scope.row.category == 'General',
                Meta: scope.row.category == 'Meta'
              }"
              @click="gotoHome(scope.row.languages.TRK)"
            >{{ scope.row.languages.TRK.replace(/\_/g, " ") }}</span>
          </span>
          <span class="tagLabel" v-if="scope.row.languages.VIN">
            Tiếng Việt:
            <span
              class="tagLink"
              v-bind:class="{
                Copyright: scope.row.category == 'Copyright',
                Soundtrack: scope.row.category == 'Soundtrack',
                Language: scope.row.category == 'Language',
                Character: scope.row.category == 'Character',
                Author: scope.row.category == 'Author',
                General: scope.row.category == 'General',
                Meta: scope.row.category == 'Meta'
              }"
              @click="gotoHome(scope.row.languages.VIN)"
            >{{ scope.row.languages.VIN.replace(/\_/g, " ") }}</span>
          </span>
          <!-- 标签别名 -->
          <span class="tagLabel" v-for="item in scope.row.alias" :key="item">
            -:
            <span
              class="tagLink"
              v-bind:class="{
                Copyright: scope.row.category == 'Copyright',
                Soundtrack: scope.row.category == 'Soundtrack',
                Language: scope.row.category == 'Language',
                Character: scope.row.category == 'Character',
                Author: scope.row.category == 'Author',
                General: scope.row.category == 'General',
                Meta: scope.row.category == 'Meta'
              }"
              @click="gotoHome(item)"
            >{{ item.replace(/\_/g, " ") }}</span>
          </span>
        </template>
      </el-table-column>
      <!-- 合并标签选项 -->
      <el-table-column prop label="合并选项" min-width="130">
        <template slot-scope="scope">
          <el-select
            @change="(arg1) => onMergeOptionChanged(scope.row, scope.$index, arg1)"
            v-model="mergeArray[scope.$index]"
            placeholder="-"
          >
            <el-option
              v-for="item in mergeOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </template>
      </el-table-column>
      <!-- 操作,一般隐藏 -->
      <el-table-column :label="$t('op')" min-width="200" fixed="right">
        <template slot-scope="scope">
          <div v-if="advancedOptions" class="tabs-op">
            <el-button type="danger" round @click="removeTag(scope.$index)">{{$t('delete_tag')}}</el-button>
            <el-button
              type="primary"
              round
              @click="openDialog(scope.$index)"
            >{{$t('change_category')}}</el-button>
          </div>
          <div v-else>
            <el-button
              type="danger"
              round
              @click="advancedOptions = true"
              style="margin-left:40px"
            >{{$t('show_advance')}}</el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>

    <!-- ElementUI自带的分页器 -->
    <el-pagination
      background
      class="page-selector"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      layout="prev, pager, next, sizes"
      :current-page="this.page"
      :total="this.maxcount"
      :page-size="20"
      :page-sizes="[10, 20, 30, 40]"
      hide-on-single-page
    ></el-pagination>

    <!-- 更改分类的弹出框 -->
    <el-dialog :title="$t('prompt')" :visible.sync="dialogVisible" width="20%">
      <div style="width:80%;margin:0 auto">
        <el-select
          v-model="newTagCategorie"
          :placeholder="$t('select_categoty')"
          style="width:100%"
        >
          <el-option v-for="item in tagCategories2" :key="item" :label="item" :value="item"></el-option>
        </el-select>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">{{$t('cancel')}}</el-button>
        <el-button type="primary" @click="renameAlias()">{{$t('confirm2')}}</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import ShowAuthorData from "../components/ShowAuthorData.vue";
export default {
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
      languagesList: [
        { value: "CHS", label: "简体中文" },
        { value: "CHT", label: "繁體中文" },
        { value: "JPN", label: "日本語" },
        { value: "ENG", label: "English" },
        { value: "KOR", label: "한국어" },
        { value: "CSY", label: "čeština" },
        { value: "NLD", label: "Nederlands" },
        { value: "FRA", label: "français" },
        { value: "DEU", label: "Deutsch" },
        { value: "HUN", label: "magyar nyelv" },
        { value: "ITA", label: "italiano" },
        { value: "PLK", label: "polski" },
        { value: "PTB", label: "português" },
        { value: "ROM", label: "limba română" },
        { value: "RUS", label: "русский язык" },
        { value: "ESP", label: "español" },
        { value: "TRK", label: "Türk dili" },
        { value: "VIN", label: "Tiếng Việt" }
      ],
      // 标签种类
      tagCategories: [],
      // 改变标签种类的时候的标签ID
      tagIndex: "",
      // 改变标签种类的时候的标签种类
      tagCategorie: "",
      // 改变标签种类的时候的标签种类
      newTagCategorie: "",
      // 标签数据(展示用)
      tagData: [],
      // 标签数据（编辑用）：因为vue的双向绑定功能使得数据会实时变化
      // 导致编辑标签时输入框被清空的时候整个标签对应语言的名字会直接消失
      tagEdit: [],
      // 标签列表的排序规则
      options: [
        { value: "latest", label: this.$t("latest") },
        { value: "oldest", label: this.$t("oldest") },
        { value: "count", label: this.$t("count") },
        { value: "count_inv", label: this.$t("count_inv") }
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
      // 打开的作者详情的作者的ID
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
        { value: "dst", label: "目标标签" },
        { value: "src", label: "源标签" }
      ],
      // 合并标签的源
      mergeSrc: -1,
      // 合并标签的目标
      mergeDst: -1,
      // 标记不同标签是否处于合并状态下的数组
      mergeArray: [],
      // 页面是否属于加载状态的判断
      loading: true
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
      var list = this.tagCategories;
      for (var i = 0; i < list.length; i++) {
        if (list[i] == this.tagCategorie) {
          list.splice(i, 1);
        }
      }
      return list;
    },
    // 搜索标签的时候的标签种类列表。其中“-”指的是所有种类
    tagCategories3() {
      var all = "-";
      var tagCategories = JSON.parse(JSON.stringify(this.tagCategories));
      tagCategories.push(all);
      return tagCategories;
    }
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
        data: {}
      }).then(result => {
        var categories = result.data.data.categories;
        for (var i = 0; i < categories.length; i++) {
          this.tagCategories.push(categories[i].name);
        }
        this.loading = false;
      });
    },
    // 请求搜索数据
    requestSearchedTags() {
      this.mergeSrc = -1;
      this.mergeDst = -1;
      var query = this.searchTag;
      var category = this.searchCategory;
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
          page_size: this.count
        }
      }).then(result => {
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
        this.$router
          .push({ path: "/home", query: { keyword: key } })
          .catch(err => {
            return err;
          });
      } else {
        this.$router.push({ path: "/home" });
      }
    },
    // 为现有标签添加新的语言
    addTagLanguage(index) {
      this.loading = true;
      var tag = this.tagData[index].id;
      var new_tag = this.new_Tag;
      var language = this.newTagLanguage.value;
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
          language: language
        }
      }).then(result => {
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
      var list2 = JSON.parse(JSON.stringify(this.languagesList));
      var alias = { value: "-", label: "-" };
      for (var key in list) {
        for (var i = 0; i < list2.length; i++) {
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
          new_tag: new_tag
        }
      }).then(result => {
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
      var tag = this.tagEdit[index].id;
      this.$confirm(this.$t("delete_confirm_prompt"), this.$t("prompt"), {
        confirmButtonText: this.$t("confirm"),
        cancelButtonText: this.$t("cancel2"),
        type: "warning"
      })
        // 点击确定之后
        .then(() => {
          this.loading = true;
          this.axios({
            method: "post",
            url: "be/tags/remove_tag.do",
            data: {
              tag: tag
            },
            withCredentials: true
          }).then(result => {
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
      var alias = this.tagEdit[index].alias[i];
      this.$confirm(this.$t("delete_alias_prompt"), this.$t("prompt"), {
        confirmButtonText: this.$t("confirm"),
        cancelButtonText: this.$t("cancel2"),
        type: "warning"
      })
        // 点击确定之后
        .then(() => {
          this.loading = true;
          this.axios({
            method: "post",
            url: "be/tags/remove_alias.do",
            data: {
              alias: alias
            }
          }).then(result => {
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
      var tag = this.tagData[index].languages[language];
      var new_tag = this.tagEdit[index].languages[language].replace(/\ /g, "_");
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
          language: language
        }
      }).then(result => {
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
      var tag = this.tagData[$index].alias[i];
      var new_tag = this.tagEdit[$index].alias[i].replace(/\ /g, "_");
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
          new_tag: new_tag
        }
      }).then(result => {
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
    renameAlias(index) {
      var tag = this.tagData[this.tagIndex].id;
      var category = this.newTagCategorie;
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
          category: category
        }
      }).then(result => {
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
    // 记录原标签和目标标签的标签ID
    onMergeOptionChanged(item, index, value) {
      if (value == "dst") {
        this.mergeArray = this.mergeArray.map(item => {
          if (item == "dst") {
            return undefined;
          } else return item;
        });
        this.mergeArray[index] = "dst";
        this.mergeDst = item.id;
      }
      if (value == "src") {
        this.mergeArray = this.mergeArray.map(item => {
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
          tags_dst: this.mergeDst,
          tag_src: this.mergeSrc
        }
      })
        .then(result => {
          this.loading = false;
          if (result.data.status == "FAILED") {
            this.open2("合并失败,请重试!");
          } else {
            this.open2("合并成功!");
            this.requestSearchedTags();
          }
          console.log(result);
        })
        .catch(error => {
          this.open2("合并失败,请重试!");
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
        type: "success"
      });
    },
    open2(message) {
      this.$message({
        message: message,
        type: "error"
      });
    }
  },
  watch: {
    page(v) {
      this.requestSearchedTags();
    },
    count(v) {
      this.requestSearchedTags();
      this.page = 1;
    },
    couponSelected() {
      this.handleCurrentChange(1);
      this.requestSearchedTags();
    }
  },
  components: { ShowAuthorData }
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
.addTag {
}
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
