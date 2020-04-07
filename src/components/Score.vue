
<i18n>
{
    "CHS": {
        "score":"评分",
        "submit":"提交",
        "average":"均分",
        "evaluation":"评价",
        "login":"登录",
        "prompt":"提示",
        "OK":"确 定",
        "prompt_content":"你还没有评分！无法提交！"

    },
    "ENG": {
        "score":"Score",
        "submit":"Submit",
        "average":"Average",
        "evaluation":"Evaluation",
        "login":"Login",
        "prompt":"Prompt",
        "OK":"O K",
        "prompt_content":"You have not rated yet! Unable to submit!"
    },
    "CHT": {
        "score":"評分",
        "submit":"提交",
        "average":"均分",
        "Evaluation":"評價",
        "login":"登錄",
        "prompt":"提示",
        "OK":"確 定",
        "prompt_content":"妳還沒有評分！無法提交！"
    }
}
</i18n>


<template>

    <div style="position:relative">

        <!-- 没有评分就提交（分数<1）时  弹出框-->

        <el-dialog
        :title="$t('prompt')"
        :visible.sync="dialogVisible"
        width="30%">
        <span v-if="!promptContent">{{$t("prompt_content")}}</span>
        <span v-if="promptContent">打分{{data.user_rating}}分成功！</span>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">{{$t("OK")}}</el-button>
            </span>
        </el-dialog>

        <!-- 主题 -->
        <span>{{$t("score")}}</span>
        <div class="star" v-for="index in [1,2,3,4,5]" :key="index" @click="enableListener = !enableListener">
            <img :src="(index<=lastStar.index)?starIcon[2]:starIcon[0]">
            <div class="left" @mouseover="starHover(index,0)"></div>
            <div class="right" @mouseover="starHover(index,1)"></div>
        </div>
        <span v-if="isLogin()"><el-link type="primary" @click="submitScore">{{$t("submit")}}</el-link></span>
        <span v-if="!isLogin()"><router-link to="/login" @click.native="login">{{$t("login")}}</router-link></span>
        <span class="aveScore">
            {{data.user_rating}} / {{(data.total_rating/data.total_user||0).toFixed(1)}}
            <span>{{data.total_user||0}} {{$t("evaluation")}}</span>
        </span>
    </div>
</template>


<script>
import star_hollow from "../static/img/star_hollow.png"
import star_half from "../static/img/star_half.png"
import star_full from "../static/img/star_full.png"
export default {
    props: {
        type: "",
        
    },
    data:function () { 
        this.$i18n.locale = localStorage.getItem("lang");
        return {
            pid: this.$route.query.id,
            dialogVisible: false,
            //提示框内容显示 0表示失败提示 1表示成功提示 
            promptContent:0,
            enableListener: true,
            starIcon:[star_hollow,star_half,star_full],
            // 评分状态，true=已经评过
            scoreStatus: false,
            // 最近一次悬浮的星星信息
            lastStar:{
                // 序号 1起
                index:0,
                // 位置 左0右1
                position:0,
            },
            data:{}
        }
    },
    created(){
        this.isLogin() ? this.getMyScore():this.getTotalRating();
    },
    watch:{
        pid:function (val) {             
            this.getMyScore();
        },
        scoreStatus:function (val) {
            
        }

    },
    methods:{
        // 登录跳转
        login() {
        this.$store.commit("changeifRouter", "0");
        },
        getMyScore(callBack){
            // var url = this.type="video"?"/be/rating/get_video.do":"/be/rating/get_playlist.do ";
            var data = {};
            var url = "";
            if(this.type=="video"){
                url = "/be/rating/get_video.do";
                data.vid = this.pid;
            }else{
                url = "/be/rating/get_playlist.do";
                data.pid = this.pid;
            }
            this.axios({
                method: "post",
                url: url,
                data: data
            }).then(res => {
                var data = res.data;
                if(data.data.reason === "NOT_RATED"){
                    // 没有评分过
                    this.scoreStatus = false;
                    return;
                }
                // user_rating == -1 时也没有评分
                this.scoreStatus = !(data.data.user_rating == -1);
                this.data = data.data;
                // console.log(data);
                
                this.showStar(this.data.user_rating);
                if(callBack){
                    callBack();
                }
            });
        },
        getTotalRating(){
            var data = {};
            var url = "";
            if(this.type=="video"){
                url = "/be/rating/get_video_total.do ";
                data.vid = this.pid;
            }else{
                url = "/be/rating/get_playlist_total.do ";
                data.pid = this.pid;
            }
            this.axios({
                method: "post",
                url: url,
                data: data
            }).then(res => {
                this.data = res.data.data;
                // console.log(this.data);
            });
        },
        showStar(num){
            var stars = document.getElementsByClassName("star");
            for(var i=0;i<stars.length;i++){
                var img = stars[i].getElementsByTagName("img")[0];
                var index = parseInt(num/2);
                var pos = num%2;
                if(i<index && img!=this.starIcon[2]){
                   img.src = this.starIcon[2];
                };
                if(i>index && img.src!=this.starIcon[2]){
                    img.src = this.starIcon[0];
                };
                if(i==index && pos==1){
                    img.src = this.starIcon[1];
                }
            }
        },
        // index 第几个星星， pos 0左1右
        starHover(index,pos){
            // if(this.scoreStatus) return;
            if(!this.isLogin()) return;
            if(!this.enableListener) return;

            this.lastStar = {index:index,position:pos};
            this.checkStar(this.lastStar.index)
            var curStar = document.getElementsByClassName("star")[index-1];
            var img = curStar.getElementsByTagName("img")[0];
            img.src=this.starIcon[pos+1];
        },
        checkStar(index){
            var stars = document.getElementsByClassName("star");
            for(var i=0;i<stars.length;i++){
                var img = stars[i].getElementsByTagName("img")[0];
                if(i<index && img!=this.starIcon[2]){
                   img.src = this.starIcon[2];
                    continue;
                };
                if(i>index && img.src!=this.starIcon[0]){
                    img.src = this.starIcon[0];
                    continue;
                };
            }
        },
        
        async submitScore(){
            var score = (this.lastStar.index-1)*2 + this.lastStar.position + 1;
            if(score<1){
                this.dialogVisible = true;
                return;
            }
            // var url = this.type=="video"?"/be/rating/video.do":"/be/rating/playlist.do ";
            var data = {};
            var url = "";
            if(this.type=="video"){
                url = "/be/rating/video.do";
                data.vid = this.pid;
                data.stars = score;
            }else{
                url = "/be/rating/playlist.do";
                data.pid = this.pid;
                data.stars = score;
            }
            this.axios({
                method: "post",
                url: url,
                data: data
            }).then(res => {
                var data = res.data;
                this.scoreStatus = true;
                this.enableListener=false;
                // console.log(data);
                var that = this;
                this.getMyScore(function(){
                    that.promptContent = 1;
                    that.dialogVisible = true;
                });
                
            });
        },
        // 判断是否登录的标志
        isLogin() {
            if (
                JSON.stringify(this.$store.state.username) != "null" &&
                this.$store.state.username != ""
            ) {
                return true;
            } else {
                return false;
            }
        },
        }
}
</script>

<style scoped>
    span{
        padding-left: 10px;
        position: relative;
        top: -6px;
    }
    .star{
        display: inline-block;
        position: relative;
        padding-left: 5px;
        width: 30px;
        height: 30px;
    }
    .star img{
        width: 100%;
        height: 100%;
    }
    .star div{
        position: absolute;
        display: inline-block;
        width: 50%;
        height: 100%;
        text-align: center;
        line-height: 30px;
    }
    .left{
        left: 0;
    }
    .right{
        right: 0;
    }
    .aveScore{
        position: absolute;
        top: 5px;
        right: 0;
        color: #ffd343;
        font-size: 20px;
        font-weight: bolder;
    }
    .aveScore span{
        font-size: 10px;
        color:rgb(175, 175, 175);
    }
</style>