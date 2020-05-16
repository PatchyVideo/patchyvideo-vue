<!--    vue组件：tagDetail.vue     -->
<!--
    组件：标签编辑页面的详细信息
    大小：100% * 600px(最小高度)
    功能：编辑对应分类下的标签的界面
    必要传入参数：tagCategorie：本组件需要请求标签种类的详细名称
    更新日志：
    1/26/2020：
      release
    1/27/2020：v1.0.1
      1.显示搜索结果的标签数量进行了优化
    1/29/2020：v1.0.2
      1.表格的展开项中不同的标签名之间的间隔优化
      2.标签名在修改之后才会显示提交按钮
      3.添加标签的输入框输入回车便可添加
    ★待解决问题：
      1.各种语言的支持希望可以用v-for实现（现在由于v-if和v-for无法兼容实现不了）
      2.不同标签对应不同的颜色分类
-->

<template>
  <div v-loading="loading" class="content2">
    <!-- Author 页面特有的，作者详情的组件 -->
    <el-dialog :close-on-click-modal="false" :visible.sync="showAuthorData" width="70%">
      <ShowAuthorData ref="AuthorData" :author-i-d="AuthorID"></ShowAuthorData>
    </el-dialog>

    <!-- 标签列表的抬头 -->
    <div class="video-list-header">
      <p v-if="maxcount">{{ $t("count_prompt", { count2: count2, maxcount: maxcount }) }}</p>
      <p v-else>{{ $t("no_video_found") }}</p>
      <el-select id="select-order" v-model="couponSelected" class="video-list-header-el-select">
        <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
      </el-select>
    </div>

    <!-- 添加标签列表 -->
    <div class="addTag">
      <!--<el-input
        v-model="newTag"
        :placeholder="'向' + this.tagCategorie + '类别添加标签'"
        class="addTag-input"
        @keyup.enter.native="addTag()"
      ></el-input>-->

      <!-- 添加标签自动补全 -->

      <!--<el-autocomplete
        v-model="newTag"
        :fetch-suggestions="querySearchAsync"
        :trigger-on-focus="false"
        popper-class="my-autocomplete"
        :placeholder="'向' + this.tagCategorie + '类别添加标签'"
        @select="handleSelect"
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
                Meta: item.cat == 4,
                Soundtrack: item.cat == 6
                }"
            >{{ item.tag }}</div>
            <div class="addr">{{ item.cnt }}</div>
          </div>
        </template>
      </el-autocomplete>-->
      <el-select v-model="language" :placeholder="$t('select_lang_prompt')" size="small" class="addTag-select">
        <el-option v-for="item in languagesList" :key="item.value" :label="item.label" :value="item"></el-option>
      </el-select>
      <!-- 检查标签是否已存在 -->
      <CheckInput
        v-model="newTag"
        popper-class="my-autocomplete"
        :placeholder="$t('add_to_category', { cat: tagCategorie })"
        :check-status.sync="checkTag"
        @check-value-async="querySearchAsync2"
        @keyup.enter.native="addTag"
      ></CheckInput>
      <el-button type="info" @click="addTag()">{{ $t("add_tag") }}</el-button>
      <!-- Wiki链接 -->
      <a href="https://patchyvideo.wiki/Tags" target="_blank" style="color: #409eff; float: right; margin-right: 100px; margin-top: 15px;">{{
        $t("rulesOfTags")
      }}</a>
    </div>
    <!-- 表格正文 -->
    <el-table :data="tagData" style="width: 100%;">
      <!-- 表格的展开项 -->
      <el-table-column type="expand">
        <template slot-scope="props">
          <!-- 显示作者信息的按钮 -->
          <el-button v-if="tagCategorie == 'Author'" class="showAuthorData" @click="openAuthorData(props.row.id)">{{ $t("author_detail") }}</el-button>
          <!-- 为现有标签添加新的语言 -->
          <div class="languageSuppot">
            <el-row>
              <el-col :span="3">
                <el-select v-model="newTagLanguage" :placeholder="$t('select_lang_prompt')" size="mini" style="width: 95%;">
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
            <el-row v-if="props.row.languages.CHS">
              <el-col :span="3">
                <span class="languageSuppot_language">简体中文:</span>
              </el-col>
              <el-col :span="4">
                <el-input
                  v-model="tagEdit[props.$index].languages.CHS"
                  size="small"
                  style="width: 100%;"
                  @keyup.enter.native="confirmChange(props.$index, 'CHS')"
                ></el-input>
              </el-col>
              <el-col :span="4">
                <el-button
                  v-if="tagEdit[props.$index].languages.CHS != tagData[props.$index].languages.CHS"
                  type="primary"
                  size="mini"
                  round
                  class="confirmChange"
                  @click="confirmChange(props.$index, 'CHS')"
                  >{{ $t("confirm") }}</el-button
                >
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
                  style="width: 100%;"
                  @keyup.enter.native="confirmChange(props.$index, 'CHT')"
                ></el-input>
              </el-col>
              <el-col :span="4">
                <el-button
                  v-if="tagEdit[props.$index].languages.CHT != tagData[props.$index].languages.CHT"
                  type="primary"
                  size="mini"
                  round
                  class="confirmChange"
                  @click="confirmChange(props.$index, 'CHT')"
                  >{{ $t("confirm") }}</el-button
                >
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
                  style="width: 100%;"
                  @keyup.enter.native="confirmChange(props.$index, 'JPN')"
                ></el-input>
              </el-col>
              <el-col :span="4">
                <el-button
                  v-if="tagEdit[props.$index].languages.JPN != tagData[props.$index].languages.JPN"
                  type="primary"
                  size="mini"
                  round
                  class="confirmChange"
                  @click="confirmChange(props.$index, 'JPN')"
                  >{{ $t("confirm") }}</el-button
                >
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
                  style="width: 100%;"
                  @keyup.enter.native="confirmChange(props.$index, 'ENG')"
                ></el-input>
              </el-col>
              <el-col :span="4">
                <el-button
                  v-if="tagEdit[props.$index].languages.ENG != tagData[props.$index].languages.ENG"
                  type="primary"
                  size="mini"
                  round
                  class="confirmChange"
                  @click="confirmChange(props.$index, 'ENG')"
                  >{{ $t("confirm") }}</el-button
                >
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
                  style="width: 100%;"
                  @keyup.enter.native="confirmChange(props.$index, 'KOR')"
                ></el-input>
              </el-col>
              <el-col :span="4">
                <el-button
                  v-if="tagEdit[props.$index].languages.KOR != tagData[props.$index].languages.KOR"
                  type="primary"
                  size="mini"
                  round
                  class="confirmChange"
                  @click="confirmChange(props.$index, 'KOR')"
                  >{{ $t("confirm") }}</el-button
                >
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
                  style="width: 100%;"
                  @keyup.enter.native="confirmChange(props.$index, 'CSY')"
                ></el-input>
              </el-col>
              <el-col :span="4">
                <el-button
                  v-if="tagEdit[props.$index].languages.CSY != tagData[props.$index].languages.CSY"
                  type="primary"
                  size="mini"
                  round
                  class="confirmChange"
                  @click="confirmChange(props.$index, 'CSY')"
                  >{{ $t("confirm") }}</el-button
                >
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
                  style="width: 100%;"
                  @keyup.enter.native="confirmChange(props.$index, 'NLD')"
                ></el-input>
              </el-col>
              <el-col :span="4">
                <el-button
                  v-if="tagEdit[props.$index].languages.NLD != tagData[props.$index].languages.NLD"
                  type="primary"
                  size="mini"
                  round
                  class="confirmChange"
                  @click="confirmChange(props.$index, 'NLD')"
                  >{{ $t("confirm") }}</el-button
                >
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
                  style="width: 100%;"
                  @keyup.enter.native="confirmChange(props.$index, 'FRA')"
                ></el-input>
              </el-col>
              <el-col :span="4">
                <el-button
                  v-if="tagEdit[props.$index].languages.FRA != tagData[props.$index].languages.FRA"
                  type="primary"
                  size="mini"
                  round
                  class="confirmChange"
                  @click="confirmChange(props.$index, 'FRA')"
                  >{{ $t("confirm") }}</el-button
                >
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
                  style="width: 100%;"
                  @keyup.enter.native="confirmChange(props.$index, 'DEU')"
                ></el-input>
              </el-col>
              <el-col :span="4">
                <el-button
                  v-if="tagEdit[props.$index].languages.DEU != tagData[props.$index].languages.DEU"
                  type="primary"
                  size="mini"
                  round
                  class="confirmChange"
                  @click="confirmChange(props.$index, 'DEU')"
                  >{{ $t("confirm") }}</el-button
                >
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
                  style="width: 100%;"
                  @keyup.enter.native="confirmChange(props.$index, 'HUN')"
                ></el-input>
              </el-col>
              <el-col :span="4">
                <el-button
                  v-if="tagEdit[props.$index].languages.HUN != tagData[props.$index].languages.HUN"
                  type="primary"
                  size="mini"
                  round
                  class="confirmChange"
                  @click="confirmChange(props.$index, 'HUN')"
                  >{{ $t("confirm") }}</el-button
                >
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
                  style="width: 100%;"
                  @keyup.enter.native="confirmChange(props.$index, 'ITA')"
                ></el-input>
              </el-col>
              <el-col :span="4">
                <el-button
                  v-if="tagEdit[props.$index].languages.ITA != tagData[props.$index].languages.ITA"
                  type="primary"
                  size="mini"
                  round
                  class="confirmChange"
                  @click="confirmChange(props.$index, 'ITA')"
                  >{{ $t("confirm") }}</el-button
                >
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
                  style="width: 100%;"
                  @keyup.enter.native="confirmChange(props.$index, 'PLK')"
                ></el-input>
              </el-col>
              <el-col :span="4">
                <el-button
                  v-if="tagEdit[props.$index].languages.PLK != tagData[props.$index].languages.PLK"
                  type="primary"
                  size="mini"
                  round
                  class="confirmChange"
                  @click="confirmChange(props.$index, 'PLK')"
                  >{{ $t("confirm") }}</el-button
                >
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
                  style="width: 100%;"
                  @keyup.enter.native="confirmChange(props.$index, 'PTB')"
                ></el-input>
              </el-col>
              <el-col :span="4">
                <el-button
                  v-if="tagEdit[props.$index].languages.PTB != tagData[props.$index].languages.PTB"
                  type="primary"
                  size="mini"
                  round
                  class="confirmChange"
                  @click="confirmChange(props.$index, 'PTB')"
                  >{{ $t("confirm") }}</el-button
                >
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
                  style="width: 100%;"
                  @keyup.enter.native="confirmChange(props.$index, 'ROM')"
                ></el-input>
              </el-col>
              <el-col :span="4">
                <el-button
                  v-if="tagEdit[props.$index].languages.ROM != tagData[props.$index].languages.ROM"
                  type="primary"
                  size="mini"
                  round
                  class="confirmChange"
                  @click="confirmChange(props.$index, 'ROM')"
                  >{{ $t("confirm") }}</el-button
                >
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
                  style="width: 100%;"
                  @keyup.enter.native="confirmChange(props.$index, 'RUS')"
                ></el-input>
              </el-col>
              <el-col :span="4">
                <el-button
                  v-if="tagEdit[props.$index].languages.RUS != tagData[props.$index].languages.RUS"
                  type="primary"
                  size="mini"
                  round
                  class="confirmChange"
                  @click="confirmChange(props.$index, 'RUS')"
                  >{{ $t("confirm") }}</el-button
                >
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
                  style="width: 100%;"
                  @keyup.enter.native="confirmChange(props.$index, 'ESP')"
                ></el-input>
              </el-col>
              <el-col :span="4">
                <el-button
                  v-if="tagEdit[props.$index].languages.ESP != tagData[props.$index].languages.ESP"
                  type="primary"
                  size="mini"
                  round
                  class="confirmChange"
                  @click="confirmChange(props.$index, 'ESP')"
                  >{{ $t("confirm") }}</el-button
                >
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
                  style="width: 100%;"
                  @keyup.enter.native="confirmChange(props.$index, 'TRK')"
                ></el-input>
              </el-col>
              <el-col :span="4">
                <el-button
                  v-if="tagEdit[props.$index].languages.TRK != tagData[props.$index].languages.TRK"
                  type="primary"
                  size="mini"
                  round
                  class="confirmChange"
                  @click="confirmChange(props.$index, 'TRK')"
                  >{{ $t("confirm") }}</el-button
                >
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
                  style="width: 100%;"
                  @keyup.enter.native="confirmChange(props.$index, 'VIN')"
                ></el-input>
              </el-col>
              <el-col :span="4">
                <el-button
                  v-if="tagEdit[props.$index].languages.VIN != tagData[props.$index].languages.VIN"
                  type="primary"
                  size="mini"
                  round
                  class="confirmChange"
                  @click="confirmChange(props.$index, 'VIN')"
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
      <el-table-column prop="count" :label="$t('count2')" min-width="70"></el-table-column>
      <el-table-column :label="$t('tag')" min-width="720">
        <!-- 各种语言标签 -->
        <template slot-scope="scope">
          <span v-if="scope.row.languages.CHS" class="tagLabel">
            简体中文:
            <span
              :class="{
                Copyright: scope.row.category == 'Copyright',
                Soundtrack: scope.row.category == 'Soundtrack',
                Language: scope.row.category == 'Language',
                Character: scope.row.category == 'Character',
                Author: scope.row.category == 'Author',
                General: scope.row.category == 'General',
                Meta: scope.row.category == 'Meta',
              }"
              @click="gotoHome(scope.row.languages.CHS)"
              >{{ scope.row.languages.CHS.replace(/\_/g, " ") }}</span
            >
          </span>
          <span v-if="scope.row.languages.CHT" class="tagLabel">
            繁體中文:
            <span
              :class="{
                Copyright: scope.row.category == 'Copyright',
                Soundtrack: scope.row.category == 'Soundtrack',
                Language: scope.row.category == 'Language',
                Character: scope.row.category == 'Character',
                Author: scope.row.category == 'Author',
                General: scope.row.category == 'General',
                Meta: scope.row.category == 'Meta',
              }"
              @click="gotoHome(scope.row.languages.CHT)"
              >{{ scope.row.languages.CHT }}</span
            >
          </span>
          <span v-if="scope.row.languages.JPN" class="tagLabel">
            日本語:
            <span
              :class="{
                Copyright: scope.row.category == 'Copyright',
                Soundtrack: scope.row.category == 'Soundtrack',
                Language: scope.row.category == 'Language',
                Character: scope.row.category == 'Character',
                Author: scope.row.category == 'Author',
                General: scope.row.category == 'General',
                Meta: scope.row.category == 'Meta',
              }"
              @click="gotoHome(scope.row.languages.JPN)"
              >{{ scope.row.languages.JPN.replace(/\_/g, " ") }}</span
            >
          </span>
          <span v-if="scope.row.languages.ENG" class="tagLabel">
            English:
            <span
              :class="{
                Copyright: scope.row.category == 'Copyright',
                Soundtrack: scope.row.category == 'Soundtrack',
                Language: scope.row.category == 'Language',
                Character: scope.row.category == 'Character',
                Author: scope.row.category == 'Author',
                General: scope.row.category == 'General',
                Meta: scope.row.category == 'Meta',
              }"
              @click="gotoHome(scope.row.languages.ENG)"
              >{{ scope.row.languages.ENG.replace(/\_/g, " ") }}</span
            >
          </span>
          <span v-if="scope.row.languages.KOR" class="tagLabel">
            한국어:
            <span
              :class="{
                Copyright: scope.row.category == 'Copyright',
                Soundtrack: scope.row.category == 'Soundtrack',
                Language: scope.row.category == 'Language',
                Character: scope.row.category == 'Character',
                Author: scope.row.category == 'Author',
                General: scope.row.category == 'General',
                Meta: scope.row.category == 'Meta',
              }"
              @click="gotoHome(scope.row.languages.KOR)"
              >{{ scope.row.languages.KOR.replace(/\_/g, " ") }}</span
            >
          </span>
          <span v-if="scope.row.languages.CSY" class="tagLabel">
            čeština:
            <span
              :class="{
                Copyright: scope.row.category == 'Copyright',
                Soundtrack: scope.row.category == 'Soundtrack',
                Language: scope.row.category == 'Language',
                Character: scope.row.category == 'Character',
                Author: scope.row.category == 'Author',
                General: scope.row.category == 'General',
                Meta: scope.row.category == 'Meta',
              }"
              @click="gotoHome(scope.row.languages.CSY)"
              >{{ scope.row.languages.CSY.replace(/\_/g, " ") }}</span
            >
          </span>
          <span v-if="scope.row.languages.NLD" class="tagLabel">
            Nederlands:
            <span
              :class="{
                Copyright: scope.row.category == 'Copyright',
                Soundtrack: scope.row.category == 'Soundtrack',
                Language: scope.row.category == 'Language',
                Character: scope.row.category == 'Character',
                Author: scope.row.category == 'Author',
                General: scope.row.category == 'General',
                Meta: scope.row.category == 'Meta',
              }"
              @click="gotoHome(scope.row.languages.NLD)"
              >{{ scope.row.languages.NLD.replace(/\_/g, " ") }}</span
            >
          </span>
          <span v-if="scope.row.languages.FRA" class="tagLabel">
            français:
            <span
              :class="{
                Copyright: scope.row.category == 'Copyright',
                Soundtrack: scope.row.category == 'Soundtrack',
                Language: scope.row.category == 'Language',
                Character: scope.row.category == 'Character',
                Author: scope.row.category == 'Author',
                General: scope.row.category == 'General',
                Meta: scope.row.category == 'Meta',
              }"
              @click="gotoHome(scope.row.languages.FRA)"
              >{{ scope.row.languages.FRA.replace(/\_/g, " ") }}</span
            >
          </span>
          <span v-if="scope.row.languages.DEU" class="tagLabel">
            Deutsch:
            <span
              :class="{
                Copyright: scope.row.category == 'Copyright',
                Soundtrack: scope.row.category == 'Soundtrack',
                Language: scope.row.category == 'Language',
                Character: scope.row.category == 'Character',
                Author: scope.row.category == 'Author',
                General: scope.row.category == 'General',
                Meta: scope.row.category == 'Meta',
              }"
              @click="gotoHome(scope.row.languages.DEU)"
              >{{ scope.row.languages.DEU.replace(/\_/g, " ") }}</span
            >
          </span>
          <span v-if="scope.row.languages.HUN" class="tagLabel">
            magyar nyelv:
            <span
              :class="{
                Copyright: scope.row.category == 'Copyright',
                Soundtrack: scope.row.category == 'Soundtrack',
                Language: scope.row.category == 'Language',
                Character: scope.row.category == 'Character',
                Author: scope.row.category == 'Author',
                General: scope.row.category == 'General',
                Meta: scope.row.category == 'Meta',
              }"
              @click="gotoHome(scope.row.languages.HUN)"
              >{{ scope.row.languages.HUN.replace(/\_/g, " ") }}</span
            >
          </span>
          <span v-if="scope.row.languages.ITA" class="tagLabel">
            italiano:
            <span
              :class="{
                Copyright: scope.row.category == 'Copyright',
                Soundtrack: scope.row.category == 'Soundtrack',
                Language: scope.row.category == 'Language',
                Character: scope.row.category == 'Character',
                Author: scope.row.category == 'Author',
                General: scope.row.category == 'General',
                Meta: scope.row.category == 'Meta',
              }"
              @click="gotoHome(scope.row.languages.ITA)"
              >{{ scope.row.languages.ITA.replace(/\_/g, " ") }}</span
            >
          </span>
          <span v-if="scope.row.languages.PLK" class="tagLabel">
            polski:
            <span
              :class="{
                Copyright: scope.row.category == 'Copyright',
                Soundtrack: scope.row.category == 'Soundtrack',
                Language: scope.row.category == 'Language',
                Character: scope.row.category == 'Character',
                Author: scope.row.category == 'Author',
                General: scope.row.category == 'General',
                Meta: scope.row.category == 'Meta',
              }"
              @click="gotoHome(scope.row.languages.PLK)"
              >{{ scope.row.languages.PLK.replace(/\_/g, " ") }}</span
            >
          </span>
          <span v-if="scope.row.languages.PTB" class="tagLabel">
            português:
            <span
              :class="{
                Copyright: scope.row.category == 'Copyright',
                Soundtrack: scope.row.category == 'Soundtrack',
                Language: scope.row.category == 'Language',
                Character: scope.row.category == 'Character',
                Author: scope.row.category == 'Author',
                General: scope.row.category == 'General',
                Meta: scope.row.category == 'Meta',
              }"
              @click="gotoHome(scope.row.languages.PTB)"
              >{{ scope.row.languages.PTB.replace(/\_/g, " ") }}</span
            >
          </span>
          <span v-if="scope.row.languages.ROM" class="tagLabel">
            limba română:
            <span
              :class="{
                Copyright: scope.row.category == 'Copyright',
                Soundtrack: scope.row.category == 'Soundtrack',
                Language: scope.row.category == 'Language',
                Character: scope.row.category == 'Character',
                Author: scope.row.category == 'Author',
                General: scope.row.category == 'General',
                Meta: scope.row.category == 'Meta',
              }"
              @click="gotoHome(scope.row.languages.ROM)"
              >{{ scope.row.languages.ROM.replace(/\_/g, " ") }}</span
            >
          </span>
          <span v-if="scope.row.languages.RUS" class="tagLabel">
            русский язык:
            <span
              :class="{
                Copyright: scope.row.category == 'Copyright',
                Soundtrack: scope.row.category == 'Soundtrack',
                Language: scope.row.category == 'Language',
                Character: scope.row.category == 'Character',
                Author: scope.row.category == 'Author',
                General: scope.row.category == 'General',
                Meta: scope.row.category == 'Meta',
              }"
              @click="gotoHome(scope.row.languages.RUS)"
              >{{ scope.row.languages.RUS.replace(/\_/g, " ") }}</span
            >
          </span>
          <span v-if="scope.row.languages.ESP" class="tagLabel">
            español:
            <span
              :class="{
                Copyright: scope.row.category == 'Copyright',
                Soundtrack: scope.row.category == 'Soundtrack',
                Language: scope.row.category == 'Language',
                Character: scope.row.category == 'Character',
                Author: scope.row.category == 'Author',
                General: scope.row.category == 'General',
                Meta: scope.row.category == 'Meta',
              }"
              @click="gotoHome(scope.row.languages.ESP)"
              >{{ scope.row.languages.ESP.replace(/\_/g, " ") }}</span
            >
          </span>
          <span v-if="scope.row.languages.TRK" class="tagLabel">
            Türk dili:
            <span
              :class="{
                Copyright: scope.row.category == 'Copyright',
                Soundtrack: scope.row.category == 'Soundtrack',
                Language: scope.row.category == 'Language',
                Character: scope.row.category == 'Character',
                Author: scope.row.category == 'Author',
                General: scope.row.category == 'General',
                Meta: scope.row.category == 'Meta',
              }"
              @click="gotoHome(scope.row.languages.TRK)"
              >{{ scope.row.languages.TRK.replace(/\_/g, " ") }}</span
            >
          </span>
          <span v-if="scope.row.languages.VIN" class="tagLabel">
            Tiếng Việt:
            <span
              :class="{
                Copyright: scope.row.category == 'Copyright',
                Soundtrack: scope.row.category == 'Soundtrack',
                Language: scope.row.category == 'Language',
                Character: scope.row.category == 'Character',
                Author: scope.row.category == 'Author',
                General: scope.row.category == 'General',
                Meta: scope.row.category == 'Meta',
              }"
              @click="gotoHome(scope.row.languages.VIN)"
              >{{ scope.row.languages.VIN.replace(/\_/g, " ") }}</span
            >
          </span>
          <!-- 标签别名 -->
          <span v-for="item in scope.row.alias" :key="item" class="tagLabel">
            -:
            <span
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
      <!-- 操作，选项一般隐藏 -->
      <el-table-column :label="$t('op')" min-width="300" fixed="right">
        <template slot-scope="scope">
          <div v-if="advancedOptions">
            <el-button type="danger" round @click="removeTag(scope.$index)">{{ $t("del_tag") }}</el-button>
            <el-button type="primary" round @click="openDialog(scope.$index)">{{ $t("change_category") }}</el-button>
          </div>
          <div v-else>
            <el-button type="danger" round style="margin-left: 40px;" @click="advancedOptions = true">{{ $t("show_advance") }}</el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>

    <!-- ElementUI 自带的分页器 -->
    <el-pagination
      background
      class="page-selector"
      layout="prev, pager, next, sizes"
      :current-page="page"
      :total="maxcount"
      :page-size="20"
      :page-sizes="[10, 20, 30, 40]"
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
        <el-button @click="dialogVisible = false">{{ $t("cancel2") }}</el-button>
        <el-button type="primary" @click="renameAlias()">{{ $t("ok2") }}</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import ShowAuthorData from "../components/ShowAuthorData.vue";
import CheckInput from "../components/CheckInput.vue";
export default {
  components: { ShowAuthorData, CheckInput },
  props: {
    tagCategorie: {
      type: String,
      default: "",
    },
  },
  data() {
    this.$i18n.locale = localStorage.getItem("lang");
    return {
      // 添加新标签的内容
      newTag: "",
      // 为现有标签添加新的语言
      newTagLanguage: "",
      // 为现有标签添加新的语言的内容
      new_Tag: "",
      // 添加新标签的语言内容
      language: "简体中文",
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
        { value: "VIN", label: "Tiếng Việt" },
      ],
      // 标签种类
      tagCategories: [],
      // 改变标签种类的时候的标签 ID
      tagIndex: "",
      // 改变标签种类的时候的标签种类
      newTagCategorie: "",
      // 标签数据(展示用)
      tagData: [],
      // 标签数据（编辑用）：因为 vue 的双向绑定功能使得数据会实时变化
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
      // 打开的作者详情的作者的ID
      AuthorID: "ID",
      // 是否打开作者详情页面
      showAuthorData: false,
      // 页面是否显示高级选项
      advancedOptions: false,
      // 弹出框是否显示
      dialogVisible: false,
      // 页面是否属于加载状态的判断
      loading: true,
      //标签检查状态
      checkTag: 0,
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
  },
  watch: {
    page() {
      this.requestCategorieTags();
    },
    count() {
      this.requestCategorieTags();
      this.page = 1;
    },
    couponSelected() {
      this.handleCurrentChange(1);
      this.requestCategorieTags();
    },
  },
  created() {},
  mounted() {
    this.requestCategorieTags();
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
    // 请求标签数据
    requestCategorieTags() {
      this.loading = true;
      this.axios({
        method: "post",
        url: "be/tags/query_tags.do",
        data: {
          category: this.tagCategorie,
          order: this.couponSelected,
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
          // 动画效果
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
    // 添加标签
    addTag() {
      this.loading = true;
      let tag = this.newTag.replace(/ /g, "_");
      let category = this.tagCategorie;
      let language = this.language;
      // 对默认选项进行兼容性调整
      if (language == "简体中文") {
        language = "CHS";
      } else {
        language = language.value;
      }
      // 校验数据
      if (tag == "") {
        this.open2(this.$t("enter_alias_prompt"));
        this.loading = false;
        return false;
      }
      switch (this.checkTag) {
        case -1:
          this.open2(this.$t("tag_already_exist"));
          this.loading = false;
          return false;
        case 0:
          this.open2(this.$t("tag_checking"));
          this.loading = false;
          return false;
      }
      this.axios({
        method: "post",
        url: "be/tags/add_tag.do",
        data: {
          tag: tag,
          category: category,
          language: language,
        },
      }).then((result) => {
        if (result.data.status == "SUCCEED") {
          this.open(this.$t("add_succeed"));
          this.newTag = "";
          this.language = "简体中文";
          this.loading = false;
          this.requestCategorieTags();
        } else {
          if (result.data.data.reason == "TAG_ALREADY_EXIST") {
            this.open2(this.$t("tag_already_exist"));
            this.loading = false;
          } else {
            this.open2(this.$t("failed"));
            this.loading = false;
          }
        }
      });
    },
    // 为现有标签添加新的语言
    addTagLanguage(index) {
      this.loading = true;
      let tag = this.tagData[index].id;
      let new_tag = this.new_Tag;
      let language = this.newTagLanguage.value;
      // 校验数据
      if (language == undefined) {
        this.open2(this.$t("select_lang_prompt"));
        this.loading = false;
        return false;
      }
      if (new_tag == "") {
        this.open2(this.$t("enter_alias_prompt"));
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
          this.requestCategorieTags();
        } else {
          if (result.data.data.reason == "TAG_ALREADY_EXIST") {
            this.loading = false;
            this.open2(this.$t("tag_already_exist"));
          } else {
            this.loading = false;
            this.open2(this.$t("failed"));
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
          this.open(this.$t("add_succeed"));
          this.new_Tag = "";
          this.requestCategorieTags();
        } else {
          if (result.data.data.reason == "ALIAS_ALREADY_EXIST") {
            this.loading = false;
            this.open2(this.$t("tag_already_exist"));
          } else {
            this.loading = false;
            this.open2(this.$t("failed"));
          }
        }
      });
    },
    // 删除标签
    removeTag(index) {
      let tag = this.tagEdit[index].id;
      this.$confirm(this.$t("delete_confirm_prompt"), this.$t("prompt"), {
        confirmButtonText: this.$t("ok"),
        cancelButtonText: this.$t("cancel"),
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
              this.requestCategorieTags();
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
      this.$confirm(this.$t("delete_confirm_prompt"), this.$t("prompt"), {
        confirmButtonText: this.$t("ok"),
        cancelButtonText: this.$t("cancel"),
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
              this.requestCategorieTags();
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
        this.open2(this.$t("enter_alias_prompt"));
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
          this.requestCategorieTags();
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
        this.open2(this.$t("enter_alias_prompt"));
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
          this.requestCategorieTags();
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
    // 打开对话框
    openDialog(index) {
      this.dialogVisible = true;
      this.tagIndex = index;
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
    querySearchAsync2(queryString, cb) {
      // this.infoTipMark = true;
      let url = "/be/autocomplete/ql?q=" + queryString;
      this.axios({
        method: "get",
        url: url,
      }).then((result) => {
        this.taglist = result.data;
        cb(result.data);
      });
    },
    handleSelect(item) {
      this.newTag = item.tag;
      // console.log("选中时的值为" + this.infoTipMark);
      // console.log("选中");
    },
  },
};
</script>

<style scoped>
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
  width: 150px;
  margin-left: 10px;
  margin-right: 10px;
}
.languageSuppot {
  margin-left: 150px;
  margin-top: 5px;
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
.tagLabel {
  display: inline-block;
  margin-right: 20px;
  font-size: 18px;
}
.page-selector {
  display: block;
  text-align: center;
  margin-top: 20px;
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

<i18n folder></i18n>
