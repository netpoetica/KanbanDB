const path = require('path');

module.exports = {
  entry: './src/KanbanDB.js',
  mode: 'development',
  devtool: 'source-map',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'KanbanDB.js',
    libraryExport: 'default',
    libraryTarget: 'umd',
    library: 'KanbanDB',
  },
  externals: {
    lodash: {
      uuid: 'node-uuid',
    },
  },
};
