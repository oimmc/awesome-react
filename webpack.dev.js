const path = require('path')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
	mode: 'development',
	entry: './src/index.js',
	output: {
		filename: 'bundle.js',
		path: path.resolve(__dirname, 'dist')
	},
	devtool: 'inline-source-map',
	devServer: {
		historyApiFallback: true,
		host: '0.0.0.0',
		port: 8088,
		compress: true,
		// noInfo: true,
		useLocalIp: true,
		hot: true,
		open: false,
		proxy: {
			'/api/v3': {
				target: 'http://11.22.33.111:8891',
				changeOrigin: true,
				secure: false,
				pathRewrite: {
					'^/': ''
				}
			}
		}
	},
	resolve: {
		extensions: ['.js', '.jsx', '.json']
	},
	module: {
		rules: [
			{
				test: /\.(js|jsx)$/,
				exclude: /node_modules/,
				loader: 'babel-loader'
			},
			{
				test: /\.css$/,
				use: ['style-loader', 'css-loader']
			},
			{
				test: /\.(png|svg|jpg|gif)$/,
				use: ['file-loader']
			},
			{
				test: /\.(woff|woff2|eot|ttf|otf)$/,
				use: ['file-loader']
			},
			{
				test: /\.(csv|tsv)$/,
				use: ['csv-loader']
			},
			{
				test: /\.xml$/,
				use: ['xml-loader']
			}
		]
	},
	plugins: [
		new CleanWebpackPlugin({
			cleanOnceBeforeBuildPatterns: [path.resolve(process.cwd(), 'dist')]
		}),
		new HtmlWebpackPlugin({
			minify: {
				inject: true,
				html5: true,
				collapseWhitespace: true,
				preserveLineBreaks: false,
				minifyCSS: true,
				minifyJS: true,
				removeComments: false
			},
			filename: 'index.html',
			template: './src/index.html'
		})
	]
}
