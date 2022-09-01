import path from 'path'
import webpack from 'webpack'

const root = path.resolve(__dirname, '../../../api')

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

export default config
