<template>
  <div ref="sdiv">
    <div v-html="html" :style="'all:initial;font-size:' + fontsize + 'rem;'"></div>
  </div>
</template>

<script>
export default {
  mounted() {
    let style = document.createElement("style");
    style.innerHTML =
      ".hljs{display:block;overflow-x:auto;padding:.5em;color:#383a42;background:#fafafa}.hljs-comment,.hljs-quote{color:#a0a1a7;font-style:italic}.hljs-doctag,.hljs-formula,.hljs-keyword{color:#a626a4}.hljs-deletion,.hljs-name,.hljs-section,.hljs-selector-tag,.hljs-subst{color:#e45649}.hljs-literal{color:#0184bb}.hljs-addition,.hljs-attribute,.hljs-meta-string,.hljs-regexp,.hljs-string{color:#50a14f}.hljs-built_in,.hljs-class .hljs-title{color:#c18401}.hljs-attr,.hljs-number,.hljs-selector-attr,.hljs-selector-class,.hljs-selector-pseudo,.hljs-template-variable,.hljs-type,.hljs-variable{color:#986801}.hljs-bullet,.hljs-link,.hljs-meta,.hljs-selector-id,.hljs-symbol,.hljs-title{color:#4078f2}.hljs-emphasis{font-style:italic}.hljs-strong{font-weight:700}.hljs-link{text-decoration:underline}";
    this.$refs.sdiv.appendChild(style);
    let styleline = document.createElement("style");
    styleline.innerHTML =
      'pre code{border:0;font-family:Consulas,"Courier New",Courier,mono,serif;font-size:12px;background:#eee!important;display:block;padding:1px;margin:0;font-weight:200;color:#333;white-space:pre-wrap}pre code ul{list-style:decimal;background-color:#fff;margin:0 0 0 40px!important;padding:0}pre code ul li{list-style:decimal-leading-zero;border-left:1px solid #ddd!important;background:#fff;padding:0 0 0 5px!important;margin:0!important;line-height:14px;word-break:break-all;word-wrap:break-word}pre code ul li:nth-of-type(even){background-color:#fcfcfc;color:inherit}';
    this.$refs.sdiv.appendChild(styleline);
    let stylef = document.createElement("style");
    stylef.innerHTML = "h1,h2,h3,h4,h5,h6,p{padding:0;margin:0;}pre{padding:0;margin:4px 0;}ul{margin:0;padding-inline-start:24px}";
    this.$refs.sdiv.appendChild(stylef);
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
