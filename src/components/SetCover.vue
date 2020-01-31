<template>
<div>
    <el-tooltip class="item" effect="dark" content="设置此视频封面为播放列表封面" placement="top-end">
        <i class="fa fa-picture-o" aria-hidden="true" @click="setCover()"></i>
    </el-tooltip>

</div>
</template>

<script>
    export default {
        data() {
            return {}
        },
        methods: {
           setCover(){
                this.axios({
                    method:"post",
                    url:"https://www.patchyvideo.com/list/setcover.do",
                    data:this.msg
                }).then(res=>{
                    if(res.data.status=="SUCCEED"){
                        //方案一：全局刷新、会有闪屏，且所有数据重新请求，不好。
                        //this.$router.go(0);
                        //方案二:VueX来监听子组件的值。
                        this.$store.commit("refreshPage");

                    }
                })
            }
        },
        props:["msg"],
        components: {}
    }
</script>

<style scoped>

</style>