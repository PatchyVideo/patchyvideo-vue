<!--    vue页面：Edittag.vue     -->
<!--
    页面：paychyvideo的标签编辑界面
    功能：用户可以在这里编辑标签
    包含组件：TopNavbar.vue、Foot.vue、tagDetail.vue、searchTag.vue
    更新日志：
    ★待解决问题：
      2.标签搜索功能的实现
-->

<i18n>
{
  "CHS": {
    "title":"编辑标签",
    "search_tag":"搜索标签",
    "tag_categories":{
        "General":"综合",
        "Character":"角色",
        "Copyright":"作品",
        "Author":"up主",
        "Meta":"元数据",
        "Language":"语言",
        "Soundtrack":"原曲"
    }
  },
  "ENG": {
    "title":"Edit tag",
    "search_tag":"Search tag",
    "tag_categories":{
        "General":"General",
        "Character":"Character",
        "Copyright":"Copyright",
        "Author":"Author",
        "Meta":"Meta",
        "Language":"Language",
        "Soundtrack":"Soundtrack"
    }
  },
  "CHT": {
    "title":"編輯標簽",
    "search_tag":"搜索標簽",
    "tag_categories":{
        "General":"綜合",
        "Character":"角色",
        "Copyright":"作品",
        "Author":"up主",
        "Meta":"元數據",
        "Language":"語言",
        "Soundtrack":"原曲"
    }
  }
}
</i18n>


<template>
  <div>
    <topnavbar />

    <div class="tagpage">
      <div class="content" v-loading="loading">
        <!-- 每个标签种类的表单 -->
        <el-tabs type="border-card" v-model="activeName">
          <el-tab-pane
            :lazy="true"
            v-for="(item, i) in tagCategories"
            :key="item"
            :label="$t('tag_categories.' + item)"
            :name="i.toString()"
          >
            <tagDetail :tagCategorie="item"></tagDetail>
          </el-tab-pane>
          <el-tab-pane
            :lazy="true"
            :label="$t('search_tag')"
            :name="(tagCategories.length+1).toString()"
          >
            <searchTag></searchTag>
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>

    <Footer></Footer>
  </div>
</template>

<script>
import topnavbar from "../components/TopNavbar.vue";
import tagDetail from "../components/tagDetail.vue";
import searchTag from "../components/searchTag.vue";
import Footer from "../components/Footer.vue";
export default {
  data() {
    this.$i18n.locale = localStorage.getItem("lang");
    return {
      // 页面是否属于加载状态的判断
      loading: true,
      // 标签种类
      tagCategories: [],
      // 打开标签的序号
      activeName: "0"
    };
  },
  computed: {},
  mounted() {
    // 初始化页面名为 home
    this.$store.commit("changeBgc", "tag");
    // 修改网站标题
    document.title = this.$t("title") + " - Patchyvideo";
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
    }
  },
  components: { topnavbar, tagDetail, searchTag, Footer }
};
</script>

<style scoped>
.tagpage {
  width: 100%;
  margin-top: 10px;
  margin-bottom: 20px;
  /* background-image: url("./../static/img/imoto3.jpg"); */
  background-repeat: no-repeat;
}
.content {
  width: 80%;
  min-height: 600px;
  margin: 0 auto;
  background-color: #ffffffc9;
}
.footer {
  width: calc(100% - 30px);
}
</style>