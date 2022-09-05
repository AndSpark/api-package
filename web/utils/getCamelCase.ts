export function getCamelCase(str: string) {
	return str.replace(/-([a-z])/g, function (all, i) {
		return i.toUpperCase()
	})
}
