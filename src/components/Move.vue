<template>
<div>

    <i class="fa fa-arrow-up move-up" aria-hidden="true" @click="moveUp()"></i>
    <i class="fa fa-arrow-down move-down" aria-hidden="true"  @click="moveDown"></i>
</div>
</template>

<script>
    export default {
        data() {
            return {}
        },
        methods: {
            moveUp(){
                console.log("msg:");
                console.log(this.msg);
                 this.axios({
                      method:"post",
                      url:"be/list/moveup.do",
                      data:this.msg
                  }).then(res=>{
                     if(res.data.status=="SUCCEED"){
                          //方案一：全局刷新、会有闪屏，且所有数据重新请求，不好。
                          //this.$router.go(0);
                          //方案二:VueX来监听子组件的值。

                          this.$store.commit("refreshPage");

                      }
                 })
            },

            moveDown(){
                this.axios({
                    method:"post",
                    url:"be/list/movedown.do",
                    data:this.msg
                }).then(res=>{
                    if(res.data.status=="SUCCEED"){
                        //方案一：全局刷新、会有闪屏，且所有数据重新请求，不好。
                        //this.$router.go(0);
                        //方案二:VueX来监听子组件的值。
                        this.$store.commit("refreshPage");
                        console.log(this.$store.state);
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
    display: flex;
    flex-direction: column;
}
    i{
        height: 40px;
    }
</style>