var faceslist = {
    呵呵: "paopao/i_f01.gif",
    哈哈: "paopao/i_f02.gif",
    //哈哈: "paopao/i_f03.gif",
    //哈哈: "paopao/i_f04.gif",
    //哈哈: "paopao/i_f05.gif",
    //哈哈: "paopao/i_f06.gif",
    //哈哈: "paopao/i_f07.gif",
    //哈哈: "paopao/i_f08.gif",
    //哈哈: "paopao/i_f09.gif",
    //哈哈: "paopao/i_f10.gif",
    //哈哈: "paopao/i_f11.gif",
    //哈哈: "paopao/i_f12.gif",
    //哈哈: "paopao/i_f13.gif",
    //哈哈: "paopao/i_f14.gif",
    //哈哈: "paopao/i_f15.gif",
    //哈哈: "paopao/i_f16.gif",
    //哈哈: "paopao/i_f17.gif",
    //哈哈: "paopao/i_f18.gif",
    //哈哈: "paopao/i_f19.gif",
    //哈哈: "paopao/i_f20.gif",
    //哈哈: "paopao/i_f21.gif",
    //哈哈: "paopao/i_f22.gif",
    //哈哈: "paopao/i_f23.gif",
    //哈哈: "paopao/i_f24.gif",
    //哈哈: "paopao/i_f25.gif",
    //哈哈: "paopao/i_f26.gif",
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
    //钱币: "paopao/i_f42.gif",
    //钱币: "paopao/i_f43.gif",
    //钱币: "paopao/i_f44.gif",
    //钱币: "paopao/i_f45.gif",
    //钱币: "paopao/i_f46.gif",
    //钱币: "paopao/i_f47.gif",
    //钱币: "paopao/i_f48.gif",
    //钱币: "paopao/i_f49.gif",
    //钱币: "paopao/i_f50.gif",
};

var emojislist = {
    好: "👌",
    哈哈: "😄",
    无奈:"😔",
    害怕:"😰",
    笑哭:"😂",
    高兴:"😃",
    微笑:"🙂"
}

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

function ParseComment(content) {
    var match = content.match(/((?<=\[\[)[^\(\]\]]+)/g);
    if (match) {
        match.forEach(v => {
            var kv = v.split(":");
            if (kv.length <= 1) return;
            var action = kv[0];
            var value = kv[1];
            var newvalue = "";
            switch (action) {
                case "表情":
                    var face = ParseFace(value);
              /*      newvalue = (face) ? `<img src='${face}' />` : v;*/
                    newvalue = face;
                    break;
                case "emoji":
                    var emoji = ParseEmoji(value);
                    newvalue = (emoji) ? emoji : v;
                    break;
                default:
                    newvalue = v;
                    break;
            }
            content = content.replace(`[[${v}]]`, newvalue);
        });
    }
    return content;
}

export { ParseFace, ParseComment,faceslist };