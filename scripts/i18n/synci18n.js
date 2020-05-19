const fs = require("fs");
const path = require("path");
const _ = require("lodash");

function keycount(obj) {
  let count = 0;
  for (var i of Object.keys(obj)) {
    if (i && typeof i == "object") {
      count += keycount(i);
    } else {
      count++;
    }
  }
  return count;
}

module.exports = function(rl, nl) {
  let keys = 0;
  let rfiles = [];
  function filesP(filePath) {
    const _files = fs.readdirSync(filePath);
    _files.forEach((filename) => {
      const filedir = path.join(filePath, filename);
      const stats = fs.statSync(filedir);
      if (stats.isFile()) {
        rfiles.push(path.relative(".\\i18n\\patchyvideo-vue\\" + rl, filedir));
      }
      if (stats.isDirectory()) {
        filesP(filedir);
      }
    });
  }
  filesP(path.resolve(".\\i18n\\patchyvideo-vue", rl));
  if (rfiles.length == 0) return;
  function writeFileRecursive(path, buffer) {
    let lastPath = path.substring(0, path.lastIndexOf("\\"));
    fs.mkdirSync(lastPath, { recursive: true });
    fs.writeFileSync(path, buffer);
  }
  rfiles.forEach((v) => {
    const rfile = path.resolve(".\\i18n\\patchyvideo-vue", rl, v);
    const nfile = path.resolve(".\\i18n\\patchyvideo-vue", nl, v);
    let j = JSON.parse(fs.readFileSync(rfile).toString());
    if (fs.existsSync(nfile)) {
      const nj = JSON.parse(fs.readFileSync(nfile).toString());
      j = _.merge(j, nj);
      keys += keycount(j) - keycount(nj);
    }
    writeFileRecursive(nfile, JSON.stringify(j, null, 2));
  });
  console.log("done.(" + keys + " keys)");
};
