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
    ★待解决问题：
      1.各种语言的支持希望可以用v-for实现（现在由于v-if和v-for无法兼容实现不了）
-->

<template>
  <div class="content2" v-loading="loading">
    <!-- 播放列表的抬头 -->
    <div class="video-list-header">
      <p v-if="maxcount">显示 {{ count2 }} / {{ maxcount }} 个标签</p>
      <p v-else>没有搜索到视频</p>
      <el-select id="select-order" v-model="couponSelected" class="video-list-header-el-select">
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        ></el-option>
      </el-select>
    </div>
    <!-- 添加标签列表 -->
    <div class="addTag">
      <el-input v-model="searchTag" placeholder="搜索标签（可不填）" class="addTag-input"></el-input>
      <el-select
        v-model="searchCategory"
        placeholder="请选择类别（可不选）"
        size="small"
        class="addTag-select"
      >
        <el-option v-for="item in tagCategories3" :key="item" :label="item" :value="item"></el-option>
      </el-select>
      <el-button type="info" @click="requestSearchedTags()">搜索标签</el-button>
    </div>
    <!-- 表格正文 -->
    <el-table :data="tagData" style="width: 100%">
      <!-- 表格的展开项 -->
      <el-table-column type="expand">
        <template slot-scope="props">
          <!-- 为现有标签添加新的语言 -->
          <div class="languageSuppot">
            <el-row>
              <el-col :span="3">
                <el-select
                  v-model="newTagLanguage"
                  placeholder="请选择语言"
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
                >添加</el-button>
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
                >确认</el-button>
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
                >确认</el-button>
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
                >确认</el-button>
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
                >确认</el-button>
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
                >确认</el-button>
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
                >确认</el-button>
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
                >确认</el-button>
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
                >确认</el-button>
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
                >确认</el-button>
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
                >确认</el-button>
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
                >确认</el-button>
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
                >确认</el-button>
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
                >确认</el-button>
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
                >确认</el-button>
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
                >确认</el-button>
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
                >确认</el-button>
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
                >确认</el-button>
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
                >确认</el-button>
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
                >确认</el-button>
                <el-button
                  type="danger"
                  size="mini"
                  round
                  class="confirmChange"
                  @click="confirmAliasRemove(props.$index, i)"
                >删除</el-button>
              </el-col>
            </el-row>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="count" label="数量" min-width="50"></el-table-column>
      <el-table-column label="类别" min-width="120">
        <template slot-scope="scope">
          <div
            class="category"
            v-bind:class="{Copyright:scope.row.category=='Copyright',
													Language:scope.row.category=='Language',
													Character:scope.row.category=='Character',
													Author:scope.row.category=='Author',
													General:scope.row.category=='General',
													Meta:scope.row.category=='Meta'}"
          >{{ scope.row.category }}</div>
        </template>
      </el-table-column>
      <el-table-column label="标签" min-width="680">
        <!-- 各种语言标签 -->
        <template slot-scope="scope">
          <span class="tagLabel" v-if="scope.row.languages.CHS">
            简体中文:
            <span
              class="tagLink"
              v-bind:class="{Copyright:scope.row.category=='Copyright',
                              Language:scope.row.category=='Language',
                              Character:scope.row.category=='Character',
                              Author:scope.row.category=='Author',
                              General:scope.row.category=='General',
                              Meta:scope.row.category=='Meta'}"
              @click="gotoHome(scope.row.languages.CHS)"
            >{{ scope.row.languages.CHS }}</span>
          </span>
          <span class="tagLabel" v-if="scope.row.languages.CHT">
            繁體中文:
            <span
              class="tagLink"
              v-bind:class="{Copyright:scope.row.category=='Copyright',
                              Language:scope.row.category=='Language',
                              Character:scope.row.category=='Character',
                              Author:scope.row.category=='Author',
                              General:scope.row.category=='General',
                              Meta:scope.row.category=='Meta'}"
              @click="gotoHome(scope.row.languages.CHT)"
            >{{ scope.row.languages.CHT }}</span>
          </span>
          <span class="tagLabel" v-if="scope.row.languages.JPN">
            日本語:
            <span
              class="tagLink"
              v-bind:class="{Copyright:scope.row.category=='Copyright',
                              Language:scope.row.category=='Language',
                              Character:scope.row.category=='Character',
                              Author:scope.row.category=='Author',
                              General:scope.row.category=='General',
                              Meta:scope.row.category=='Meta'}"
              @click="gotoHome(scope.row.languages.JPN)"
            >{{ scope.row.languages.JPN }}</span>
          </span>
          <span class="tagLabel" v-if="scope.row.languages.ENG">
            English:
            <span
              class="tagLink"
              v-bind:class="{Copyright:scope.row.category=='Copyright',
                              Language:scope.row.category=='Language',
                              Character:scope.row.category=='Character',
                              Author:scope.row.category=='Author',
                              General:scope.row.category=='General',
                              Meta:scope.row.category=='Meta'}"
              @click="gotoHome(scope.row.languages.ENG)"
            >{{ scope.row.languages.ENG }}</span>
          </span>
          <span class="tagLabel" v-if="scope.row.languages.KOR">
            한국어:
            <span
              class="tagLink"
              v-bind:class="{Copyright:scope.row.category=='Copyright',
                              Language:scope.row.category=='Language',
                              Character:scope.row.category=='Character',
                              Author:scope.row.category=='Author',
                              General:scope.row.category=='General',
                              Meta:scope.row.category=='Meta'}"
              @click="gotoHome(scope.row.languages.KOR)"
            >{{ scope.row.languages.KOR }}</span>
          </span>
          <span class="tagLabel" v-if="scope.row.languages.CSY">
            čeština:
            <span
              class="tagLink"
              v-bind:class="{Copyright:scope.row.category=='Copyright',
                              Language:scope.row.category=='Language',
                              Character:scope.row.category=='Character',
                              Author:scope.row.category=='Author',
                              General:scope.row.category=='General',
                              Meta:scope.row.category=='Meta'}"
              @click="gotoHome(scope.row.languages.CSY)"
            >{{ scope.row.languages.CSY }}</span>
          </span>
          <span class="tagLabel" v-if="scope.row.languages.NLD">
            Nederlands:
            <span
              class="tagLink"
              v-bind:class="{Copyright:scope.row.category=='Copyright',
                              Language:scope.row.category=='Language',
                              Character:scope.row.category=='Character',
                              Author:scope.row.category=='Author',
                              General:scope.row.category=='General',
                              Meta:scope.row.category=='Meta'}"
              @click="gotoHome(scope.row.languages.NLD)"
            >{{ scope.row.languages.NLD }}</span>
          </span>
          <span class="tagLabel" v-if="scope.row.languages.FRA">
            français:
            <span
              class="tagLink"
              v-bind:class="{Copyright:scope.row.category=='Copyright',
                              Language:scope.row.category=='Language',
                              Character:scope.row.category=='Character',
                              Author:scope.row.category=='Author',
                              General:scope.row.category=='General',
                              Meta:scope.row.category=='Meta'}"
              @click="gotoHome(scope.row.languages.FRA)"
            >{{ scope.row.languages.FRA }}</span>
          </span>
          <span class="tagLabel" v-if="scope.row.languages.DEU">
            Deutsch:
            <span
              class="tagLink"
              v-bind:class="{Copyright:scope.row.category=='Copyright',
                              Language:scope.row.category=='Language',
                              Character:scope.row.category=='Character',
                              Author:scope.row.category=='Author',
                              General:scope.row.category=='General',
                              Meta:scope.row.category=='Meta'}"
              @click="gotoHome(scope.row.languages.DEU)"
            >{{ scope.row.languages.DEU }}</span>
          </span>
          <span class="tagLabel" v-if="scope.row.languages.HUN">
            magyar nyelv:
            <span
              class="tagLink"
              v-bind:class="{Copyright:scope.row.category=='Copyright',
                              Language:scope.row.category=='Language',
                              Character:scope.row.category=='Character',
                              Author:scope.row.category=='Author',
                              General:scope.row.category=='General',
                              Meta:scope.row.category=='Meta'}"
              @click="gotoHome(scope.row.languages.HUN)"
            >{{ scope.row.languages.HUN }}</span>
          </span>
          <span class="tagLabel" v-if="scope.row.languages.ITA">
            italiano:
            <span
              class="tagLink"
              v-bind:class="{Copyright:scope.row.category=='Copyright',
                              Language:scope.row.category=='Language',
                              Character:scope.row.category=='Character',
                              Author:scope.row.category=='Author',
                              General:scope.row.category=='General',
                              Meta:scope.row.category=='Meta'}"
              @click="gotoHome(scope.row.languages.ITA)"
            >{{ scope.row.languages.ITA }}</span>
          </span>
          <span class="tagLabel" v-if="scope.row.languages.PLK">
            polski:
            <span
              class="tagLink"
              v-bind:class="{Copyright:scope.row.category=='Copyright',
                              Language:scope.row.category=='Language',
                              Character:scope.row.category=='Character',
                              Author:scope.row.category=='Author',
                              General:scope.row.category=='General',
                              Meta:scope.row.category=='Meta'}"
              @click="gotoHome(scope.row.languages.PLK)"
            >{{ scope.row.languages.PLK }}</span>
          </span>
          <span class="tagLabel" v-if="scope.row.languages.PTB">
            português:
            <span
              class="tagLink"
              v-bind:class="{Copyright:scope.row.category=='Copyright',
                              Language:scope.row.category=='Language',
                              Character:scope.row.category=='Character',
                              Author:scope.row.category=='Author',
                              General:scope.row.category=='General',
                              Meta:scope.row.category=='Meta'}"
              @click="gotoHome(scope.row.languages.PTB)"
            >{{ scope.row.languages.PTB }}</span>
          </span>
          <span class="tagLabel" v-if="scope.row.languages.ROM">
            limba română:
            <span
              class="tagLink"
              v-bind:class="{Copyright:scope.row.category=='Copyright',
                              Language:scope.row.category=='Language',
                              Character:scope.row.category=='Character',
                              Author:scope.row.category=='Author',
                              General:scope.row.category=='General',
                              Meta:scope.row.category=='Meta'}"
              @click="gotoHome(scope.row.languages.ROM)"
            >{{ scope.row.languages.ROM }}</span>
          </span>
          <span class="tagLabel" v-if="scope.row.languages.RUS">
            русский язык:
            <span
              class="tagLink"
              v-bind:class="{Copyright:scope.row.category=='Copyright',
                              Language:scope.row.category=='Language',
                              Character:scope.row.category=='Character',
                              Author:scope.row.category=='Author',
                              General:scope.row.category=='General',
                              Meta:scope.row.category=='Meta'}"
              @click="gotoHome(scope.row.languages.RUS)"
            >{{ scope.row.languages.RUS }}</span>
          </span>
          <span class="tagLabel" v-if="scope.row.languages.ESP">
            español:
            <span
              class="tagLink"
              v-bind:class="{Copyright:scope.row.category=='Copyright',
                              Language:scope.row.category=='Language',
                              Character:scope.row.category=='Character',
                              Author:scope.row.category=='Author',
                              General:scope.row.category=='General',
                              Meta:scope.row.category=='Meta'}"
              @click="gotoHome(scope.row.languages.ESP)"
            >{{ scope.row.languages.ESP }}</span>
          </span>
          <span class="tagLabel" v-if="scope.row.languages.TRK">
            Türk dili:
            <span
              class="tagLink"
              v-bind:class="{Copyright:scope.row.category=='Copyright',
                              Language:scope.row.category=='Language',
                              Character:scope.row.category=='Character',
                              Author:scope.row.category=='Author',
                              General:scope.row.category=='General',
                              Meta:scope.row.category=='Meta'}"
              @click="gotoHome(scope.row.languages.TRK)"
            >{{ scope.row.languages.TRK }}</span>
          </span>
          <span class="tagLabel" v-if="scope.row.languages.VIN">
            Tiếng Việt:
            <span
              class="tagLink"
              v-bind:class="{Copyright:scope.row.category=='Copyright',
                              Language:scope.row.category=='Language',
                              Character:scope.row.category=='Character',
                              Author:scope.row.category=='Author',
                              General:scope.row.category=='General',
                              Meta:scope.row.category=='Meta'}"
              @click="gotoHome(scope.row.languages.VIN)"
            >{{ scope.row.languages.VIN }}</span>
          </span>
          <!-- 标签别名 -->
          <span class="tagLabel" v-for="item in scope.row.alias" :key="item">
            -:
            <span
              class="tagLink"
              v-bind:class="{Copyright:scope.row.category=='Copyright',
                              Language:scope.row.category=='Language',
                              Character:scope.row.category=='Character',
                              Author:scope.row.category=='Author',
                              General:scope.row.category=='General',
                              Meta:scope.row.category=='Meta'}"
              @click="gotoHome(item)"
            >{{ item }}</span>
          </span>
        </template>
      </el-table-column>
      <!-- 操作,一般隐藏 -->
      <el-table-column label="操作" min-width="230" fixed="right">
        <template slot-scope="scope">
          <div v-if="advancedOptions">
            <el-button type="danger" round @click="removeTag(scope.$index)">删除标签</el-button>
            <el-button type="primary" round @click="openDialog(scope.$index)">更改分类</el-button>
          </div>
          <div v-else>
            <el-button
              type="danger"
              round
              @click="advancedOptions=true"
              style="margin-left:40px"
            >显示高级操作</el-button>
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
    <el-dialog title="提示" :visible.sync="dialogVisible" width="20%">
      <div style="width:80%;margin:0 auto">
        <el-select v-model="newTagCategorie" placeholder="请选择新的标签分类" style="width:100%">
          <el-option v-for="item in tagCategories2" :key="item" :label="item" :value="item"></el-option>
        </el-select>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="renameAlias()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
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
        { value: "latest", label: "按照时间正序" },
        { value: "oldest", label: "按照时间倒序" },
        { value: "count", label: "按照使用数量倒序" },
        { value: "count_inv", label: "按照使用数量正序" }
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
      // 页面是否显示高级选项
      advancedOptions: false,
      // 弹出框是否显示
      dialogVisible: false,
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
      var query = this.searchTag + "*";
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
        this.open2("请选择语言！");
        this.loading = false;
        return false;
      }
      if (new_tag == "") {
        this.open2("请填写标签名称！");
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
          this.open("添加成功！");
          this.new_Tag = "";
          this.loading = false;
          this.requestSearchedTags();
        } else {
          if (result.data.data.reason == "TAG_ALREADY_EXIST") {
            this.loading = false;
            this.open2("此名称已经存在！");
          } else {
            this.loading = false;
            this.open2("添加失败，请重试！");
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
            this.open2("此名称已经存在！");
          } else {
            this.loading = false;
            this.open2("添加失败，请重试！");
          }
        }
      });
    },
    // 删除标签
    removeTag(index) {
      var tag = this.tagEdit[index].id;
      this.$confirm("此操作将永久删除该标签, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
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
              this.open("删除成功！");
              this.requestSearchedTags();
            } else {
              if (result.data.data.reason == "UNAUTHORISED_OPERATION") {
                this.open2("抱歉,只有管理员或者标签的创建者有权修改标签!");
              } else {
                this.open2("删除失败，请重试！");
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
      this.$confirm("此操作将永久删除该标签的别名, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
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
              this.open("删除成功！");
              this.requestSearchedTags();
            } else {
              if (result.data.data.reason == "UNAUTHORISED_OPERATION") {
                this.open2("抱歉,只有管理员或者标签的创建者有权修改标签!");
              } else {
                this.open2("删除失败，请重试！");
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
      var new_tag = this.tagEdit[index].languages[language];
      if (new_tag == "") {
        this.open2("请填写标签名称！");
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
          this.open("修改成功！");
          this.requestSearchedTags();
        } else {
          this.loading = false;
          this.open2("修改失败，请重试！");
        }
      });
    },
    // 重命名标签别名
    confirmAliasChange($index, i) {
      this.loading = true;
      var tag = this.tagData[$index].alias[i];
      var new_tag = this.tagEdit[$index].alias[i];
      if (new_tag == "") {
        this.open2("请填写标签名称！");
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
          this.open("修改成功！");
          this.requestSearchedTags();
        } else {
          this.loading = false;
          this.open2("修改失败，请重试！");
        }
      });
    },
    // 重命名标签类别
    renameAlias(index) {
      var tag = this.tagData[this.tagIndex].id;
      var category = this.newTagCategorie;
      if (category == "") {
        this.open2("请选择标签种类!");
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
          this.open("修改成功！");
          this.loading = false;
          this.$router.go(0);
        } else {
          this.loading = false;
          this.open2("修改失败，请重试！");
        }
      });
    },
    // 打开对话框
    openDialog(index) {
      this.open("功能暂停中，请谅解~");
      return false;
      this.dialogVisible = true;
      this.tagIndex = index;
      this.tagCategorie = this.tagData[index].category;
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
  components: {}
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
  font-size: 17px;
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
</style>