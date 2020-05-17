const fs = require("fs");
const path = require("path");
const merge = require("webpack-merge");

const args = process.argv.splice(2);
if (args.length != 2) return;

let rfiles = [];
function filesP(filePath) {
  const _files = fs.readdirSync(filePath);
  _files.forEach((filename) => {
    const filedir = path.join(filePath, filename);
    const stats = fs.statSync(filedir);
    if (stats.isFile()) {
      rfiles.push(path.relative(".\\i18n\\patchyvideo-vue\\" + args[0], filedir));
    }
    if (stats.isDirectory()) {
      filesP(filedir);
    }
  });
}
filesP(path.resolve(".\\i18n\\patchyvideo-vue", args[0]));
if (rfiles.length == 0) return;
function writeFileRecursive(path, buffer) {
  let lastPath = path.substring(0, path.lastIndexOf("\\"));
  fs.mkdirSync(lastPath, { recursive: true });
  fs.writeFileSync(path, buffer);
}
rfiles.forEach((v) => {
  const rfile = path.resolve(".\\i18n\\patchyvideo-vue", args[0], v);
  const nfile = path.resolve(".\\i18n\\patchyvideo-vue", args[1], v);
  let j = JSON.parse(fs.readFileSync(rfile).toString());
  if (fs.existsSync(nfile)) j = merge(j, JSON.parse(fs.readFileSync(nfile).toString()));
  writeFileRecursive(nfile, JSON.stringify(j, null, 2));
});
