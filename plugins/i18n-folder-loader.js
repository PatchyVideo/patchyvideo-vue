const fs = require("fs");
const path = require("path");
const loaderUtils = require("loader-utils");
const _ = require("lodash");

let reload = false;

module.exports = function(source) {
  let i18nj = {};
  if (!global.PVi18nJsonFileCache) loadJson();
  if (!global.PVi18nLoadedFiles) global.PVi18nLoadedFiles = [];
  reload = global.PVi18nLoadedFiles.indexOf(this.resourcePath) > -1;
  if (!reload) global.PVi18nLoadedFiles.push(this.resourcePath);
  const params = loaderUtils.parseQuery(this.resourceQuery);
  const folder = getParam(params, "folder");
  if (folder) i18nj = _.merge(i18nj, loadi18n(this.resourcePath, source, folder, this));
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

function loadJson() {
  global.PVi18nJsonFileCache = {};
  let nfiles = [];
  const filesN = (filePath) => {
    const _files = fs.readdirSync(filePath);
    _files.forEach((filename) => {
      const filedir = path.join(filePath, filename);
      const stats = fs.statSync(filedir);
      if (stats.isFile()) {
        nfiles.push(filedir);
      }
      if (stats.isDirectory()) {
        filesN(filedir);
      }
    });
  };
  filesN(path.resolve("./i18n/patchyvideo-vue"));
  nfiles.forEach((f) => {
    global.PVi18nJsonFileCache[f] = JSON.parse(fs.readFileSync(f).toString());
  });
}

function readJson(f) {
  if (reload) return JSON.parse(fs.readFileSync(f).toString());
  if (!global.PVi18nJsonFileCache[f]) global.PVi18nJsonFileCache[f] = JSON.parse(fs.readFileSync(f).toString());
  return global.PVi18nJsonFileCache[f];
}

function loadi18n(cpath, source, folder, that) {
  let jsonSource = JSON.parse(source.replace(/(^\s*)|(\s*$)/g, "") || "{}");
  const i18nDir = path.resolve("./i18n/patchyvideo-vue");
  fs.readdirSync(i18nDir).forEach((file) => {
    let srcFile;
    let loadedi18nusef = [];
    const loadi18nuse = (srcContents) => {
      if (srcContents.__i18n_use && _.isObject(srcContents.__i18n_use))
        for (const v in srcContents.__i18n_use) {
          const val = srcContents.__i18n_use[v];
          const f = v.startsWith("@/") ? path.resolve(i18nDir, file, v.slice(2)) : path.resolve(path.dirname(srcFile), v);
          if (loadedi18nusef.indexOf(f + ":" + val) > -1) continue;
          if (fs.existsSync(f)) {
            loadedi18nusef.push(f + ":" + val);
            const fj = loadi18nuse(readJson(f));
            if (fj.__i18n_rfuseby && _.isArray(fj.__i18n_rfuseby)) {
              let ct;
              for (const v of srcContents.__i18n_use) {
                const fl = v.startsWith("@/") ? path.resolve(i18nDir, file, v.slice(2)) : path.resolve(path.dirname(f), v);
                if (fl == srcFile) ct = true;
              }
              if (ct) continue;
            }
            const fj2 = val ? _.set({}, val, fj) : fj;
            jsonSource = _.merge(jsonSource, {
              [path.basename(file)]: fj2,
            });
          }
        }
      return srcContents;
    };
    if (folder !== true) {
      srcFile = path.resolve(i18nDir, file, folder).replace(/\.vue$/, ".json");
    } else {
      srcFile = path.resolve(i18nDir, file, path.relative("./", cpath)).replace(/\.vue$/, ".json");
    }
    let c = path.dirname(path.relative(i18nDir, srcFile));
    while (path.dirname(c) != c) {
      const f = path.resolve(i18nDir, c, "_common.json");
      if (fs.existsSync(f)) {
        that.addDependency(f);
        const fj = loadi18nuse(readJson(f));
        if (fj.__i18n_rfuseby && _.isArray(fj.__i18n_rfuseby)) {
          let ct;
          for (const v of srcContents.__i18n_use) {
            const fl = v.startsWith("@/") ? path.resolve(i18nDir, file, v.slice(2)) : path.resolve(path.dirname(f), v);
            if (fl == srcFile) ct = true;
          }
          if (ct) continue;
        }
        if (fj.__i18n_global) {
          jsonSource = _.merge(jsonSource, {
            [path.basename(file)]: fj,
          });
        } else {
          jsonSource = _.merge(jsonSource, {
            [path.basename(file)]: { _common: fj },
          });
        }
      }
      c = path.dirname(c);
    }
    if (!fs.existsSync(srcFile)) return;
    that.addDependency(srcFile);
    const srcContents = loadi18nuse(readJson(srcFile));
    jsonSource = _.merge(jsonSource, {
      [path.basename(file)]: srcContents,
    });
  });
  const fil = (obj) => {
    for (const i in obj) {
      if (i.startsWith("__i18n")) {
        delete obj[i];
        continue;
      }
      if (_.isObject(obj[i])) {
        obj[i] = fil(obj[i]);
      }
    }
    return obj;
  };
  jsonSource = fil(jsonSource);
  return jsonSource;
}
