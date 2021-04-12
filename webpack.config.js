// Env & version
const isProduction = process.env.NODE_ENV == "production";
const version = require("./package.json").version;
const _ = require("lodash");

// Plugins
const webpack = require("webpack");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const autoprefixer = require("autoprefixer");
const colorFunction = require("postcss-color-function");
const precss = require("precss");
const HtmlWebpackPlugin = require("html-webpack-plugin");

// Pages
const pages = ["index"];

module.exports = {
  context: __dirname + "/src",
  entry: _(pages)
    .keyBy()
    .mapValues((p) => `/pages/${p}/${p}.jsx`)
    .value(),
  mode: isProduction ? "production" : "development",
  output: {
    path: __dirname + "/assets",
    filename: `[name]-${version}.js`,
    publicPath: ""
  },
  module: {
    rules: [
      {
        test: /\.s?css$/,
        use: [
          MiniCssExtractPlugin.loader,
          { loader: "css-loader", options: { importLoaders: 1 } },
          {
            loader: "postcss-loader",
            options: {
              postcssOptions: {
                plugins: [
                  [
                    "postcss-import",
                    {
                      path: [__dirname + "/src/styles"]
                    }
                  ],
                  precss,
                  colorFunction,
                  autoprefixer
                ]
              }
            }
          }
        ]
      },
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: [["@babel/preset-env", { targets: "defaults" }], "@babel/preset-react"],
            plugins: [["@babel/plugin-proposal-class-properties", { loose: true }]]
          }
        }
      },
      {
        test: /\.svg$/,
        loader: "react-svg-loader"
      },
      {
        test: /\.html$/,
        loader: "html-loader"
      }
    ]
  },
  resolve: {
    extensions: [".js", ".jsx"]
  },
  devtool: isProduction ? "nosources-source-map" : "cheap-module-source-map",
  plugins: [
    new webpack.ProvidePlugin({
      _: "lodash",
      React: "react",
      ReactDOM: "react-dom",
      useReducer: ["react", "useReducer"],
      useState: ["react", "useState"],
      useEffect: ["react", "useEffect"],
      useRef: ["react", "useRef"]
    }),
    ...pages.map(() => new HtmlWebpackPlugin()),
    ...pages.map(() => new MiniCssExtractPlugin({ filename: `[name]-${version}.css` }))
  ],
  watchOptions: { ignored: ["node_modules/**"] }
};
