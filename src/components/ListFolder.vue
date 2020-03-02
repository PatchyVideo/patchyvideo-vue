
<!--
    页面：paychyvideo的播放列表目录页面
    功能：展示用户创建的播放列表目录
    更新日志：
    2/12/2019: v1.0

    ★待解决问题：
    
-->
<i18n>
{
    "CHS":{
        "cancel":"取 消",
        "ok":"确 定",
        "name":"名称",
        "rename":"重命名",
        "cover":"封面",
        "title":"标题",
        "video_num":"视频数",
        "modif_date":"修改日期",
        "search_list":"搜索列表...",
        "search":"搜索",
        "my_playlist":"我的播放列表",
        "all":"全部",
        "private":"私有",
        "public":"公开",
        "copy_folder_addr":"点击复制文件夹地址",
        "tip":"提示",
        "confirm_tip":"确认删除吗？此操作不可逆",
        "new_folder":"新建文件夹",
        "add":"添加",
        "del_select":"删除选择项",
        "add_2_cur_dir":"添加至当前目录",
        "input_name":"请输入名称",
        "no_permissions":"您没有权限查看此文件夹",
        "create_success":"创建成功",
        "folder_exist":"文件夹已存在",
        "name_limit":"名称不能含有/或*",
        "del_success":"删除成功",
        "login_please":"请登录",
        "add_sucess":"添加成功",
        "invalid_path_or_name":"无效路径或名称"


    },
    "ENG":{
        "cancel":"Cancel",
        "ok":"O K",
        "name":"Name",
        "rename":"Rename",
        "cover":"Cover",
        "title":"Title",
        "video_num":"Number of videos",
        "modif_date":"Modification date",
        "search_list":"Search list...",
        "search":"Search",
        "my_playlist":"My playlist",
        "all":"All",
        "private":"Private",
        "public":"Public",
        "copy_folder_addr":"Click Copy Folder Address",
        "tip":"Tip",
        "confirm_tip":"Confirm delete? This operation is irreversible",
        "new_folder":"New folder",
        "add":"Add",
        "del_select":"Delete selection",
        "add_2_cur_dir":"Add to current directory",
        "input_name":"Please enter a name",
        "no_permissions":"You do not have permission to view this folder",
        "create_success":"Created successfully",
        "folder_exist":"The folder already exists",
        "name_limit":"The name cannot contain'/'or'*'",
        "del_success":"Successfully deleted",
        "login_please":"Please sign in",
        "add_sucess":"Added successfully",
        "invalid_path_or_name":"Invalid path or name"



    }
}
</i18n>


<template>
<div v-loading="loading" ref="aside">
    <el-dialog :title="$t('tip')" :visible.sync="dialogVisible" :modal-append-to-body='false' width="30%">
        <span>{{$t('confirm_tip')}}</span>
        <span slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible = false">{{$t('cancel')}}</el-button>
            <el-button
            type="primary"
            @click="
                dialogVisible = false;
                deleteSelectedItems();
            ">{{$t('ok')}}</el-button>
        </span>
    </el-dialog>
    <el-dialog
        v-if="loggedIn && editable"
        :title="$t('new_folder')"
        :visible.sync="showNewFolderDialog"
        width="40%"
        :close-on-click-modal="true"
        :modal-append-to-body='false'
        >
        <el-form
            ref="createNewFolderForm"
            label-width="auto"
            :rules="folderNameRules"
            :model="newFolderForm"
        >
            <el-form-item :label="$t('name')" prop="name">
                <el-input :placeholder="$t('name')" v-model="newFolderForm.name"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button
                    type="primary"
                    @click="createFolder"
                    style="width:80%"
                    :loading="loading"
                    >{{$t('add')}}</el-button
                >
                <el-button
                    @click="showNewFolderDialog = false"
                    style="width:80%;margin-top:10px;margin-left:0px"
                    >{{$t('cancel')}}</el-button>
            </el-form-item>
        </el-form>
    </el-dialog>
    <el-dialog
        v-if="loggedIn && editable"
        :title="$t('rename')"
        :visible.sync="showRenameFolderDialog"
        width="40%"
        :close-on-click-modal="true"
        :modal-append-to-body='false'
        >
        <el-form
            ref="refRenameFolderForm"
            label-width="auto"
            :rules="folderNameRules"
            :model="renameFolderForm"
        >
            <el-form-item :label="$t('name')" prop="name">
                <el-input :placeholder="$t('name')" v-model="renameFolderForm.name"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button
                    type="primary"
                    @click="renameFolder"
                    style="width:80%"
                    :loading="loading"
                    >{{$t('rename')}}</el-button
                >
                <el-button
                    @click="showRenameFolderDialog = false"
                    style="width:80%;margin-top:10px;margin-left:0px"
                    >{{$t('cancel')}}</el-button>
            </el-form-item>
        </el-form>
    </el-dialog>
 <!--   <i @click="copyPathLink" class="fa fa-copy fa-1x" style="margin-right: 6px; cursor: pointer;"></i>-->
    <el-button @click="copyPathLink">{{$t('copy_folder_addr')}}</el-button>
    <el-breadcrumb separator="/">
        <el-breadcrumb-item
            v-for="i in toNavigablePath()"
            :key="i.dst"
        >
            <a @click="navigateTo(i.dst)" style="font-size: 21px">{{i.name}}</a>
        </el-breadcrumb-item>
    </el-breadcrumb>
    <el-row v-if="this.$route.params.id!='me'">
                
        <el-col style="width: 100%">
            <div class="folder-view" >
                <el-container>
                    <el-aside    :style="{width:this.asideWidth+'px', position:'relative',cursor: 'e-resize'}">
                        <div class="asaide-shelter" style="position: absolute;width: 99%;height: 100%;cursor: default" ></div>
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

                        <!--<el-switch
                            v-model="priavteEdit"
                            active-text="允许他人编辑"
                            inactive-text="私人编辑">
                        </el-switch>-->
                    </el-aside>
                    <el-main>

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
                                    :label="$t('cover')"
                                    width="180"
                                    height="100">
                                <template slot-scope="scope">
                                    <img v-if="typeof scope.row.playlist_object != 'undefined'" :src="'/images/covers/' + scope.row.playlist_object.cover" width="160px" height="100px" />
                                    <img v-else src="/images/folder.png" width="160px" height="100px" />
                                </template>
                            </el-table-column>
                            <el-table-column
                                    :label="$t('title')"
                                    width="500"
                                    align="center"
                                    sortable
                                    prop="name">
                                <template slot-scope="scope">
                                    <router-link
                                            v-if="typeof scope.row.playlist_object != 'undefined'"
                                            target="_blank"
                                            :to="{ path: '/listdetail', query: { id: scope.row.playlist_object._id.$oid} }"
                                            :key="scope.row.playlist_object._id.$oid"
                                            tag="a" >
                                        <h4>{{scope.row.playlist_object.title.english}}</h4>
                                        <p style="width: 150px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; height: 50px;">{{scope.row.playlist_object.desc.english}}</p>
                                    </router-link>
                                    <div v-else>
                                        <el-button type="text" @click="navigateTo(scope.row.path)">
                                            <h3>{{scope.row.name}}</h3>
                                        </el-button>
                                        <el-button v-if="loggedIn && editable" type="primary" round @click="showRenameFolderDialogFunc(scope.row)">{{$t('rename')}}</el-button>
                                    </div>
                                </template>
                            </el-table-column>
                            <el-table-column :label="$t('video_num')"  width="200" align="center" prop="playlist_object.videos" sortable>
                                <template slot-scope="scope">
                                    <h3 v-if="typeof scope.row.playlist_object != 'undefined'">{{scope.row.playlist_object.videos}}</h3>
                                </template>
                            </el-table-column>
                            <el-table-column :label="$t('modif_date')" align="center"  prop="playlist_object.meta.modified_at" sortable>
                                <template slot-scope="scope">
                                    <h3 v-if="typeof scope.row.playlist_object != 'undefined'">{{scope.row.playlist_object.meta.modified_at | formatDate}}</h3>
                                </template>
                            </el-table-column>
                        </el-table>
                    </el-main>
                </el-container>
            </div>
        </el-col>
    </el-row>
    <el-row  v-if="this.$route.params.id=='me'" >
        <el-col  style="width: 60%">
            <div class="folder-view" >
                <el-container>
                    <el-aside  :style="{width:this.asideWidth+'px', position:'relative',cursor: 'e-resize'}">
                        <div class="asaide-shelter" style="position: absolute;width: 97%;height: 100%;cursor: default" ></div>
                        <el-tree
                                ref="folderTree"
                                node-key="path"
                                :props="props"
                                :load="loadNode"
                                :expand-on-click-node="false"
                                @node-click="handleTreeNodeClick"
                                style="width: 190px"
                                lazy>
                        </el-tree>
                        <el-switch

                                v-if="loggedIn && editable"
                                v-model="currentFolderObject.privateView"
                                :active-text="$t('private')"
                                :inactive-text="$t('public')"
                                style="width: 97%;cursor: default;"
                                @change="handleCurrentFolderPrivateViewChanged">
                        </el-switch>
                        <!--<el-switch
                            v-model="priavteEdit"
                            active-text="允许他人编辑"
                            inactive-text="私人编辑">
                        </el-switch>-->
                    </el-aside>
                    <el-main>
                        <el-button v-if="loggedIn && editable" @click="showNewFolderDialog = true">{{$t('new_folder')}}</el-button>
                        <el-button v-if="loggedIn && editable" @click="dialogVisible = true" type="danger" :disabled="this.currentSelectedItems == 0">{{$t('del_select')}}</el-button>
                        <el-button round @click="addToCurrectFolder" :disabled="this.currentSelectedPlaylists.length == 0">{{$t('add_2_cur_dir')}}</el-button>

                      <!--  <div v-if="loggedIn && editable" class="operations">
                            <el-button type="primary" round @click="addToCurrectFolder" :disabled="this.currentSelectedPlaylists.length == 0">添加至当前目录</el-button>
                        </div>-->
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
                                    :label="$t('cover')"
                                    width="180"
                                    height="100"
                                    align="center"
                            >
                                <template slot-scope="scope">
                                    <img v-if="typeof scope.row.playlist_object != 'undefined'" :src="'/images/covers/' + scope.row.playlist_object.cover" width="160px" height="100px" />
                                    <img v-else src="/images/folder.png" width="160px" height="100px" />
                                </template>
                            </el-table-column>
                            <el-table-column
                                    :label="$t('title')"
                                    width="200"
                                    align="center"
                                    sortable
                                    prop="name">
                                <template slot-scope="scope">
                                    <router-link
                                            v-if="typeof scope.row.playlist_object != 'undefined'"
                                            target="_blank"
                                            :to="{ path: '/listdetail', query: { id: scope.row.playlist_object._id.$oid} }"
                                            :key="scope.row.playlist_object._id.$oid"
                                            tag="a" >
                                        <h4>{{scope.row.playlist_object.title.english}}</h4>
                                        <p style="width: 150px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; height: 50px;">{{scope.row.playlist_object.desc.english}}</p>
                                    </router-link>
                                    <div v-else>
                                        <el-button type="text" @click="navigateTo(scope.row.path)">
                                            <h3>{{scope.row.name}}</h3>
                                        </el-button>
                                        <el-button v-if="loggedIn && editable" type="primary" round @click="showRenameFolderDialogFunc(scope.row)">{{$t('rename')}}</el-button>
                                    </div>
                                </template>
                            </el-table-column>
                            <el-table-column :label="$t('video_num')"      align="center"  width="100" prop="playlist_object.videos" sortable>
                                <template slot-scope="scope">
                                    <h3 v-if="typeof scope.row.playlist_object != 'undefined'">{{scope.row.playlist_object.videos}}</h3>
                                </template>
                            </el-table-column>
                            <el-table-column :label="$t('modif_date')"      align="center" prop="playlist_object.meta.modified_at" sortable>
                                <template slot-scope="scope">
                                    <h3 v-if="typeof scope.row.playlist_object != 'undefined'">{{scope.row.playlist_object.meta.modified_at | formatDate}}</h3>
                                </template>
                            </el-table-column>
                        </el-table>
                    </el-main>
                </el-container>
            </div>
        </el-col>

        <el-col v-if="loggedIn && editable" style="width: 40%">
            <div class="raw-playlist">
                <div id="select-order" class="head">
                    <el-input
                            :placeholder="$t('search_list')"
                            v-model="currentPlaylistSearchTerm"
                            clearable
                            class="inputbox"
                            @keyup.enter.native="loadCurrentPlaylists()"
                    >
                        <el-button slot="append" icon="el-icon-search" @click="loadCurrentPlaylists()">{{$t('search')}}</el-button>
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
                        :active-text="$t('my_playlist')"
                        :inactive-text="$t('all')"
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
                            :label="$t('cover')"
                            width="180"
                            height="100"
                            align="center"
                    >
                        <template slot-scope="scope">
                            <img :src="'/images/covers/' + scope.row.cover" width="160px" height="100px" />
                        </template>
                    </el-table-column>
                    <el-table-column
                            :label="$t('title')"
                            width="150"
                            align="center"
                            sortable
                            prop="name">
                        <template slot-scope="scope">
                            <router-link
                                    target="_blank"
                                    :to="{ path: '/listdetail', query: { id: scope.row._id.$oid} }"
                                    :key="scope.row._id.$oid"
                                    tag="a" >
                                <h4>{{scope.row.title.english}}</h4>
                                <p style="width: 150px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; height: 50px;">{{scope.row.desc.english}}</p>
                            </router-link>
                        </template>
                    </el-table-column>
                    <el-table-column :label="$t('video_num')" width="100" align="center" prop="playlist_object.videos" sortable>
                        <template slot-scope="scope">
                            <h3>{{scope.row.videos}}</h3>
                        </template>
                    </el-table-column>
                    <el-table-column :label="$t('modif_date')" width="110" align="center"  prop="playlist_object.meta.modified_at" sortable>
                        <template slot-scope="scope">
                            <h3>{{scope.row.meta.modified_at | formatDate}}</h3>
                        </template>
                    </el-table-column>
                </el-table>
                
            </div>
            <el-pagination
                background
                class="page-selector"
                layout="jumper, prev, pager, next, sizes"
                :current-page.sync="currentPlaylistPage"
                :page-size.sync="currentPlaylistPageSize"
                :page-sizes="[10, 20, 30, 40]"
                :total="allPlaylistsCount"
            ></el-pagination>
        </el-col>
    </el-row>
</div>
</template>

<script>
    import { copyToClipboardText } from "../static/js/generic";
    export default {
    data() {
        this.$i18n.locale = localStorage.getItem('lang');
        return {
            isFirst:true,
            asideWidth:200,
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
                name: [{ required: true, message: this.$t('input_name'), trigger: "blur" }],
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
        if ('path' in this.$route.query)
            this.currentPath = this.$route.query.path;
        this.getFolder();
        this.loadCurrentPlaylists();
    },
        mounted(){

            let asideObj = this.$refs.aside.getElementsByClassName("el-aside")[0];
            let _that = this;

            asideObj.onmousedown = (e)=>{
                const disX = e.clientX;
                const asideWidth = parseInt(asideObj.style.width);
                let   asideBorder =parseInt(asideObj.style.width)*0.99;
                if(Math.abs((e.offsetX - asideBorder))<5){ //判断是否满足鼠标到达边界点 允许误差5像素
                    document.onmousemove = function (e) { //按住鼠标移动时
                        e.preventDefault(); // 移动时禁用默认事件
                        // 计算移动的距离
                        const l = e.clientX - disX;
                        _that.asideWidth =asideWidth+l;
                     /*   asideObj.style.width = `${asideWidth+l}px`;*/
                    };
                    document.onmouseup = function (e) {
                        document.onmousemove = null;
                        document.onmouseup = null;
                    };
                }


            }

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
                    this.$message.error(this.$t('no_permissions'));
                }
            });
        },

        handleTreeNodeClick(data) {
            this.navigateTo(data.path);
        },

        getFolder(f = null)
        {
            this.loading = true;
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

                    if(this.isFirst ===false){
                        if(this.$route.params.id!='me'){
                            this.$router.push({path:`/users/${this.user_id}/`,query: {path:this.currentPath}})
                            /*     this.$router.push(`/users/${this.user_id}/${path}`);*/
                        }

                    }
                    if (f) {
                        f();
                    }

                } else if (result.data.reason == 'UNAUTHORISED_OPERATION') {
                    this.$message.error(this.$t('no_permissions'));
                }
                this.isFirst = false;
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
            this.loading = true;
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
                    this.$message({message: this.$t('create_success'), type: 'success'});
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
                        this.$message.error(this.$t('folder_exist'));
                    } else if (result.data.reason == 'INVALID_PATH') {
                        this.$message.error(this.$t('name_limit'));
                    }
                }
                this.loading = false;
            })
        },

        deleteSelectedItems() {
            this.loading = true;
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
                            this.$message.success(this.$t('del_success'));
                            this.getFolder();
                        });
                    } else if (result.data.reason == 'UNAUTHORISED_OPERATION') {
                        this.$message.error(this.$t('no_permissions'));
                    }
                    this.loading = false;
                });
            }
        },
        copyPathLink() {
            var uid = this.user_id;
            if (this.user_id == 'me') {
                this.axios({
                    method: "post",
                    url: "be/user/profile.do",
                    data: { uid: this.user_id }
                }).then(res => {
                    uid = res.data.data._id.$oid;
                    const url = `https://patchyvideo.com/#/users/${uid}?path=${this.currentPath}`;
                    copyToClipboardText(url);
                });
            } else {
                const url = `https://patchyvideo.com/#/users/${uid}?path=${this.currentPath}`;
                copyToClipboardText(url);
            }
        },


        handlePlaylistTableSelectionChange(val) {
            this.currentSelectedPlaylists = val;
        },
        loadCurrentPlaylists() {

            if (this.showMyPlaylistsOnly) {
                // only show my playlists
                this.loading = true;
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
                        this.$message.error(this.$t('login_please'));
                    }
                    this.loading = false;
                });
            } else {
                // show all playlists
                this.loading = true;
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
                    this.loading = false;
                });
            }
        },

        addToCurrectFolder() {
            this.loading = true;
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
                    this.$message.success(this.$t('add_sucess'));
                    this.getFolder();
                } else if (result.data.reason == 'UNAUTHORISED_OPERATION') {
                    this.$message.error(this.$t('login_please'));
                }
                this.loading = false;
            }).catch(err=>{
                this.loading = false;
            });
        },
        renameFolder() {
            const row = this.renameFolderForm.row;
            this.loading = true;
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
                    this.$message.error(this.$t('no_permissions'));
                } else if (result.data.reason == 'INVALID_PATH') {
                    this.$message.error(this.$t('invalid_path_or_name'));
                } else if (result.data.reason == 'FOLDER_ALREADY_EXIST') {
                    this.$message.error(this.$t('folder_exist'));
                }this.loading = false;
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
    },

    filters: {
        formatDate(value) {
            if (value) {
                var upload_time = new Date(value.$date);
                var y = upload_time.getFullYear(); //getFullYear方法以四位数字返回年份
                var M = upload_time.getMonth() + 1; // getMonth方法从 Date 对象返回月份 (0 ~ 11)，返回结果需要手动加一
                var d = upload_time.getDate(); // getDate方法从 Date 对象返回一个月中的某一天 (1 ~ 31)
                var h = upload_time.getHours(); // getHours方法返回 Date 对象的小时 (0 ~ 23)
                var m = upload_time.getMinutes(); // getMinutes方法返回 Date 对象的分钟 (0 ~ 59)
                var s = upload_time.getSeconds(); // getSeconds方法返回 Date 对象的秒数 (0 ~ 59)
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
        }
    }
};
</script>

<style lang="less" scoped>

    .fa-copy{
        &:hover{
           color: cornflowerblue;
        }
    }

    .operations{
        margin-bottom: 12px;
    }
    .el-row{
        display: flex;

       .el-col{
        /*   width: 50%;*/
           .folder-view{
               .el-container{

                   .el-aside{
                       .el-tree{
                           font-size: 30px;
                           /deep/ span{
                               max-width: 150px !important;
                               overflow: hidden;
                               text-overflow: ellipsis;
                           }
                       }
                       .el-switch{
                           margin: 30px 0px;
                       }
                 /*      width: 80px!important;*/
                  /*     width: 100%;*/
                   }
                   .el-main{
                       background-color: #fff;
                       border: 3px solid #f5f5f5;
                       border-right: none;
                   }
               }

           }
        }
        .el-col{
           /* width: 50%;*/
            max-height:1000px;
            overflow: auto;
            .raw-playlist{
                border: 3px solid #f5f5f5;
                   #select-order{
                       display: flex;

                   }
                .el-switch{
                    margin: 20px 0px;
               }
            }
        }
    }
</style>
