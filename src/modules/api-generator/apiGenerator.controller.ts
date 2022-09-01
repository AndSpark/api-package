import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common'
import { ApiGeneratorService } from './apiGenerator.service'
import { ApiConfig } from './generator'

@Controller('/api')
export class ApiGeneratorController {
	constructor(private readonly apiService: ApiGeneratorService) {}

	@Get('generator')
	async getData(): Promise<any> {
		return await this.apiService.get()
	}

	@Post('generator')
	async post(@Body('apiConfig') apiConfig: ApiConfig) {
		return await this.apiService.post(apiConfig)
	}

	@Put('generaotr/:id')
	async update(@Param('id') id: string, @Body('apiConfig') apiConfig: ApiConfig) {
		return await this.apiService.update(Number(id), apiConfig)
	}

	@Delete('generaotr/:id')
	async del(@Param('id') id: string) {
		return await this.apiService.del(Number(id))
	}
}
