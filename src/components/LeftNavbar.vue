<template>
    <div class="left-navbar ">
        <div class="left_list" >
            <h1>Tags</h1>
            <ul  ref="test" >

                <li class="tag" v-for="(item,i) in msg"><router-link :to="'href=+/search?query='+i" >{{i}}</router-link></li>


            </ul>

        </div>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                newmsg:[],
                oldmsg:[]
            }
        },
        created(){
        },
        methods: {},
        components: {},
        watch:{
         msg(newV,oldV){
               console.log("监听到了左边区域Tag的MSG发生了改变")
                     this.newmsg=newV;
                     this.oldmsg=oldV;

         }
        },
        props:['msg']
    }
</script>

<style scoped>
    .left_list ul:hover .tag{
        /*       width:expression(varWidth + "px")*/

    }

    .left_list li{

        width: 100%;    transition: all 2s ease;
    }
    .left_list ul
    {
        transition: all 2s ease;
        padding-right: 6px;
        padding: 20px;
        font-size: 100%;
        color: #999;
        text-decoration: none;

        margin-block-end: 1em;
        margin-inline-start: 0px;
        margin-inline-end: 0px;
        padding-inline-start: 20px;
        font-size: 100%;
        line-height: 1.25em;
        width: 200px;
        word-break: break-all;
    }
    .left_list h1{
        font-family: Tahoma,Verdana,Helvetica,sans-serif;
        line-height: 1.5em;
        padding-left: 20px;
        margin-top: 20px;


    }
    .left_list li a{

        line-height: 30px;

        text-decoration: none;
    }
    .left_list li a:hover{
        background-color: #F0EBF1;
    }
    .left-navbar {
        position: relative;
        width: 15%;
        margin-right: 10px;
        box-shadow: 0 2px 8px rgba(0,0,0,.1);
    }

</style>