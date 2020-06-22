import { XmlEntities as htmle } from "html-entities";
const parserHTML = new htmle();

let faceslist = {
  呵呵: "paopao/i_f01.gif",
  哈哈: "paopao/i_f02.gif",
  吐舌: "paopao/i_f03.gif",
  啊: "paopao/i_f04.gif",
  酷: "paopao/i_f05.gif",
  怒: "paopao/i_f06.gif",
  开心: "paopao/i_f07.gif",
  汗: "paopao/i_f08.gif",
  泪: "paopao/i_f09.gif",
  黑线: "paopao/i_f10.gif",
  鄙视: "paopao/i_f11.gif",
  不高兴: "paopao/i_f12.gif",
  真棒: "paopao/i_f13.gif",
  钱: "paopao/i_f14.gif",
  疑问: "paopao/i_f15.gif",
  阴险: "paopao/i_f16.gif",
  吐: "paopao/i_f17.gif",
  咦: "paopao/i_f18.gif",
  委屈: "paopao/i_f19.gif",
  花心: "paopao/i_f20.gif",
  呼: "paopao/i_f21.gif",
  爱心: "paopao/i_f22.gif",
  心碎: "paopao/i_f23.gif",
  玫瑰: "paopao/i_f24.gif",
  礼物: "paopao/i_f25.gif",
  笑眼: "paopao/i_f26.gif",
  冷: "paopao/i_f27.gif",
  太开心: "paopao/i_f28.gif",
  滑稽: "paopao/i_f29.gif",
  勉强: "paopao/i_f30.gif",
  狂汗: "paopao/i_f31.gif",
  乖: "paopao/i_f32.gif",
  睡觉: "paopao/i_f33.gif",
  惊哭: "paopao/i_f34.gif",
  生气: "paopao/i_f35.gif",
  惊讶: "paopao/i_f36.gif",
  喷: "paopao/i_f37.gif",
  彩虹: "paopao/i_f38.gif",
  星星月亮: "paopao/i_f39.gif",
  太阳: "paopao/i_f40.gif",
  钱币: "paopao/i_f41.gif",
  灯泡: "paopao/i_f42.gif",
  茶杯: "paopao/i_f43.gif",
  蛋糕: "paopao/i_f44.gif",
  音乐: "paopao/i_f45.gif",
  haha: "paopao/i_f46.gif",
  胜利: "paopao/i_f47.gif",
  大拇指: "paopao/i_f48.gif",
  弱: "paopao/i_f49.gif",
  OK: "paopao/i_f50.gif",
};

let emojislist = {
  好: "👌",
  哈哈: "😄",
  无奈: "😔",
  害怕: "😰",
  笑哭: "😂",
  高兴: "😃",
  微笑: "🙂",
};

/*function ParseFace(faceName) {
    let face = faceslist.filter(v => {
        let tmp = Object.keys(v).filter(v2 => v2 == faceName);
        if (tmp && tmp.length > 0) return v;
        return null;
    });
    if (face && face.length > 0 && face[0][faceName]) {
        return require("../img/face/" + face[0][faceName]);
    }
    return "";
}*/

function ParseFace(faceName) {
  if (faceslist[faceName]) {
    return require("../img/face/" + faceslist[faceName]);
  }
  return "";
}

function ParseEmoji(emojiName) {
  if (emojislist[emojiName]) {
    return emojislist[emojiName];
  }
  return "";
}

/*function getFace() {
    //规定一排多少个
    let array = [];
    const MAXROW = 10;
    //读取face数据,转换成[{"呵呵":"src"},{}]格式
    for (let i = 0; i < faceslist.length; i++) {
        let tmparr = [];
        let faces = faceslist[i];
        for (let face in faces) {
            let obj = {};
            obj[face] = ParseFace(face);
            tmparr.push(obj);
        }
        array.push(tmparr);
    }

    let faces = [];
    for (let index = 0; index < faceslist.length; index++) {
        //计算最后一排个数
        let face = array[index];
        let faceRow = Math.ceil(face.length / MAXROW);
        let c = [];
        //转换成[[{"呵呵":"src"},{}],[]]格式
        for (let i = 0; i < faceRow; ++i) {
            c[i] = [];
            for (let m = i * MAXROW; m < i * MAXROW + MAXROW; ++m) {
                c[i].push(face[m]);
            }
        }
        faces.push(c);
    }
    console.log(faces);
    return faces;
}*/

function getFace() {
  //规定一排多少个
  let array = [];
  const MAXROW = 10;
  //读取face数据,转换成[{"呵呵":"src"},{}]格式
  for (let i in faceslist) {
    let obj = {};
    obj[i] = ParseFace(i);
    array.push(obj);
  }

  //计算最后一排个数
  let faceRow = Math.ceil(array.length / MAXROW);
  let c = [];
  //转换成[[{"呵呵":"src"},{}],[]]格式
  for (let i = 0; i < faceRow; ++i) {
    c[i] = [];
    for (let m = i * MAXROW; m < i * MAXROW + MAXROW; ++m) {
      c[i].push(array[m]);
    }
  }
  return c;
}

/*function getFace() {
    //[{1:{name:name,src:src},2:{name:name,src:src}},{1:{name:name,src:src},2:{name:name,src:src}}]
    let faces = [];
    const MAXROW = 10;
    //读取face数据,转换成[{name:"呵呵",src:"src"},{}]格式
    for (let i in faceslist) {
        let obj = { name: i, src: ParseFace(i) };
        faces.push(obj);
    }
    //计算最后一排个数
    let faceRow = Math.ceil(faces.length / MAXROW);
    let facesData = [];
    for (let i = 0; i < faceRow; i++) {
        let list = {};
        for (let j = i * MAXROW, k = 0; j < i * MAXROW + MAXROW; j++, k++) {
            list[k] = faces[j];
        }
        facesData.push(list);
    }
    //console.log(facesData);
    return facesData;
}*/

function getEmoji() {
  //规定一排多少个
  let array = [];
  const MAXROW = 10;
  //读取face数据,转换成[{"呵呵":"src"},{}]格式
  for (let i in emojislist) {
    let obj = {};
    obj[i] = ParseEmoji(i);
    array.push(obj);
  }

  //计算最后一排个数
  let faceRow = Math.ceil(array.length / MAXROW);
  let c = [];
  //转换成[[{"呵呵":"src"},{}],[]]格式
  for (let i = 0; i < faceRow; ++i) {
    c[i] = [];
    for (let m = i * MAXROW; m < i * MAXROW + MAXROW; ++m) {
      c[i].push(array[m]);
    }
  }
  return c;
}

function ParseCommentT(content) {
  content = content.replace(/\[\[\{[\w]+\}\]\]/g, ""); // 过滤渲染属性
  //let match = content.match(/((?<=\[\[)[^\(\]\]]+)/g);
  let match = content.match(/\[\[[^[\]]*\]\]/g);
  if (match) {
    match.forEach((v) => {
      v = v.replace(/\[\[/g, "").replace(/\]\]/g, "");
      let kv = v.split(":");
      if (kv.length <= 1) return;
      let action = kv[0];
      let value = kv[1];
      let newvalue = "";
      switch (action) {
        case "表情": {
          let face = ParseFace(value);
          newvalue = face ? `[[{html}]]<img src='${face}' />[[{/html}]]` : v;
          break;
        }
        case "emoji": {
          let emoji = ParseEmoji(value);
          newvalue = emoji ? emoji : v;
          break;
        }
        default: {
          newvalue = v;
          break;
        }
      }
      content = content.replace(`[[${v}]]`, newvalue);
    });
  }
  return content;
}

function en(con) {
  let t = con;
  con = "";
  while (t.match(/\[\[\{html\}\]\]/)) {
    t = t.match(/^([\S\s]*?)\[\[\{html\}\]\]([\S\s]*)/);
    con += parserHTML.encode(t[1]);
    while (t[2].match(/\[\[\{html\}\]\]/) && t[2].match(/\[\[\{\/html\}\]\]/).index > t[2].match(/\[\[\{html\}\]\]/).index) {
      t[2] = t[2].replace(/\[\[\{html\}\]\]([\S\s]*?)\[\[\{\/html\}\]\]/, "$1");
    }
    t = t[2].match(/([\S\s]*?)\[\[\{\/html\}\]\]([\S\s]*)/);
    con += t[1];
    t = t[2];
  }
  con += parserHTML.encode(t);
  return con;
}

function une(con) {
  return con.replace(/\[\[\{[\w]+\}\]\]/g, ""); // 过滤渲染属性
}

function ParseComment(con, un = false) {
  if (un) {
    return une(ParseCommentT(con));
  } else {
    return en(ParseCommentT(con));
  }
}

export { ParseFace, ParseEmoji, ParseComment, getFace, getEmoji };
