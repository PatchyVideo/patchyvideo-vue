const fs = require("fs");
const path = require("path");

let files = [];
function filesP(filePath) {
  const _files = fs.readdirSync(filePath);
  _files.forEach((filename) => {
    const filedir = path.join(filePath, filename);
    const stats = fs.statSync(filedir);
    if (stats.isFile()) {
      files.push(filedir);
    }
    if (stats.isDirectory()) {
      filesP(filedir);
    }
  });
}
filesP(path.resolve("./src"));
let vuefiles = [];
files.forEach((v) => {
  path.extname(v) == ".vue" && vuefiles.push(path.relative("./", v));
});

function writeFileRecursive(path, buffer) {
  let lastPath = path.substring(0, path.lastIndexOf("\\"));
  fs.mkdirSync(lastPath, { recursive: true });
  fs.writeFileSync(path, buffer);
}

vuefiles.forEach((v) => {
  let j = [
    ...fs
      .readFileSync("./" + v)
      .toString()
      .matchAll(/<i18n>([\S\s]*)<\/i18n>/g),
  ];
  if (j[0]) {
    let con = JSON.parse(j[0][1]);
    for (let c in con) {
      writeFileRecursive(".\\i18n\\patchyvideo-vue\\" + c + "\\" + v.replace(/.vue$/, ".json"), JSON.stringify(con[c], null, 2));
      fs.writeFileSync("./" + v, j[0].input.replace(/<i18n>([\S\s]*)<\/i18n>/g, "<i18n folder></i18n>"));
    }
  }
});

console.log("done.");
