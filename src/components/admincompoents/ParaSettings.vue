<i18n>
{
  "CHS": {
	"para_settings":"网站参数设置"
  },
  "ENG": {
	"para_settings":"Site parameter settings "
  }
}
</i18n>
<template>
<div>
	<h1>{{$t('para_settings')}}</h1>
	<el-switch
	v-model="isEdit"
	active-text="编辑"
  	inactive-text="查看"
	active-color="#13ce66"
	inactive-color="#ff4949">
	</el-switch>
	<el-form ref="form" :model="data" label-width="80px" :disabled="!isEdit">
		<el-form-item :label="index" v-for="(item, index) in data" :key="index">
			<el-input
			style="width:500px"
			:placeholder="item"
			v-model="data.BILICOOKIE_SESSDATA">
			</el-input>
			<el-button type="primary" v-if="isEdit">更新</el-button>
		</el-form-item>
	</el-form>

</div>
</template>

<script>
export default {
	data(){
		this.$i18n.locale = localStorage.getItem("lang");
		return{
			isEdit:false,
			data:{},
		}
	},
	mounted(){
		this.getPara();
	},
	methods:{
		getPara() {
			this.axios({
				method: "post",
				url: "/be/config/listconfig.do" ,
				data: {}
			}).then(ret => {
				this.data = ret.data.data;
				console.log(ret.data.data);
			}).catch(err => {
				console.log("err:", err);
			});
		},
		coptText(text){
			if(!this.isEdit) return;
			navigator.clipboard.writeText(text)
			.then(() => {
				console.log('文本已经成功复制到剪切板');
			})
			.catch(err => {
				// This can happen if the user denies clipboard permissions:
				// 如果用户没有授权，则抛出异常
				console.error('无法复制此文本：', err);
			});
		},
		formatterDate(row) {
			return this.dateFormat("yyyy-MM-dd HH:mm:ss", new Date(row.time.$date));
		},
		/**
		 *格式化日期
		*/
		dateFormat(fmt, date) {
			let ret;
			const opt = {
				"y+": date.getFullYear().toString(), // 年
				"M+": (date.getMonth() + 1).toString(), // 月
				"d+": date.getDate().toString(), // 日
				"H+": date.getHours().toString(), // 时
				"m+": date.getMinutes().toString(), // 分
				"s+": date.getSeconds().toString() // 秒
				// 有其他格式化字符需求可以继续添加，必须转化成字符串
			};
			for (let k in opt) {
				ret = new RegExp("(" + k + ")").exec(fmt);
				if (ret) {
				fmt = fmt.replace(
					ret[1],
					ret[1].length == 1 ? opt[k] : opt[k].padStart(ret[1].length, "0")
				);
				}
			}
			return fmt;
		},

		/**
		 * 将本地时间字符串 -> UTC时间字符串
		 * @param {string date}
		 * @return: UTC
		 */
		toUTCTime(date) {
			var UTC = new Date(new Date(date).getTime() - 8 * 3600 * 1000);
			return this.dateFormat("yyyy-MM-dd HH:mm:ss", UTC);
		}
	}
}
</script>

<style scoped>
</style>