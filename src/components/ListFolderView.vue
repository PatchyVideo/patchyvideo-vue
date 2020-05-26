<!--
    页面：paychyvideo的播放列表目录页面
    功能：展示用户创建的播放列表目录
    更新日志：
    2/12/2019: v1.0

    ★待解决问题：
    
-->
<template>
  <div v-show="visible" ref="aside" v-loading="loading">
    <el-dialog :title="$t('tip')" :visible.sync="dialogVisible" :modal-append-to-body="false" width="30%">
      <span>{{ $t("confirm_tip") }}</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">{{ $t("cancel") }}</el-button>
        <el-button
          type="primary"
          @click="
            dialogVisible = false;
            deleteSelectedItems();
          "
          >{{ $t("ok") }}</el-button
        >
      </span>
    </el-dialog>
    <el-dialog
      v-if="loggedIn"
      :title="$t('new_folder')"
      :visible.sync="showNewFolderDialog"
      width="40%"
      :close-on-click-modal="true"
      :modal-append-to-body="false"
    >
      <el-form ref="createNewFolderForm" label-width="auto" :rules="folderNameRules" :model="newFolderForm">
        <el-form-item :label="$t('name')" prop="name">
          <el-input v-model="newFolderForm.name" :placeholder="$t('name')"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" style="width: 80%;" :loading="loading" @click="createFolder">{{ $t("add") }}</el-button>
          <el-button style="width: 80%; margin-top: 10px; margin-left: 0px;" @click="showNewFolderDialog = false">{{ $t("cancel") }}</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <el-dialog
      v-if="loggedIn"
      :title="$t('rename')"
      :visible.sync="showRenameFolderDialog"
      width="40%"
      :close-on-click-modal="true"
      :modal-append-to-body="false"
    >
      <el-form ref="refRenameFolderForm" label-width="auto" :rules="folderNameRules" :model="renameFolderForm">
        <el-form-item :label="$t('name')" prop="name">
          <el-input v-model="renameFolderForm.name" :placeholder="$t('name')"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" style="width: 80%;" :loading="loading" @click="renameFolder">{{ $t("rename") }}</el-button>
          <el-button style="width: 80%; margin-top: 10px; margin-left: 0px;" @click="showRenameFolderDialog = false">{{ $t("cancel") }}</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <!--<el-button type="primary" round @click="addToCurrectFolder">{{$t('add_2_cur_dir')}}</el-button>
    <el-button type="primary" round @click="closeSelf">关闭</el-button>-->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item v-for="i in toNavigablePath()" :key="i.dst">
        <a style="font-size: 21px;" @click="navigateTo(i.dst)">{{ i.name }}</a>
      </el-breadcrumb-item>
    </el-breadcrumb>

    <el-container>
      <el-aside :style="{ width: asideWidth + 'px', position: 'relative', cursor: 'e-resize' }">
        <div class="asaide-shelter" style="position: absolute; width: 97%; height: 100%; cursor: default;"></div>
        <el-tree
          ref="folderTree"
          node-key="path"
          :props="props"
          :load="loadNode"
          :expand-on-click-node="false"
          style="width: 190px;"
          lazy
          @node-click="handleTreeNodeClick"
        ></el-tree>
        <el-switch
          v-if="loggedIn"
          v-model="currentFolderObject.privateView"
          :active-text="$t('private')"
          :inactive-text="$t('public')"
          style="width: 97%; cursor: default;"
          @change="handleCurrentFolderPrivateViewChanged"
        ></el-switch>
        <!--<el-switch
          v-model="priavteEdit"
          active-text="允许他人编辑"
          inactive-text="私人编辑">
        </el-switch>-->
      </el-aside>
      <el-main>
        <el-button v-if="loggedIn" @click="showNewFolderDialog = true">{{ $t("new_folder") }}</el-button>
        <el-button v-if="loggedIn" type="danger" :disabled="currentSelectedItems == 0" @click="dialogVisible = true">{{ $t("del_select") }}</el-button>
        <el-button type="primary" round @click="addToCurrectFolder">{{ $t("add_2_cur_dir") }}</el-button>
        <el-table ref="currentFolderTable" :data="currentFolderChildrens" style="width: 100%;" @selection-change="handleCurrentFolderTableSelectionChange">
          <el-table-column type="selection" width="55"></el-table-column>
          <el-table-column :label="$t('cover')" width="180" height="100" align="center">
            <template slot-scope="scope">
              <img
                v-if="typeof scope.row.playlist_object != 'undefined'"
                :src="'/images/covers/' + scope.row.playlist_object.cover"
                width="160px"
                height="100px"
              />
              <img v-else src="/images/folder.png" width="160px" height="100px" />
            </template>
          </el-table-column>
          <el-table-column :label="$t('title')" width="200" align="center" sortable prop="name">
            <template slot-scope="scope">
              <router-link
                v-if="typeof scope.row.playlist_object != 'undefined'"
                :key="scope.row.playlist_object._id.$oid"
                target="_blank"
                :to="{ path: '/listdetail', query: { id: scope.row.playlist_object._id.$oid } }"
                tag="a"
              >
                <h4>{{ scope.row.playlist_object.title.english }}</h4>
                <p style="width: 150px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; height: 50px;">
                  {{ scope.row.playlist_object.desc.english }}
                </p>
              </router-link>
              <div v-else>
                <el-button type="text" @click="navigateTo(scope.row.path)">
                  <h3>{{ scope.row.name }}</h3>
                </el-button>
                <el-button v-if="loggedIn" type="primary" round @click="showRenameFolderDialogFunc(scope.row)">{{ $t("rename") }}</el-button>
              </div>
            </template>
          </el-table-column>
          <el-table-column :label="$t('video_num')" align="center" width="80" prop="playlist_object.videos">
            <template slot-scope="scope">
              <h3 v-if="typeof scope.row.playlist_object != 'undefined'">{{ scope.row.playlist_object.videos }}</h3>
            </template>
          </el-table-column>
          <el-table-column :label="$t('modif_date')" align="center" prop="playlist_object.meta.modified_at">
            <template slot-scope="scope">
              <h3 v-if="typeof scope.row.playlist_object != 'undefined'">{{ scope.row.playlist_object.meta.modified_at | formatDate }}</h3>
            </template>
          </el-table-column>
        </el-table>
      </el-main>
    </el-container>
  </div>
</template>

<script>
// import moment from "moment";
export default {
  filters: {
    formatDate(value) {
      if (value) {
        let upload_time = new Date(value.$date);
        let y = upload_time.getFullYear(); //getFullYear 方法以四位数字返回年份
        let M = upload_time.getMonth() + 1; // getMonth 方法从 Date 对象返回月份 (0 ~ 11)，返回结果需要手动加一
        let d = upload_time.getDate(); // getDate 方法从 Date 对象返回一个月中的某一天 (1 ~ 31)
        let h = upload_time.getHours(); // getHours 方法返回 Date 对象的小时 (0 ~ 23)
        let m = upload_time.getMinutes(); // getMinutes 方法返回 Date 对象的分钟 (0 ~ 59)
        let s = upload_time.getSeconds(); // getSeconds 方法返回 Date 对象的秒数 (0 ~ 59)
        return (
          y +
          "-" +
          // 数字不足两位自动补零，下同
          (Array(2).join(0) + M).slice(-2) +
          "-" +
          (Array(2).join(0) + d).slice(-2) +
          " " +
          (Array(2).join(0) + h).slice(-2) +
          ":" +
          (Array(2).join(0) + m).slice(-2) +
          ":" +
          (Array(2).join(0) + s).slice(-2)
        );
      }
    },
  },
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    this.$i18n.locale = localStorage.getItem("lang");
    return {
      asideWidth: 200,
      loading: true,
      loggedIn: false,
      user_id: "me",
      // for folder view
      props: {
        label: "name",
        isLeaf: "leaf",
      },
      currentFolderChildrens: [],
      currentFolderObject: { privateView: false },
      currentPath: "/",
      currentSelectedItems: [],
      dialogVisible: false,
      showNewFolderDialog: false,
      showRenameFolderDialog: false,
      newFolderForm: {
        name: "",
      },
      renameFolderForm: {
        name: "",
        row: null,
      },
      folderNameRules: {
        name: [{ required: true, message: this.$t("input_name"), trigger: "blur" }],
      },
      priavteView: false,
      pid: "",
    };
  },
  created() {
    this.loggedIn = JSON.stringify(this.$store.state.username) != "null" && this.$store.state.username != "";
    this.user_id = this.$route.params.id;
    this.getFolder();
  },
  mounted() {
    let asideObj = this.$refs.aside.getElementsByClassName("el-aside")[0];
    let _that = this;

    asideObj.onmousedown = (e) => {
      const disX = e.clientX;
      const asideWidth = parseInt(asideObj.style.width);
      let asideBorder = parseInt(asideObj.style.width) * 0.99;
      if (Math.abs(e.offsetX - asideBorder) < 5) {
        // 判断是否满足鼠标到达边界点 允许误差 5 像素
        document.onmousemove = function(e) {
          // 按住鼠标移动时
          e.preventDefault(); // 移动时禁用默认事件
          // 计算移动的距离
          const l = e.clientX - disX;
          _that.asideWidth = asideWidth + l;
          // asideObj.style.width = `${asideWidth+l}px`;
        };
        document.onmouseup = function() {
          document.onmousemove = null;
          document.onmouseup = null;
        };
      }
    };
  },
  methods: {
    folderObjectToTreeNode(obj) {
      let data = [];
      for (let i = 0; i < obj.length; ++i) {
        if (typeof obj[i].playlist_object == "undefined") {
          data.push({
            name: obj[i].name,
            leaf: false,
            path: obj[i].path,
            children: [],
          });
        }
      }
      return data;
    },
    closeSelf() {
      this.visible = false;
      this.$emit("update:visible", false);
    },
    loadNode(node, resolve) {
      if (node.level === 0) {
        return resolve([{ name: "/", leaf: false, path: "/", children: [] }]);
      }

      this.axios({
        method: "post",
        url: "be/folder/view",
        data: {
          path: node.data.path,
          uid: this.user_id,
        },
        withCredentials: true,
      }).then((result) => {
        result = result.data;
        if (result.status == "SUCCEED") {
          resolve(this.folderObjectToTreeNode(result.data.children));
        } else if (result.data.reason == "UNAUTHORISED_OPERATION") {
          this.$message.error(this.$t("no_permissions"));
        }
      });
    },

    handleTreeNodeClick(data) {
      this.navigateTo(data.path);
    },

    getFolder(f = null) {
      this.loading = true;
      this.axios({
        method: "post",
        url: "be/folder/view",
        data: {
          path: this.currentPath,
          uid: this.user_id,
        },
        withCredentials: true,
      }).then((result) => {
        result = result.data;
        if (result.status == "SUCCEED") {
          this.currentFolderChildrens = result.data.children;
          this.currentFolderObject = result.data.cur;
          if (f) {
            f();
          }
        } else if (result.data.reason == "UNAUTHORISED_OPERATION") {
          this.$message.error(this.$t("no_permissions"));
        }
        this.loading = false;
      });
    },
    navigateTo(path) {
      if (this.currentPath == path) {
        return;
      }
      this.loading = true;
      this.currentPath = path;
      this.getFolder();
    },
    refreshCurrentFolder() {
      this.getFolder();
    },
    toNavigablePath() {
      let paths = this.currentPath.split("/").filter(Boolean);
      if (paths.length == 0) {
        return [
          {
            dst: "/",
            name: "root",
          },
        ];
      } else {
        let result = [];
        let priorPath = "/";
        result.push({
          dst: priorPath,
          name: "root",
        });
        for (let i = 0; i < paths.length; ++i) {
          priorPath += paths[i] + "/";
          let curObj = {
            dst: priorPath,
            name: paths[i],
          };
          result.push(curObj);
        }
        return result;
      }
    },
    handleCurrentFolderTableSelectionChange(val) {
      this.currentSelectedItems = val;
    },

    handleCurrentFolderPrivateViewChanged() {
      // console.log(this.currentFolderObject.privateView);
      this.axios({
        method: "post",
        url: "be/folder/change_access",
        data: {
          path: this.currentPath,
          private_edit: this.currentFolderObject.privateEdit,
          private_view: this.currentFolderObject.privateView,
        },
        withCredentials: true,
      });
    },

    createFolder() {
      this.loading = true;
      let folderName = this.newFolderForm.name;
      this.axios({
        method: "post",
        url: "be/folder/create",
        data: {
          root: this.currentPath,
          name: folderName,
        },
        withCredentials: true,
      }).then((result) => {
        result = result.data;
        if (result.status == "SUCCEED") {
          this.showNewFolderDialog = false;
          this.newFolderForm.name = "";
          this.$message({
            message: this.$t("create_success"),
            type: "success",
          });
          this.refreshCurrentFolder();
          const curTreeNode = this.$refs.folderTree.getNode(this.currentPath);
          if (curTreeNode) {
            curTreeNode.data.children.push({
              name: folderName,
              path: this.currentPath + folderName + "/",
              leaf: false,
              children: [],
            });
          }
        } else {
          if (result.data.reason == "FOLDER_ALREADY_EXIST") {
            this.$message.error(this.$t("folder_exist"));
          } else if (result.data.reason == "INVALID_PATH") {
            this.$message.error(this.$t("name_limit"));
          }
        }
        this.loading = false;
      });
    },

    deleteSelectedItems() {
      this.loading = true;
      if (this.currentSelectedItems) {
        let pathsToDelete = [];
        this.currentSelectedItems.forEach((obj) => {
          if (typeof obj.playlist_object == "undefined") pathsToDelete.push(obj.path);
        });
        let pidsToDelete = [];
        this.currentSelectedItems.forEach((obj) => {
          if (typeof obj.playlist_object !== "undefined") pidsToDelete.push(obj.playlist_object._id.$oid);
        });
        this.axios({
          method: "post",
          url: "be/folder/delete_many",
          data: {
            paths: pathsToDelete,
          },
          withCredentials: true,
        }).then((result) => {
          result = result.data;
          if (result.status == "SUCCEED") {
            for (let i = 0; i < pathsToDelete.length; ++i) {
              let node = this.$refs.folderTree.getNode(pathsToDelete[i]);
              this.$refs.folderTree.remove(node);
            }
            this.axios({
              method: "post",
              url: "be/folder/del_pid",
              data: {
                path: this.currentPath,
                pids: pidsToDelete,
              },
              withCredentials: true,
            }).then(() => {
              this.$message.success(this.$t("del_success"));
              this.getFolder();
            });
          } else if (result.data.reason == "UNAUTHORISED_OPERATION") {
            this.$message.error(this.$t("no_permissions"));
          }
          this.loading = false;
        });
      }
    },

    addToCurrectFolder() {
      this.loading = true;
      // console.log(this.pid);
      this.axios({
        method: "post",
        url: "be/folder/add_pid",
        data: {
          path: this.currentPath,
          pids: [this.pid],
        },
        withCredentials: true,
      })
        .then((result) => {
          result = result.data;
          if (result.status == "SUCCEED") {
            this.$message.success(this.$t("add_sucess"));
            this.getFolder();
          } else if (result.data.reason == "UNAUTHORISED_OPERATION") {
            this.$message.error(this.$t("login_please"));
          }
          this.loading = false;
        })
        .catch(() => {
          // console.log(err);
          this.loading = false;
        });
    },
    renameFolder() {
      const row = this.renameFolderForm.row;
      this.loading = true;
      this.axios({
        method: "post",
        url: "be/folder/rename",
        data: {
          path: row.path,
          new_name: this.renameFolderForm.name,
        },
        withCredentials: true,
      }).then((result) => {
        result = result.data;
        if (result.status == "SUCCEED") {
          this.showRenameFolderDialog = false;
          this.getFolder(() => {
            let renamedTreeNode = this.$refs.folderTree.getNode(row.path);
            let parentTreeNode = this.$refs.folderTree.getNode(this.currentPath);
            if (renamedTreeNode) {
              this.$refs.folderTree.remove(renamedTreeNode);
              parentTreeNode.data.children.push({
                name: this.renameFolderForm.name,
                path: result.data,
                leaf: false,
                children: [],
              });
            }
          });
        } else if (result.data.reason == "UNAUTHORISED_OPERATION") {
          this.$message.error(this.$t("no_permissions"));
        } else if (result.data.reason == "INVALID_PATH") {
          this.$message.error(this.$t("invalid_path_or_name"));
        } else if (result.data.reason == "FOLDER_ALREADY_EXIST") {
          this.$message.error(this.$t("folder_exist"));
        }
        this.loading = false;
      });
    },
    showRenameFolderDialogFunc(row) {
      this.renameFolderForm.name = row.name;
      this.renameFolderForm.row = row;
      this.showRenameFolderDialog = true;
    },
  },
};
</script>

<style lang="less" scoped>
.operations {
  margin-bottom: 12px;
}
.el-row {
  display: flex;

  .el-col {
    /* width: 50%; */
    .folder-view {
      .el-container {
        .el-aside {
          .el-tree {
            font-size: 30px;
            /deep/ span {
              max-width: 150px !important;
              overflow: hidden;
              text-overflow: ellipsis;
            }
          }
          .el-switch {
            margin: 30px 0px;
          }
          /* width: 80px!important; */
          /* width: 100%; */
        }
        .el-main {
          background-color: #fff;
          border: 3px solid #f5f5f5;
          border-right: none;
        }
      }
    }
  }
  .el-col {
    /* width: 50%; */
    max-height: 1000px;
    overflow: auto;
    .raw-playlist {
      border: 3px solid #f5f5f5;
      #select-order {
        display: flex;
      }
      .el-switch {
        margin: 20px 0px;
      }
    }
  }
}
</style>

<i18n folder></i18n>
