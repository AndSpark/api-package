import axios from 'axios'
import path from 'path'
import fs from 'fs'
import webpack from 'webpack'
import { execSync } from 'child_process'
import { ApiConfig } from '~/typings/data/apiGenerator'

import { packageJson, tsconfig } from './constant'
import { configModule, config } from './webpack.config'

const root = path.resolve(__dirname, '../../../api/')

export const compiler = async (apiConfig: ApiConfig) => {
	const { version } = await createPackage(apiConfig)
	fs.writeFileSync(path.resolve(root, '.npmrc'), apiConfig.npmrc)
	fs.writeFileSync(path.resolve(root, 'tsconfig.json'), tsconfig)
	// execSync('npm install', { cwd: root })
	return new Promise((res, rej) => {
		webpack(config, (err, stats) => {
			if (err || stats?.hasErrors()) {
				console.log(err, stats)
				rej(stats?.compilation.errors?.[0])
			} else {
				execSync('npm publish', { cwd: root })
				res(version)
			}
		})

		webpack(configModule(apiConfig.name), (err, stats) => {
			if (err || stats?.hasErrors()) {
				console.log(err, stats)
			}
		})
	})
}

const createPackage = async (apiConfig: ApiConfig) => {
	let registry = 'https://registry.npmjs.org/'
	const config = apiConfig.packageConfig
	const name = apiConfig.name
	if (config?.registry) {
		registry = config.registry
	}
	let res: any,
		version = '1.0.0'
	try {
		res = await axios.get(registry + '/' + name)
		if (res.data['dist-tags']?.latest) {
			version = res.data['dist-tags']?.latest
		}
	} catch (error: any) {
		if (error.response.status !== 404) {
			console.log(error)
			throw new Error(error)
		}
	}

	const packageData = packageJson(name, version, {
		...config,
		...{
			publishConfig: {
				registry,
			},
		},
	})
	fs.writeFileSync(path.resolve(root, 'package.json'), packageData)
	if (version) {
		execSync('npm version patch', { cwd: root })
	}
	const packageJSON = JSON.parse(fs.readFileSync(path.resolve(root, 'package.json'), 'utf-8'))

	return { version: packageJSON.version }
}
