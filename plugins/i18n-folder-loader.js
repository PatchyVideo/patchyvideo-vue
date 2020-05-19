const fs = require("fs");
const path = require("path");
const loaderUtils = require("loader-utils");
const _ = require("lodash");

module.exports = function(source) {
  let i18nj = { ...loadi18nc() };
  const params = loaderUtils.parseQuery(this.resourceQuery);
  const folder = getParam(params, "folder");
  if (folder) i18nj = _.merge(i18nj, loadi18n(this.resourcePath, source, folder, this));
  if (getParam(params, "global")) i18nj = _.merge({ _global: alli18n() }, i18nj);
  return JSON.stringify(i18nj);
};

function getParam(params, key) {
  for (var p in params) {
    if (Object.prototype.hasOwnProperty.call(params, p) && p.toLowerCase() === key) {
      return params[p];
    }
  }
  return null;
}

function loadi18n(cpath, source, folder, that) {
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
    that.addDependency(srcFile);
    const srcContents = fs.readFileSync(srcFile).toString();
    jsonSource = _.merge(jsonSource, {
      [path.basename(file)]: JSON.parse(srcContents),
    });
  });
  return jsonSource;
}

function alli18n() {
  let i18nj = {};
  const i18nDir = path.resolve("./i18n/patchyvideo-vue");
  fs.readdirSync(i18nDir).forEach((file) => {
    const read = (file) => {
      fs.readdirSync(file).forEach((filename) => {
        const stats = fs.statSync(path.resolve(file, filename));
        if (stats.isFile()) {
          const filep = path.relative(i18nDir, path.resolve(file, filename));
          _.setWith(i18nj, filep.replace(/[/\\]/g, ".").replace(/.json$/, ""), JSON.parse(fs.readFileSync(path.resolve(file, filename)).toString()), Object);
        }
        if (stats.isDirectory()) {
          read(path.resolve(file, filename));
        }
      });
    };
    read(i18nDir, file);
  });
  return i18nj;
}

function loadi18nc() {
  let i18nj = {};
  const i18nDir = path.resolve("./i18n/patchyvideo-vue");
  fs.readdirSync(i18nDir).forEach((file) => {
    if (fs.existsSync(path.resolve(i18nDir, file, "common.json")))
      _.setWith(i18nj, file + "._common", JSON.parse(fs.readFileSync(path.resolve(i18nDir, file, "common.json")).toString()), Object);
  });
  return i18nj;
}
