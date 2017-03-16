const path = require('path');

module.exports = {
  entry: './components/index.js',
  module: {
    rules: [{
      test: /\.js$/,
      exclude: /node_modules/,
      loader: 'babel-loader',
      options: {
        babelrc: false,
        presets: ['es2015', 'stage-2', 'react'],
        plugins: ['syntax-dynamic-import']
      }
    }]
  },
  output: {
    filename: 'bundle-[name].js',
    path: path.resolve(__dirname, 'public', 'scripts'),
    publicPath: 'scripts/',
  },
  devServer: {
    contentBase: path.join(__dirname, 'public'),
    compress: true,
    port: 9000
  }
};
