import path from 'path'
export const apiPackageRoot = path.resolve(__dirname, '../../../api-package')

export const packageJson = (
	name: string,
	version: string = '1.0.0',
	configs: Record<string, any> = {}
) =>
	JSON.stringify(
		{
			name,
			version,
			main: 'index.js',
			license: 'private',
			dependencies: {
				axios: '0.27.2',
			},
			...configs,
			files: ['*.js', '*.d.ts', '*.js.map'],
		},
		null,
		2
	)

export const tsconfig = `
{
	"compilerOptions": {
		"target": "ES2015",
		"declaration": true,
		"useDefineForClassFields": false,
		"outDir": "../api-package",
		"moduleResolution": "node",
		"allowSyntheticDefaultImports": true,
		"esModuleInterop": true,
		"sourceMap": true
	},
	"include": ["./*.ts","./*.d.ts"]
}

`
