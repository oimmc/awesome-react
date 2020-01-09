const path = require('path')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
// const UglifyJSPlugin = require('uglifyjs-webpack-plugin') //作废
const TerserJSPlugin = require('terser-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin')

function assetsPath(_path) {
	return path.posix.join(process.env.NODE_ENV === 'development' ? './' : '/', _path)
}

module.exports = {
	mode: 'production',
	entry: './src/index',
	output: {
		filename: '[name].[hash:7].js',
		path: path.resolve(__dirname, 'dist')
	},
	resolve: {
		extensions: ['.js', '.jsx', '.json']
	},
	module: {
		rules: [
			{
				enforce: 'pre',
				test: /\.(js|jsx)$/,
				exclude: /node_modules/,
				loader: 'eslint-loader',
				options: {
					cache: true,
					fix: true
				}
			},
			{
				test: /\.(js|jsx)$/,
				exclude: /node_modules/,
				include: path.resolve(__dirname, 'src'),
				use: [
					{
						loader: 'cache-loader'
					},
					{
						loader: 'thread-loader',
						options: {
							workers: 2
						}
					},
					'babel-loader'
				]
			},
			{
				test: /\.css$/,
				use: [
					'style-loader',
					{
						loader: MiniCssExtractPlugin.loader,
						options: {
							esModule: true
						}
					},
					'css-loader',
					'postcss-loader'
				]
			},
			{
				test: /\.less$/,
				use: [
					'style-loader',
					{
						loader: MiniCssExtractPlugin.loader,
						options: {
							esModule: true
						}
					},
					'css-loader',
					'postcss-loader',
					'less-loader'
				]
			},
			{
				test: /\.(png|svg|jpg|gif)$/,
				use: [
					{
						loader: 'file-loader',
						options: {
							limit: 1024 * 1,
							name: assetsPath('img/[name].[hash:7].[ext]')
						}
					}
				]
			},
			{
				test: /\.(woff|woff2|eot|ttf|otf)$/,
				use: {
					loader: 'url-loader',
					options: {
						limit: 10000,
						name: assetsPath('fonts/[name].[hash:7].[ext]')
					}
				}
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
	optimization: {
		minimize: true,
		minimizer: [
			new TerserJSPlugin({
				cache: true
			})
		]
	},
	plugins: [
		new TerserJSPlugin({}),
		new MiniCssExtractPlugin({
			filename: 'css/[name].[hash:7].css',
			chunkFilename: 'css/[name].[hash:7].css'
		}),
		new OptimizeCSSAssetsPlugin({
			// assetNameRegExp: /\.optimize\.css$/g,
			cssProcessor: require('cssnano'),
			cssProcessorPluginOptions: {
				preset: ['default', { discardComments: { removeAll: true } }]
			},
			canPrint: true
		}),
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
