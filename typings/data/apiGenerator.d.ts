export interface GeneratorConfig {
	useClassInterface?: boolean
}

export interface ApiConfig {
	name: string
	npmrc: string
	packageConfig?: Record<string, any>
	registry?: string
	generatorConfig?: GeneratorConfig
	apiList: {
		id?: number
		name: string
		url: string
	}[]
}
