<template>
  <div ref="cdiv" :style="(mini ? 'margin-top:8px;' : 'margin-top:16px;') + (highlight ? 'border: dashed yellow;' : '')">
    <div v-if="comment" :style="'border: 1px solid #d1d5da;border-radius: 3px;' + (mini || pre ? 'margin-left:58px;' : 'margin-left:72px;')">
      <div class="left-avatar">
        <router-link
          v-if="commentAuthorsInfo[comment.meta.created_by.$oid]"
          :to="'/users/' + comment.meta.created_by.$oid"
          target="_blank"
          :title="commentAuthorsInfo[comment.meta.created_by.$oid].profile.username"
        >
          <el-avatar size="large" :src="'be/images/userphotos/' + commentAuthorsInfo[comment.meta.created_by.$oid].profile.image"></el-avatar>
        </router-link>
        <el-avatar v-else size="large" :src="require('@/static/img/defaultAvatar.jpg')"></el-avatar>
      </div>
      <div class="comment-box">
        <div class="title-div">
          <p class="title">
            <span
              ><strong>{{
                commentAuthorsInfo[comment.meta.created_by.$oid] ? commentAuthorsInfo[comment.meta.created_by.$oid].profile.username : "..."
              }}</strong></span
            >&nbsp;<span style="color: gray;"><i class="el-icon-date"></i>&thinsp;{{ time(comment.meta.created_at.$date) }}</span>
          </p>
          <div class="comment-bar">
            <strong style="color: gray;">{{ comment.edited ? $t("edited") : "" }}</strong>
            &nbsp;
            <i
              class="comment-bar-item pv-icon-pin"
              :style="comment.pinned ? '' : 'transform: rotate(45deg);'"
              @click="own && pin2(comment._id.$oid, comment.pinned)"
            ></i>
            &nbsp;
            <i class="comment-bar-item el-icon-link" @click="copy2()"></i>
            &nbsp;
            <i
              v-if="!comment.hidden && (own || comment.meta.created_by.$oid == userId)"
              class="comment-bar-item el-icon-edit"
              @click="edit2(comment._id.$oid, comment.content, comment.meta.created_by.$oid)"
            ></i>
            &nbsp;
            <i
              v-if="!comment.hidden && (own || comment.meta.created_by.$oid == userId)"
              class="comment-bar-item el-icon-delete"
              @click="del2(comment._id.$oid)"
            ></i>
            &nbsp;
            <i v-if="userId" class="comment-bar-item pv-icon-reply" @click="reply2('user', comment._id.$oid, comment)"></i>
          </div>
        </div>
        <div class="comment-div">
          <div v-if="!comment.hidden || forceShow" v-shadow :style="mini ? 'padding: 5px 15px;' : 'padding: 15px;'">
            <thread-comment :html="parse(comment.content)"></thread-comment>
          </div>
          <div v-else :style="mini ? 'padding: 5px 15px;' : 'padding: 15px;'">
            {{ $t("hidden.label") }}
            <span style="color: #409eff;" @click="forceShow = true">{{ $t("hidden.show") }}</span>
          </div>
          <div v-for="(commentC, indexC) in comment.children" :key="indexC" style="padding: 0px 8px;">
            <thread-comment-box
              :mini="true"
              :comment="commentC"
              :index="index + '-' + commentC._id.$oid"
              :comment-authors-info="commentAuthorsInfo"
              :user-id="userId"
              :own="own || comment.meta.created_by.$oid == userId"
              @position="position"
              @pin2="pin2"
              @edit2="edit2"
              @del2="del2"
              @reply2="reply2"
            ></thread-comment-box>
          </div>
          <div v-if="adcomment">
            <div style="margin-top: 16px; border: 1px solid #d1d5da; border-radius: 3px; margin-left: 58px;">
              <div class="left-avatar">
                <el-avatar size="large" :src="adcomment.avatar"></el-avatar>
              </div>
              <div class="comment-box">
                <div class="title-div">
                  <p class="title">
                    <span>{{ adcomment.username || "..." }}</span
                    >&nbsp;<span style="color: gray;"><i class="el-icon-date"></i>&thinsp;{{ time(adcomment.date) }}</span>
                  </p>
                </div>
                <div class="comment-div" style="padding: 5px 15px;">
                  <div v-shadow>
                    <thread-comment :html="parse(adcomment.comment)"></thread-comment>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ThreadComment from "./Comment";

import { parse } from "@/static/js/postparser";
import { copyToClipboardText } from "@/static/js/generic";

export default {
  name: "ThreadCommentBox",
  components: {
    ThreadComment,
  },
  props: {
    comment: {
      type: Object,
      default() {
        return {};
      },
    },
    index: {
      type: String,
      default: "",
    },
    commentAuthorsInfo: {
      type: Object,
      default() {
        return {};
      },
    },
    userId: {
      type: String,
      default: "",
    },
    own: {
      type: Boolean,
      default: false,
    },
    mini: {
      type: Boolean,
      default: false,
    },
    adcomment: {
      type: Object,
      default: null,
    },
    pre: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return { highlight: false, forceShow: false };
  },
  mounted() {
    if ("#L" + this.index == this.$route.hash) {
      this.position(this.$refs.cdiv);
      this.highlight = true;
    }
  },
  methods: {
    time(t) {
      function i2(i) {
        return (Array(2).join(0) + i).slice(-2);
      }
      const time = new Date(t);
      return `${time.getFullYear()}-${i2(time.getMonth() + 1)}-${i2(time.getDate())} ${i2(time.getHours())}:${i2(time.getMinutes())}:${i2(time.getSeconds())}`;
    },
    position(el) {
      this.$emit("position", el);
    },
    copy2() {
      copyToClipboardText(window.location.protocol + "//" + window.location.host + "/#" + this.$route.path + "#L" + this.index);
    },
    pin2(id, pinned) {
      this.$emit("pin2", id, pinned);
    },
    edit2(id, comment, uid) {
      this.$emit("edit2", id, comment, uid);
    },
    del2(id) {
      this.$emit("del2", id);
    },
    reply2(type, id, comment) {
      this.$emit("reply2", type, id, comment);
    },
    parse(c) {
      try {
        return parse(c);
      } catch (e) {
        return '<div style="font-family:Consolas">Error: ' + e.message.replace(/ /g, "&nbsp;").replace(/\n/g, "<br />") + "</div>";
      }
    },
  },
};
</script>

<style scoped>
@import "../../../static/img/svg/style.css";
.left-avatar {
  position: absolute;
  left: 16px;
}
.title {
  padding-top: 8px;
  padding-bottom: 8px;
  color: #586069;
  flex: 1 1 auto;
}
.title-div {
  background-color: #f6f8fa;
  border-bottom: 1px solid #d1d5da;
  padding-right: 16px;
  padding-left: 16px;
  display: flex;
  flex-direction: row;
  align-items: center;
}
.comment-box {
  position: relative;
}
.comment-box:after,
.comment-box:before {
  position: absolute;
  top: 11px;
  right: 100%;
  left: -16px;
  display: block;
  width: 0;
  height: 0;
  pointer-events: none;
  content: " ";
  border-color: transparent;
  border-style: solid solid outset;
}
.comment-box:before {
  border-width: 8px;
  border-right-color: #d1d5da;
}
.comment-box:after {
  margin-top: 1px;
  margin-left: 2px;
  border-width: 7px;
  border-right-color: #f6f8fa;
}
.comment-div {
  overflow: visible;
  font-size: 14px;
}
.comment-bar {
  float: right;
  cursor: default;
}
.comment-bar-item {
  cursor: pointer;
}
</style>
