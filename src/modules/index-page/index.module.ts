import { Module } from '@nestjs/common'
import { AppController } from './index.controller'
import { PackageModule } from '../package/package.module'

@Module({
	imports: [PackageModule],
	controllers: [AppController],
})
export class indexModule {}
