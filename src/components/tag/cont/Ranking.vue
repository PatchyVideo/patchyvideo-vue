<template>
  <div v-loading="loading" class="bang">
    <div style="height: 35px;">
      <transition name="anime-left">
        <div v-show="loading === false" style="height: 35px;">
          <el-select id="select-order" v-model="couponSelected">
            <el-option v-for="item in options" :key="item.value" style="text-align: center;" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </div>
      </transition>
    </div>

    <div v-for="(item, i) in ranking" :key="i">
      <div class="list-item" :class="{ top: i === 0, second: i === 1, three: i === 2 }">
        <h1 class="rank">{{ i + 1 }}</h1>

        <router-link :to="'/users/' + item._id.$oid" class="u-img">
          <div class="Imgcover"></div>
          <el-avatar fit="cover" class="loginUser-userAvatar" :size="40" :src="userAvatar(item.user_obj.profile.image)"></el-avatar>
        </router-link>
        <router-link :to="'/users/' + item._id.$oid" class="u-name" tag="h1">{{ item.user_obj.profile.username }}</router-link>
        <p class="u-desc">
          <span>{{ item.user_obj.profile.desc }}</span>
        </p>
        <i18n tag="h1" path="editcount" class="count">
          <span place="count">{{ item.count }}</span>
        </i18n>
      </div>

      <el-divider></el-divider>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    this.$i18n.locale = localStorage.getItem("lang");
    return {
      options: [
        { value: 24 * 7 * 52 * 10, label: this.$t("to_date") },
        { value: 24 * 30, label: this.$t("last_month") },
        { value: 24 * 7, label: this.$t("last_week") },
        { value: 24 * 1, label: this.$t("last_day") },
      ],
      couponSelected: "",
      loading: true,
      timeSpan: 24 * 7 * 52 * 10, // 过去一周
      displaySize: 30, // 显示前 30 个
      ranking: [],
    };
  },
  computed: {},
  watch: {
    couponSelected() {
      //排序更改时，重新请求数据
      this.loading = true;
      this.loadData();
    },
  },
  created() {
    this.couponSelected = this.options[0].value;
    this.loadData();
  },

  methods: {
    userAvatar(i) {
      return "be/images/userphotos/" + i;
    },
    loadData() {
      this.loading = true;
      this.axios({
        method: "post",
        url: "/be/ranking/tag_contributor.do",
        data: {
          hrs: this.couponSelected,
          size: this.displaySize,
        },
      }).then((result) => {
        let data = result.data.data;
        this.ranking = data;
        this.loading = false;
      });
    },
  },
};
</script>
<style scoped lang="less">
/deep/ .el-select {
  input {
    text-align: center;
  }
}
.top {
  text-shadow: 0 0 10px #fff, 0 0 20px #fff, 0 0 30px #fff, 0 0 5px #ff7777;
  font-size: 25px !important;
  color: #ff7777 !important;
}
.second {
  text-shadow: 0 0 10px #fff, 0 0 20px #fff, 0 0 30px #fff, 0 0 5px #228dff;
  color: #228dff !important;
  font-size: 22px !important;
}
.three {
  text-shadow: 0 0 10px #fff, 0 0 20px #fff, 0 0 30px #fff, 0 0 5px #54df31;
  font-size: 20px !important;
  color: #54df31 !important;
}
.u-img {
  position: relative;
  &:hover .loginUser-userAvatar {
    cursor: pointer;
    background-color: rgba(255, 255, 255, 0.3);
  }
  .loginUser-userAvatar {
    transition: all 2s ease;
  }
  .Imgcover {
    position: absolute;
    width: 100%;
    height: 100%;
    z-index: 20;
    top: 0%;
    transition: all 0.3s ease;
    &:hover {
      cursor: pointer;
      background-color: rgba(255, 255, 255, 0.3);
    }
  }
}

.bang {
  width: 80%;
  margin: auto;
}
/deep/ .el-avatar {
  width: 100px !important;
  height: 100px !important;
}

.list-item {
  margin: 24px 0;
  height: 100%;
  transition: all 0.3s ease;
  &:hover {
    /* background-color: rgba(255,255,255,0.3); */
    background-color: rgb(244, 244, 245);
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  }
  display: flex;
  .rank {
    line-height: 100px;
    width: 50px;
    margin-right: 50px;
  }
  .u-name {
    cursor: pointer;
    margin-left: 30px;
    font-size: 20px;
    /* flex: 0 0 31%; */
    text-align: left;
    width: 333px;
    max-width: 333px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    line-height: 100px;
    margin-right: 50px;
    transition: all 0.3s ease;
    &:hover {
      opacity: 0.7;
    }
  }
  .u-desc {
    color: #6d757a;
    overflow: hidden;
    white-space: nowrap;
    flex: 0 0 41%;
    text-overflow: ellipsis;
    text-shadow: none;
    position: relative;
    padding-right: 50px;
    span {
      text-align: left;
      display: inline-block;
      width: 90%;
      white-space: normal;
      position: absolute;
      top: 50%;
      left: 0%;
      transform: translateY(-50%);
    }
  }
  .count {
    text-align: right;
    white-space: nowrap;
    flex-grow: 1;
    font-size: 20px;
    line-height: 100px;
  }
}
</style>
