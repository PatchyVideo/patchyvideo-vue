module.exports = {
  plugins: [
    // Doc: https://github.com/postcss/autoprefixer#readme
    require("autoprefixer"),
    // Doc: https://github.com/postcss/postcss-import#readme
    require("postcss-import"),
    // Doc: https://github.com/postcss/postcss-nested#readme
    require("postcss-nested"),
    // Doc: https://tailwindcss.com/
    require("tailwindcss"),
  ],
  preset: {
    stage: 1, // see https://tailwindcss.com/docs/using-with-preprocessors#future-css-featuress
  },
};
