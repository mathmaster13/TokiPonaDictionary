const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const fs = require('fs');
const CopyPlugin = require('copy-webpack-plugin');

const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const HTMLInlineCSSWebpackPlugin = require("html-inline-css-webpack-plugin").default;

module.exports = {
  devServer: {
    contentBase: path.join(__dirname, 'dist'),
    port: 9000,
  },
  entry: './src/main.js',
  output: {
    filename: 'app.js',
    path: path.resolve(__dirname, 'dist'),
  },
  plugins: [
    // Clear dist folder
    new CleanWebpackPlugin(),
    // Handle HTML output
    new HtmlWebpackPlugin({
      template: 'src/index.pug',
      templateParameters: {
        'dictionary': JSON.parse(fs.readFileSync('src/data/toki_pona_dictionary.json')),
      },
      minify: {
        collapseBooleanAttributes: true,
        collapseInlineTagWhitespace: true,
        collapseWhitespace: true,
        html5: true,
        includeAutoGeneratedTags: false,
        keepClosingSlash: false,
        preserveLineBreaks: false,
        removeAttributeQuotes: true,
        removeComments: true,
        removeOptionalTags: false,
        removeRedundantAttributes: true,
        removeScriptTypeAttributes: true,
        removeStyleLinkTypeAttributes: true,
        useShortDoctype: true,
      },
    }),
    // Static assets like images
    new CopyPlugin({
      patterns: [
        { from: 'src/assets', to: 'assets' },
      ],
    }),
    new MiniCssExtractPlugin({
      // filename: 'styles.css',
      filename: "[name].css",
      chunkFilename: "[id].css"
    }),
    new HTMLInlineCSSWebpackPlugin(),
  ],
  module: {
    rules: [
      // CSS
      {
        include: path.resolve(__dirname, 'src'),
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader'],
      },
      // Fonts
      {
        test: /\.woff$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[ext]',
              outputPath: 'fonts/'
            }
          }
        ]
      },
      // Pug to HTML
      {
        include: path.resolve(__dirname, 'src'),
        test: /\.pug$/,
        use: ['pug-loader'],
      }
    ],
  },
  optimization: {
    minimize: true,
    minimizer: [
      new CssMinimizerPlugin(),
    ],
  },
};
