
<template>
    <div class="" v-loading="loading">
        <div v-for="(item, i) in ranking" v-bind:key="i">
            <h1>
                {{i + 1}}
            </h1>
            <h1>
                {{item.user_obj.profile.username}}
            </h1>
            <h1>
                {{item.count}}
            </h1>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        this.$i18n.locale = localStorage.getItem("lang");
        return {
            loading: true,
            timeSpan: 24 * 30,// 过去24小时
            displaySize: 30, // 显示前30个
            ranking: []
        }
    },
    created() {
        this.loadData();
    },
    methods: {
        loadData() {
            this.loading = true;
            this.axios({
                method: "post",
                url: "/be/ranking/tag_contributor.do",
                data: {
                    hrs: this.timeSpan,
                    size: this.displaySize
                }
            }).then(result => {
                var data = result.data.data;
                this.ranking = data;
                this.loading = false;
            });
        }
    }
}
</script>


