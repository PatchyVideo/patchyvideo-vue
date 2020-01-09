
<!--
使用方法：
需要父组件绑定 1.msg属性 值为视频的Pid
               2.visible.sync属性 值为布尔值，true打开，false关闭。默认false关闭.
保存功能、检验Tag的添加是否合法没做，无接口。
觉得问题大可以重做。
-->
<template>
  <transition mode="out-in">
    <div v-if="visible" class="EditTags">
      <div id="tag">
        <i class="fa fa-close fa-2x" id="close" @click="closeTagPanel"></i>
        <div class="minibox">
          <div class="m_bg"></div>
          <div class="m_a activeTag">
            <ul class="Taglist Copyright">
              <li
                class="item"
                v-for="(i,item) in TagCategoriesData"
                :key="item"
                v-if="i=='Copyright'"
                :class="{selected:-1==tagsForRec.indexOf(item)}"
                @click.stop="selected(i,item)"
              >
                <p class="val_${str[i]}">{{item}}</p>
                <i class="fa fa-close" @click.stop="deleteObj(i,item)"></i>
              </li>
            </ul>
            <ul class="Taglist Language">
              <li
                class="item"
                v-for="(i,item) in TagCategoriesData"
                :key="item"
                v-if="i=='Language'"
                :class="{selected:-1==tagsForRec.indexOf(item)}"
                @click.stop="selected(i,item)"
              >
                <p class="val_${str[i]}">{{item}}</p>
                <i class="fa fa-close" @click.stop="deleteObj(i,item)"></i>
              </li>
            </ul>
            <ul class="Taglist Character">
              <li
                class="item"
                v-for="(i,item) in TagCategoriesData"
                :key="item"
                v-if="i=='Character'"
                :class="{selected:-1==tagsForRec.indexOf(item)}"
                @click.stop="selected(i,item)"
              >
                <p class="val_${str[i]}">{{item}}</p>
                <i class="fa fa-close" @click.stop="deleteObj(i,item)"></i>
              </li>
            </ul>
            <ul class="Taglist General">
              <li
                class="item"
                v-for="(i,item) in TagCategoriesData"
                :key="item"
                v-if="i=='General'"
                :class="{selected:-1==tagsForRec.indexOf(item)}"
                @click.stop="selected(i,item)"
              >
                <p class="val_${str[i]}">{{item}}</p>
                <i class="fa fa-close" @click.stop="deleteObj(i,item)"></i>
              </li>
            </ul>
            <ul class="Taglist Meta">
              <li
                class="item"
                v-for="(i,item) in TagCategoriesData"
                :key="item"
                v-if="i=='Meta'"
                :class="{selected:-1==tagsForRec.indexOf(item)}"
                @click.stop="selected(i,item)"
              >
                <p class="val_${str[i]}">{{item}}</p>
                <i class="fa fa-close" @click.stop="deleteObj(i,item)"></i>
              </li>
            </ul>
            <ul class="Taglist Author">
              <li
                class="item"
                v-for="(i,item) in TagCategoriesData"
                :key="item"
                v-if="i=='Author'"
                :class="{selected:-1==tagsForRec.indexOf(item)}"
                @click.stop="selected(i,item)"
              >
                <p class="val_${str[i]}">{{item}}</p>
                <i class="fa fa-close" @click.stop="deleteObj(i,item)"></i>
              </li>
            </ul>
          </div>

          <div class="m_b">
            <div id="m_b_box">
              <input
                id="ipt"
                v-model="iptVal"
                @focus="infoTipEvent(true)"
                @blur="infoTipEvent(false)"
              />
              <i class="fa fa-plus-square fa-2x" id="add" @click="addTag"></i>
            </div>
            <span class="tag_title infoTip_1" :class="{hidden:infoTip[0].isHidden}">编辑共有标签</span>
            <span class="tag_title infoTip_2" :class="{show:infoTip[1].isHidden}">标签已存在</span>
            <span class="tag_title infoTip_3" :class="{show:infoTip[2].isHidden}">标签不存在</span>
          </div>
          <div class="m_c">
            <div>
              <span>推荐标签：</span>
              <transition mode="out-in">
                <ul class="recTag Taglist" v-show="recTagsWatch">
                  <li class="item" v-for="(i,item) in recTags" @click="getiptVal(i,item)">
                    <p class="val_${str[i]}">{{Object.keys(i)[0]}}</p>
                    <i class="fa fa-close"></i>
                  </li>
                </ul>
              </transition>
            </div>
          </div>
        </div>

        <i class="fa fa-circle-o fa-3x" id="save"></i>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  data() {
    return {
      tags: [],
      tagsForRec: [],
      TagCategoriesData: {},
      recTags: [],
      iptVal: "",
      pid: "",
      infoTip: [
        { name: "infoTip_1", isHidden: false },
        { name: "infoTip_2", isHidden: false },
        { name: "infoTip_3", isHidden: false }
      ],
      recTagsWatch: true
    };
  },
  methods: {
    getCommonTags() {
      console.log("getCommonTags");
      this.axios({
        method: "post",
        url: "be/list/getcommontags.do",
        data: { pid: this.msg }
      })
        .then(res => {
          console.log(res);
          this.tags = res.data.data;
          this.tagsForRec = JSON.parse(JSON.stringify(this.tags));
          this.getTagCategories(this.tags);
          this.getRecTags(this.tags);
        })
        .catch(err => {});
    },
    getTagCategories(str) {
      this.axios({
        method: "post",
        url: "be/tags/query_tag_categories.do ",
        data: { tags: str }
      })
        .then(res => {
          this.TagCategoriesData = res.data.data.categorie_map;
        })
        .catch(err => {});
    },
    getRecTags(tags) {
      this.axios({
        method: "post",
        url: "be/tags/get_related_tags.do",
        data: { tags: tags }
      })
        .then(res => {
          this.recTags = res.data.data.tags;
        })
        .catch(err => {});
    },
    deleteObj(i, item) {
      this.$delete(this.TagCategoriesData, item);
      this.tags.forEach(function(value, index, array) {
        if (value == item) {
          this.tags.splice(index, 1);
          return;
        }
      });
    },
    selected(i, item) {
      if (this.tagsForRec.indexOf(item) != -1) {
        this.tagsForRec.splice(this.tagsForRec.indexOf(item), 1);
        return;
      }
      if (this.tagsForRec.indexOf(item) === -1) {
        this.tagsForRec.push(item);
        return;
      }
    },
    getiptVal(i, item) {
      this.iptVal = Object.keys(i)[0];
    },
    addTag() {
      this.infoTip[0].isHidden = true;
      if (this.tags.indexOf(this.iptVal) === -1) {
        //Tag是否合法未作检测，无接口
        this.tags.push(this.iptVal);
        this.getTagCategories(this.tags);
        return;
      }
      if (this.tags.indexOf(this.iptVal) != -1) {
        console.log("true");
        this.infoTip[1].isHidden = true;
        let _that = this;
        setTimeout(function() {
          _that.infoTip[1].isHidden = false;
        }, 2000);
        return;
      }
    },
    closeTagPanel() {
      this.$emit("update:visible", false);
    },
    infoTipEvent(event) {
      if (event == true) {
        this.infoTip[0].isHidden = true;
        return;
      }
      if (event == false) {
        this.infoTip[0].isHidden = false;
        return;
      }
    }
  },
  watch: {
    tagsForRec(newVal, oldVal) {
      if (JSON.stringify(oldVal) != "{}") {
        this.recTagsWatch = !this.recTagsWatch;
        let _that = this;
        setTimeout(function() {
          _that.recTagsWatch = !_that.recTagsWatch;
          _that.getRecTags(newVal);
        }, 300);
      }
    },
    msg() {
      this.getCommonTags();
    }
  },
  props: {
    msg: {},
    visible: {
      type: Boolean,
      defulet: false
    }
  },
  components: {}
};
</script>

<style lang="less" scoped>
.v-enter,
.v-leave-to {
  opacity: 0;
}

.v-enter-active,
.v-leave-active {
  transition: all 0.8s ease;
}

* {
  font-family: "Microsoft YaHei", "Lantinghei SC", "Open Sans", Arial,
    "Hiragino Sans GB", "STHeiti", "WenQuanYi Micro Hei", "SimSun", sans-serif;
}

div {
  transition: all 0.6s ease;
}
.EditTags {
  position: relative;
  z-index: 100;
}
.hidden {
  display: none !important;
}
.show {
  display: block !important;
}
.closed {
  display: none;
}
.selected {
  background-color: rgba(200, 200, 200, 0.5) !important;
  color: white !important;
}
div {
  #tag {
    width: 1200px;
    height: 923px;
    background: url("../static/img/test3.png") no-repeat center;
    background-color: #fff;
    background-size: 70% 105%;
    text-align: center;
    box-shadow: 0 5px 15px -5px rgba(0, 0, 0, 0.5);
    display: block;
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    /* 	另一张背景图，可以试试
                    background:url("./static/img/test1.jpg") no-repeat  right;
                        background-size: 83% 108%;

                        */
    /*  padding: 50px;*/

    #close {
      position: absolute;
      right: 5px;
      transform: translateX(-50%);
      top: 5px;
      color: #265778;
      z-index: 999;
    }
    .minibox {
      display: block;
      height: 100%;
      display: flex;
      margin-top: 0px;
      flex-direction: column;
      .m_bg {
      }
      .m_a {
        transition: all 0.6s ease;
        background-color: rgba(215, 176, 184, 0.2);
        flex: 1;
        max-height: 40%;
        overflow: auto;
        padding-top: 35px;
        box-sizing: border-box;
        ul {
          li {
            background-color: #fff;
            display: inline-block;
            zoom: 1;
            height: 20px;
            padding: 12px;
            margin-bottom: 10px;
            margin-left: 10px;
            text-align: center;
            vertical-align: middle;
            cursor: pointer;
            list-style: none;
            border-radius: 20px;
            p {
              display: inline;
              margin-right: 4px;
            }
          }
        }

        .Copyright {
          li {
            p {
              color: #a0a;
            }
          }
        }
        .Language {
          li {
            p {
              color: #585455;
            }
          }
        }
        .Character {
          li {
            p {
              color: #0a0;
            }
          }
        }
        .Author {
          li {
            p {
              color: #a00;
            }
          }
        }
        .General {
          li {
            p {
              color: #0073ff;
            }
          }
        }
        .Meta {
          li {
            p {
              color: #a0a;
            }
          }
        }
      }
      .m_b {
        transition: all 0.6s ease;
        background-color: rgba(215, 176, 184, 0.2);
        box-sizing: border-box;
        flex: 0.5;
        max-height: 10%;
        perspective: 2000px;
        position: relative;

        #m_b_box {
          height: 100%;
          /*              perspective: 500px; */
          box-sizing: border-box;
          #ipt {
            //input
            width: 30%;
            height: 30%;
            outline: none;
            background: white;
            border: none;
            padding-left: 8px;
            box-shadow: 0 0 10px #fff !important;
            transform: translateY(50%) rotateX(0deg) !important;
            transform-origin: left top !important;
          }
          #add {
            transition: all 0.3s ease;
            transform: translateY(60%);
            margin: 0;
            padding: 0;
            vertical-align: center;
            color: white;
            &:hover {
              color: black;
            }
          }
        }
        .tag_title {
          //三个
          position: absolute;
          bottom: 0;
          left: 50%;
          transform: translate(-50%, -50%);
          color: white;
          text-shadow: 0 0 10px #fff, 0 0 40px #ff7777, 0 0 70px #ff7777,
            0 0 80px #ff7777;
          transition: all 0.5s ease;
        }
        .infoTip_1 {
          //编辑标签
          color: white;
          text-shadow: 0 0 10px #fff, 0 0 40px #ff7777, -1px 0 #ff7777,
            -1px 1px #ff7777;

          display: block;
        }
        .infoTip_2 {
          //标签已存在
          display: none;
        }
        .infoTip_3 {
          //标签不存在
          display: none;
        }
      }
      .m_c {
        transition: all 0.6s ease;
        box-sizing: border-box;
        flex: 1;
        max-height: 40%;
        overflow: auto;
        &:hover {
          background-color: rgba(50, 50, 50, 0.4);
        }
        div {
          transition: all 0.6s ease;
          span {
            //推荐标签
            margin: 20px 0px;
            color: #404d5b;
            display: inline-block;
            line-height: 25px;
            font-weight: 800;
            font-size: 25px;
            transition: all 0.1s ease;
          }
          .recTag {
            li {
              background-color: #fff;
              display: inline-block;
              zoom: 1;
              height: 20px;
              padding: 12px;
              margin-bottom: 10px;
              margin-left: 10px;
              text-align: center;
              vertical-align: middle;
              cursor: pointer;
              list-style: none;
              border-radius: 20px;
              p {
                display: inline;
                margin-right: 4px;
              }
            }
          }
        }
      }
    }
    #save {
      position: absolute;
      bottom: 20px;
      left: 50%;
      transform: translateX(-50%);
      transition: all 0.3s ease;
      color: #265778;
      margin-top: 20px;
      &:hover {
        color: skyblue;
      }
    }
  }
}
</style>