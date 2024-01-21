const autoprefixer = require("autoprefixer");
const postcssPresetEnv = require("postcss-preset-env");

module.exports = {
  plugins: [
    autoprefixer,
    postcssPresetEnv({
      browsers: ["> 0.2% and not dead"],
    }),
  ],
};
