import { DataSource } from 'typeorm'
import { ApiInfoEntity, PackageEntity } from './entities/package.entity'

export const packageProviders = [
	{
		provide: 'PACKAGE_REPOSITORY',
		useFactory: (dataSource: DataSource) => dataSource.getRepository(PackageEntity),
		inject: ['DATA_SOURCE'],
	},
	{
		provide: 'API_INO_REPOSITORY',
		useFactory: (dataSource: DataSource) => dataSource.getRepository(ApiInfoEntity),
		inject: ['DATA_SOURCE'],
	},
]
