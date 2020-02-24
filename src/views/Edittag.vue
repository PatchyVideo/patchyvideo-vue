<!--    vue页面：Edittag.vue     -->
<!--
    页面：paychyvideo的标签编辑界面
    功能：用户可以在这里编辑标签
    包含组件：TopNavbar.vue、Foot.vue、tagDetail.vue、searchTag.vue
    更新日志：
    ★待解决问题：
      2.标签搜索功能的实现
-->
<template>
  <div>
    <topnavbar />

    <div class="tagpage">
      <div class="content" v-loading="loading">
        <!-- 每个标签种类的表单 -->
        <el-tabs type="border-card" v-model="activeName">
          <el-tab-pane
            v-for="(item, i) in tagCategories"
            :key="item"
            :label="item"
            :name="i.toString()"
          >
            <tagDetail :tagCategorie="item"></tagDetail>
          </el-tab-pane>
          <el-tab-pane label="搜索标签" :name="(tagCategories.length+1).toString()">
            <searchTag></searchTag>
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>

    <div class="footer w">
      <p>© 2019 www.patchyvideo.com Touhou Project</p>
    </div>
  </div>
</template>

<script>
import topnavbar from "../components/TopNavbar.vue";
import tagDetail from "../components/tagDetail.vue";
import searchTag from "../components/searchTag.vue";
export default {
  data() {
    return {
      // 页面是否属于加载状态的判断
      loading: true,
      // 标签种类
      tagCategories: [],
      // 打开标签的序号
      activeName: "0"
    };
  },
  mounted() {
    // 初始化页面名为home
    this.$store.commit("changeBgc", "tag");
    // 修改网站标题
    document.title = "编辑标签 - Patchyvideo";
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
        console.log(result);
        var categories = result.data.data.categories;
        for (var i = 0; i < categories.length; i++) {
          this.tagCategories.push(categories[i].name);
        }
      });
      this.loading = false;
    }
  },
  components: { topnavbar, tagDetail, searchTag }
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