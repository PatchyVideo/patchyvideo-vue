<!--
    页面：paychyvideo的个人信息界面
    功能：展示用户个人信息
    更新日志：
    12/31/2019: v1.0

    ★待解决问题：
     因个人界面接口较特殊，需登录后才能获取，登录需携带Cookie，请先在官网登录后再打开此页面。
     本地登录提示错误暂未做处理。

       更新日志：
       1/11/2020
       问题：
       1.登录机制需要做成cookie保存验证判断,现有的登录有点问题暂时没有解决，
       2.由于User组件被改动，与原先的单独渲染相反，现在的所有子组件渲染几乎同时完成，意味着只要用户进入user界面，其他三个页面就已经加载完成。
       3.该组件应当采用大驼峰命名，下次更新时修改。


-->
<template>

    <div>
        <div class="bigbox standard" v-if="this.$route.params.id=='me'"   v-loading="loading">
            <div class="bigbox_left"></div>
            <div class="bigbox_left" id="imoto2"></div>
            <div class="bigbox_right">
                <div class="desc">
                    <div class="desc_name">{{myData.username}}</div>
                    <div class="text-form">
                        <textarea name="" id="" cols="30" rows="10">{{myData.desc}}</textarea>
                    </div>
                    <button>保存</button>
                </div>
                <div class="psd">
                    <div class="desc_name">更改密码</div>
                    <div class="psd-form">
                        <input type="password" placeholder="Old Password">
                        <input type="password" placeholder="New Password">
                        <input type="password" placeholder="Repeat New Password">
                    </div>
                    <button>保存</button>

                </div>


            </div>


        </div>
        <div class="bigbox standard" v-if="this.$route.params.id!='me'"   v-loading="loading">
            <div class="bigbox_left"></div>
            <div class="bigbox_left" id="imoto2"></div>
            <div class="bigbox_right">
                <div class="desc">
                    <div class="desc_name">{{userData.username}}</div>
                    <div class="text-form">
                        <textarea name="" id="" cols="30" rows="10" disabled="disabled">{{userData.desc}}</textarea>
                    </div>

                </div>



            </div>


        </div>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                myData:{
                    "username": "null",
                    "desc":"null"
                },
                userData:{
                    desc: "null",
                    email: "null",
                    image: "null",
                    pubkey: "null",
                    username: "null",
                },
                loading:true
            }
        },
        created(){
            console.log(this.myData);
            if(this.$route.params.id=='me'){
                this.getMyData();
            }
            if(this.$route.params.id!='me'){
                this.getUserData();
            }
            console.log(this.$route);

        },
        methods: {
            getMyData(){
                //现有的登录机制存在问题，
                //可能本地判断已登录实际并没有登录而进入了user界面，这时没有数据渲染，需要让他跳回登录界面
                this.axios({
                    method:'post',
                    url:"/be/user/myprofile.do",
                    data:{
                    },
                    withCredentials:true,
                }).then(res=>{
                    if(res.data.status=='ERROR'){
                        //火狐浏览器有BUG 暂时先这样跳，等cookie登陆做完后再在user页面判断。
                        this.$router.push("/login");
                        console.log(res.data.data);
                    }
                    if(res.data.status=='SUCCEED')
                    {
                        this.myData = res.data.data.profile;
                    }
                    this.loading =false;
                }).catch(err=>{
                    console.log(err);
                })
            },
            getUserData(){
                this.axios({
                    method: "post",
                    url:"be/user/profile.do",
                    data:{"uid":this.$route.params.id}
                }).then(res=>{
                    this.userData =res.data.data.profile;
                    console.log(res);
                    this.loading =false;
                });

            }
        },
        components: {}
    }
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