import type { UserConfig } from 'ssr-types'

const userConfig: UserConfig = {
	css: () => {
		return {
			loaderOptions: {
				postcss: {
					options: {},
					plugins: [require('postcss-import'), require('tailwindcss')],
				},
			},
		}
	},
	serverPort: 8188,
}

export { userConfig }
