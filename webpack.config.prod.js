const path = require('path');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

// main configuration object.
module.exports = {

  // Path to entry point
  entry: './src/javascript/index.js',

  // Path and filename of result bundle.
  output: {
    path: path.resolve(__dirname, 'dist'),
    publicPath: '',
    filename: 'bundle.js'
  },

  mode: 'production',
 
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      },
      {
        test: /\.(sa|sc|c)ss$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader
          },
          {
            loader: "css-loader",
          },
          {
            loader: "postcss-loader"
          },
          {
            loader: "sass-loader",
            options: {
              implementation: require("sass")
            }
          }
        ]
      },
      // {
      //   test: /\.(png|jpe?g|gif|svg)$/,
      //   use: [
      //     {
      //       loader: "file-loader",
      //       options: {
      //         outputPath: 'images'
      //       }
      //     }
      //   ]
      // },
      {
        test: /\.(woff|woff2|ttf|otf|eot|png|jpe?g|gif|svg)$/,
        type: 'asset/resource',
      }
    ],
  },
  plugins: [

    new MiniCssExtractPlugin({
      filename: "bundle.css"
    })

  ]

};


