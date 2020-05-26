module.exports = {
  root: true,
  env: {
    browser: true,
    commonjs: true,
    es6: true,
    jquery: true,
    node: true,
  },
  extends: ["plugin:vue/recommended", "eslint:recommended", "@vue/prettier"],
  parserOptions: {
    parser: "babel-eslint",
  },
  rules: {
    "prettier/prettier": "warn",
    "vue/component-tags-order": [
      "warn",
      {
        order: ["template", "script", "style", "i18n"],
      },
    ],
    "vue/no-v-html": "off",
  },
};
