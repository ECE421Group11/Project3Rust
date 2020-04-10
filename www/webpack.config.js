const CopyWebpackPlugin = require("copy-webpack-plugin");
const path = require('path');

module.exports = {
  entry: "./bootstrap.js",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "bootstrap.js",
  },
  entry: "./handler-connect4human.js",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "handler-connect4human.js",
  },
  mode: "development",
  plugins: [
    new CopyWebpackPlugin(['index.html'])
  ],
};
