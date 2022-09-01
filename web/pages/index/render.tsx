import { NDataTable } from 'naive-ui'
import { TableColumns } from 'naive-ui/es/data-table/src/interface'
import { defineComponent, ref } from 'vue'

export default defineComponent({
	setup() {
		const data = ref([])
		const columns: TableColumns<any> = [
			{
				title: 'id',
				key: 'id',
			},
			{
				title: 'package名称',
				key: 'name',
			},
			{
				title: 'registry',
				key: 'registry',
			},
		]
		fetch('/api/generator').then(res =>
			res.json().then(res => {
				data.value = res
			})
		)
		return {
			data,
			columns,
		}
	},
	render() {
		return (
			<div>
				<NDataTable data={this.data} columns={this.columns}></NDataTable>
			</div>
		)
	},
})
