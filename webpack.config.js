const webpack = require('webpack');
const path = require('path');

module.exports = {
  entry: {
    main: './components/index.js',
  },
  output: {
    filename: 'bundle-[name].js',
    path: path.resolve(__dirname, 'public', 'scripts'),
    publicPath: 'scripts/',
  },
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
  }
};
