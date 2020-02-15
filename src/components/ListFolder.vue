
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
        v-if="loggedIn && editable"
        title="新建文件夹"
        :visible.sync="showNewFolderDialog"
        width="40%"
        :close-on-click-modal="true"
        >
        <el-form
            ref="createNewFolderForm"
            label-width="auto"
            :rules="folderNameRules"
            :model="newFolderForm"
        >
            <el-form-item label="名称" prop="name">
                <el-input placeholder="名称" v-model="newFolderForm.name"></el-input>
            </el-form-item>
            <el-form-item>
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
    <el-dialog
        v-if="loggedIn && editable"
        title="重命名"
        :visible.sync="showRenameFolderDialog"
        width="40%"
        :close-on-click-modal="true"
        >
        <el-form
            ref="refRenameFolderForm"
            label-width="auto"
            :rules="folderNameRules"
            :model="renameFolderForm"
        >
            <el-form-item label="名称" prop="name">
                <el-input placeholder="名称" v-model="renameFolderForm.name"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button
                    type="primary"
                    @click="renameFolder"
                    style="width:80%"
                    :loading="loading"
                    >重命名</el-button
                >
                <el-button
                    @click="showRenameFolderDialog = false"
                    style="width:80%;margin-top:10px;margin-left:0px"
                    >取 消</el-button>
            </el-form-item>
        </el-form>
    </el-dialog>
    <div v-if="loggedIn && editable" class="operations">
        <el-button type="primary" round @click="addToCurrectFolder" :disabled="this.currentSelectedPlaylists.length == 0">添加至当前目录</el-button>
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
                            style="width: 100%"
                            lazy>
                        </el-tree>
                        <el-switch
                            v-if="loggedIn && editable"
                            v-model="currentFolderObject.privateView"
                            active-text="私有"
                            inactive-text="公开"
                            @change="handleCurrentFolderPrivateViewChanged">
                        </el-switch>
                        <!--<el-switch
                            v-model="priavteEdit"
                            active-text="允许他人编辑"
                            inactive-text="私人编辑">
                        </el-switch>-->
                    </el-aside>
                    <el-main>
                        <el-button v-if="loggedIn && editable" @click="showNewFolderDialog = true">新建文件夹</el-button>
                        <el-button v-if="loggedIn && editable" @click="dialogVisible = true" type="danger" :disabled="this.currentSelectedItems == 0">删除选中项</el-button>
                        <el-table
                            ref="currentFolderTable"
                            :data="currentFolderChildrens"
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
                                    <img v-if="typeof scope.row.playlist_object != 'undefined'" :src="'/images/covers/' + scope.row.playlist_object.cover" width="160px" height="100px" />
                                    <img v-else src="/images/folder.png" width="160px" height="100px" />
                                </template>
                            </el-table-column>
                            <el-table-column
                                label="标题"
                                width="600"
                                sortable
                                prop="name">
                                <template slot-scope="scope">
                                    <router-link
                                        v-if="typeof scope.row.playlist_object != 'undefined'"
                                        target="_blank"
                                        :to="{ path: '/listdetail', query: { id: scope.row.playlist_object._id.$oid} }"
                                        :key="scope.row.playlist_object._id.$oid"
                                        tag="a" >
                                        <h3>{{scope.row.playlist_object.title.english}}</h3>
                                        <p style="overflow:hidden">{{scope.row.playlist_object.desc.english}}</p>
                                    </router-link>
                                    <div v-else>
                                        <el-button type="text" @click="navigateTo(scope.row.path)">
                                            <h3>{{scope.row.name}}</h3>
                                        </el-button>
                                        <el-button v-if="loggedIn && editable" type="primary" round @click="showRenameFolderDialogFunc(scope.row)">重命名</el-button>
                                    </div>
                                </template>
                            </el-table-column>
                            <el-table-column label="视频数" prop="playlist_object.videos">
                                <template slot-scope="scope">
                                    <h3 v-if="typeof scope.row.playlist_object != 'undefined'">{{scope.row.playlist_object.videos}}</h3>
                                </template>
                            </el-table-column>
                            <el-table-column label="修改日期" prop="playlist_object.meta.modified_at">
                                <template slot-scope="scope">
                                    <h3 v-if="typeof scope.row.playlist_object != 'undefined'">{{scope.row.playlist_object.meta.modified_at}}</h3>
                                </template>
                            </el-table-column>
                        </el-table>
                    </el-main>
                </el-container>
            </div>
        </el-col>
    
        <el-col>
            <div v-if="loggedIn && editable" class="raw-playlist">
                <div id="select-order" class="head">
                    <el-input
                    placeholder="搜索列表..."
                    v-model="currentPlaylistSearchTerm"
                    clearable
                    class="inputbox"
                    @keyup.enter.native="loadCurrentPlaylists()"
                    >
                    <el-button slot="append" icon="el-icon-search" @click="loadCurrentPlaylists()">搜索</el-button>
                    </el-input>
                    <el-select v-model="currentPlaylistOrder" class="select">
                    <el-option
                        v-for="item in playlistOrderOptions"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                    ></el-option>
                    </el-select>
                </div>
                <el-switch
                    v-model="showMyPlaylistsOnly"
                    active-text="我的播放列表"
                    inactive-text="全部"
                    >
                </el-switch>
                <el-table
                    ref="rawPlaylists"
                    :data="currentPlaylists"
                    style="width: 100%"
                    @selection-change="handlePlaylistTableSelectionChange">
                    <el-table-column
                        type="selection"
                        width="55">
                    </el-table-column>
                    <el-table-column
                        label="封面"
                        width="180"
                        height="100">
                        <template slot-scope="scope">
                            <img :src="'/images/covers/' + scope.row.cover" width="160px" height="100px" />
                        </template>
                    </el-table-column>
                    <el-table-column
                        label="标题"
                        width="600"
                        sortable
                        prop="name">
                        <template slot-scope="scope">
                            <router-link
                                target="_blank"
                                :to="{ path: '/listdetail', query: { id: scope.row._id.$oid} }"
                                :key="scope.row._id.$oid"
                                tag="a" >
                                <h3>{{scope.row.title.english}}</h3>
                            </router-link>
                        </template>
                    </el-table-column>
                    <el-table-column label="视频数" prop="playlist_object.videos">
                        <template slot-scope="scope">
                            <h3>{{scope.row.videos}}</h3>
                        </template>
                    </el-table-column>
                    <el-table-column label="修改日期" prop="playlist_object.meta.modified_at">
                        <template slot-scope="scope">
                            <h3>{{scope.row.meta.modified_at}}</h3>
                        </template>
                    </el-table-column>
                </el-table>
                <el-pagination
                    background
                    class="page-selector"
                    layout="jumper, prev, pager, next, sizes"
                    :current-page.sync="currentPlaylistPage"
                    :page-size.sync="currentPlaylistPageSize"
                    :page-sizes="[10, 20, 30, 40]"
                    :total="allPlaylistsCount"
                ></el-pagination>
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
            editable: false,
            loggedIn: false,
            user_id: '',
            // for folder view
            props: {
                label: 'name',
                isLeaf: 'leaf'
            },
            currentFolderChildrens: [],
            currentFolderObject: {privateView: false},
            currentPath: '/',
            currentSelectedItems: [],
            dialogVisible: false,
            showNewFolderDialog: false,
            showRenameFolderDialog: false,
            newFolderForm: {
                name: ''
            },
            renameFolderForm: {
                name: '',
                row: null
            },
            folderNameRules: {
                name: [{ required: true, message: "请输入名称", trigger: "blur" }],
            },
            priavteView: false,

            // for playlist
            currentPlaylists: [],
            currentSelectedPlaylists: [],
            currentPlaylistOrder: 'latest',
            currentPlaylistSearchTerm: '',
            showMyPlaylistsOnly: false,
            currentPlaylistPage: 1,
            currentPlaylistPageSize: 20,
            allPlaylistsCount: 1,
            playlistOrderOptions:  [
                { value: "latest", label: "时间正序" },
                { value: "oldest", label: "时间倒序" },
                { value: "last_modified", label: "最新修改" }
            ],
        };
    },
    created() {
        this.loggedIn = JSON.stringify(this.$store.state.username) != "null" && this.$store.state.username != "";
        this.user_id = this.$route.params.id;
        this.editable = this.user_id == 'me';
        this.getFolder();
        this.loadCurrentPlaylists();
    },
    methods: {
        folderObjectToTreeNode(obj) {
            var data = [];
            for (var i = 0; i < obj.length; ++i) {
                if (typeof obj[i].playlist_object == 'undefined') {
                    data.push({
                        name: obj[i].name,
                        leaf: false,
                        path: obj[i].path,
                        children: []
                    });
                }
            }
            return data;
        },
        loadNode(node, resolve) {
            if (node.level === 0) {
                return resolve([{ name: '/', leaf: false, path: '/', children: [] }]);
            }

            this.axios({
                method: 'post',
                url: 'be/folder/view',
                data: {
                    path: node.data.path,
                    uid: this.user_id
                },
                withCredentials: true,
            }).then(result => {
                result = result.data;
                if (result.status == 'SUCCEED') {
                    resolve(this.folderObjectToTreeNode(result.data.children));
                } else if (result.data.reason == 'UNAUTHORISED_OPERATION') {
                    this.$message.error('您没有权限查看此文件夹');
                }
            });
        },

        handleTreeNodeClick(data) {
            this.navigateTo(data.path);
        },

        getFolder(f = null)
        {
            this.axios({
                method: 'post',
                url: 'be/folder/view',
                data: {
                    path: this.currentPath,
                    uid: this.user_id
                },
                withCredentials: true,
            }).then(result => {
                result = result.data;
                if (result.status == 'SUCCEED') {
                    this.currentFolderChildrens = result.data.children;
                    this.currentFolderObject = result.data.cur;
                    if (f) {
                        f();
                    }
                } else if (result.data.reason == 'UNAUTHORISED_OPERATION') {
                    this.$message.error('您没有权限查看此文件夹');
                }
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
        refreshCurrentFolder() {
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

        handleCurrentFolderPrivateViewChanged(new_val) {
            console.log(this.currentFolderObject.privateView);
            this.axios({
                method: 'post',
                url: 'be/folder/change_access',
                data: {
                    path: this.currentPath,
                    private_edit: this.currentFolderObject.privateEdit,
                    private_view: this.currentFolderObject.privateView,
                },
                withCredentials: true,
            });
        },

        createFolder() {
            var folderName = this.newFolderForm.name;
            this.axios({
                method: 'post',
                url: 'be/folder/create',
                data: {
                    root: this.currentPath,
                    name: folderName
                },
                withCredentials: true,
            }).then(result => {
                result = result.data;
                if (result.status == 'SUCCEED') {
                    this.showNewFolderDialog = false;
                    this.newFolderForm.name = '';
                    this.$message({message: '创建成功', type: 'success'});
                    this.refreshCurrentFolder();
                    const curTreeNode = this.$refs.folderTree.getNode(this.currentPath);
                    if (curTreeNode) {
                        curTreeNode.data.children.push({
                            name: folderName,
                            path: this.currentPath + folderName + '/',
                            leaf: false,
                            children: []
                        });
                    }
                } else {
                    if (result.data.reason == 'FOLDER_ALREADY_EXIST') {
                        this.$message.error('文件夹已存在');
                    } else if (result.data.reason == 'INVALID_PATH') {
                        this.$message.error('名称不能含有/或*');
                    }
                }
            })
        },

        deleteSelectedItems() {
            if (this.currentSelectedItems) {
                var pathsToDelete = []
                this.currentSelectedItems.forEach(obj => {
                    if (typeof obj.playlist_object == 'undefined')
                        pathsToDelete.push(obj.path);
                });
                var pidsToDelete = []
                this.currentSelectedItems.forEach(obj => {
                    if (typeof obj.playlist_object !== 'undefined')
                        pidsToDelete.push(obj.playlist_object._id.$oid);
                });
                this.axios({
                    method: 'post',
                    url: 'be/folder/delete_many',
                    data: {
                        paths: pathsToDelete
                    },
                    withCredentials: true,
                }).then(result => {
                    result = result.data;
                    if (result.status == 'SUCCEED') {
                        for (var i = 0; i < pathsToDelete.length; ++i) {
                            var node = this.$refs.folderTree.getNode(pathsToDelete[i]);
                            this.$refs.folderTree.remove(node);
                        }
                        this.axios({
                            method: 'post',
                            url: 'be/folder/del_pid',
                            data: {
                                path: this.currentPath,
                                pids: pidsToDelete
                            },
                            withCredentials: true,
                        }).then(result => {
                            this.getFolder();
                        });
                    } else if (result.data.reason == 'UNAUTHORISED_OPERATION') {
                        this.$message.error('您没有权限执行此操作');
                    }
                });
            }
        },



        handlePlaylistTableSelectionChange(val) {
            this.currentSelectedPlaylists = val;
        },
        loadCurrentPlaylists() {
            console.log('loadCurrentPlaylists');
            if (this.showMyPlaylistsOnly) {
                // only show my playlists
                this.axios({
                    method: 'post',
                    url: 'be/lists/myplaylists',
                    data: {
                        page: this.currentPlaylistPage,
                        page_size: this.currentPlaylistPageSize,
                        order: this.currentPlaylistOrder,
                        query: this.currentPlaylistSearchTerm
                    },
                    withCredentials: true,
                }).then(result => {
                    result = result.data;
                    if (result.status == 'SUCCEED') {
                        this.allPlaylistsCount = result.data.count;
                        this.currentPlaylists = result.data.playlists;
                    } else if (result.data.reason == 'UNAUTHORISED_OPERATION') {
                        this.$message.error('请登录');
                    }
                });
            } else {
                // show all playlists
                this.axios({
                    method: 'post',
                    url: 'be/lists/search.do',
                    data: {
                        page: this.currentPlaylistPage,
                        page_size: this.currentPlaylistPageSize,
                        order: this.currentPlaylistOrder,
                        query: this.currentPlaylistSearchTerm
                    },
                    withCredentials: true,
                }).then(result => {
                    result = result.data;
                    if (result.status == 'SUCCEED') {
                        this.allPlaylistsCount = result.data.count;
                        this.currentPlaylists = result.data.playlists;
                    }
                });
            }
        },

        addToCurrectFolder() {
            console.log(this.currentSelectedPlaylists);
            var pidsToAdd = [];
            this.currentSelectedPlaylists.forEach(obj => {
                pidsToAdd.push(obj._id.$oid);
            });
            this.axios({
                method: 'post',
                url: 'be/folder/add_pid',
                data: {
                    path: this.currentPath,
                    pids: pidsToAdd
                },
                withCredentials: true,
            }).then(result => {
                result = result.data;
                if (result.status == 'SUCCEED') {
                    this.getFolder();
                } else if (result.data.reason == 'UNAUTHORISED_OPERATION') {
                    this.$message.error('请登录');
                }
            });
        },
        renameFolder() {
            const row = this.renameFolderForm.row;
            this.axios({
                method: 'post',
                url: 'be/folder/rename',
                data: {
                    path: row.path,
                    new_name: this.renameFolderForm.name
                },
                withCredentials: true,
            }).then(result => {
                result = result.data;
                if (result.status == 'SUCCEED') {
                    this.showRenameFolderDialog = false;
                    this.getFolder(() => {
                        var renamedTreeNode = this.$refs.folderTree.getNode(row.path);
                        var parentTreeNode = this.$refs.folderTree.getNode(this.currentPath);
                        if (renamedTreeNode) {
                            this.$refs.folderTree.remove(renamedTreeNode);
                            parentTreeNode.data.children.push({
                                name: this.renameFolderForm.name,
                                path: result.data,
                                leaf: false,
                                children: []
                            });
                        }
                    });
                } else if (result.data.reason == 'UNAUTHORISED_OPERATION') {
                    this.$message.error('您没有权限执行此操作');
                } else if (result.data.reason == 'INVALID_PATH') {
                    this.$message.error('无效路径或名称');
                } else if (result.data.reason == 'FOLDER_ALREADY_EXIST') {
                    this.$message.error('文件夹已存在');
                }
            });
        },
        showRenameFolderDialogFunc(row) {
            this.renameFolderForm.name = row.name;
            this.renameFolderForm.row = row;
            this.showRenameFolderDialog = true;
        }
    },
    watch: {
        currentPlaylistPage() {
            this.loadCurrentPlaylists();
        },
        currentPlaylistPageSize() {
            this.loadCurrentPlaylists();
        },
        currentPlaylistOrder() {
            this.loadCurrentPlaylists();
        },
        showMyPlaylistsOnly() {
            this.loadCurrentPlaylists();
        }
    }
};
</script>

