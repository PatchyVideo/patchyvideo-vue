<template>

    <div class="bigbox">
        <div class="doing">
            <h3>待处理的索引</h3>
            <p>暂无待处理的索引</p>
        </div>
        <div class="failed">
            <h3>失败的索引</h3>
            <p>共计{{failedData.count}}个</p>
         <p v-for="(item,i) in failedData.posts":key="item._id.$oid">
             <a :href="item.post_param.url">{{item.post_param.url}}</a>
            </p>
        </div>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                failedData:[{   "count:    ":"null"},
                    {   "page:     ":"null"},
                    {   "page_count":"null"},
                    {    "posts"    :"null"}]

            }
        },
        created(){
          this.axios({
              method:"post",
              url:"be/posts/list_pending.do",
              data:{"page":1,"page_size":9999}
          }).then(res=>{
          });
            this.axios({
                method:"post",
                url:"be/posts/list_failed.do",
                data:{"page":1,"page_size":99999}
            }).then(res=>{
                this.failedData =   res.data.data;

            })
        },
        methods: {},
        components: {}
    }
</script>

<style scoped lang="less">


    .bigbox {
        height: 1000px;
        display: flex;
        background-color: white;
        opacity: 0.9;
        .doing{
            flex: 1;
            border-right: 1px solid #e5e9ef;
            p{
            position: absolute;
                top:50%;
                left: 25%;
                transform: translate(-50%,50%);
            }
        }
        .failed{
            flex: 1;
            h3{
                padding: 10px;
                line-height: 20px;
                box-sizing: border-box;
                border-bottom: 1px solid #e5e9ef;
            }
        }
    }

</style>