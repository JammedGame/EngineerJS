var path = require("path");
module.exports = {
  entry: {
    app: ["./app/app.ts"]
  },
  output: {
    path: path.resolve(__dirname, "build") + "/public",
    publicPath: "./public",
    filename: "engineer.js"
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js']
  },
  module: {
    loaders: [
      { test: /\.tsx?$/, loader: 'ts-loader' }
    ]
  }
};