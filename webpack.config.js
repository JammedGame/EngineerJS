var path = require("path");
module.exports = {
  entry: {
    app: ["./app/app.ts"]
  },
  output: {
    path: path.resolve(__dirname, "build"),
    library: "engineerjs",
    libraryTarget: "umd",
    filename: "engineer.js",
    publicPath: "/resources/"
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