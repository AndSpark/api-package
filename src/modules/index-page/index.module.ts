import { Module } from '@nestjs/common'
import { AppController } from './index.controller'
import { ApiGeneratorModule } from '../api-generator/apiGenerator.module'

@Module({
	imports: [ApiGeneratorModule],
	controllers: [AppController],
})
export class indexModule {}
