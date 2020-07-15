<template>
  <div>
    <div class="errorPage">
      <h1>
        {{ $t("errmsg") }}
        <router-link to="/home">{{ $t("click2home") }}</router-link>
      </h1>
      <el-image style="width: 50%;" :src="url" :fit="fits[0]"></el-image>
    </div>
  </div>
</template>

<script>
export default {
  components: {},
  data() {
    this.$i18n.locale = localStorage.getItem("lang");
    return {
      fits: ["fill", "contain", "cover", "none", "scale-down"],
      url: "/images/covers/",
    };
  },
  created() {},
  methods: {},
};
</script>

<style scoped>
.errorPage {
  width: 100%;
  padding-top: 5%;
}
</style>
