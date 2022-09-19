import axios from 'axios'
import path from 'path'
import fs from 'fs'
import webpack from 'webpack'
import { execSync } from 'child_process'
import { ApiConfig } from '~/typings/data/apiGenerator'

import { apiPackageRoot, packageJson, tsconfig } from './constant'
import { configModule, config } from './webpack.config'
import { removeDir } from '../help'

const root = path.resolve(__dirname, '../../../api/')

export const compiler = async (apiConfig: ApiConfig) => {
	const { version } = await createPackage(apiConfig)
	fs.writeFileSync(path.resolve(apiPackageRoot, '.npmrc'), apiConfig.npmrc)
	fs.writeFileSync(path.resolve(root, 'tsconfig.json'), tsconfig)
	// execSync('npm install', { cwd: root })
	return new Promise((res, rej) => {
		webpack(config(apiConfig.apiList), (err, stats) => {
			if (err || stats?.hasErrors()) {
				console.log(err, stats)
				rej(stats?.compilation.errors?.[0])
			} else {
				execSync('npm publish', { cwd: apiPackageRoot })
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
	const name = apiConfig.name
	if (apiConfig?.registry) {
		registry = apiConfig.registry
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
	if (!fs.existsSync(apiPackageRoot)) {
		fs.mkdirSync(apiPackageRoot)
	} else {
		removeDir(apiPackageRoot)
		fs.mkdirSync(apiPackageRoot)
	}
	fs.writeFileSync(path.resolve(apiPackageRoot, 'package.json'), packageData)
	if (version) {
		execSync('npm version patch', { cwd: apiPackageRoot })
	}
	const packageJSON = JSON.parse(
		fs.readFileSync(path.resolve(apiPackageRoot, 'package.json'), 'utf-8')
	)

	return { version: packageJSON.version }
}
