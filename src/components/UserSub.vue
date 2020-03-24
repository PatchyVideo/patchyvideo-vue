
<i18n>
    {
    "CHS": {

    },
    "ENG": {

    }
    }
</i18n>

<template>
    <div>


        <el-card class="box-card"  v-loading="loading">
            <el-collapse v-model="activeNames" @change="handleChange" >
                <el-collapse-item title="已订阅的文本" name="1" style="text-align: center">

                    <div v-for="i in this.subDataTextNameData" :key="i">
                        <div class="sub-text">
                            <h4>{{i}}</h4>
                            <div>
                                <el-tag type="danger" class="text-data" v-for="(m,index) in subQtMap(i,'text')" :key="m._id.$oid">

                                    <transition mode="out-in">
                                        <div v-if="m.iptVisble!==true">
                                            <span @keyup.enter="subUpDate(m,$event,'text')" contenteditable="true">{{m.qs}}</span>
                                            <!--       <i class="el-icon-edit"  @click="showIpt(m,index)"></i>-->
                                            <i class="el-icon-delete" @click="subDel(m)"></i>
                                        </div>
                                        <div  class="text-ipt" v-if="m.iptVisble===true"  style="display: flex;">
                                            <el-input v-model="m.iptValue"
                                            >
                                            </el-input>
                                            <el-button @click="subUpDate(m)"
                                            >确认</el-button>
                                            <el-button @click="handleSubIptConfirm(m)"
                                            >取消</el-button>
                                        </div>
                                    </transition>

                                </el-tag>
                            </div>

                        </div>
                    </div>
         <!--           <transition mode="out-in">
                        <div style="display: flex; width: 80%; margin: auto;" v-if="textAddIptVisible">
                            <el-input v-model="subTextIptName"placeholder="name可为空" style="width: 30%;"></el-input>
                            <el-input v-model="subTextIptValue"placeholder="要添加的文本内容"  style="flex-grow: 1;"></el-input>


                            <el-button @click.native="subAdd(subTextIptValue,subTextIptName,'text')" >添加文本订阅</el-button>

                            <el-button @click.native="textAddIptVisible =false"  style="margin: 0">取消</el-button>

                        </div>

                        <el-button v-else class="button-new-tag" size="small" type="danger" @click="showTextAddInput" style="width: 20%;">+ 添加文本订阅</el-button>
                    </transition>-->
                </el-collapse-item>
                <el-collapse-item title="已订阅的标签/文本" name="2">

                    <div v-for=" i  in this.subDataTagsNameData" :key="i" style="margin-bottom: 20px">

                        <div class="sub-tags">
                            <h4>{{i}}</h4>
                            <div>
                                <el-tag class="tags-data" v-for="(m,index) in subQtMap(i,'tag')" :key="m._id.$oid">
                                    <transition mode="out-in">
                                        <div v-if="m.iptVisble!==true">
                                            <span @keyup.enter="subUpDate(m,$event,'tag')" contenteditable="true">{{m.qs}}</span>
                                            <!--             <i class="el-icon-edit"  @click="showIpt(m,index)"></i>-->
                                            <i class="el-icon-delete" @click="subDel(m)"></i>
                                        </div>
                                        <div  class="tags-ipt" v-if="m.iptVisble===true"  style="display: flex;">
                                            <el-input v-model="m.iptValue"
                                            >
                                            </el-input>
                                            <el-button @click="subUpDate(m)"
                                            >确认</el-button>
                                            <el-button @click="handleSubIptConfirm(m)"
                                            >取消</el-button>
                                        </div>
                                    </transition>

                                </el-tag>
                            </div>


                        </div>


                    </div>

                </el-collapse-item>
            </el-collapse>
            <transition mode="out-in">
                <div  class="sub-add" v-if="subAddIptVisible">
                    <div class="sub-name">
                        <el-checkbox v-model="checked" class="check" label="name" border></el-checkbox>
                        <el-input v-model="subAddName"placeholder="name可为空"  v-if="checked"></el-input>
                    </div>
                    <!--              <el-input v-model="subTagsIptValue"placeholder="要添加的标签内容" style="flex-grow: 1;"></el-input>-->

                    <div class="sub-main">
                        <el-select id="select-order" v-model="couponSelected">
                            <el-option
                                    v-for="item in options"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value"
                            ></el-option>
                        </el-select>
                        <el-autocomplete
                                id="ipt"
                                v-model="subAddIptValue"
                                :fetch-suggestions="querySearchAsync"
                                :trigger-on-focus="false"
                                placeholder="要添加的标签内容"
                                @select="handleSelect"
                                class="input-new-tag"
                                ref="saveTagInput"
                        >
                            <template slot-scope="{ item }">
                                <div class="adviceList">
                                    <div
                                            class="name"
                                            v-bind:class="{
                                                     Copyright: item.cat === 2,
                                                     Language: item.cat === 5,
                                                     Character: item.cat === 1,
                                                     Author: item.cat === 3,
                                                     General: item.cat === 0,
                                                     Meta: item.cat === 4,
                                                     Soundtrack: item.cat === 6
                                                   }"
                                            v-html="item.tag||ConvertLangRes(item.langs)"
                                    >{{ item.tag }}</div>
                                    <div class="addr" v-if="item.cnt != null">{{ item.cnt }}</div>
                                </div>
                            </template>
                        </el-autocomplete>
                    </div>

                    <div class="sub-action">
                        <el-button @click.native="subAdd(subTagsIptValue,subTagsIptName,'tag')" type="primary">添加标签订阅</el-button>
                        <el-button @click.native="subAddIptVisible=false" style="margin: 0">取消</el-button>
                    </div>
                </div>

                <el-button v-else class="button-new-tag" size="small"type="primary" @click="showAddInput" style="width: 20%;">+ 添加订阅</el-button>
            </transition>
        </el-card>
    </div>

</template>

<script>
    export default {
        data() {
            this.$i18n.locale = localStorage.getItem("lang");
            return {
                loading:false,
                subDataTextIptId:[],
                //更新订阅时不同输入框的值
                iptValue: '',
                //添加订阅时输入框的值
                subAddIptValue:"",
                //添加订阅时输入框的名字
                subAddName:"",
                iptVisble:false,
                checked: true,
                checkboxGroup1: [],
                couponSelected:[],
                options: [
                    { value: "tag", label:"Tag/Text" },
                    { value: "text", label: "Text Only"}
                ],

                subDataText:{},
                subTextIptValue:"",
                subTextIptName:"",
                subDataTextNameData:[],
                subDataTextQtData:[],
                textAddIptVisible:false,

                subDataTags:{},
                subDataTagsNameData:[],
                subDataTagsQtData:[],
                subTagsIptValue:"",
                subTagsIptName:"",
                subAddIptVisible:false,

                activeNames: ['1','2'],
                subObj:[],
            }
        },
        created(){
            this.couponSelected = this.options[0].value;
            $(window).keydown( function(e) {
                var key = window.event?e.keyCode:e.which;
                /*获取用户按键，如果是回车，则不执行任何*/
                if(key.toString() === "13"){
                    /*调用光标插入方法，在光标处插入 换行*/
                    return false;
                }
            });
            this.subShowAll();
        },
        mounted(){

        },
        methods: {

            handleChange(val) {
            },
            handleSubIptConfirm(m){
                m.iptVisble =false;
                this.$forceUpdate();
            },
            showAddInput(){
                this.subAddIptVisible =true;
            },
            showIpt(m,i){
                m.iptVisble =true;
                this.$forceUpdate();

            },
                ConvertLangRes(langs, hastran = true) {
                if (!langs) return;
                var LangList = [
                    { id: 1, lang: "CHS" },
                    { id: 2, lang: "CHT" },
                    { id: 5, lang: "ENG" },
                    { id: 10, lang: "JPN" }
                ];
                var level = [10, 5, 1, 2];
                var Lang = "";
                var mainLang = "";
                var subLang = "";
                //经过一系列计算得出主副语言

                //匹配当前语言的ID
                var CurrLangID = LangList.find(x => {
                    return x.lang == this.$i18n.locale;
                });
                CurrLangID = CurrLangID ? CurrLangID.id : 1;

                //匹配对应ID的内容
                var CurrLangWord = langs.find(x => {
                    return x.l == CurrLangID;
                });
                if (!CurrLangWord) {
                    for (var i = 0; i < level.length; i++) {
                        CurrLangWord = langs.find(x => {
                            return x.l == level[i];
                        });
                        if (CurrLangWord) break;
                    }
                }
                mainLang = CurrLangWord.w;

                if (hastran) {
                    /*
                  副语言匹配
                  优先级：日语，英语，简体中文，繁体中文
                  */
                    var SubLangWord = null;
                    for (var i = 0; i < level.length; i++) {
                        if (level[i] == CurrLangWord.l) continue;
                        SubLangWord = langs.find(x => {
                            return x.l == level[i];
                        });
                        if (SubLangWord) break;
                    }
                    subLang = SubLangWord ? SubLangWord.w : mainLang;

                    //合成语言
                    Lang = `${mainLang.replace(/\_/g, " ")}`;
                    Lang += `<span style='font-size:8px;color: gray;display: block;'>${subLang.replace(
                        /\_/g,
                        " "
                    )}</span>`;
                } else {
                    Lang = mainLang;
                }
                return Lang;
            },
            handleSelect(item) {
                this.subAddIptValue = this.ConvertLangRes(item.langs,false);
            },
            querySearchAsync(queryString, cb) {
                var url = "/be/autocomplete/ql?q=" + queryString;
                this.axios({
                    method: "get",
                    url: url
                }).then(result => {
                    this.taglist = result.data;
                    cb(result.data);
                });
            },
            subAdd(val,name,str){
                this.axios({
                    method:"post",
                    url:"/be/subs/add.do",
                    data:{
                        "qtype":this.couponSelected,
                        "name":this.subAddName,
                        "query":this.subAddIptValue
                    }
                }).then(res=>{
                    if(res.data.status ==="SUCCEED"){
                        this.$message({
                            message: "添加成功",
                            type: "success"
                        });
                        this.subShowAll();
                    }
                }).catch(err=>{
                    console.log(err);
                })
            },
            subDel(m){
                this.loading =true;
                this.axios({
                    method:"post",
                    url:"/be/subs/del.do",
                    data:{"subid":m._id.$oid}
                }).then(res=>{
                    if(res.data.status ==="SUCCEED"){
                        this.$message({
                            message: "删除成功",
                            type: "success"
                        });
                    }
                    this.subShowAll();
                    this.loading =false;
                    this.$forceUpdate();

                }).catch(err=>{
                    this.loading =false;
                })
            },
            subNameMap(arr,str){
                let nameData = new  Set(arr.map((item,index,array)=>{
                    return item.name
                }));
                if(str ==="text"){
                    this.subDataTextNameData =  Array.from(nameData);

                    return;

                };
                if(str ==="tag"){
                    this.subDataTagsNameData =  Array.from(nameData);

                    return;

                }

            },
            subQtMap(i,str){
                if(str ==="text"){
                    return   this.subDataText.filter((item, index, array) => {
                        if (item.name === i) {
                            return item
                        }
                    });
                }
                if(str ==="tag"){
                    return   this.subDataTags.filter((item, index, array) => {
                        if (item.name === i) {
                            return item
                        }
                    });
                }
            },
            subUpDate(m,e,str){
                this.loading =true;
                if(e!==undefined){
                    const el = e.target;
                    let value = el.innerText;
                    //阻止更新订阅时回车的换行
                    if(e.keyCode === '13')
                        value = value.substring(0,value.length-1);
                    if(e.keyCode === '8'){
                        if(value.length>=2){
                            if(value.charCodeAt(value.length-1)===10&&value.charCodeAt(value.length-2)===10){
                                value = value.substring(0,value.length-1);
                            }
                            else if(value.charCodeAt(value.length-1)===10 && value.charCodeAt(value.length-2)!==10){
                                value = value.substring(0,value.length-1);
                            }
                        }

                    };
                    if(value.charCodeAt(0) === 10 && value.length ===1){
                        value="";
                    }
                    if(value===""){
                        this.$message({
                            message: this.$t('值不能为空！'),
                            type: "warning"
                        });
                        this.loading =false;
                        return;
                    }
                    m.iptValue =value;



                }

                this.axios({
                    method:"post",
                    url:"be/subs/update.do",
                    data:{
                        "qtype":str,
                        "name":"",
                        "query":m.iptValue,
                        "subid":m._id.$oid
                    }
                }).then(res=>{
                    console.log(res);
                    if(res.data.status ==="SUCCEED"){
                        this.$message({
                            message: "修改成功",
                            type: "success"
                        });
                    }
                    this.subShowAll();
                })

            },
            subShowAll(){
                this.loading =true;
                this.axios({
                    method:"post",
                    url:"be/subs/all.do",
                    data:{}
                }).then(res=>{
                    /*        console.log(res.data.data);*/
                    this.subDataText =  res.data.data.subs.filter((item,index,array)=>{
                        return item.qt==="text"
                    });
                    /*  let e = [];
                      for(let i =0;i<=7;++i){

                          let obj = {};
                          obj.key =i;
                          obj.value = "modle"
                          e[i] = obj;

                      }
                      this.subDataTextIptId = e;*/
                    this.subNameMap(this.subDataText,"text");
                    this.subDataTags =res.data.data.subs.filter((item,index,array)=>{
                        return item.qt ==="tag"
                    });
                    this.subNameMap(this.subDataTags,"tag");
                    this.loading =false;

                }).catch(err=>{
                    this.loading =false;
                })
            },
            subShowTags(){
                this.axios({
                    method:"post",
                    url:"be/subs/tags.do",
                    data:{}
                }).then(res=>{
                })
            }
        },
        components: {

        }
    }
</script>

<style scoped lang="less">

.sub-add{

    width: 80%;
    margin:auto;
    .sub-name{
        margin-bottom: 10px;
        .el-checkbox{
            transition: all .3s ease;
            width: 15%;
            box-sizing: border-box;
            margin-right: 10px;
            /deep/&:hover{
                background-color: #409EFF;
                color: #f0f0f0;
                .el-checkbox__label{
                    color: #f0f0f0!important;
                }
                .el-checkbox__innerl{
                    background-color: #fff;
                }

            }
        }
        .el-input{
            width: 30%;
        }
    }
    .sub-main{
        margin-bottom: 10px;
        .el-select{
            width: 15%;
            box-sizing: border-box;
            margin-right: 10px;
        }
        .el-autocomplete{
            width: 30% !important;
        }
    }

    .sub-action{
        margin: auto;
display: flex;
        justify-content: center;
        .el-button{
            width: 20%;
            margin-right: 10px;
        }
    }

}
/*/deep/ .el-checkbox__label{
    color: darkblue!important;
}*/
.v-enter,
    .v-leave-to {
        opacity: 0;
    }

    .v-enter-active,
    .v-leave-active {
        transition: all 0.1s ease;
    }
    .sub-text{
        width: 80%;
        display: flex;
        margin:0 auto;
        margin-bottom: 20px;
        border-radius: 2px;
        background-color: #fff;
        background-image: none;
        border: 1px solid #dcdfe6;
        box-sizing: border-box;
        color: #606266;
        height: 100%;
        line-height: 40px;
        outline: none;
        transition: all 0.3s ease;
        justify-content: space-around;
        &:hover{
            box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
        }
        &:focus{
            border:1px solid #409eff;
        }

        h4{
            display: block;
            transition: border-color .2s cubic-bezier(.645,.045,.355,1);
            height: 100%;
            border:1px solid #fff;
            width: 20%;
            overflow: hidden;
            text-overflow: ellipsis;

            margin: auto 12px;
            /*  background-color: darkcyan;*/
            &:hover{
                outline: none;

            }


        }
        &:nth-child(1){
            padding-top: 10px;
        }
        div{

            flex: 2;
            display: flex;
            flex-wrap: wrap;
            align-items: center;
            .text-data{
                display: flex;
                /*     min-width: 300px;*/
                /*     border:1px solid #fff;*/
                position: relative;
                transition: all 0.3s ease;
                margin: 0 10px 8px 0;
                background: #f4f4f4;
                border-radius: 100px;
                padding: 0 12px;
                font-size: 12px;
                border: 1px solid #f4f4f4;
                /*          border-left: 1px solid #dcdfe6;*/
                &:hover{
                    outline: none;
                    border:1px solid #409eff;
                }
                div{
                    display: block;
                    width: 100%;
                    min-width: 50px;
                    transition: border-color .2s cubic-bezier(.645,.045,.355,1);

                    /*         border:1px solid #fff;*/
                    /*  background-color: darkcyan;*/
                    &:hover{
                        outline: none;
                        /*         border:1px solid #409eff;*/
                    }
                    span{
                        display: inline-block;
                        max-width: 300px;
                        overflow: hidden;
                        text-overflow: ellipsis;
                        white-space: nowrap;
                    }
                    i{
                        line-height: 28px;
                        float: right;
                        transition: all 0.3s ease;
                        margin-left: 5px;
                        color: black;
                        &:hover{
                            cursor: pointer;
                            color:#409eff;
                            outline: none;

                        }
                    }
                }
            }
            .text-ipt{
                width: 250px !important;
                .el-input{
                    max-width: 200px;
                    margin: 0;
                }
                .el-button{
                    height: 40px;
                    margin: 0;
                }
                &:hover{
                    outline: none;
                    border:1px solid #409eff;
                }
            }
        }

    }
    .sub-tags{
        width: 80%;
        display: flex;
        margin:0 auto;
        margin-bottom: 20px;
        border-radius: 2px;
        background-color: #fff;
        background-image: none;
        border: 1px solid #dcdfe6;
        box-sizing: border-box;
        color: #606266;
        height: 100%;
        line-height: 40px;
        outline: none;
        transition: all 0.3s ease;
        justify-content: space-around;
        &:hover{
            box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
        }
        &:focus{
            border:1px solid #409eff;
        }

        h4{
            display: block;
            transition: border-color .2s cubic-bezier(.645,.045,.355,1);
            width: 20%;
            overflow: hidden;
            text-overflow: ellipsis;
            height: 100%;
            border:1px solid #fff;

            margin: auto 12px;
            /*  background-color: darkcyan;*/
            &:hover{
                outline: none;

            }


        }
        &:nth-child(1){
            padding-top: 10px;
        }
        div{

            flex: 2;
            display: flex;
            flex-wrap: wrap;
            align-items: center;
            .tags-data{
                display: flex;
                /*     min-width: 300px;*/
                /*     border:1px solid #fff;*/
                position: relative;
                transition: all 0.3s ease;
                margin: 0 10px 8px 0;
                background: #f4f4f4;
                border-radius: 100px;
                padding: 0 12px;
                font-size: 12px;
                border: 1px solid #f4f4f4;
                /*          border-left: 1px solid #dcdfe6;*/
                &:hover{
                    outline: none;
                    border:1px solid #409eff;
                }
                div{
                    display: block;
                    width: 100%;
                    min-width: 50px;
                    transition: border-color .2s cubic-bezier(.645,.045,.355,1);

                    /*         border:1px solid #fff;*/
                    /*  background-color: darkcyan;*/
                    &:hover{
                        outline: none;
                        /*         border:1px solid #409eff;*/
                    }
                    span{
                        display: inline-block;
                        max-width: 300px;
                        overflow: hidden;
                        text-overflow: ellipsis;
                        white-space: nowrap;
                    }
                    i{
                        line-height: 28px;
                        float: right;
                        transition: all 0.3s ease;
                        margin-left: 5px;
                        color: black;
                        &:hover{
                            cursor: pointer;
                            color:#409eff;
                            outline: none;

                        }
                    }
                }
            }
            .tags-ipt{
                width: 250px !important;
                .el-input{

                    max-width: 200px;
                    margin: 0;
                }
                .el-button{
                    height: 40px;
                    margin: 0;
                }
                &:hover{
                    outline: none;
                    border:1px solid #409eff;
                }
            }
        }

    }
    .Copyright {
        color: #a0a;
    }
    .Language {
        color: #585455;
    }
    .Character {
        color: #0a0;
    }
    .Author {
        color: #a00;
    }
    .General {
        color: #0073ff;
    }
    .Meta {
        color: #f80;
    }
    .Soundtrack {
        color: #ff7792;
    }
    .el-collapse{
        /*width: 300px;*/
    }
    /*.el-collapse{
        border-radius: 4px;
        border: 1px solid #ebeef5;
        background-color: #fff;
        overflow: hidden;
        color: #303133;
        transition: .3s;
        &:hover{
                box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
        }

    }*/
</style>