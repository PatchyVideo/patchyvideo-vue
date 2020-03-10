<i18n>
{
    "CHS": {
        "pending_post": "待处理的索引",
        "no_pending": "暂无待处理的索引",
        "failed_post": "失败的索引",
        "total_count": "共计{count}个"
    }
}
</i18n>

<template>

    <div class="bigbox">
        <div class="doing">
            <h3>{{$t('pending_post')}}</h3>
            <p>{{$t('no_pending')}}</p>
        </div>
        <div class="failed">
            <h3>{{$t('failed_post')}}</h3>
            <p>{{$t('total_count', {count: failedData.count})}}</p>
         <p v-for="(item, i) in failedData.posts" :key="item._id.$oid">
             <a :href="item.post_param.url">{{item.post_param.url}}</a>
            </p>
        </div>
    </div>
</template>

<script>
    export default {
        data() {
            this.$i18n.locale = localStorage.getItem('lang');
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