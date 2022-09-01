import { Module } from '@nestjs/common'
import { DatabaseModule } from '../database/database.module'
import { ApiGeneratorController } from './apiGenerator.controller'
import { apiGeneratorProviders } from './apiGenerator.providers'
import { ApiGeneratorService } from './apiGenerator.service'

@Module({
	imports: [DatabaseModule],
	controllers: [ApiGeneratorController],
	providers: [...apiGeneratorProviders, ApiGeneratorService],
	exports: [ApiGeneratorService],
})
export class ApiGeneratorModule {}
