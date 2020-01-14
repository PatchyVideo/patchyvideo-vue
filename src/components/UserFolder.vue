




<!--
下次更新时取消该组件的制作
-->


<template>
<div>



    <div class="bigbox standard">

            <div class="aside">
    <div class="new-create" ><i class="el-icon-circle-plus-outline"></i><a>新建文件夹</a> </div>
                <ul class="folder">
                    <li><i class="el-icon-folder"></i><a>文件夹 1</a></li>
                    <li><i class="el-icon-folder"></i><a>文件夹 2</a></li>
                    <li><i class="el-icon-folder"></i><a>文件夹 3</a></li>
                    <li><i class="el-icon-folder"></i><a>文件夹 4</a></li>
                </ul>


            </div>
            <div class="main">
               <div class="info-box">

           <img src="../static/img/test.png" alt="">
           <div class="favInfo-details">
               <h3>默认收藏夹</h3>
          <div class="fav-meta">
                   <span class="fav-up-name">创建者：鳥居朔音</span>
               </div>
               <div class="fav-meta">
               <span>4个内容</span>
               <span class="dot">·</span>
               <span>公开</span>
           </div>
           </div>

       </div>
                <div class="fav null">
             <!--       <el-link icon="el-icon-edit">编辑</el-link>-->
                         <div class="add-list">
                           <i class="el-icon-plus"></i>
                         </div>
                </div>
                <div class="fav notnull"v-if="false">
                    <a href="" class="list-item">
                        <img src="../static/img/test.png" alt="">
                     <!--   <p>DEC描述</p>-->
                        <h3>标题</h3>
                        <div>
                            <span> videos:4</span>
                            <!-- <span>views:{{ i.views}}</span>-->
                        </div>

                    </a>

                    <a href="" class="list-item">
                        <img src="../static/img/test.png" alt="">
                        <!--   <p>DEC描述</p>-->
                        <h3>标题</h3>
                        <div>
                            <span> videos:4</span>
                            <!-- <span>views:{{ i.views}}</span>-->
                        </div>

                    </a>
                    <a href="" class="list-item">
                    <img src="../static/img/test.png" alt="">
                    <!--   <p>DEC描述</p>-->
                    <h3>标题</h3>
                    <div>
                        <span> videos:4</span>
                        <!-- <span>views:{{ i.views}}</span>-->
                    </div>

                </a>     <a href="" class="list-item">
                    <img src="../static/img/test.png" alt="">
                    <!--   <p>DEC描述</p>-->
                    <h3>标题</h3>
                    <div>
                        <span> videos:4</span>
                        <!-- <span>views:{{ i.views}}</span>-->
                    </div>

                </a>
                    <a href="" class="list-item">
                        <img src="../static/img/test.png" alt="">
                        <!--   <p>DEC描述</p>-->
                        <h3>标题</h3>
                        <div>
                            <span> videos:4</span>
                            <!-- <span>views:{{ i.views}}</span>-->
                        </div>

                    </a>
                    <a href="" class="list-item">
                        <img src="../static/img/test.png" alt="">
                        <!--   <p>DEC描述</p>-->
                        <h3>标题</h3>
                        <div>
                            <span> videos:4</span>
                            <!-- <span>views:{{ i.views}}</span>-->
                        </div>

                    </a>
                </div>

            </div>



    </div>
</div>
</template>

<script>
    export default {
        data() {
            return {
                centerDialogVisible: false
            }
        },
        methods: {},
        components: {}
    }
</script>

<style lang="less" scoped>
.el-dialog{
    position: absolute;
    z-index: 9999;
}
    .null{
        height: 700px;
    }
    .fav{

        display: flex;
        justify-content: flex-start;
        flex-wrap: wrap;
        margin-bottom: 50px;
            .add-list{
                i{
                    display: inline-block;
                    width: 200px;
                    height: 200px;
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    line-height: 200px;
                    transform: translate(50%,-50%);

                    border: 2px dashed #73777a;
                    font-size: 50px;
                }
            }

        .list-item{
            box-shadow: 0 1px 10px rgba(0,0,0,.1);
            flex: 0 0 22%;
            margin-left: 2.5%;
            margin-top: 2%;
            max-width:  25%;
            padding-bottom: 2%;
            transition: all 0.3s ease;
            background-color: #fff;
            &:hover{

                box-shadow: 0 15px 30px rgba(0,0,0,.1);
                transform: translate3d(0,-2px,0);
            }
            img{
display: block;
                margin: auto;
                margin-top: 9%;
                width: 250px;
                height: 166.66px;

            }
            h3{
                display: block;
                margin: auto;
                width: 80%;
                 margin-top: 18px;
                height: 100px;
                  word-break: break-word;
                line-height: 25px;
                overflow: hidden;
                text-overflow: ellipsis;
                margin-bottom: 20px;


            }
            p{
                display: block;
                height: 108px;
                margin: 10px auto;
                width: 250px;

                overflow: hidden;
                text-overflow: ellipsis;
            }
            div{
                height: 80px;
                line-height: 80px;
                span:nth-child(2){
                    margin-left: 20px;
                    transition: all 0.1s ease;
                }
            }
            &:hover span{

            }


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