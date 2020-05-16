const fs = require("fs");
const path = require("path");
const loaderUtils = require("loader-utils");
const merge = require("webpack-merge");

module.exports = function(source) {
  const params = loaderUtils.parseQuery(this.resourceQuery);
  const folder = getFolderParam(params);
  if (folder) {
    source = loadi18n(this.resourcePath, source, folder);
  }
  return source || {};
};

function getFolderParam(params) {
  for (var p in params) {
    if (Object.prototype.hasOwnProperty.call(params, p) && p.toLowerCase() === "folder") {
      return params[p];
    }
  }
  return null;
}

function loadi18n(cpath, source, folder) {
  let jsonSource = JSON.parse(source.replace(/(^\s*)|(\s*$)/g, "") || "{}");
  const i18nDir = path.resolve("./i18n/patchyvideo-vue");
  fs.readdirSync(i18nDir).forEach((file) => {
    let srcFile;
    if (folder !== true) {
      srcFile = path.resolve(i18nDir, file, folder).replace(/\.vue$/, ".json");
    } else {
      srcFile = path.resolve(i18nDir, file, path.relative("./", cpath)).replace(/\.vue$/, ".json");
    }
    if (!fs.existsSync(srcFile)) return;
    const srcContents = fs.readFileSync(srcFile).toString();
    jsonSource = merge(jsonSource, {
      [path.basename(file)]: JSON.parse(srcContents),
    });
  });
  return JSON.stringify(jsonSource);
}
