import {
	darkTheme,
	lightTheme,
	NCard,
	NConfigProvider,
	NGlobalStyle,
	NMessageProvider,
} from 'naive-ui'
import { defineComponent, ref } from 'vue'
import './index.css'

if (__isBrowser__) {
	const meta = document.createElement('meta')
	meta.name = 'naive-ui-style'
	document.head.appendChild(meta)
}

export default defineComponent({
	name: 'App',
	setup() {
		const theme = ref<any>()
		if (__isBrowser__) {
			setTimeout(() => {
				const themeMedia = window.matchMedia('(prefers-color-scheme: light)')
				if (themeMedia.matches) {
					theme.value = lightTheme
				} else {
					theme.value = darkTheme
				}
			}, 400)
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
				<NGlobalStyle></NGlobalStyle>
			</NConfigProvider>
		)
	},
})
