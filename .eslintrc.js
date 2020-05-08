module.exports = {
  root: true,
  env: {
    browser: true,
    commonjs: true,
    es6: true,
    jquery: true,
    node: true
  },
  extends: ["plugin:vue/essential", "eslint:recommended", "@vue/prettier"],
  parserOptions: {
    parser: "babel-eslint"
  },
  rules: {
    "prettier/prettier": "warn"
  }
};
