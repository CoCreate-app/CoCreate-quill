const path = require('path')

module.exports = {
  mode: 'development',
  devtool: 'source-map',
  entry: {
    'CoCreate-quill': './src/index.js',
  },
  output: {
    globalObject: 'self',
    path: path.resolve(__dirname, './dist/'),
//    filename: '[name].bundle.js',
    filename: '[name].js',
    publicPath: '/quill/dist/'
  },
  devServer: {
    contentBase: path.join(__dirname),
    compress: true,
    publicPath: '/dist/'
  }
}
