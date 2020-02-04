




<!--
下次更新时取消该组件的制作
-->


<template>
<div>



    <div class="bigbox standard">

            <div class="aside">
         <div class="new-create"  @click=changeDoingSatate() :class="{active:doingState}" ><i class="el-icon-goblet-square" ></i><a>待处理投稿</a> </div>
         <div class="new-create"  @click=changeFailedSatate() :class="{active:failedState}"><i class="el-icon-goblet-full"></i><a>已失败投稿</a> </div>


            </div>
            <div class="main">
                <div class="fav null"v-if="doingState" >

                         <div class="add-list">
                           <el-table
                                     ref="singleTable"
                                     :data="tableData2"
                                     highlight-current-row
                                     @current-change="handleCurrentChange"
                                 >
                                 <el-table-column
                                         type="index"
                                         width="50">
                                 </el-table-column>
                                 <el-table-column
                                         property="url"
                                         label="URL"
                                         align="center">
                                 </el-table-column>
                                 <el-table-column
                                         property="tags"
                                         label="TAGS"
                                         align="center">
                                 </el-table-column>
                             </el-table>

                         </div>
                </div>
                <div class="fav notnull "v-if="failedState">

              <div class="second">
                  <el-switch
                          style="display: block"
                          v-model="value"
                          active-color="#13ce66"
                          inactive-color="#ff4949"
                          active-text="仅显示url"
                          inactive-text="显示错误信息">
                  </el-switch>
                  <transition mode="out-in">
                  <el-table
                          :data="tableData"
                          style="width: 100%"
                          :row-class-name="tableRowClassName" v-show="value">

                      <el-table-column
                              prop="url"
                              label="URL"

                              align="center">

                      </el-table-column>




                  </el-table>
                  </transition>
                  <transition mode="out-in">
                  <el-table
                          :data="tableData"
                          stripe
                          style="width: 100%" v-show="!value">
                      <el-table-column
                              prop="url"
                              label="URL"
                              align="center">
                      </el-table-column>
                      <el-table-column
                              prop="status"
                              label="STATUS"
                              align="center">
                      </el-table-column>
                      <el-table-column
                              prop="exception"
                              label="EXCEPTION"
                              align="center">
                      </el-table-column>
                  </el-table>
                  </transition>
              </div>


                </div>

            </div>



    </div>
</div>
</template>

<script>
    export default {
        data() {
            return {
                failedData:[],
                doingData:[],
                currentRow: null,
                tableData2:[{

                }],
                tableData: [{
                    url:"null",
                    status:"null",
                    exception:"null"
                }],
                centerDialogVisible: false,
                value: true,
                doingState:true,
                failedState:false,
            }
        },
        created(){
            this.axios({
                method:"post",
                url:"be/posts/list_pending.do",
                data:{"page":1,"page_size":9999}
            }).then(res=>{
                let obj =  res.data.data;
                let array=[];
                for(let i in obj){
                    array.push({url:obj[i].url,tags:JSON.parse(JSON.stringify(obj[i].tags).replace(/(\",)+/g, "、\","))});
                }
                this.tableData2 =array;
            });
            this.axios({
                method:"post",
                url:"be/posts/list_failed.do",
                data:{"page":1,"page_size":99999}
            }).then(res=>{
                this.failedData =   res.data.data.posts;
                let _that=this;
                let array=[];
                (function () {
                  let m =  _that.failedData.map((item)=>{
                     return  [{"url":item.post_param.url},{"status":item.ret.result_obj.status},{"exception":item.ret.result_obj.data.exception}]
                    });
                    for(let i in  m){
                        let obj={};
                      for(let s=0;s<m[i].length;++s){
                      Object.assign(obj,m[i][s]);
                      }
                        array[i]=obj;
                    }
                })();
                 this.tableData =array;
            })
        },
        methods: {
            handleCurrentChange(val) {
                this.currentRow = val;
            },
            changeDoingSatate(){

                this.failedState =false;
                this.doingState = true;
            },
            changeFailedSatate(){
                this.doingState = false;
               this.failedState =true;

            },
            tableRowClassName({row, rowIndex}) {
                if (rowIndex === 1) {
                    return 'warning-row';
                } else if (rowIndex === 3) {
                    return 'success-row';
                }
                return '';
            }
        },
        components: {},
        watch:{
            value(n){

            }
        }
    }
</script>

<style lang="less" scoped>
    .active{
        background-color: #f4f5f7;
    }
    .v-enter,
    .v-leave-to {
        opacity: 0;
    }

    .v-enter-active,
    .v-leave-active {
        transition: all 0.8s ease;
    }
    .el-table .warning-row {
        background: oldlace;
    }

    .el-table .success-row {
        background: #f0f9eb;
    }
.el-dialog{
    position: absolute;
    z-index: 9999;
}
    .null{
        height: 700px;
    }
    .fav{
        height:100%;
        overflow: auto;
        display: flex;
        justify-content: flex-start;
        flex-wrap: wrap;
        margin-bottom: 50px;
        /deep/ .el-table__header-wrapper{
            height: 115px;
            .table{
                height: 100%;
            }
        }

        .first{

        }
        .second{
            position: relative;
            width: 100%;
            height:100%;

            .el-table{

             position: absolute;


            }
        }
            .add-list{
                width: 100%;
            }

    }

    .aside{
     /*   background-color: #D3DCE6;*/
        border-right: 1px solid #f4f5f7;
        box-sizing: border-box;
        color: #333;
        text-align: center;
         overflow: hidden;
        flex: 0.9;

        div{
            width: 100%;
            height: 60px;

            position: relative;
            padding-left: 20px;
            transition: background-color .3s ease;
            white-space: nowrap;
            font-size: 22px;
            padding-bottom: 30px;
            margin-bottom: 5px;

            text-align: center;
            overflow: hidden;
            &:hover{
                background-color: #f4f5f7;
            }
            i{
     /*           display:inline-block;
                width: 70px;*/
                 display: block;
                position: absolute;
                width: 50px;
                top: 50%;
                transform: translate(40%,-50%);
                color: #2c3e50;

            }
            a {
                cursor: pointer;
                color: #2c3e50;
                display: block;
                position: absolute;
                transform: translate(-50%,-50%);
                right: 0;
                top: 50%;
                width: 130px;
                height: 30px;
                 font-size: 18px;
                line-height: 30px;
                text-overflow: ellipsis;
                overflow: hidden;



            }
        }
        ul{
            li{
                width: 100%;
                height: 80px;
                position: relative;
                padding-left: 20px;
                transition: background-color .3s ease;
                white-space: nowrap;
                font-size: 20px;
                padding-bottom: 30px;
                text-align: center;
                overflow: hidden;
                &:hover{
                    background-color: #f4f5f7;
                }

               i{
                   display: block;
                   position: absolute;
                   width: 50px;
                   top: 50%;
                   transform: translate(50%,-50%);
               }
                a{
                    cursor: pointer;
                    color: #2c3e50;
                    text-align: left;
                    display: block;
                    position: absolute;
                    transform: translate(-30%,-50%);
                    right: 0;
                    top: 50%;
                    width: 130px;
                    height: 30px;
                    font-size: 18px;
                    line-height: 30px;
                    text-overflow: ellipsis;
                    overflow: hidden;

                }
            }
        }
    }

    .main {
        margin: 18px;
        flex: 5;
        height:800px;
        color: #333;
        text-align: center;
        line-height: 160px;
        .info-box{
            padding-bottom: 18px;
            height: 200px;
            display: flex;
            flex-direction: row;
            box-sizing: border-box;
            border-bottom: 1px solid #e5e9ef;
            img{

                width: 263px;

            }
            .favInfo-details{              margin-left: 18px;
                flex-grow: 1;
                display: flex;
                flex-direction: column;
                line-height: 50px;
                text-align: left;

                h3{
                    height: 50px;


                }
                .fav-meta{
                    height: 65px;
                }
            }
        }
    }
    .el-icon-circle-plus-outline{

}
.fa-plus-square:hover{
    background-color: rgba(1,1,1,0.1);
    color: #2c3e50;
}
    .bigbox {
     /*   height: 1000px;*/
        display: flex;
        background-color: white;
        opacity: 0.9;
    }


    .bigbox_left {
        position: absolute;

        width: 50%;
        height: 900px;
        background: url("../static/img/imoto_left.jpg") no-repeat;
        background-size: 100% 100%;
        /*     background-color: #D5D5D5; */
    }

    .bigbox_right {
        position: absolute;
        right: 0px;
        padding: 50px;
        padding-top: 150px;
        text-align: left;
        margin: auto;
        width: 40%;
        height: 900px;

    }

    .desc_name {
        margin-bottom: 20px;
    }

    .bigbox_right .desc {
        width: 100%;
        height: 250px;
        font-size: 18px;
    }

    .desc_name {
        color: #333;
        font-family: Arial, Helvetica, sans-serif;
    }

    .bigbox button {
        width: 100px;
        height: 40px;
        display: inline-block;
        line-height: 1;
        white-space: nowrap;
        cursor: pointer;
        background: #fff;
        border: 1px solid #c4c4c4;
        color: #1f2d3d;
        margin: 0;
        padding: 10px 15px;
        border-radius: 4px;
    }

    .text-form {
        margin-bottom: 20px;
    }

    textarea {
        width: 100%;
        height: 100px;
        padding: 10px;
        font-size: 16px;
        color: #4a4a4a;
        border: 1px solid #d1d1d1;
        border-radius: 2px;
    }

    .psd-form input {
        width: 300px;
        height: 30px;
        margin-bottom: 20px;
        padding-left: 10px;
        display: block;
        font-size: 16px;
        color: #4a4a4a;
        border: 1px solid #d1d1d1;
        border-radius: 2px;
    }

    #imoto2 {
        position: absolute;
        display: none;
        width: 50%;
        height: 800px;
        background: url("../static/img/imoto_left2.jpg") no-repeat;
        background-size: 100% 100%;
    }
</style>