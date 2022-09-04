import { HttpException, Inject, Injectable } from '@nestjs/common'
import { Repository } from 'typeorm'
import { ApiInfoEntity, PackageEntity } from './entities/package.entity'
import { ApiConfig } from '~/typings/data/apiGenerator'
import axios from 'axios'

@Injectable()
export class PackageService {
	constructor(
		@Inject('PACKAGE_REPOSITORY')
		private packageRepository: Repository<PackageEntity>,
		@Inject('API_INO_REPOSITORY')
		private apiInfoRepository: Repository<ApiInfoEntity>
	) {}

	async post(apiConfig: ApiConfig) {
		const res = await this.checkPackage(apiConfig.name, apiConfig.registry)
		if (res !== null) {
			throw new HttpException('该package已存在', 400)
		}
		const packageInfo = this.packageRepository.create({
			name: apiConfig.name,
			npmrc: apiConfig.npmrc || '',
			registry: apiConfig.registry,
			apiList: apiConfig.list.map(v => {
				return this.apiInfoRepository.create({
					name: v.name,
					url: v.url,
				})
			}),
		})
		if (apiConfig.registry) packageInfo.registry = apiConfig.registry
		return await this.packageRepository.save(packageInfo)
	}

	async get() {
		axios
			.get('https://registry.npmjs.org/vue-class-validator-22')
			.then(res => {
				console.log(res)
			})
			.catch(err => {
				console.log(err.response.status)
			})
		return await this.packageRepository.find()
	}

	async del(id: number) {
		return await this.packageRepository.delete({ id })
	}

	async update(id: number, apiConfig: ApiConfig) {
		return await this.packageRepository.update(
			{ id },
			{
				name: apiConfig.name,
				npmrc: apiConfig.npmrc || '',
				registry: apiConfig.registry,
				apiList: apiConfig.list.map(v => {
					return this.apiInfoRepository.create({
						name: v.name,
						url: v.url,
					})
				}),
			}
		)
	}

	async checkPackage(name: string, registry: string) {
		try {
			const res = await axios.get((registry + '/').replace('//', '/') + name)
			return res.data
		} catch (error) {
			if (error?.response?.status === 404) {
				return null
			}
		}
	}
}
