import path from 'path'
import fs from 'fs'
import webpack from 'webpack'

const root = path.resolve(__dirname, '../../../api')
const publicPath = path.resolve(__dirname, '../../../../../api-modules/')
if (!fs.existsSync(publicPath)) {
	fs.mkdirSync(publicPath)
}

const config: webpack.Configuration = {
	entry: {
		index: path.resolve(root, 'index.ts'),
	},
	mode: 'production',
	devtool: 'source-map',
	module: {
		rules: [
			{
				test: /\.ts/,
				use: 'ts-loader',
				exclude: /node_modules/,
			},
		],
	},
	resolve: {
		extensions: ['.ts', '.js'],
	},
	output: {
		filename: 'index.js',
		path: path.resolve(root, 'dist'),
		library: {
			type: 'commonjs',
		},
	},
}

const configModule = (name: string): webpack.Configuration => ({
	entry: {
		index: path.resolve(root, 'index.ts'),
	},
	experiments: {
		outputModule: true,
	},
	mode: 'production',
	module: {
		rules: [
			{
				test: /\.ts/,
				use: 'ts-loader',
				exclude: /node_modules/,
			},
		],
	},
	resolve: {
		extensions: ['.ts', '.js'],
	},
	output: {
		filename: 'index.js',
		path: path.resolve(publicPath, name),
		library: {
			type: 'module',
		},
	},
})

export { config, configModule }
