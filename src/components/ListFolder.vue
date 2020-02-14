
<!--
    页面：paychyvideo的播放列表目录页面
    功能：展示用户创建的播放列表目录
    更新日志：
    2/12/2019: v1.0

    ★待解决问题：
    
-->



<template>
<div v-loading="loading">
    <el-dialog title="提示" :visible.sync="dialogVisible" width="30%">
        <span>确认删除吗？此操作不可逆</span>
        <span slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible = false">取 消</el-button>
            <el-button
            type="primary"
            @click="
                dialogVisible = false;
                deleteSelectedItems();
            ">确 定</el-button>
        </span>
    </el-dialog>
    <el-dialog
        title="新建文件夹"
        :visible.sync="showNewFolderDialog"
        width="40%"
        :close-on-click-modal="false"
        >
        <el-form
            ref="createNewFolderForm"
            label-width="auto"
            :rules="rules"
            :model="new_folder"
        >
            <el-form-item prop="name">
                <el-input placeholder="名称" v-model="new_folder.title"></el-input>
            </el-form-item>
            <el-form-item class="createList">
                <el-button
                    type="primary"
                    @click="createFolder"
                    style="width:80%"
                    :loading="loading"
                    >添加</el-button
                >
                <el-button
                    @click="showNewFolderDialog = false"
                    style="width:80%;margin-top:10px;margin-left:0px"
                    >取 消</el-button>
            </el-form-item>
        </el-form>
    </el-dialog>
    <div class="operations">
        <el-button type="primary" round @click="addToCurrectFolder">添加至当前目录</el-button>
    </div>
    <el-row>
        <el-col>
            <div class="folder-view">
                <el-breadcrumb separator="/">
                    <el-breadcrumb-item
                        v-for="i in toNavigablePath()"
                        :key="i.dst"
                    >
                    <a @click="navigateTo(i.dst)">{{i.name}}</a>
                    </el-breadcrumb-item>
                </el-breadcrumb>
                <el-container>
                    <el-aside>
                        <el-tree
                            ref="folderTree"
                            node-key="path"
                            :props="props"
                            :load="loadNode"
                            :expand-on-click-node="false"
                            @node-click="handleTreeNodeClick"
                            lazy>
                        </el-tree>
                    </el-aside>
                    <el-main>
                        <el-button @click="handleCreateFolder">新建文件夹</el-button>
                        <el-button @click="dialogVisible = true" type="danger" :disabled="this.currentSelectedItems == 0">删除选中项</el-button>
                        <el-table
                            ref="currentFolderTable"
                            :data="currentPathObjects"
                            style="width: 100%"
                            @selection-change="handleCurrentFolderTableSelectionChange">
                            <el-table-column
                                type="selection"
                                width="55">
                            </el-table-column>
                            <el-table-column
                                label="封面"
                                width="180"
                                height="100">
                                    <template slot-scope="scope">
                                        <img v-if="typeof scope.row.playlist_object != 'undefined'" :src="'/images/covers/' + scope.row.playlist_object.cover" width="160px" height="100px"></img>
                                        <img v-else src="/images/folder.png" width="160px" height="100px"></img>
                                    </template>
                                </el-table-column>
                            <el-table-column
                                label="标题"
                                width="600"
                                sortable>
                                <template slot-scope="scope">
                                    <router-link
                                        v-if="typeof scope.row.playlist_object != 'undefined'"
                                        target="_blank"
                                        :to="{ path: '/listdetail', query: { id: scope.row.playlist_object._id.$oid} }"
                                        :key="scope.row.playlist_object._id.$oid"
                                        tag="a" >
                                        <h3>{{scope.row.playlist_object.title.english}}</h3>
                                    </router-link>
                                    <el-button v-else type="text" @click="navigateTo(scope.row.path)">
                                        <h3>{{scope.row.name}}</h3>
                                    </el-button>
                                </template>
                            </el-table-column>
                            <el-table-column label="视频数">
                                <template slot-scope="scope">
                                    <h3 v-if="typeof scope.row.playlist_object != 'undefined'">{{scope.row.playlist_object.videos}}</h3>
                                </template>
                            </el-table-column>
                            <el-table-column label="修改日期">
                                <template slot-scope="scope">
                                    <h3 v-if="typeof scope.row.playlist_object != 'undefined'">{{scope.row.playlist_object.modified_at}}</h3>
                                </template>
                            </el-table-column>
                        </el-table>
                    </el-main>
                </el-container>
            </div>
        </el-col>
    
        <el-col>
            <div class="raw-playlist">
            </div>
        </el-col>
    </el-row>
</div>
</template>

<script>
    export default {
    data() {
        return {
            loading: true,
            props: {
                label: 'name',
                isLeaf: 'leaf'
            },
            currentPathObjects: [],
            currentPath: '/',
            currentSelectedItems: [],
            dialogVisible: false,
            showNewFolderDialog: false,
            new_folder: {name: ''},
            rules: {
                name: [{ required: true, message: "请输入名称", trigger: "blur" }],
            }
        };
    },
    created(){
        this.getFolder();
    },
    methods: {
        loadNode(node, resolve) {
            if (node.level === 0) {
                return resolve([{ name: 'root', leaf: false, path: '/' }]);
            }

            this.axios({
                method:'post',
                url:'be/folder/view',
                data:{
                    path: node.data.path
                },
                withCredentials:true,
            }).then(result => {
                var currentPathObjects = result.data.data;
                var data = [];
                for (var i = 0; i < currentPathObjects.length; ++i) {
                    if (typeof currentPathObjects[i].playlist_object == 'undefined') {
                        data.push({
                            name: currentPathObjects[i].name,
                            leaf: false,
                            path: currentPathObjects[i].path
                        });
                    }
                }
                resolve(data);
            });
        },

        addToCurrectFolder() {
            ;
        },

        handleTreeNodeClick(data) {
            this.navigateTo(data.path);
        },

        getFolder()
        {
            this.axios({
                method:'post',
                url:'be/folder/view',
                data:{
                    path: this.currentPath
                },
                withCredentials:true,
            }).then(result=>{
                this.currentPathObjects = result.data.data;
                this.loading = false;
            })
        },
        navigateTo(path) {
            if (this.currentPath == path) {
                return;
            }
            this.loading = true;
            this.currentPath = path;
            this.getFolder();
        },
        toNavigablePath() {
            var paths = this.currentPath.split('/').filter(Boolean);
            if (paths.length == 0) {
                return [{
                    'dst': '/',
                    'name': 'root'
                }]
            } else {
                var result = [];
                var priorPath = '/';
                result.push({
                    'dst': priorPath,
                    'name': 'root'
                });
                for (var i = 0; i < paths.length; ++i) {
                    priorPath += paths[i] + '/';
                    var curObj = {
                        'dst': priorPath,
                        'name': paths[i]
                    };
                    result.push(curObj);
                }
                return result;
            }
        },
        handleCurrentFolderTableSelectionChange(val) {
            this.currentSelectedItems = val;
        },

        handleCreateFolder() {
            this.showNewFolderDialog = true;
        },

        createFolder() {
            ;
        },

        deleteSelectedItems() {
            if (this.currentSelectedItems) {
                var pathsToDelete = this.currentSelectedItems.map(obj => {
                    return obj.path;
                });
                console.log(pathsToDelete);
                var node = this.$refs.folderTree.getNode(pathsToDelete[0]);
                console.log(node);
            }
        }
    }
  };
</script>

