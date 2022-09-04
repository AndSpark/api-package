export interface GeneratorConfig {
	useClassInterface?: boolean
}

export interface ApiConfig {
	name: string
	npmrc: string
	packageConfig?: Record<string, any>
	registry?: string
	generatorConfig?: GeneratorConfig
	list: {
		name: string
		url: string
	}[]
}
