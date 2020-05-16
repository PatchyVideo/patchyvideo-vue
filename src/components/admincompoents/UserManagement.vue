<template>
  <div v-loading="loading">
    <!-- 编辑用户权限的对话框 -->
    <el-dialog :title="'编辑用户: ' + editUser.username" :visible.sync="dialogVisible" width="30%">
      <div class="usermanagement-form">
        <el-row>
          <el-col :span="5">
            <label>访问等级</label>
          </el-col>
          <el-col :span="18">
            <el-input v-model="editUser.status" style="width: 100%;"></el-input>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="5">
            <label>访问模式</label>
          </el-col>
          <el-col :span="18">
            <el-input v-model="editUser.access_mode" style="width: 100%;"></el-input>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="5">
            <label>允许的操作</label>
          </el-col>
          <el-col :span="18">
            <el-input v-model="editUser.allowed_ops" placeholder="[ ]" style="width: 100%;"></el-input>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="5">
            <label>拒绝的操作</label>
          </el-col>
          <el-col :span="18">
            <el-input v-model="editUser.denied_ops" placeholder="[ ]" style="width: 100%;"></el-input>
          </el-col>
        </el-row>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleOk(updateUserData)">确 定</el-button>
      </span>
    </el-dialog>

    <h1>{{ $t("title") }}</h1>
    <!-- 表单 -->
    <div class="usermanagement-form">
      <el-input v-model="usermanagement.keyword" placeholder="搜索用户名..." clearable @keyup.enter.native="getUserList(true)">
        <el-select slot="prepend" v-model="usermanagement.order" class="select">
          <el-option v-for="item in usermanagement.form.options" :key="item.value" :label="item.label" :value="item.value"></el-option>
        </el-select>
        <el-button slot="append" icon="el-icon-search" @click="getUserList(true)">查找</el-button>
      </el-input>
    </div>

    <el-table :data="usermanagement.data.users" style="width: 100%;">
      <el-table-column type="expand">
        <template slot-scope="props">
          <el-form label-position="left" class="demo-table-expand">
            <el-form-item label="头像">
              <el-avatar :size="30" :src="'be/images/userphotos/' + props.row.profile.image"></el-avatar>
            </el-form-item>
            <el-form-item label="描述">
              <span>{{ props.row.profile.desc }}</span>
            </el-form-item>
            <el-form-item label="邮箱">
              <span>{{ props.row.profile.email }}</span>
            </el-form-item>
            <el-form-item label="创建日期">
              <span>{{ dateFormat("yyyy-MM-dd HH:mm:ss", new Date(props.row.meta.created_at.$date)) }}</span>
            </el-form-item>
            <el-form-item label="pubkey">
              <span>{{ '"' + props.row.profile.pubkey + '"' }}</span>
            </el-form-item>
            <el-form-item label="blacklist设置">
              <span>{{ props.row.settings.blacklist }}</span>
            </el-form-item>
            <el-form-item label="UID">
              <el-link type="primary" target="_blank" :href="'#/users/' + props.row._id.$oid" title="查看空间">{{ props.row._id.$oid }}</el-link>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column label="用戶名" width="200">
        <template slot-scope="scope">
          <router-link :to="'/users/' + scope.row._id.$oid" target="_blank">{{ scope.row.profile.username }}</router-link>
        </template>
      </el-table-column>
      <el-table-column prop="access_control.status" label="访问等级" width="200"></el-table-column>
      <el-table-column prop="access_control.access_mode" label="访问模式" width="200"></el-table-column>
      <el-table-column prop="access_control.allowed_ops" label="允许的操作" width="200"></el-table-column>
      <el-table-column prop="access_control.denied_ops" label="拒绝的操作" width="200"></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="props">
          <el-button @click="showDialog(props.row._id.$oid)">Edit</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      background
      :current-page="curPageNum"
      layout="pager"
      :page-count.sync="usermanagement.data.page_count"
      @current-change="handleCurrentChange"
    ></el-pagination>
  </div>
</template>

<script>
export default {
  data() {
    this.$i18n.locale = localStorage.getItem("lang");
    return {
      dialogVisible: false,
      couponSelected: "",
      options: [
        { value: "latest", label: "时间正序" },
        { value: "oldest", label: "时间倒序" },
      ],
      // 当前页码
      curPageNum: 1,
      usermanagement: {
        // 关键词
        keyword: "",
        //每页的 log 条目数量
        size: 20,
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
            { value: "oldest", label: "时间倒序" },
          ],
        },
      },
      // 编辑的用户是当前页面的第几条 0 开始
      editUserIndex: 0,
      editUser: {
        username: "",
        uid: "",
        status: "normal",
        access_mode: "blacklist",
        allowed_ops: [],
        denied_ops: [],
      },
      // 加载状态
      loading: false,
    };
  },
  watch: {},
  created() {
    this.couponSelected = this.options[0].value;
    this.usermanagement.form.timeRange = [
      this.dateFormat("yyyy-MM-dd HH:mm:ss", new Date(new Date().getTime() - 24 * 60 * 60 * 1000)),
      this.dateFormat("yyyy-MM-dd HH:mm:ss", new Date()),
    ];
    this.getUserList();
  },
  methods: {
    /**
     *  处理弹窗点击确定时
     */
    handleOk(done) {
      this.$confirm("确认提交？")
        .then(() => {
          this.dialogVisible = false;
          done();
        })
        .catch(() => {});
    },
    /**
     * 更新用户数据
     */
    async updateUserData() {
      await this.updateUserAttr("status", "/be/user/admin/updaterole.do", "role");
      await this.updateUserAttr("access_mode", "/be/user/admin/updatemode.do", "mode");
      await this.updateUserAttr("allowed_ops", "/be/user/admin/update_allowedops.do", "ops");
      await this.updateUserAttr("denied_ops", "/be/user/admin/update_deniedops.do", "ops");
      await this.getUserList();
    },
    /*
     * 提交前判断用户数据是否通过弹窗修改（由于更新接口更新的数据全是传入 access_control 下的，所以可以直接传入字符串）
     */
    attrIsModify(attr) {
      let user = this.usermanagement.data.users[this.editUserIndex];
      return this.editUser[attr] != "undefined" && this.editUser[attr] != user.access_control[attr];
    },
    /**
     * 处理更新用户数据的单个请求
     */
    async updateUserAttr(attr, reqRouter, paraName) {
      if (!(await this.attrIsModify(attr))) return;
      let paras = { uid: this.editUser.uid };
      paras[paraName] = this.editUser[attr];
      await this.axios({
        method: "post",
        url: reqRouter,
        data: paras,
      }).then(() => {
        let user = this.usermanagement.data.users[this.editUserIndex];
        // let data = ret.data.data;
        user.access_control[attr] = this.editUser[attr];
      });
    },
    /*
     *点下编辑按钮，显示弹窗
     */
    showDialog(uid) {
      let index = this.findEditUserIndex(uid);
      this.editUserIndex = index;
      let user = this.usermanagement.data.users[index];

      this.dialogVisible = true;
      this.editUser = {
        username: user.profile.username,
        uid: user._id.$oid,
        status: user.access_control.status,
        access_mode: user.access_control.access_mode,
        allowed_ops: user.access_control.allowed_ops.toString(),
        denied_ops: user.access_control.denied_ops.toString(),
      };
    },
    /*
     * 根据 uid 查找在data.users中的 index
     */
    findEditUserIndex(uid) {
      for (let i = 0; i < this.usermanagement.data.users.length; i++) {
        if (this.usermanagement.data.users[i]._id.$oid === uid) return i;
      }
    },
    handleCurrentChange(val) {
      let prePageNum = this.curPageNum;
      this.curPageNum = val;
      try {
        this.getUserList();
      } catch (error) {
        // console.log("net err");
        this.curPageNum = prePageNum;
      }
    },
    getUserList(clearall = false) {
      this.loading = true;
      if (clearall) {
        this.curPageNum = 1;
      }
      this.axios({
        method: "post",
        url: "/be/user/list_users.do",
        data: {
          page: this.curPageNum,
          page_size: this.usermanagement.size,
          query: this.usermanagement.keyword,
          order: this.usermanagement.order,
        },
      })
        .then((ret) => {
          let data = ret.data.data;
          this.usermanagement.data = data;
          this.loading = false;
          // 回到顶部
          if ($("html").scrollTop()) {
            //动画效果
            $("html").animate({ scrollTop: 0 }, 100);
          }
        })
        .catch(() => {
          this.loading = false;
        });
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
        "s+": date.getSeconds().toString(), // 秒
        // 有其他格式化字符需求可以继续添加，必须转化成字符串
      };
      for (let k in opt) {
        ret = new RegExp("(" + k + ")").exec(fmt);
        if (ret) {
          fmt = fmt.replace(ret[1], ret[1].length == 1 ? opt[k] : opt[k].padStart(ret[1].length, "0"));
        }
      }
      return fmt;
    },
    /**
     * 将本地时间字符串 -> UTC 时间字符串
     * @param {string date}
     * @return: UTC
     */
    toUTCTime(date) {
      let UTC = new Date(new Date(date).getTime() - 8 * 3600 * 1000);
      return this.dateFormat("yyyy-MM-dd HH:mm:ss", UTC);
    },
  },
};
</script>

<style scoped>
.usermanagement-form {
  text-align: right;
}
.el-input {
  width: 500px;
}
.select {
  width: 130px;
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

<i18n folder></i18n>
