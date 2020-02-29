<template>
  <div>
    <h1>用户管理界面</h1>

    <el-select v-model="couponSelected" class="select">
      <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
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