export const packageJson = (
	name: string,
	version: string = '1.0.0',
	configs: Record<string, any> = {}
) =>
	JSON.stringify(
		{
			name,
			version,
			main: 'dist/index.js',
			license: 'private',
			dependencies: {
				axios: '0.27.2',
			},
			...configs,
			files: ['dist/*'],
		},
		null,
		2
	)

export const tsconfig = `
{
	"compilerOptions": {
		"target": "ES2015",
		"declaration": true,
		"useDefineForClassFields": true,
		"outDir": "dist",
		"moduleResolution": "node",
		"allowSyntheticDefaultImports": true,
		"esModuleInterop": true,
		"sourceMap": true
	},
	"include": ["./*.ts","./*.d.ts"]
}

`
