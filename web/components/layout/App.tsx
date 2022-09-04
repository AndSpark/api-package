import { darkTheme, lightTheme, NCard, NConfigProvider, NMessageProvider } from 'naive-ui'
import { defineComponent, ref } from 'vue'
import './index.css'
export default defineComponent({
	name: 'App',
	setup() {
		const theme = ref()
		if (__isBrowser__) {
			const themeMedia = window.matchMedia('(prefers-color-scheme: light)')
			if (themeMedia.matches) {
				theme.value = lightTheme
			} else {
				theme.value = darkTheme
			}
		}
		return {
			theme,
		}
	},
	render() {
		return (
			<NConfigProvider theme={this.theme}>
				<NMessageProvider>
					<NCard style={{ height: '100vh' }}>
						<router-view></router-view>
					</NCard>
				</NMessageProvider>
			</NConfigProvider>
		)
	},
})
