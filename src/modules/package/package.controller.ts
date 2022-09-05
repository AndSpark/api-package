import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common'
import { PackageService } from './package.service'
import { ApiConfig } from '~/typings/data/apiGenerator'

@Controller('/api')
export class PackageController {
	constructor(private readonly packageService: PackageService) {}

	@Get('package')
	async getData(): Promise<any> {
		return await this.packageService.get()
	}

	@Get('package/:id/update')
	async updatePackage(@Param('id') id: string): Promise<any> {
		return await this.packageService.updatePackage(Number(id))
	}

	@Post('package')
	async post(@Body('apiConfig') apiConfig: ApiConfig) {
		return await this.packageService.post(apiConfig)
	}

	@Put('package/:id')
	async update(@Param('id') id: string, @Body('apiConfig') apiConfig: ApiConfig) {
		return await this.packageService.update(Number(id), apiConfig)
	}

	@Delete('package/:id')
	async del(@Param('id') id: string) {
		return await this.packageService.del(Number(id))
	}
}
