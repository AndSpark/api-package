import {
	NButton,
	NCard,
	NDataTable,
	NDrawer,
	NDrawerContent,
	NPopconfirm,
	NSpace,
	NSpin,
	useMessage,
} from 'naive-ui'
import { TableColumns } from 'naive-ui/es/data-table/src/interface'
import { defineComponent, nextTick, ref } from 'vue'
import { ApiConfig } from '~/typings/data/apiGenerator'
import { ApiForm } from './form'
import dayjs from 'dayjs'
import { request } from '~/web/api'
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
				title: '版本',
				key: 'version',
			},
			{
				title: '创建时间',
				key: 'createTime',
				width: '200px',
				render: ({ createTime }) => dayjs(createTime).format('YYYY-MM-DD HH:mm'),
			},
			{
				title: '修改时间',
				key: 'updateTime',
				width: '200px',
				render: ({ updateTime }) => dayjs(updateTime).format('YYYY-MM-DD HH:mm'),
			},
			{
				title: '操作',
				key: 'option',
				width: '300px',
				render(data) {
					return (
						<NSpin show={loading.value}>
							<NSpace>
								<NButton
									onClick={() => {
										editFormType.value = 'update'
										isShowDrawer.value = true
										nextTick().then(_ => {
											apiForm.value.formData = data
											apiForm.value.formData.list = data.apiList
										})
									}}
								>
									详情
								</NButton>
								<NButton type={'info'} onClick={() => updatePackage(data.id)}>
									更新
								</NButton>
								<NPopconfirm onPositiveClick={() => delData(data.id)}>
									{{
										trigger: () => <NButton type={'error'}>删除</NButton>,
										default: () => <span>确认删除吗</span>,
									}}
								</NPopconfirm>
							</NSpace>
						</NSpin>
					)
				},
			},
		]
		const { list, fetchData, createData, updateData, delData, loading, updatePackage } =
			useApiCRUD()

		const createApi = async () => {
			await createData(apiForm.value.formData)
			isShowDrawer.value = false
		}

		const updateApi = async () => {
			await updateData(apiForm.value.formData.id, apiForm.value.formData)

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
			updateApi,
			editFormType,
			updatePackage,
			loading,
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
					<NDrawerContent title='新增Package' closable>
						<NSpin show={this.loading}>
							{{
								description: () => <span>正在生成package中，请稍后</span>,
								default: () => (
									<div class='flex h-full w-full flex-col gap-4'>
										<ApiForm ref='apiForm' class='flex-1'></ApiForm>
										<NSpace justify={'end'}>
											{this.editFormType === 'create' ? (
												<NButton type={'primary'} onClick={this.createApi}>
													保存
												</NButton>
											) : (
												<NButton type={'success'} onClick={this.updateApi}>
													修改
												</NButton>
											)}
										</NSpace>
									</div>
								),
							}}
						</NSpin>
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
	const loading = ref(false)

	const fetchData = async () => {
		list.value = await request.get(url)
	}
	const createData = async (apiConfig: ApiConfig) => {
		try {
			loading.value = true
			await request.post(url, { apiConfig })
			await fetchData()
			message.success('创建成功')
			loading.value = false
		} catch (error) {
			message.error(error.message)
			loading.value = false

			throw new Error(error.message)
		}
	}

	const updatePackage = async (id: number) => {
		try {
			loading.value = true

			await request.get(url + id + '/update')
			await fetchData()
			message.success('更新package成功')
			loading.value = false
		} catch (error) {
			message.error(error.message)
			loading.value = false

			throw new Error(error.message)
		}
	}

	const updateData = async (id: number, apiConfig: ApiConfig) => {
		try {
			loading.value = true
			await request.put(url + id, { apiConfig })
			await fetchData()
			message.success('修改成功')
			loading.value = false
		} catch (error) {
			message.error(error.message)
			loading.value = false
			throw new Error(error.message)
		}
	}
	const delData = async (id: number) => {
		try {
			await request.delete(url + id)
			await fetchData()
			message.success('删除成功')
		} catch (error) {
			message.error(error.message)
			throw new Error(error.message)
		}
	}

	return {
		fetchData,
		createData,
		updateData,
		delData,
		list,
		updatePackage,
		loading,
	}
}
