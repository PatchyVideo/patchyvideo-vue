const fs = require("fs");
const path = require("path");
const _ = require("lodash");
// const colors = require("colors/safe");

module.exports = function(...args) {
  let csv = `"key","${args.join('","')}" \r\n`;
  let i18n = {};
  for (const arg of args) {
    let rfiles = [];
    const filesP = (filePath) => {
      const _files = fs.readdirSync(filePath);
      _files.forEach((filename) => {
        const filedir = path.join(filePath, filename);
        const stats = fs.statSync(filedir);
        if (stats.isFile()) {
          rfiles.push(path.relative("./i18n/patchyvideo-vue/" + arg, filedir));
        }
        if (stats.isDirectory()) {
          filesP(filedir);
        }
      });
    };
    filesP(path.resolve("./i18n/patchyvideo-vue", arg));
    rfiles.forEach((file) => {
      const f = path.resolve("./i18n/patchyvideo-vue", arg, file);
      i18n[file] = i18n[file] || {};
      i18n[file][arg] = i18n[file][arg] || {};
      i18n[file][arg] = _.merge(i18n[file][arg], JSON.parse(fs.readFileSync(f).toString() || "{}"));
    });
  }
  for (const file in i18n) {
    csv += `"${file}",${_.join(Array(args.length), '"---file---",')}"---file---" \r\n`;
    let i18nks = [];
    let i18nc = {};
    for (const l in i18n[file]) {
      const i18nf = i18n[file][l];
      const getv = (a) => _.reduce(a, (res, val, key) => res.concat(_.isPlainObject(val) || _.isArray(val) ? getv(val).map((x) => key + "." + x) : [key]), []);
      getv(i18nf).forEach((k) => {
        i18nks.push(k);
        _.set(i18nc, `${l}.${k}`, _.get(i18nf, k));
      });
    }
    for (const k of i18nks) {
      csv +=
        `"${k.replace(/"/g, '""')}"` +
        _.reduce(
          args,
          (res, val) => {
            const c = _.get(i18nc, `${val}.${k}`);
            return `${res},"${_.isString(c) ? c.replace(/"/g, '""') : ""}"`;
          },
          ""
        ) +
        " \r\n";
    }
  }
  fs.writeFileSync(path.resolve("./i18n_export.csv"), csv);
  console.log(`done.(${path.resolve("./i18n_export.csv")})`);
};
