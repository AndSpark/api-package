import { DataSource } from 'typeorm'
import { ApiGenerator, ApiInfo } from './apiGenerator.entity'

export const apiGeneratorProviders = [
	{
		provide: 'API_GENERATOR_REPOSITORY',
		useFactory: (dataSource: DataSource) => dataSource.getRepository(ApiGenerator),
		inject: ['DATA_SOURCE'],
	},
	{
		provide: 'API_INFO_REPOSITORY',
		useFactory: (dataSource: DataSource) => dataSource.getRepository(ApiInfo),
		inject: ['DATA_SOURCE'],
	},
]
