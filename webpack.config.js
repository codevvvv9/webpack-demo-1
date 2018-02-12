const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin')

module.exports = {
  entry: './src/js/app.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist/js/')
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['env']
          }
        }
      },
      {
  	    test: /\.scss$/,
  	    use: [{
  	        loader: "style-loader" // creates style nodes from JS strings
        }, {
  	        loader: "css-loader" // translates CSS into CommonJS
        }, {
  	        loader: "sass-loader" // compiles Sass to CSS
        }]
  	  },
      {
        test: /\.html$/,
        use: {
          loader: 'html-loader',
          options: {
            minimize: true
          }
        }
      }	  
    ]
  },
  plugins: [
    new CopyWebpackPlugin([ {
      from: 'src/index.html',
      to: '../index.html',
      toType: 'file'
    }], { copyUnmodified: true })
  ]
};
