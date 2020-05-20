const fs = require("fs");
const path = require("path");
const _ = require("lodash");
const colors = require("colors/safe");

module.exports = function(rl, nl) {
  let keys = 0;
  const bdiff = (a, b) =>
    _.reduce(
      a,
      (res, val, key) =>
        res.concat(
          (_.isPlainObject(val) || _.isArray(val)) && b
            ? bdiff(val, b[key]).map((x) => key + "." + x)
            : !b || !val || !b[key]
            ? typeof val == "object"
              ? bdiff(val, {}).map((x) => key + "." + x)
              : [key]
            : b && typeof b[key] == "object"
            ? bdiff({}, b[key]).map((x) => key + "." + x)
            : []
        ),
      []
    );
  let rfiles = [];
  function filesP(filePath) {
    const _files = fs.readdirSync(filePath);
    _files.forEach((filename) => {
      const filedir = path.join(filePath, filename);
      const stats = fs.statSync(filedir);
      if (stats.isFile()) {
        rfiles.push(path.relative("./i18n/patchyvideo-vue/" + rl, filedir));
      }
      if (stats.isDirectory()) {
        filesP(filedir);
      }
    });
  }
  filesP(path.resolve("./i18n/patchyvideo-vue", rl));
  let nfiles = [];
  function filesN(filePath) {
    const _files = fs.readdirSync(filePath);
    _files.forEach((filename) => {
      const filedir = path.join(filePath, filename);
      const stats = fs.statSync(filedir);
      if (stats.isFile()) {
        nfiles.push(path.relative("./i18n/patchyvideo-vue/" + rl, filedir));
      }
      if (stats.isDirectory()) {
        filesP(filedir);
      }
    });
  }
  filesN(path.resolve("./i18n/patchyvideo-vue", nl));
  if (rfiles.length == 0) return;
  let d = {};
  const map = (arr, data) => arr.map((x) => colors.yellow(x) + " " + colors.gray("(" + JSON.stringify(_.get(data, x)) + ")"));
  [...rfiles, ...nfiles].forEach((v) => {
    const rfile = path.resolve("./i18n/patchyvideo-vue", rl, v);
    const nfile = path.resolve("./i18n/patchyvideo-vue", nl, v);
    if (!fs.existsSync(rfile)) {
      const nj = JSON.parse(fs.readFileSync(nfile).toString());
      d[v] = {
        n: map(bdiff(nj, {}), nj),
      };
    }
    let j = JSON.parse(fs.readFileSync(rfile).toString());
    if (fs.existsSync(nfile)) {
      const nj = JSON.parse(fs.readFileSync(nfile).toString());
      const r = bdiff(j, nj);
      const n = bdiff(nj, j);
      d[v] = {
        r: map(
          r.filter((x) => !n.includes(x)),
          j
        ),
        n: map(
          n.filter((x) => !r.includes(x)),
          nj
        ),
      };
    } else {
      d[v] = {
        r: map(bdiff(j, {}), j),
      };
    }
    keys += (d[v].r ? d[v].r.length : 0) + (d[v].n ? d[v].n.length : 0);
  });
  for (const v in d) {
    const rle = d[v].r ? d[v].r.length : 0;
    const nle = d[v].n ? d[v].n.length : 0;
    if (rle + nle > 0) {
      console.log(colors.magenta(v + " (" + rle + " + " + nle + " = " + (rle + nle) + " keys):"));
      d[v].r && d[v].r.forEach((v) => console.log("  " + colors.green(rl + " -> " + nl) + " : " + v));
      d[v].n && d[v].n.forEach((v) => console.log("  " + colors.blue(rl + " <- " + nl) + " : " + v));
    }
  }
  console.log("done.(" + keys + " keys)");
};
