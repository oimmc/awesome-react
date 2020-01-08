const path = require('path')
const address = require('address')
const chalk = require('chalk')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')

function clearConsole() {
	process.stdout.write(process.platform === 'win32' ? '\x1B[2J\x1B[0f' : '\x1B[2J\x1B[3J\x1B[H')
}

module.exports = {
	mode: 'development',
	entry: './src/index.js',
	output: {
		publicPath: '/'
	},
	devtool: 'inline-source-map',
	devServer: {
		historyApiFallback: true,
		host: '0.0.0.0',
		port: 8088,
		compress: true,
		noInfo: true,
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
		}),
		function() {
			const isInteractive = process.stdout.isTTY
			this.hooks.invalid.tap('invalid', () => {
				if (isInteractive) {
					clearConsole()
				}
				console.log('Compiling...')
			})
			this.hooks.done.tap('done', () => {
				if (isInteractive) {
					clearConsole()
				}
				console.log(`You can now view ${chalk.bold('App')} in the browser.`)
				console.log(`  ${chalk.bold('Local:')}            http://localhost:${8088}`)
				console.log(`  ${chalk.bold('On Your Network:')}  http://${address.ip()}:${8088}`)
			})
		}
	]
}
