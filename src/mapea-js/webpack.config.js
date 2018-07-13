const path = require('path');
const webpack = require("webpack");
const env = process.env.NODE_ENV || "development";
// const MultiCSSPlugin = require("./multicssplugin");
// const CopyWebpackPlugin = require('copy-webpack-plugin')


let plugins = [];
let devServer = {};
let devtool;
if (env === "development") {
  let HotModuleReplacementPlugin = new webpack.HotModuleReplacementPlugin();
  plugins.push(HotModuleReplacementPlugin);
  devServer = {
    hot: true,
    open: true,
    watchOptions: {
      poll: 1000
    }
  }
  devtool = "eval-source-map";
}


module.exports = {
  mode: env, // "production" | "development" | "none"
  // Chosen mode tells webpack to use its built-in optimizations accordingly.
  entry: {
    // "mapea.l.min": "src/impl/leaflet/js/map/map.js",
    "mapea.ol.min": path.resolve(__dirname, "src/impl/ol/js/Map.js")
  },
  output: {
    // options related to how webpack emits results
    path: path.resolve(__dirname, "dist/core/js"), // string
    // the target directory for all output files
    // must be an absolute path (use the Node.js path module)
    filename: "[name].js", // string
    // the filename template for entry chunks
    // publicPath: "/assets", // string
    // the url to the output directory resolved relative to the HTML page
    // library: "M", // string,
    // the name of the exported library
    // libraryTarget: "this", // universal module definition
    // the type of the exported library
    /* Advanced output configuration (click to show) */
  },
  resolve: {
    alias: {
      handlebars: 'handlebars/dist/handlebars.min.js',
      templates: path.resolve(__dirname, 'src/templates'),
      assets: path.resolve(__dirname, 'src/assets'),
      facade: path.resolve(__dirname, 'src/facade'),
      impl: path.resolve(__dirname, "src/impl"),
      configuration: path.resolve(__dirname, "test/configuration_filtered")
    },
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ['@babel/preset-env'],
            plugins: ["@babel/plugin-proposal-export-default-from"]
          }
        }
      }, {
        test: /\.js$/,
        loader: 'eslint-loader',
        exclude: /node_modules/
    },
      {
        test: [/\.hbs$/, /\.html$/],
        loader: "html-loader",
        exclude: /node_modules/
      }],
  },
  plugins: [...plugins],
  devServer: devServer,
  devtool: devtool,
  externals: {
    ol: "ol",
    leaflet: "L"
  }
}