<template>
  <div ref="sdiv">
    <div
      v-html="html"
      :style="'all:initial;font-size:' + fontsize + 'em;'"
    ></div>
  </div>
</template>

<script>
export default {
  mounted() {
    let style = document.createElement("style");
    style.innerHTML =
      ".hljs{display:block;overflow-x:auto;padding:.5em;color:#333;background:#f8f8f8}.hljs-comment,.hljs-quote{color:#998;font-style:italic}.hljs-keyword,.hljs-selector-tag,.hljs-subst{color:#333;font-weight:700}.hljs-literal,.hljs-number,.hljs-tag .hljs-attr,.hljs-template-variable,.hljs-variable{color:teal}.hljs-doctag,.hljs-string{color:#d14}.hljs-section,.hljs-selector-id,.hljs-title{color:#900;font-weight:700}.hljs-subst{font-weight:400}.hljs-class .hljs-title,.hljs-type{color:#458;font-weight:700}.hljs-attribute,.hljs-name,.hljs-tag{color:navy;font-weight:400}.hljs-link,.hljs-regexp{color:#009926}.hljs-bullet,.hljs-symbol{color:#990073}.hljs-built_in,.hljs-builtin-name{color:#0086b3}.hljs-meta{color:#999;font-weight:700}.hljs-deletion{background:#fdd}.hljs-addition{background:#dfd}.hljs-emphasis{font-style:italic}.hljs-strong{font-weight:700}";
    this.$refs.sdiv.appendChild(style);
    let styleline = document.createElement("style");
    styleline.innerHTML =
      'pre code{border:0;font-family:Consulas,"Courier New",Courier,mono,serif;font-size:12px;background:#eee!important;display:block;padding:1px;margin:0;font-weight:200;color:#333;white-space:pre-wrap}pre code ul{list-style:decimal;background-color:#fff;margin:0 0 0 40px!important;padding:0}pre code ul li{list-style:decimal-leading-zero;border-left:1px solid #ddd!important;background:#fff;padding:0 0 0 5px!important;margin:0!important;line-height:14px;word-break:break-all;word-wrap:break-word}pre code ul li:nth-of-type(even){background-color:#fcfcfc;color:inherit}';
    this.$refs.sdiv.appendChild(styleline);
    $(this.$refs.sdiv)
      .find("pre code")
      .each(function() {
        $(this).html(
          "<ul><li>" +
            $(this)
              .html()
              .replace(/\n$/, "")
              .replace(/\n/g, "\n</li><li>") +
            "\n</li></ul>"
        );
      });
  },
  props: {
    html: {
      type: String,
      default: ""
    },
    fontsize: {
      type: Number,
      default: 0.9
    }
  }
};
</script>