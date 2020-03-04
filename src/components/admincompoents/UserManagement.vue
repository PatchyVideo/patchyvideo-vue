<i18n>
{
  "CHS": {
    "title":"用户管理界面",
    "latest":"时间正序",
    "oldest":"时间倒序"
  },
  "ENG": {
    "title":"User management interface",
    "latest":"Latest",
    "oldest":"Oldest"
  }
}
</i18n>

<template>
  <div>
    <h1>{{$t('title')}}</h1>

    <el-select v-model="couponSelected" class="select">
      <el-option v-for="item in options" :key="item.value" :label="$t(item.value)" :value="item.value"></el-option>
    </el-select>
  </div>
</template>

<script>
export default {
  data() {
    this.$i18n.locale = localStorage.getItem('lang');
    return {
      couponSelected: "",
      options: [
        { value: "latest", label: "时间正序" },
        { value: "oldest", label: "时间倒序" }
      ]
    };
  },
  created() {
    this.couponSelected = this.options[0].value;
    this.axios({
      method: "post",
      url: "/be/user/list_users.do",
      data: { page: 1, page_size: 20, query: "", order: this.couponSelected }
    }).then(res => {
      // console.log(res);
    });
  },
  methods: {},
  components: {}
};
</script>

<style scoped>
</style>