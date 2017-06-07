var webpack = require('webpack');
var path = require('path');
var env = require('yargs').argv.env;
var ExtractTextPlugin = require('extract-text-webpack-plugin')

var outputStyle = env === 'prod' ? 'compressed' : 'expanded'
var sassLoader = 'sass-loader?outputStyle=' + outputStyle + '&includePaths[]=' 
        		+ path.resolve(__dirname, "./node_modules/compass-mixins/lib");

var config = {
	entry: {
		'referenceapplication': './src/index.js',
	},
	output: {
		filename: '[name].js',
		path: path.resolve(__dirname, 'lib'),
		library: 'style-openmrs-referenceapplication',
		libraryTarget: 'umd',
		umdNamedDefine: true
	},
	module: {
		rules: [ 
			{
				test: /\.css$/,
				exclude: /(node_modules)/,
				use: env === 'prod' ? ExtractTextPlugin.extract(
				{ fallback: 'style-loader', use: [ 'css-loader' ] }
				) : ['style-loader', 'css-loader']
			},
			{
				test: /\.scss$/,
				exclude: /(node_modules)/,
				use: env === 'prod' ? ExtractTextPlugin.extract({ fallback: 'style-loader', use: [
				'css-loader', sassLoader ] }
				) : ['style-loader', 'css-loader', sassLoader ]
			},
			{
				test: /\.(png|jpg|jpeg|gif|svg)$/,
				exclude: /(node_modules)/,
				use: [ 
					{ 
						loader: 'url-loader',
						query: {
							limit: 10000
						}
					}, 
					{
						loader: 'image-webpack-loader',
						query: {
							mozjpeg: {
							  progressive: true,
							},
							gifsicle: {
								interlaced: false,
							},
							optipng: {
								optimizationLevel: 4,
							},
							pngquant: {
								quality: '75-90',
								speed: 3,
							}
						}
					}
				]
			},
			{
				test: /\.woff(\?v=\d+\.\d+\.\d+)?$/,
				exclude: /(node_modules)/,
				use: {
					loader: 'url-loader',
					query: {
						limit: 10000
					}
				}
			},
			{
				test: /\.woff2(\?v=\d+\.\d+\.\d+)?$/,
				exclude: /(node_modules)/,
				use: {
					loader: 'url-loader',
					query: {
						limit: 10000
					}
				}
			},
			{
				test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
				exclude: /(node_modules)/,
				use: {
					loader: 'url-loader',
					query: {
						limit: 10000
					}
				}
			},
			{
				test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
				exclude: /(node_modules)/,
				use: {
					loader: 'url-loader',
					query: {
						limit: 10000
					}
				}
			}
		]
	},
	plugins: env === 'prod'
    ? [
        new ExtractTextPlugin({
          filename: '[name].css'
        })
      ]
    : []
};

if (env === 'dev') {
	
} else if (env === 'prod') {
	config.devtool = 'source-map';
	
	config.plugins.push(new webpack.optimize.UglifyJsPlugin({
		sourceMap: true,
		compress: {
			warnings: false
		}
	}));
}

module.exports = config;