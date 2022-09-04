import axios from 'axios'
import {
	NButton,
	NCard,
	NDataTable,
	NDrawer,
	NDrawerContent,
	NPopconfirm,
	NSpace,
	useMessage,
} from 'naive-ui'
import { TableColumns } from 'naive-ui/es/data-table/src/interface'
import { defineComponent, nextTick, ref } from 'vue'
import { ApiConfig } from '~/typings/data/apiGenerator'
import { ApiForm } from './form'
import dayjs from 'dayjs'
export default defineComponent({
	setup() {
		const isShowDrawer = ref(false)
		const editFormType = ref<'create' | 'update'>('create')
		const apiForm = ref<any>()
		const columns: TableColumns<any> = [
			{
				title: 'id',
				key: 'id',
			},
			{
				title: 'npm包名称',
				key: 'name',
			},
			{
				title: 'registry',
				key: 'registry',
			},
			{
				title: '版本',
				key: 'version',
			},
			{
				title: '创建时间',
				key: 'create_time',
				width: '200px',
				render: ({ create_time }) => dayjs(create_time).format('YYYY-MM-DD HH:mm'),
			},
			{
				title: '修改时间',
				key: 'update_time',
				width: '200px',
				render: ({ update_time }) => dayjs(update_time).format('YYYY-MM-DD HH:mm'),
			},
			{
				title: '操作',
				key: 'option',
				width: '300px',
				render(data) {
					return (
						<NSpace>
							<NButton
								onClick={() => {
									editFormType.value = 'update'
									isShowDrawer.value = true
									nextTick().then(_ => {
										apiForm.value.formData = data
									})
								}}
							>
								详情
							</NButton>
							<NButton type={'info'}>更新</NButton>
							<NPopconfirm onPositiveClick={() => delData(data.id)}>
								{{
									trigger: () => <NButton type={'error'}>删除</NButton>,
									default: () => <span>确认删除吗</span>,
								}}
							</NPopconfirm>
						</NSpace>
					)
				},
			},
		]
		const { list, fetchData, createData, updateData, delData } = useApiCRUD()

		const createApi = async () => {
			await createData(apiForm.value.formData)
			isShowDrawer.value = false
		}

		if (__isBrowser__) {
			fetchData()
		}

		return {
			list,
			columns,
			isShowDrawer,
			apiForm,
			createApi,
			editFormType,
		}
	},
	render() {
		return (
			<NSpace vertical>
				<NCard>
					<NSpace justify='end'>
						<NButton>刷新</NButton>
						<NButton
							type={'info'}
							onClick={() => {
								this.isShowDrawer = true
								this.editFormType = 'create'
								this.$nextTick().then(_ => {
									this.apiForm.initData()
								})
							}}
						>
							新增
						</NButton>
					</NSpace>
				</NCard>
				<NDataTable data={this.list} columns={this.columns}></NDataTable>
				<NDrawer v-model:show={this.isShowDrawer} width={'900px'}>
					<NDrawerContent title='新增Api' closable>
						<div class='flex h-full w-full flex-col gap-4'>
							<ApiForm ref='apiForm' class='flex-1'></ApiForm>
							<NSpace justify={'end'}>
								{this.editFormType === 'create' ? (
									<NButton type={'primary'} onClick={this.createApi}>
										保存
									</NButton>
								) : (
									<NButton type={'success'} onClick={this.createApi}>
										修改
									</NButton>
								)}
							</NSpace>
						</div>
					</NDrawerContent>
				</NDrawer>
			</NSpace>
		)
	},
})

function useApiCRUD() {
	const list = ref([])
	const url = '/api/package/'
	const message = useMessage()

	const fetchData = async () => {
		const res = await axios.get(url)
		list.value = res.data
	}
	const createData = async (apiConfig: ApiConfig) => {
		await axios.post(url, { apiConfig })
		await fetchData()
		message.success('创建成功')
	}
	const updateData = async (id: number, apiConfig: ApiConfig) => {
		await axios.put(url + id, { apiConfig })
		await fetchData()

		message.success('修改成功')
	}
	const delData = async (id: number) => {
		await axios.delete(url + id)
		await fetchData()

		message.success('删除成功')
	}

	return {
		fetchData,
		createData,
		updateData,
		delData,
		list,
	}
}
