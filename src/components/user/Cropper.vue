<!--

2/11/2020：v1.0.0
1.新增图片裁剪组件
需要安装依赖：npm install vue-cropper -s
-->

<template>
  <div v-loading="loading" class="custom-upload">
    <el-dialog :title="$t('title')" :visible.sync="showCropper" top="6vh" width="50%" height="600" class="cropper-dialog" center append-to-body>
      <vue-cropper v-if="showCropper" id="corpper" ref="cropper" :class="{ 'corpper-warp': showCropper }" v-bind="cropper" />
      <div v-if="showCropper" class="cropper-button">
        <el-button class="cancel-btn" size="small" @click.native="showCropper = false">{{ $t("cancel") }}</el-button>
        <el-button size="small" type="primary" :loading="loading" @click="uploadCover">{{ $t("ok") }}</el-button>
      </div>
    </el-dialog>
    <el-dialog :modal="false" :title="$t('upload_userphoto')" :visible.sync="dialogVisible" width="40%" top="30vh" :before-close="handleClose">
      <el-input v-if="isShowNetUp" v-model="imgNetUpUrl" :placeholder="$t('enter_url_prompt')" style="margin: 20px 0px 30px;"></el-input>
      <span class="dialog-footer" style="text-align: center; margin: 20px 0px 30px;">
        <el-button v-if="!isShowNetUp" type="primary" @click="handleOpenFile()">{{ $t("from_file") }}</el-button>
        <el-button v-if="!isShowNetUp" type="primary" @click="showNetUp(true)">{{ $t("from_url") }}</el-button>
        <el-button v-if="isShowNetUp" @click="imgNetUrlup()">{{ $t("ok") }}</el-button>
        <el-button v-if="isShowNetUp" @click="showNetUp(false)">{{ $t("cancel") }}</el-button>
      </span>
    </el-dialog>
    <form id="form1" action="/be/helper/upload_image.do" method="post" accept-charset="utf-8" enctype="multipart/form-data" @submit.prevent="sub">
      <input v-show="false" id="type" name="type" type="text" value="userphoto" />
      <input v-show="false" id="file" name="file" type="file" tag="input" accept="image/*" :class="id" @change="onChange($event)" />
      <el-button size="small" type="primary" :loading="loading" @click="dialogVisible = true">
        <i class="fa fa-upload" />
        {{ buttonName }}
      </el-button>
      <el-input type="submit" :value="$t('upload')" @click="sub"></el-input>
    </form>
    <div v-if="tips" class="tips clear-margin-top">{{ tips }}</div>
  </div>
</template>

<script>
// 上传文件组件
import { VueCropper } from "vue-cropper";
// 定义的接口根据自己项目更换
// import { uploadImage } from '@/api/upload'
import { isImageFile, readFile } from "@/static/js/upload"; // 见下文
export default {
  components: {
    VueCropper,
    // isImageFile,
    // isMaxFileSize,
    // readFile,
    // loadImage,
  },
  props: {
    // 最大上传文件的大小
    maxFileSize: {
      type: Number,
      default: 2, // (MB)
    },
    // 按钮文字
    buttonName: {
      type: String,
      default: "Add Image",
    },
    // 提示内容
    tips: {
      type: String,
      default: "",
    },
    // 图片裁剪比列
    fixedNumber: {
      type: Array,
      default: function() {
        return [];
      },
    },
    // 图片文件分辨率的宽度
    width: {
      type: Number,
      default: 460,
    },
    // 图片文件分辨率的高度
    height: {
      type: Number,
      default: 300,
    },
  },
  data() {
    this.$i18n.locale = localStorage.getItem("lang");
    return {
      imgNetUpUrl: "",
      id: "cropper-input-" + new Date(),
      loading: false,
      showCropper: false,
      isShowNetUp: false,
      dialogVisible: false,
      url: "",
      compress: 0.8, // 压缩率
      imgFile: {},
      img64: {},
      cropper: {
        img: "",
        info: true,
        size: 0.9,
        outputType: "png",
        canScale: true,
        autoCrop: true,
        full: true,
        // 只有自动截图开启 宽度高度才生效
        autoCropWidth: this.width,
        autoCropHeight: this.height,
        fixedBox: false,
        // 开启宽度和高度比例
        fixed: true,
        fixedNumber: this.fixedNumber,
        original: false,
        canMoveBox: true,
        canMove: true,
      },
    };
  },
  methods: {
    handleClose(done) {
      done();
      // this.$confirm("确认关闭？")
      //   .then(_ => {
      //     done();
      //   })
      //   .catch(_ => {});
    },
    showNetUp(b) {
      this.isShowNetUp = b;
      if (b === false) {
        this.imgNetUpUrl = "";
      }
    },
    sub() {
      if (this.imgFile.lastModified === undefined) {
        this.$message.error(this.$t("no_file_prompt"));
        return;
      }
      // 这个司马东西还是只读不准赋值？百度半天不知道这是哪国的妖术竟然可以赋值了
      const data = new DataTransfer();
      data.items.add(this.imgFile);
      $("#file")[0].files = data.files;
      this.loading = true;
      let formObj = new FormData(document.getElementById("form1"));
      this.axios({
        method: "post",
        url: "be/helper/upload_image.do",
        data: formObj,
        processData: false,
        contentType: false,
      })
        .then((res) => {
          if (res.data.status == "SUCCEED") {
            this.file_key = res.data.data.file_key;
            this.changePhtoto(this.file_key);
          } else {
            this.$message.error(this.$t("no_file_prompt"));
            this.loading = false;
          }
        })
        .catch(() => {
          this.$message.error(this.$t("file_size_prompt"));
          this.loading = false;
        });
    },
    changePhtoto(key) {
      this.loading = true;
      this.axios({
        method: "post",
        url: "be/user/changephoto.do",
        data: { file_key: key },
      }).then((res) => {
        // this.getMyData();
        this.$emit("sub-upload-succeed", this.url, true);
        let img = res.data.data;
        this.$store.commit("getUserAvatar", img);
        this.setUser(img);
        this.loading = false;
        this.$message({
          message: this.$t("upload_succeed"),
          type: "success",
        });
        this.dialogVisible = false;
      });
    },
    imgNetUrlup() {
      if (this.imgNetUpUrl.toString() === "") {
        this.$message.error(this.$t("no_url_prompt"));
        return false;
      }
      this.axios({
        method: "post",
        url: "/be/helper/upload_image_url.do",
        data: { url: this.imgNetUpUrl, type: "userphoto" },
      })
        .then((res) => {
          if (res.data.status === "SUCCEED") {
            this.file_key = res.data.data.file_key;
            this.changePhtoto(this.file_key);
          } else {
            if (res.data.data === "INCORRECT_UPLOAD_TYPE") {
              this.$message.error(this.$t("INCORRECT_UPLOAD_TYPE"));
            } else {
              this.$message.error(this.$t("upload_failed"));
            }
          }
        })
        .catch(() => {
          this.$message.error(this.$t("upload_failed"));
        });
    },
    // 打开文件
    handleOpenFile() {
      const input = document.getElementsByClassName(this.id)[0];
      // 解决同一个文件不能监听的问题
      input.addEventListener(
        "click",
        function() {
          this.value = "";
        },
        false
      );
      // 点击 input
      input.click();
    },

    // 裁剪 input 监听
    async onChange(e) {
      const file = e.target.files[0];
      if (!file) {
        return this.$message.error(this.$t("open_failed"));
      }
      // 验证文件类型
      if (!isImageFile(file)) {
        return;
      }
      try {
        // 读取文件
        const src = await readFile(file);
        this.showCropper = true;
        this.cropper.img = src;
      } catch (error) {
        // TODO: handle file error
      }
    },
    dataURLtoFile(dataurl, filename) {
      let arr = dataurl.split(","),
        mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]),
        n = bstr.length,
        u8arr = new Uint8Array(n);
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
      }
      return new File([u8arr], filename, { type: mime });
    },
    onImgCompression(img) {
      let canvas = document.createElement("canvas");
      let ctx = canvas.getContext("2d");
      // let initSize = img.src.length;
      let width = img.width;
      let height = img.height;
      canvas.width = width;
      canvas.height = height;
      // 铺底色
      ctx.fillStyle = "#fff";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, width, height);
      // 进行压缩
      let compress = this.compress || 0.8; // 压缩率
      return canvas.toDataURL("image/jpeg", compress);
    },
    // 封面上传功能
    uploadCover() {
      this.$refs.cropper.getCropBlob(async (imgRes) => {
        try {
          // 文件大小限制
          // if (!isMaxFileSize(imgRes, this.maxFileSize)) {
          //   return;
          // }
          //是否压缩
          let img = new Image();
          img.src = window.URL.createObjectURL(imgRes);
          img.onload = () => {
            let _data = this.onImgCompression(img);
            let file = this.dataURLtoFile(_data, "压缩后的图片");
            console.log("图片大小-压缩过:", (file.size / 1024).toFixed(2), "kb，", "压缩率：", this.compress);
            this.imgFile = file;
          };
          this.loading = true;
          // this.imgFile = new File([imgRes],"裁剪后的图片");
          this.url = await window.URL.createObjectURL(imgRes);
          this.$emit("sub-upload-succeed", this.url, false);
          this.loading = false;
          this.showCropper = false;
          this.dialogVisible = false;
        } catch (error) {
          this.loading = false;
          this.showCropper = false;
          this.$message.error(error);
        }
      });
    },
    setUser(avatar) {
      const userInfo = JSON.parse(localStorage.getItem("userInfo") || "{}");
      userInfo.avatar = avatar;
      localStorage.setItem("userInfo", JSON.stringify(userInfo));
    },
  },
};
</script>

<style lang="less" scoped>
.dialog-footer {
  height: 50% !important;
}
form {
  transform: translateY(50%);
  width: 100%;
  text-align: left;
  font-size: 50px;
  display: flex;
  flex-direction: column;
  #file {
    border: 1px solid #dcdfe6;

    width: 256px;
    text-align: center;
  }
  i {
    display: block;
  }
  .el-button,
  .el-input {
    margin-top: 20px;
    width: 256px;
  }
}
#corpper {
  width: 90%;
  height: 400px;
  margin: 0 auto;
  background-image: none;
  background: #fff;
  z-index: 1002;
}
.cropper-dialog {
  height: 800px;
  text-align: center;
  .el-dialog__header {
    padding-top: 15px;
  }
  .el-dialog--center .el-dialog__body {
    padding-top: 0;
    padding-bottom: 15px;
  }
  .el-dialog {
    text-align: center;
  }
}
.cropper-button {
  z-index: 1003;
  text-align: center;
  margin-top: 20px;
  .el-button {
    font-size: 16px;
    cursor: pointer;
    text-align: center;
  }
  .cancel-btn {
    color: #373737;
  }
  .el-button:last-child {
    margin-left: 100px;
  }
}
.cropper-modal {
  background-color: rgba(0, 0, 0, 0.5) !important;
}
.custom-upload {
  .tips {
    margin-top: 10px;
    color: red;
    font-size: 12px;
  }
  .clear-margin-top {
    margin-top: 0;
  }
}
</style>
