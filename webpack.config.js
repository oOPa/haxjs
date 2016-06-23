var path = require("path");
var CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
    entry: "./src/js/entry.js",
    output: {
        path: __dirname + "/dist",
        filename: "bundle.js"
    },
    module: {
        loaders: [{
		test: /\.js$/, 
		include: [
			path.resolve(__dirname, "src/js")
		],
		loader: "babel-loader",
		query: {
				presets: ['es2015']
		}
	}]
    },
	plugins: [new CopyWebpackPlugin([{ from: 'src/index.html', to: 'index.html' },{ from: 'src/app.js', to: 'app.js' }])]
};
