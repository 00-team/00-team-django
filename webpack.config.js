module.exports = {
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader"
                }
            }
        ]
    },
    output: {
      filename: "[name].js",
      sourceMapFilename: "[name].js.map"
    },
    devtool: "source-map",
};