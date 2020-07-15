<template>
  <div>
    <topnavbar />

    <div class="tagpage">
      <div v-loading="loading" class="content">
        <!-- 每个标签种类的表单 -->
        <el-tabs v-model="activeName" type="border-card">
          <el-tab-pane v-for="(item, i) in tagCategories" :key="item" :lazy="true" :label="$t('tag_categories.' + item)" :name="i.toString()">
            <tagDetail :tag-categorie="item"></tagDetail>
          </el-tab-pane>
          <el-tab-pane :lazy="true" :label="$t('search_tag')" :name="(tagCategories.length + 1).toString()">
            <searchTag></searchTag>
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>

    <Footer></Footer>
  </div>
</template>

<script>
import topnavbar from "@/components/main/bar/TopNavbar";
import Footer from "@/components/main/bar/Footer";
import tagDetail from "@/components/tag/Detail";
import searchTag from "@/components/tag/edit/Search";
export default {
  components: { topnavbar, tagDetail, searchTag, Footer },
  data() {
    this.$i18n.locale = localStorage.getItem("lang");
    return {
      // 页面是否属于加载状态的判断
      loading: true,
      // 标签种类
      tagCategories: [],
      // 打开标签的序号
      activeName: "0",
    };
  },
  computed: {
    aqwe() {
      return "asda";
    },
  },
  mounted() {
    // 初始化页面名为 home
    this.$store.commit("changeBgc", "tag");
    // 修改网站标题
    document.title = this.$t("title") + " - PatchyVideo";
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
  },
};
</script>

<style scoped>
.tagpage {
  width: 100%;
  margin-top: 10px;
  margin-bottom: 20px;
  /* background-image: url("/static/img/imoto3.jpg"); */
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
