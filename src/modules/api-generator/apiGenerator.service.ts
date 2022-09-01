import { Inject, Injectable } from '@nestjs/common'
import { Repository } from 'typeorm'
import { ApiGenerator, ApiInfo } from './apiGenerator.entity'
import { ApiConfig } from './generator'

@Injectable()
export class ApiGeneratorService {
	constructor(
		@Inject('API_GENERATOR_REPOSITORY')
		private apiGeneratorRepository: Repository<ApiGenerator>,
		@Inject('API_INFO_REPOSITORY')
		private apiInfoRepository: Repository<ApiInfo>
	) {}

	async post(apiConfig: ApiConfig) {
		const apiGenerator = this.apiGeneratorRepository.create({
			name: apiConfig.name,
			npmrc: apiConfig.npmrc || '',
			apiList: apiConfig.list.map(v => {
				return this.apiInfoRepository.create({
					apiName: apiConfig.name,
					name: v.name,
					url: v.url,
				})
			}),
		})
		if (apiConfig.registry) apiGenerator.registry = apiConfig.registry
		return await this.apiGeneratorRepository.save(apiGenerator)
	}

	async get() {
		return await this.apiGeneratorRepository.find({ relations: ['apiList'] })
	}

	async del(id: number) {
		return await this.apiGeneratorRepository.delete(id)
	}

	async update(id: number, apiConfig: ApiConfig) {
		return await this.apiGeneratorRepository.update(id, {
			name: apiConfig.name,
			npmrc: apiConfig.npmrc || '',
			apiList: apiConfig.list.map(v => {
				return this.apiInfoRepository.create({
					apiName: apiConfig.name,
					name: v.name,
					url: v.url,
				})
			}),
		})
	}
}
