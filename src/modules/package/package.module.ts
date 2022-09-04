import { Module } from '@nestjs/common'
import { DatabaseModule } from '../database/database.module'
import { PackageController } from './package.controller'
import { packageProviders } from './package.providers'
import { PackageService } from './package.service'

@Module({
	imports: [DatabaseModule],
	controllers: [PackageController],
	providers: [...packageProviders, PackageService],
	exports: [PackageService],
})
export class PackageModule {}
