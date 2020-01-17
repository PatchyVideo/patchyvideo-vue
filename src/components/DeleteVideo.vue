<template>

    <div>
        <i class="fa fa-times" aria-hidden="true" @click="deleteVideo()"></i>
    </div>
</template>

<script>
    export default {
        data() {
            return {}
        },
        methods: {
            deleteVideo(){
                this.axios({
                    method:"post",
                    url:"be/list/delete.do",
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
div{
}
</style>