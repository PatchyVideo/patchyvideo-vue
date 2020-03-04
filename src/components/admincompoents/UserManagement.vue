<i18n>
{
	"CHS": {
		"title":"用户管理",
		"latest":"时间正序",
		"oldest":"时间倒序"
	},
	"ENG": {
		"title":"User management interface",
		"latest":"Latest",
		"oldest":"Oldest"
	}
}
</i18n>

<template>
<div>
	<h1>{{$t('title')}}</h1>
	 <!-- 表单 -->
	<div class="usermanagement-form">
		关键词
		<el-input
		placeholder="请输入关键词"
		v-model="usermanagement.keyword"
		@keyup.enter.native="getUserList()"
		clearable>
		<i slot="prefix" class="el-input__icon el-icon-search"></i>
		</el-input>

		<el-select v-model="usermanagement.order" class="select">
		<el-option
			v-for="item in usermanagement.form.options"
			:key="item.value"
			:label="item.label"
			:value="item.value"
		></el-option>
		</el-select>
		<el-button type="primary" @click="getUserList">查找</el-button>
	</div>

	<el-table :data="usermanagement.data.users" style="width: 100%">
		<el-table-column type="expand">
			<template slot-scope="props">
				<el-form label-position="left" class="demo-table-expand">
				<el-form-item label="头像">
					<img :src="'be/images/userphotos/'+props.row.profile.image" alt="" style="height:50px;">
				</el-form-item>
				<el-form-item label="描述">
					<span>{{ props.row.profile.desc }}</span>
				</el-form-item>
				<el-form-item label="邮箱">
					<span>{{ props.row.profile.email }}</span>
				</el-form-item>				
				<el-form-item label="创建日期">
					<span>{{ props.row.meta.created_at.$date}}</span>
				</el-form-item>
				<el-form-item label="pubkey">
					<span>{{ '"' + props.row.profile.pubkey + '"'}}</span>
				</el-form-item>
				<el-form-item label="blacklist设置">
					<span>{{props.row.settings.blacklist}}</span>
				</el-form-item>
				<el-form-item label="UID">
					<el-link type="primary" target="_blank" :href="'#/users/'+props.row._id.$oid" title="查看空间">{{props.row._id.$oid}}</el-link>
				</el-form-item>
				</el-form>
			</template>
		</el-table-column>
		<el-table-column
		prop="_id.$oid"
		width="220"
		label="I D"
		></el-table-column>
		<el-table-column prop="profile.username" label="用戶名" width="200"></el-table-column>
		<el-table-column prop="access_control.status" label="访问等级" width="200">
		</el-table-column>
		<el-table-column prop="access_control.access_mode" label="访问模式" width="200"></el-table-column>
		<el-table-column prop="access_control.allowed_ops.toString()" label="允许的操作" width="200"></el-table-column>
		<el-table-column prop="access_control.denied_ops.toString()" label="拒绝的操作" width="200"></el-table-column>
	</el-table>

	<el-pagination
	background
	@current-change="handleCurrentChange"
	:current-page="curPageNum"
	layout="pager"
	:total.sync="usermanagement.data.count">
	</el-pagination>
</div>
</template>

<script>
export default {
	data() {
		this.$i18n.locale = localStorage.getItem("lang");
		return {
			couponSelected: "",
			options: [
				{ value: "latest", label: "时间正序" },
				{ value: "oldest", label: "时间倒序" }
			],
			// 当前页码
			curPageNum:1,
			usermanagement: {
				// 关键词
				keyword:"",
				//每页的log条目数量
				size:10,
				// 排序方式
				order: "latest",
				data: [],
				form: {
					name: "",
					types: ["viewlogs.do", "viewlogs_aggregated.do"],
					type: "2",
					timeRange: [],
					options: [
						{ value: "latest", label: "时间正序" },
						{ value: "oldest", label: "时间倒序" }
					]
				}
			}
		};
	},
	watch:{
		curPageNum(){
			this.getUserList();
		}
	},
	created() {
		this.couponSelected = this.options[0].value;
		this.usermanagement.form.timeRange = [
			this.dateFormat(
				"yyyy-MM-dd HH:mm:ss",
				new Date(new Date().getTime() - 24 * 60 * 60 * 1000)
			),
			this.dateFormat("yyyy-MM-dd HH:mm:ss", new Date())
		];
	},
	methods:{
		handleStatus(para){
			console.log(para);
			
		},
		handleCurrentChange(val) {
			var prePageNum = this.curPageNum;
			this.curPageNum = val;
			try {
				this.getUserList();
			} catch (error) {
				console.log("net err");
				
				this.curPageNum = prePageNum;
			}
		},
		getUserList() {
			this.axios({
				method: "post",
				url: "/be/user/list_users.do",
				data: {
					page: this.curPageNum,
					page_size: this.usermanagement.size,
					query:this.usermanagement.keyword,
					order: this.usermanagement.order
				}
			}).then(ret => {
				var data = ret.data.data;
				console.log(data);
				this.usermanagement.data = data;
				// return ret.data.data.video;
			}).catch(err => {
				throw new Error(err);
				// alert("请求出错：\n"+err);
			});
		},
		formatterDate(row) {
			// return this.dateFormat("yyyy-MM-dd HH:mm:ss", new Date(row.time.$date));
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
};
</script>

<style scoped>
.el-input{
	width: 25%;
}

.demo-table-expand {
	font-size: 0;
}
.demo-table-expand label {
	width: 90px;
	color: #72a8f3;
}
.demo-table-expand .el-form-item {
	margin-right: 0;
	margin-bottom: 0;
	width: 100%;
	color: #959595;

}
</style>