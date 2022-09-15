import { HttpException, Inject, Injectable } from '@nestjs/common'
import { Repository } from 'typeorm'
import { ApiInfoEntity, PackageEntity } from './entities/package.entity'
import { ApiConfig } from '~/typings/data/apiGenerator'
import axios from 'axios'
import { apiGenerate } from './generator'

@Injectable()
export class PackageService {
	constructor(
		@Inject('PACKAGE_REPOSITORY')
		private packageRepository: Repository<PackageEntity>,
		@Inject('API_INO_REPOSITORY')
		private apiInfoRepository: Repository<ApiInfoEntity>
	) {}

	async updatePackage(id: number) {
		const target = await this.packageRepository.findOne({ where: { id }, relations: ['apiList'] })
		if (target) {
			try {
				const version = (await apiGenerate(target)) as string
				return await this.packageRepository.update({ id }, { version })
			} catch (error) {
				console.log(error)
				throw new HttpException('更新package失败，' + error?.message || error, 400)
			}
		} else {
			throw new HttpException('package不存在', 404)
		}
	}

	async post(apiConfig: ApiConfig) {
		const res = await this.checkPackage(apiConfig.name, apiConfig.registry)

		if (res !== null) {
			throw new HttpException('该package已存在', 400)
		}
		try {
			await apiGenerate(apiConfig)
		} catch (error) {
			console.log(error)
			throw new HttpException('创建package失败，' + error?.message || error, 400)
		}
		const packageInfo = this.packageRepository.create({
			name: apiConfig.name,
			npmrc: apiConfig.npmrc || '',
			registry: apiConfig.registry,
			version: '1.0.0',
			apiList: apiConfig.apiList.map(v => {
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
		return await this.packageRepository.find({ relations: ['apiList'] })
	}

	async del(id: number) {
		return await this.packageRepository.delete({ id })
	}

	async update(id: number, apiConfig: ApiConfig) {
		return await this.packageRepository.save({
			id,
			name: apiConfig.name,
			npmrc: apiConfig.npmrc || '',
			registry: apiConfig.registry,
			apiList: apiConfig.apiList,
		})
	}

	async checkPackage(name: string, registry: string) {
		try {
			const res = await axios.get(registry + name)
			return res.data
		} catch (error) {
			if (error?.response?.status === 404) {
				return null
			}
		}
	}
}
