const webpack = require("webpack")
const path = require("path")
const { CleanWebpackPlugin } = require("clean-webpack-plugin")
const CopyWebpackPlugin = require("copy-webpack-plugin")

const rootPath = path.join(__dirname, "./..")

const options = {
  entry: {
    content: `${rootPath}/src/js/censor.js`,
    background: `${rootPath}/src/js/background.js`,
  },
  output: {
    path: `${rootPath}/build`,
    filename: "[name].js",
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },
    ],
  },
  plugins: [
    new CleanWebpackPlugin(), // Clean `build/` between webpack runs
    // TODO: Fix --watch mode issue with suggestion from https://github.com/webpack-contrib/copy-webpack-plugin/issues/252#issuecomment-427322809
    new CopyWebpackPlugin([
      // Copy static assets into `build/`
      {
        from: "manifest.json",
        // Use the package.json to populate the manifest.json
        transform: function(content, _path) {
          return Buffer.from(
            JSON.stringify({
              description: process.env.npm_package_description,
              version: process.env.npm_package_version,
              ...JSON.parse(content.toString()),
            })
          )
        },
        context: `${rootPath}/src/`,
      },
      { from: "css/*", to: `${rootPath}/build`, context: `${rootPath}/src/` },
      {
        from: "icons/*.png",
        to: `${rootPath}/build`,
        context: `${rootPath}/src/`,
      },
    ]),
  ],
}

module.exports = options
