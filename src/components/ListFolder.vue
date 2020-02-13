
<!--
    页面：paychyvideo的播放列表目录页面
    功能：展示用户创建的播放列表目录
    更新日志：
    2/12/2019: v1.0

    ★待解决问题：
    
-->



<template>
<div v-loading="loading">
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
                    <a v-on:click="navigateTo(i.dst)">{{i.name}}</a>
                    </el-breadcrumb-item>
                </el-breadcrumb>
                <el-container>
                    <el-aside>
                        <el-tree
                            :props="props"
                            :load="loadNode"
                            lazy
                            show-checkbox>
                        </el-tree>
                    </el-aside>
                    <el-main>
                        <el-table
                            :data="currentPathObjects"
                            style="width: 100%">
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
                                width="600">
                                <template slot-scope="scope">
                                    <router-link
                                        v-if="typeof scope.row.playlist_object != 'undefined'"
                                        target="_blank"
                                        :to="{ path: '/listdetail', query: { id: scope.row.playlist_object._id.$oid} }"
                                        :key="scope.row.playlist_object._id.$oid"
                                        tag="a" >
                                        <h3>{{scope.row.playlist_object.title.english}}</h3>
                                    </router-link>
                                    <h3 v-else>
                                        <a v-on:click="navigateTo(scope.row.path)">{{scope.row.name}}</a>
                                    </h3>
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
                <el-tree
                    :props="props"
                    :load="loadNode"
                    lazy
                    show-checkbox>
                </el-tree>
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
          children: 'zones',
          isLeaf: 'leaf'
        },
        tableData: [{
          date: '2016-05-02',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        }, {
          date: '2016-05-04',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1517 弄'
        }, {
          date: '2016-05-01',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1519 弄'
        }, {
          date: '2016-05-03',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1516 弄'
        }],
        currentPathObjects: [],
        currentPath: '/'
      };
    },
    created(){
        this.getFolder();
    },
    methods: {
        loadNode(node, resolve) {
            if (node.level === 0) {
            return resolve([{ name: 'region' }]);
            }
            if (node.level > 1) return resolve([]);

            setTimeout(() => {
            const data = [{
                name: 'leaf',
                leaf: true
            }, {
                name: 'zone'
            }];

            resolve(data);
            }, 500);
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
        }
    }
  };
</script>

