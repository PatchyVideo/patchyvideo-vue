<!--

2/11/2020：v1.0.0
1.新增图片裁剪组件
需要安装依赖：npm install vue-cropper -s
-->


<template>
    <div class="custom-upload" v-loading="loading">
        <el-dialog
                title="图片裁剪"
                :visible.sync="showCropper"
                top="6vh"
                width="50%"
                height="600"
                class="cropper-dialog"
                center
                append-to-body
        >
            <vue-cropper
                    v-if="showCropper"
                    id="corpper"
                    ref="cropper"
                    :class="{'corpper-warp':showCropper}"
                    v-bind="cropper"
            />
            <div v-if="showCropper" class="cropper-button">
                <el-button class="cancel-btn" size="small" @click.native="showCropper=false">取消</el-button>
                <el-button size="small" type="primary" :loading="loading" @click="uploadCover">完成</el-button>
            </div>
        </el-dialog>
        <form
                action="/be/helper/upload_image.do"
                method="post"
                accept-charset="utf-8"
                enctype="multipart/form-data"
                id="form1"
                @submit.prevent="sub"
        >
            <input id="type" name="type" type="text" value="userphoto" v-show="false" />
            <input id="file" name="file" type="file" tag="input"
                   accept="image/*"
                   @change="onChange($event)"
                   :class="id"
                   v-show="false"
            />
            <el-button size="small" type="primary" :loading="loading" @click="handleOpenFile()">
                <i class="fa fa-upload" />
                {{ buttonName }}
            </el-button>
            <el-input type="submit" value="上传" @click="sub"></el-input>
        </form>



        <div v-if="tips" class="tips clear-margin-top">{{ tips }}</div>
    </div>
</template>

<script>
    // 上传文件组件
    import { VueCropper } from 'vue-cropper'
    // 定义的接口根据自己项目更换
    /*    import { uploadImage } from '@/api/upload'*/
    import { isImageFile, isMaxFileSize, readFile,loadImage } from '../static/js/upload.js'   // 见下文
    export default {
        components: {
            VueCropper,isImageFile,isMaxFileSize,readFile,loadImage
        },
        props: {
            // 最大上传文件的大小
            maxFileSize: {
                type: Number,
                default: 2 // （MB)
            },
            // 按钮文字
            buttonName: {
                type: String,
                default: '添加图片'
            },
            // 提示内容
            tips: {
                type: String
            },
            // 图片裁剪比列
            fixedNumber: {
                type: Array,
                default: function() {
                    return []
                }
            },
            // 图片文件分辨率的宽度
            width: {
                type: Number,
                default: 460
            },
            // 图片文件分辨率的高度
            height: {
                type: Number,
                default: 300
            }
        },
        data() {

            return {
                id: 'cropper-input-' + +new Date(),
                loading: false,
                showCropper: false,
                url:"",
                compress:0.8, //压缩率
                imgFile:{},
                img64:{},
                cropper: {
                    img: '',
                    info: true,
                    size: 0.9,
                    outputType: 'png',
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

                }
            }
        },
        methods: {
            sub() {
                //这个司马东西还是只读不准赋值？百度半天不知道这是哪国的妖术竟然可以赋值了
                const data = new DataTransfer();
                data.items.add(this.imgFile);
                $("#file")[0].files = data.files;
                this.loading = true;
                var formObj = new FormData(document.getElementById("form1"));
                console.log($("#file")[0].files);
                this.axios({
                    method: "post",
                    url: "be/helper/upload_image.do",
                    data: formObj,
                    processData: false,
                    contentType: false
                })
                    .then(res => {
                        console.log(res);
                        if (res.data.status == "SUCCEED") {
                            this.file_key = res.data.data.file_key;
                            this.axios({
                                method: "post",
                                url: "be/user/changephoto.do",
                                data: { file_key: this.file_key }
                            }).then(res => {
                         /*       this.getMyData();*/
                                this.$emit('subUploadSucceed',this.url,true);
                                this.loading = false;
                                this.$message({
                                    message: "上传成功！",
                                    type: "success"
                                });
                            });
                        } else {
                            this.$message.error("请选择要上传的头像!");
                            this.loading = false;
                        }
                    })
                    .catch(err => {
                        this.$message.error("上传头像图片大小不能超过 2MB!");
                        this.loading = false;
                    });
            },
            // 打开文件
            handleOpenFile() {
                const input = document.getElementsByClassName(this.id)[0]
                // 解决同一个文件不能监听的问题
                input.addEventListener(
                    'click',
                    function() {
                        this.value = ''
                    },
                    false
                )
                // 点击input
                input.click()
            },

            // 裁剪input 监听
            async onChange(e) {

                const file = e.target.files[0];
                console.log(file);
                if (!file) {
                    return this.$message.error('选择图片失败')
                }
                // 验证文件类型
                if (!isImageFile(file)) {
                    return
                }
                try {
                    // 读取文件
                    const src = await readFile(file)
                    this.showCropper = true
                    this.cropper.img = src
                } catch (error) {
                    console.log(error)
                }
            },
            dataURLtoFile (dataurl, filename) {
                var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
                    bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
                while (n--) {
                    u8arr[n] = bstr.charCodeAt(n);
                }
                return new File([u8arr], filename, { type: mime });
            },
            onImgCompression (img) {
                let canvas = document.createElement("canvas")
                let ctx = canvas.getContext("2d")
                let initSize = img.src.length
                let width = img.width
                let height = img.height
                canvas.width = width
                canvas.height = height
                // 铺底色
                ctx.fillStyle = "#fff"
                ctx.fillRect(0, 0, canvas.width, canvas.height)
                ctx.drawImage(img, 0, 0, width, height)
                //进行压缩
                let compress = this.compress || 0.8  //压缩率
                return canvas.toDataURL("image/jpeg", compress)
            },
            // 封面上传功能
            uploadCover() {
                this.$refs.cropper.getCropBlob(async imgRes => {
                    try {
                        // 文件大小限制
                      /*  if (!isMaxFileSize(imgRes, this.maxFileSize)) {
                            return
                        }*/
                       //是否压缩
                            let img = new Image();
                            img.src = window.URL.createObjectURL(imgRes);
                            img.onload = () => {
                                console.log("正在压缩");
                                let _data = this.onImgCompression(img)
                                let  file = this.dataURLtoFile(_data, "压缩后的图片");
                                console.log('图片大小-压缩过:', (file.size / 1024).toFixed(2), 'kb，', '压缩率：', this.compress)
                                this.imgFile = file;
                            }
                        this.loading = true
               /*         this.imgFile =new File([imgRes],"裁剪后的图片");*/
                        this.url = await window.URL.createObjectURL(imgRes);
                        this.$emit('subUploadSucceed', this.url,false)
                        this.loading = false
                        this.showCropper = false
                    } catch (error) {
                        this.loading = false
                        this.showCropper = false
                        this.$message.error(error)
                    }
                })
            }

        },

    }
</script>

<style lang="less" scoped>
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
        .el-button,.el-input {
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