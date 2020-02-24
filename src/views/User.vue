<!--
新增user模块 需要安装依赖
npm install --save-dev less-loader less
npm install echarts --save
npm install font-awesome --save

————————————————————————————

img文件夹下新增 imoto.jpg test.png imoto_left.jpg imoto_left2.jpg

main.js文件下需要添加：
import echarts from 'echarts';
Vue.prototype.$echarts = echarts;

   vue页面：User.vue

    页面：paychyvideo的注册页面
    功能：用户由此注册账号
    包含组件：UserContribute、UserFavorites、Userprofile
    更新日志：
    1/1/2020: v1.0
    现在可以查看其他用户界面。
    1/22/2020: v1.1
    新增贡献索引状态状态页面。
    修改密码功能以及邮箱功能完成。
    更新了切换状态的字体图标。

    ★待解决问题：
    问题：1. 页面布局不是依照100%宽度做的，所以并不能适应，最终展示分辨率大小还有待商榷
          2. 当用户输入的UID非法时，应跳转至404页面，暂时没做
          3. 预订取消userfolder模块。


-->


<template>
    <div>

        <topnavbar></topnavbar>
        <div class="content w">
            <!-- <el-menu
              :default-active="activeIndex"
              class="el-menu-demo"
              mode="horizontal"
              @select="handleSelect"
            >
              <el-menu-item index="1">个人中心</el-menu-item>
              <el-menu-item index="2">我贡献的索引</el-menu-item>
              <el-menu-item index="3">收藏夹</el-menu-item>
            </el-menu>
            <userprofile v-if="1==gotomark"></userprofile>
            <usercontribute v-if="2==gotomark"></usercontribute>
            <userfavorites v-if="3==gotomark"></userfavorites>-->

            <!--个人界面-->
     
            <el-tabs v-model="activeName" @tab-click="handleClick">
                <el-tab-pane :label="labelInfo[0]" name="first">
                    <userprofile></userprofile>
                </el-tab-pane>
                <el-tab-pane :label="labelInfo[1]" name="second">
                    <usercontribute v-if="this.activeName==='second'"></usercontribute>
                </el-tab-pane>
                <el-tab-pane :label="labelInfo[2]" name="third">
                    <listfolder v-if="this.activeName==='third'"></listfolder>
                </el-tab-pane>
                <el-tab-pane :label="labelInfo[3]" name="four">
                    <userfavorites v-if="this.activeName==='four'"></userfavorites>
                </el-tab-pane>
                <el-tab-pane :label="labelInfo[4]" name="fifth">
                    <userfolder v-if="this.activeName==='fifth'"></userfolder>
                </el-tab-pane>
        <!--       <el-tab-pane label="文件管理" name="five">
                    <userfolder></userfolder>
                </el-tab-pane>-->
            </el-tabs>

            <!--其他用户界面-->


        </div>
        <Footer></Footer>
    </div>
</template>

<script>
    import topnavbar from '../components/TopNavbar.vue';
    import userprofile from '../components/UserProfile.vue';
    import usercontribute from '../components/UserContribute.vue';
    import listfolder from '../components/ListFolder.vue';
    import userfavorites from '../components/UserFavorites.vue';
    import userfolder from '../components/UserFolder.vue';
    import userpoststate from '../components/UserPostState.vue';

    import Footer from "../components/Footer.vue";
    export default {
        data() {
            return {
                usersid: "www",
                gotomark: 0,
                activeIndex: "1",
                activeIndex2: "1",
                activeName: "first",
                info:[["我的信息","我贡献的索引","我的文件夹","我的收藏","索引状态"],["用户信息","他贡献的索引","他的文件夹","他的收藏"]],
                labelInfo:["我的信息","我贡献的索引","文件夹","我的收藏","索引状态"]
            }
        },
       created(){
            //判断url阶段,
           // 如果用户输入的路径为me,将User渲染为个人界面
           // 如果用户输入的路径不为me,先判断此uid是否存在，存在则渲染其他用户界面，不存在则跳到404
           if(this.$route.params.id=="me"){
               //如果用户输入的路径为me,将User渲染为个人界面，已经在上面的条件渲染中体现

           }
           if(this.$route.params.id!="me" ){
               //当路径不为me，判断输入uid是否合法，     SUCCEED FAILED
               this.isUidNull();
           }
       },
        mounted(){

            if(Object.keys(this.$route.query).toString()==="path"){
                this.activeName="third";
                /*  let path = this.$route.query.path;*/
                /*                let str = this.$route.query.path.replace(/\//g,"");*/
                this.$refs.folder.navigateTo(this.$route.query.path);
            }
        },
        methods: {
            handleSelect(key, keyPath) {
            },
            handleClick(key) {
            },
            isUidNull(){
             this.axios({
                    method:'post',
                    url:'be/user/profile.do',
                    data:{"uid":this.$route.params.id}
                }).then(res=>{
                    if(res.data.status=="FAILED"){
                        this.$router.push("/*");
                   /*     this.$router.push("/home");*/
                        //跳到404
                    }
                    if(res.data.status =="SUCCEED"){
                        //uid合法 渲染该uid的用户数据
                        this.labelInfo = this.info[1];
                    }
               });
            }

        },
        components: {topnavbar,usercontribute,userprofile,listfolder,userfavorites,userfolder,userpoststate,Footer}
    }
</script>

<style scoped >

    .w {
        display: block;
    }
    .el-tabs{
        background-color: rgba(255,255,255,0.9);
    }

    input::-webkit-input-placeholder {
        font-size: 12px;

    }


    body {
        width: 100%;
        height: 100%;

        background: none;
    }

    h4 {

        position: absolute;
        display: block;
    }

    .content {
       /* width: 1600px;*/
        width: 80%;
        max-width: 1600px;
        min-width: 1600px;
        height: 100%;

   /*     background:  url("../static/img/imoto.jpg") no-repeat top center;*/

        opacity: 0.9;
        background-size: cover;
        background-attachment: fixed;

    }

    .font {}

    .standard {
        width: 1500px;
        margin: 10px 5px 0px;
    }

    .topmsg {

        font-size: 22px;
        font-weight: lighter;
        width: 100%;
        font-family: PingFang SC, Arial, Microsoft YaHei, sans-serif;
        height: 50px;
        border-bottom: 1px solid #ccc;
        /*background-color: white;*/
    }
    .topmsg div{
        display: flex;  height: 100%;
    }
    .topmsg div a{
        display: inline-block;
        text-decoration: none;
        text-align: center;
        height: 100%;
        line-height: 50px;
        margin-right: 15px;
    }
    .topmsg div a:hover{
        background-color: #fafafa;

    }
    .topmsg  div a:nth-child(1){

    }
</style>