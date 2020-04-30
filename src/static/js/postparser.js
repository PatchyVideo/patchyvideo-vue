// parsers
// HTML
// const htmle = import("html-entities").XmlEntities;
// const parserHTML = new htmle();
// markdown
import MarkdownIt from "markdown-it";
import MarkdownPluginSub from "markdown-it-sub";
import MarkdownPluginSup from "markdown-it-sup";
import MarkdownPluginFootnote from "markdown-it-footnote";
import MarkdownPluginDeflist from "markdown-it-deflist";
import MarkdownPluginAbbr from "markdown-it-abbr";
import MarkdownPluginContainer from "markdown-it-container";
import MarkdownPluginIns from "markdown-it-ins";
import MarkdownPluginMark from "markdown-it-mark";
const parserMarkdownPlugins = {
  sub: MarkdownPluginSub,
  sup: MarkdownPluginSup,
  footnote: MarkdownPluginFootnote,
  deflist: MarkdownPluginDeflist,
  abbr: MarkdownPluginAbbr,
  container: MarkdownPluginContainer,
  ins: MarkdownPluginIns,
  mark: MarkdownPluginMark,
};
}
import hljs from "highlight.js";
// utils
import { ParseFace, ParseEmoji } from "./comment";

function parse(text) {
  const head = text.match(/^\[\[((?:[\w-]+:"[^"]+" *)*)\]\]\s*/); // 匹配全局属性
  let renderText = text;
  if (head) {
    // 渲染全局属性
    const data = getData(" " + head[1]);
    renderText = text.slice(head[0].length);
    renderText = queryData("document", data, renderText);
    if (data.parser) {
      // 已指定解析器则直接返回解析器的解析
      renderText = renderText.text
        .replace(/\[\[\{renderd\}\]\]\n?/, "")
        .replace("[[{/renderd}]]", "")
        .replace(/&(amp;)*_dl;/g, "[[")
        .replace(/&(amp;)*_dr;/g, "]]");
      return renderText;
    }
  }
  try {
    let stack = [];
    renderText = parserChunk(renderText, stack, 0); // 渲染
  } catch (e) {
    throw readError(e, text);
  }
  let t = renderText.text;
  renderText = "";
  while (t.match(/\[\[\{renderd\}\]\]/)) {
    t = t.match(/^([\S\s]*?)\n?\[\[\{renderd\}\]\]([\S\s]*)/);
    renderText += t[1].replace(/\n/g, "<br />\n");
    while (
      t[2].match(/\[\[\{renderd\}\]\]/) &&
      t[2].match(/\[\[\{\/renderd\}\]\]/).index >
        t[2].match(/\[\[\{renderd\}\]\]/).index
    ) {
      t[2] = t[2].replace(
        /\[\[\{renderd\}\]\]([\S\s]*?)\[\[\{\/renderd\}\]\]/,
        "$1"
      );
    }
    t = t[2].match(/([\S\s]*?)\[\[\{\/renderd\}\]\]\n?([\S\s]*)/);
    renderText += t[1];
    t = t[2];
  }
  renderText += t.replace(/\n/g, "<br />\n");
  renderText = renderText
    .replace(/&(amp;)*_dl;/g, "[[")
    .replace(/&(amp;)*_dr;/g, "]]"); // 转义
  return renderText;
}

function parserChunk(text, stack, aindex) {
  // [[chunk parser:"markdown" markdown-plugin:"subscript superscript"]]www[[/chunk]]
  const chunkT = text.match(/\[\[(\w+)((?: +[\w-]+:"[^"]+")*)\]\]\s*/);
  // chunkT = {
  //   0: '[[chunk parser:"markdown" markdown-plugin:"subscript superscript"]]',
  //   1: 'chunk',
  //   2: ' parser:"markdown" markdown-plugin:"subscript superscript"',
  //   index: 0
  // }
  if (!chunkT) return { l: text.length, text };

  const chunkSize = chunkT[0].length;
  // 67
  // [[chunk parser:"markdown" markdown-plugin:"subscript superscript"]]www[[/chunk]]
  // ^-----------------------------------------------------------------^
  const data = getData(chunkT[2]);
  // data = {
  //   parser: "markdown",
  //   "markdown-plugin": "subscript superscript"
  // }
  const stackC = stack.push({
    type: chunkT[1],
    index: aindex + chunkT.index - 1,
    indexT: aindex + chunkT.index + chunkSize,
    data: data || {},
  });

  const chunkLE = text.match(/\[\[\/(\w+)\]\]/);
  // 70
  // [[chunk parser:"markdown" markdown-plugin:"subscript superscript"]]www[[/chunk]]
  //                                                                       ^
  if (!chunkLE) throw genError("Unclosed tag.", stack);
  if (chunkT.index > chunkLE.index) {
    stack.pop();
    return { l: chunkLE.index, text };
  }

  let textT = text.slice(chunkT.index + chunkSize);
  // www[[/chunk]]
  // [[chunk parser:"markdown" markdown-plugin:"subscript superscript"]]www[[/chunk]]
  //                                                                    >
  const textE = parserChunk(textT, stack, aindex + chunkT.index + chunkSize);
  if (stackC != stack.length) throw genError("Unexpected end of chunk.", stack);
  // will return with 'www[[/chunk]]' because of no chunks inside
  const chunkE = textE.text.match(
    RegExp("\\s*\\[\\[\\/(" + chunkT[1] + ")\\]\\]")
  );
  // 3
  // www[[/chunk]]
  //    ^
  if (!chunkE) throw genError("Unclosed tag.", stack);
  let content = textE.text.slice(0, chunkE.index);
  // www
  // www[[/chunk]]
  //   <
  content = queryData(chunkT[1], data, content, stack);
  if (!content.b) {
    stack.pop();
    text =
      text.slice(0, chunkT.index + chunkSize) +
      textE.text.slice(0, chunkE.index) +
      chunkE[0];
    const t = parserChunk(
      textE.text.slice(chunkE.index + chunkE[0].length),
      stack,
      aindex + chunkT.index + chunkSize + textE.l + chunkE[0].length
    );
    return {
      l: chunkT.index + chunkSize + textE.l + chunkE[0].length + t.l,
      text: text + t.text,
    };
  }
  // <p>www</p>\n
  let textB = text.slice(0, chunkT.index);
  // empty
  textB += content.text;
  // <p>www</p>\n
  stack.pop();
  const t = parserChunk(
    textE.text.slice(chunkE.index + chunkE[0].length),
    stack,
    aindex + chunkT.index + chunkSize + textE.l + chunkE[0].length
  );
  return {
    l: chunkT.index + chunkSize + textE.l + chunkE[0].length + t.l,
    text: textB + t.text,
  };
}

function genError(e, stack) {
  if (!stack) return new Error(JSON.stringify({ e: e.toString() }));
  return new Error(JSON.stringify({ e: e.toString(), stack }));
}

function readError(e, text) {
  let d = {};
  try {
    d = JSON.parse(e.message);
  } catch (e2) {
    return e;
  }
  if (!d) return e;
  if (!d.stack) return new Error(d.e);
  let msg = d.e + "\n";
  // 绘制指针
  const sc = d.stack[d.stack.length - 1];
  const p = getTextPosition(sc.index, text);
  const texta = text.split("\n");
  msg += "Line " + p.l + ":\n  " + texta[p.l] + "\n";
  for (let t = 0; t < p.r; t++) msg += " ";
  msg += "->|";
  for (let t = 0; t < sc.indexT - sc.index - 3; t++) msg += "-";
  msg += "|<-\n";
  // 输出堆栈
  // msg += "[[{STACK}]]\n";
  for (let i = 1; i <= 5 && i <= d.stack.length; i++) {
    const sc = d.stack[d.stack.length - i];
    const p = getTextPosition(sc.index, text);
    msg += "    at " + sc.type + ":" + p.l + ":" + p.r + "\n";
  }
  // msg += "[[{/STACK}]]";
  return new Error(msg);
}

function getTextPosition(index, text) {
  let l = 0;
  let r = 0;
  if (index > text.length) return { l: index, r: 0 };
  for (const i in text) {
    if (i == index) return { l, r };
    if (text[i] === "\n") {
      l++;
      r = 0;
    } else {
      r++;
    }
  }
}

function getData(text) {
  const data = [...text.matchAll(/([\w-]+):"([^"]+)"/g)];
  const b = {};
  data.forEach((value) => {
    b[value[1]] = value[2];
  });
  return b;
}

function queryData(type, data, text, stack) {
  data = data || {};
  let b = false;
  if (data["p-after"]) return text;
  switch (type) {
    case "document":
    case "chunk": {
      let parsed = false;
      for (let i in stack) {
        if (
          stack.type == "chunk" &&
          stack.data &&
          stack.data.parser &&
          stack.data.parser !== "default"
        ) {
          parsed = true;
          b = true;
          break;
        }
      }
      for (let i in data) {
        switch (i) {
          case "parser":
            if (parsed) continue;
            parsed = true;
            text = parser(data[i], data, text);
        }
      }
      b = true;
      break;
    }
    case "strong":
    case "em":
    case "s": {
      text = "<" + type + ">" + text + "</" + type + ">";
      b = true;
      break;
    }
    case "h1":
    case "h2":
    case "h3":
    case "h4":
    case "h5":
    case "h6": {
      text =
        "[[{renderd}]]\n<" +
        type +
        ">" +
        text +
        "</" +
        type +
        ">\n[[{/renderd}]]";
      b = true;
      break;
    }
    case "link": {
      if (!data.href) break;
      text = '<a href="' + data.href + '">' + text + "</a>";
      b = true;
      break;
    }
    case "face": {
      const face = ParseFace(data.name);
      text = face
        ? `[[{renderd}]]\n<img src='${face}' />\n[[{/renderd}]]`
        : data.name;
      b = true;
      break;
    }
    case "emoji": {
      const emoji = ParseEmoji(data.name);
      text = emoji ? emoji : data.name;
      b = true;
      break;
    }
  }
  return { b, text };
}

function parser(type, dataList, text) {
  switch (type) {
    case "markdown":
      let parserMarkdown = new MarkdownIt({
        highlight: function(str, lang) {
          if (lang && hljs.getLanguage(lang)) {
            try {
              return hljs.highlight(lang, str).value;
            } catch (__) {}
          }
          return ""; // use external default escaping
        },
      });
      if (dataList["markdown-plugin"]) {
        dataList["markdown-plugin"].split(" ").forEach((value) => {
          if (parserMarkdownPlugins[value])
            parserMarkdown = parserMarkdown.use(parserMarkdownPlugins[value]);
        });
      }
      let b = text
        .replace(/&(amp;)*_dl;/g, "[[")
        .replace(/&(amp;)*_dr;/g, "]]");
      b = parserMarkdown.render(b);
      b =
        "[[{renderd}]]" +
        b.replace(/\[\[\[/g, "&_dl;").replace(/\]\]/g, "&_dr;") +
        "[[{/renderd}]]";
      return b;
  }
}

export { parse };
