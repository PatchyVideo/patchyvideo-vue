<!--
    页面：paychyvideo的个人信息界面
    功能：展示用户个人信息
    更新日志：
    12/31/2019: v1.0

    ★待解决问题：
     因个人界面接口较特殊，需登录后才能获取，登录需携带Cookie，请先在官网登录后再打开此页面。
     本地登录提示错误暂未做处理。
-->
<template>
  <div>
    <div class="bigbox standard">
      <div class="bigbox_left"></div>
      <div class="bigbox_left" id="imoto2"></div>
      <div class="bigbox_right">
        <div class="desc">
          <div class="desc_name">{{ userData.username }}</div>
          <div class="text-form">
            <textarea name="" id="" cols="30" rows="10" v-model="userData.desc"></textarea>
          </div>
          <button>保存</button>
        </div>
        <div class="psd">
          <div class="desc_name">更改密码</div>
          <div class="psd-form">
            <input type="password" placeholder="Old Password" />
            <input type="password" placeholder="New Password" />
            <input type="password" placeholder="Repeat New Password" />
          </div>
          <button>保存</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      userData: {
        username: "null",
        desc: "null"
      }
    };
  },
  created() {
    console.log(this.userData);
    this.getUserData();
  },
  methods: {
    getUserData() {
      this.axios({
        method: "post",
        url: "https://www.patchyvideo.com/user/myprofile.do",
        data: {},
        withCredentials: true
      })
        .then(res => {
          console.log("错误如下：");
          console.log(res);
          if (res.data.status == "ERROR") {
            console.log(
              "登录状态异常,请在官网确认是否登录，否则无法查看个人信息"
            );
            console.log(res.data.data);
          }
          if (res.data.status == "SUCCEED") {
            this.userData = res.data.data.profile;
          }
        })
        .catch(err => {
          console.log(err);
        });
    }
  },
  components: {}
};
</script>

<style scoped>
.bigbox {
  height: 1000px;
  display: flex;
  background-color: white;
  opacity: 0.9;
}

.bigbox_left {
  position: absolute;

  width: 50%;
  height: 900px;
  background: url("../static/img/imoto_left.jpg") no-repeat;
  background-size: 100% 100%;
  /*     background-color: #D5D5D5; */
}

.bigbox_right {
  position: absolute;
  right: 0px;
  padding: 50px;
  padding-top: 150px;
  text-align: left;
  margin: auto;
  width: 40%;
  height: 900px;
}

.desc_name {
  margin-bottom: 20px;
}

.bigbox_right .desc {
  width: 100%;
  height: 250px;
  font-size: 18px;
}

.desc_name {
  color: #333;
  font-family: Arial, Helvetica, sans-serif;
}

.bigbox button {
  width: 100px;
  height: 40px;
  display: inline-block;
  line-height: 1;
  white-space: nowrap;
  cursor: pointer;
  background: #fff;
  border: 1px solid #c4c4c4;
  color: #1f2d3d;
  margin: 0;
  padding: 10px 15px;
  border-radius: 4px;
}

.text-form {
  margin-bottom: 20px;
}

textarea {
  width: 100%;
  height: 100px;
  padding: 10px;
  font-size: 16px;
  color: #4a4a4a;
  border: 1px solid #d1d1d1;
  border-radius: 2px;
}

.psd-form input {
  width: 300px;
  height: 30px;
  margin-bottom: 20px;
  padding-left: 10px;
  display: block;
  font-size: 16px;
  color: #4a4a4a;
  border: 1px solid #d1d1d1;
  border-radius: 2px;
}

#imoto2 {
  position: absolute;
  display: none;
  width: 50%;
  height: 800px;
  background: url("../static/img/imoto_left2.jpg") no-repeat;
  background-size: 100% 100%;
}
</style>
