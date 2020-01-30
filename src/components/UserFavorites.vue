
<!--
    页面：paychyvideo的个人收藏夹页面
    功能：展示用户创建的所有收藏夹信息
    更新日志：
    12/31/2019: v1.0

    ★待解决问题：
     因个人界面接口较特殊，需登录后才能获取，登录需携带Cookie，请先在官网登录后再打开此页面。
     本地登录提示错误暂未做处理。
-->



<template>
<div v-loading="loading">
    <div class="data_null standard"v-if="maxcount==0">
        <p>你目前没有任何视频数据哦</p>
    </div>
    <div class="bigbox standard" v-if="maxcount!=0">

        <el-select id="select-order" v-model="couponSelected">
            <el-option
                    v-for="item in options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
            ></el-option>
        </el-select>

        <div class="fav">

            <router-link
                    target="_blank"
                    :to="{ path: '/listdetail', query: { id: i._id.$oid} }"
                    class="list-item"
                    v-for="i in myListVideoData"
                    :key="i._id.$oid"
                    tag="a" >
                <img :src="'/images/covers/'+i.cover"  alt="">
                <p>{{i.desc.english}}</p>
                <h3>{{i.title.english}}</h3>
                <div>
                    <span> videos:{{i.videos}}</span>
                    <!-- <span>views:{{ i.views}}</span>-->
                </div>
            </router-link>


        </div>

        <el-pagination
                background
                class="page-selector"
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                layout="jumper, prev, pager, next, sizes"
                :current-page="this.page"
                :total="maxcount"
                :page-size="20"
                :page-sizes="[10, 20, 30, 40]"
        ></el-pagination>

    </div>
</div>
</template>

<script>
    export default {
        data() {
            return {
                page:1,
                maxcount:0,
                count: 20,
                activeName: '1',
                myListVideoData:[

                ],
                couponSelected:"",
                options: [
                    { value: "latest", label: "Latest Post  " },
                    { value: "oldest", label: "Oldest Post  " },
                    { value: "last_modified", label: "last_modified Post" },
                ],
                loading:true
            };
        },
        created(){
            this.couponSelected = this.options[0].value;

             this.getVideoMaxCount();
        },
        mounted(){
        },
        methods: {
            handleCurrentChange(val) {
                this.page = val;
            },
            handleSizeChange(val) {
                this.count = val;
            },
            handleChange(val) {
                console.log(val);
            },
            getVideoMaxCount(){
                if(this.$route.params.id=='me'){
                    this.axios({
                        method:'post',
                        url:'be/lists/myplaylists',
                        data:{
                            "page":1,
                            "page_size":9999999, //无法确认视频总个数,第一次请求仅为获取视频总个数
                            "order":this.couponSelected
                        },
                        withCredentials:true,
                    }).then(res=>{
                        this.maxcount=res.data.data.count; //获取总的视频个数制作分页后开始第二次请求获取当前页面的数据
                        this.getVideoData(this.page,this.count);
                    });
                }
                if(this.$route.params.id!='me'){
                    //POST /lists/yourplaylists
                    // {"page":1,"page_size":10,"uid":"用户的uid",可选项"order":"排序顺序，可以是'latest', 'oldest', 'last_modified'"}

                    this.axios({
                        method:'post',
                        url:"be/lists/yourplaylists",
                        data:{
                            "page":1,
                            "page_size":9999999,
                            "uid":this.$route.params.id,
                            "order":this.couponSelected
                        }
                    }).then(res=>{
                        this.maxcount=res.data.data.count; //获取总的视频个数制作分页后开始第二次请求获取当前页面的数据
                        this.getVideoData(this.page,this.count);
                    })
                }

            },
            getVideoData(e, count){
               if(this.$route.params.id=='me'){
                    this.axios({
                        method:'post',
                        url:'be/lists/myplaylists',
                        data:{
                            "page":e,
                            "page_size":count,
                            "order":this.couponSelected
                        },
                        withCredentials:true,
                    }).then(result=>{
                        this.myListVideoData =result.data.data.playlists;
                        this.loading =false;
                    })
                }
                if(this.$route.params.id!='me'){
                    this.axios({
                        method:'post',
                        url:"be/lists/yourplaylists",
                        data:{
                            "page":e,
                            "page_size":count,
                            "uid":this.$route.params.id,
                            "order":this.couponSelected
                        }
                    }).then(result=>{
                        this.myListVideoData =result.data.data.playlists;
                        this.loading =false;
                    })
                }

            }
        },
        watch:{
            couponSelected(val) {//排序更改时，重新请求数据
                this. getVideoMaxCount();
            },
            page(v) {
                this.getVideoData(this.page, this.count);
            },
            count(v) {
                this.getVideoData(this.page, this.count);
            },
        }
    };
</script>

<style lang="less" scoped>
 /*   .fav:after {
        content: "";
        margin-left: auto;
    }*/
 .data_null{
     height: 1000px;
     display: flex;
     background-color: white;
     opacity: 0.9;
  p{
      margin: auto;
  }
 }
    .bigbox {

        h2{
            box-sizing: border-box;
            padding: 20px ;

        }
        .fav{
            border: 1px solid #e5e9ef;
            display: flex;
            justify-content: flex-start;
            flex-wrap: wrap;
            margin-bottom: 50px;

            .list-item{
                box-shadow: 0 1px 10px rgba(0,0,0,.1);
                flex: 0 0 25%;
                max-width:  25%;
                padding-bottom: 2%;
                transition: all 0.3s ease;
                background-color: #fff;
                &:hover{

                    box-shadow: 0 15px 30px rgba(0,0,0,.1);
                    transform: translate3d(0,-2px,0);
                }
                img{margin-top: 9%;
                    width: 320px;
                    height: 199px;
                }
                h3{
                    margin: auto;
                    width: 80%;
                    overflow: hidden;
                    height: 100px;
                    text-overflow: ellipsis;
                    margin-bottom: 20px;

                }
                p{
                   height: 108px;
                    margin: 10px auto;
                    width: 80%;
                    overflow: hidden;
                    text-overflow: ellipsis;
                }
                div{
                    span:nth-child(2){
                        margin-left: 20px;
                        transition: all 0.1s ease;
                    }
                }
                &:hover span{

                  }


            }

            }



        display: flex;
        flex-direction: column;
        background-color: white;
        opacity: 0.9;

    }
</style>