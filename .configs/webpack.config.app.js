const path = require('path');
const webpack = require('webpack');

//Thanks to: https://taylor.callsen.me/using-webpack-5-and-sass-with-wordpress/

// css extraction and minification
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");

// clean out build dir in-between builds
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

new webpack.DefinePlugin({
  PRODUCTION: JSON.stringify(false),
 });
 
module.exports = {
  mode: "development", // | production
  watch: true,
  entry: {
    'main': [
      './src/accessibility-checker-app/index.js',
      //'./src/accessibility-checker-app/sass/accessibility-checker.scss',
      
    ]
  },

  module: {
    rules: [
      {
         test: /\.(js|jsx)$/,
         exclude: /node_modules/,
         use: ['babel-loader']
      },
      {
        //https://blog.logrocket.com/using-webpack-typescript/#webpack-loaders
        test: /\.(ts|tsx)$/,
        exclude: /node_modules/,
        use: ['ts-loader']
      },
      {
        test: /\.(s(a|c)ss)$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader']
      },
      // loader for images and icons (required if css references image files)
      {
        test: /\.(svg|png|jpg|gif)$/,
        type: 'asset/resource',
        generator: {
          filename: './img/[name][ext]',
        }
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js', '.jsx'],
  },
  plugins: [
    // clear out build directories on each build
    new CleanWebpackPlugin({
      cleanOnceBeforeBuildPatterns: [
        './build/*',
      ]
    }),
    // css extraction into dedicated file
    new MiniCssExtractPlugin({
      filename: './css/[name].css'
    }),
  ],
  optimization: {
    // minification - only performed when mode = production
    minimizer: [
      // js minification - special syntax enabling webpack 5 default terser-webpack-plugin 
      `...`,
      // css minification
      new CssMinimizerPlugin(),
    ]
  },

  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, './../build/accessibility-checker-app'),
  },

 
}