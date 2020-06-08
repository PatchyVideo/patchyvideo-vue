<!-- vue组件：pv-tag.vue -->
<!-- 
    说明：
      PatchyVideo的标签组件
    功能：
      1.对应不同的标签种类展示不同的颜色√
      2.点击标签跳转到对应的搜索页面√
      3.由于宽度原因导致无法全部显示的，鼠标悬停时会显示全部名称
      4.鼠标悬停的时候显示跳转到wiki按钮
    参数：
      1.tagType（String）：标签的种类，可选值：
        Copyright, Language, Character, Author, General, Meta, Soundtrack,none
      2.（必需）tagText（String）：标签的内容
      3.tagID（Number）：标签的ID
 -->
<template>
  <div class="tag">
    <el-tooltip effect="light" :content="tipText.replace(/_/g, ' ')" placement="left">
      <div class="tag-div">
        <p :ref="tipText" class="tag-text" :class="type" @click="gotoHome(tipText)" @click.middle="gotoHome(tipText, true)">{{ tipText }}</p>
      </div>
    </el-tooltip>
  </div>
</template>

<script>
export default {
  components: {},
  props: {
    // 标签种类
    tagType: {
      type: String,
      default: "none",
    },
    // 标签内容
    tagText: {
      type: String,
      required: true,
    },
    // 标签ID
    tagID: {
      type: Number,
      default: null,
    },
  },
  data() {
    this.$i18n.locale = localStorage.getItem("lang");
    return {
      // Tag 颜色列表
      colorTagList: ["Copyright", "Language", "Character", "General", "Meta", "Soundtrack", "Author"],
      // Tag 内容更新时的钩子函数
      onresizehandler: null,
    };
  },
  watch: {
    // 当标签内容发生变动时刷新溢出属性
    tagText() {
      this.$nextTick(function() {
        this.freshOverflow();
      });
    },
  },
  created() {},
  mounted() {},
  methods: {
    // 点击标签显示标签的搜索结果
    gotoHome(key, _blank = false) {
      if (key != "") {
        if (_blank) {
          let routerPath = this.$router.resolve({
            path: "/home",
            query: { keyword: key },
          });
          window.open(routerPath.href, "_blank");
        } else {
          this.$router.push({
            path: "/home",
            query: { keyword: key },
          });
        }
      } else {
        this.$router.push({ path: "/home" });
      }
    },
  },
};
</script>

<style scoped>
.tag {
  display: inline-block;
  cursor: pointer;
  transition: all 0.5s ease;
}
.tag:hover {
  color: #ff88a0;
}
.tag-div {
  padding: 0 12px;
  border-radius: 100px;
  border: 1px solid #a4a4a4;
  /* 使文字变为最多显示1行，多余的使用省略号代替 */
  display: -webkit-inline-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}
.tag-div:hover {
  border-color: #ff88a0;
}
.tag-text {
  font-size: 16px;
  font-weight: 800;
  margin: 5px 0 5px 0;
}
/* 针对标签种类调整标签颜色 */
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
.none {
  color: #b3b3b3;
}
</style>

<i18n folder></i18n>
