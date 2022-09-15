import {
	NCard,
	NDynamicInput,
	NForm,
	NFormItem,
	NInput,
	NTabPane,
	NTabs,
	NTree,
	TreeOption,
} from 'naive-ui'
import { defineComponent, ref, watch } from 'vue'
import { ApiConfig } from '~/typings/data/apiGenerator'
import { getCamelCase } from '~/web/utils/getCamelCase'

const initForm: () => ApiConfig = () => ({
	name: 'test-api',
	npmrc: '',
	registry: '',
	apiList: [],
})

type ApiMethod = {
	[x: string]:
		| {
				[name: string]: Record<string, Function>
		  }
		| Function
	install: Function
}

const createTree = (name: string, api: ApiMethod): TreeOption[] => {
	return [
		{
			label: name,
			key: name,
			children: [
				...Object.entries(api).map(([key, value]) => {
					return {
						label: key,
						key,
						children: [
							...Object.entries(value).map(([key2, value]) => ({
								label: key2,
								key: key + key2,
								children: [
									...Object.keys(value).map(key3 => ({
										label: key3,
										key: key + key2 + key3,
									})),
								],
							})),
						],
					}
				}),
			],
		},
	]
}

export const ApiForm = defineComponent({
	name: 'ApiForm',
	props: ['isEdit'],
	setup() {
		const formData = ref(initForm())
		const tree = ref()
		const initData = () => {
			formData.value = initForm()
		}

		watch(formData, () => {
			const api = window[getCamelCase(formData.value.name)]
			if (api) {
				tree.value = createTree(getCamelCase(formData.value.name), api)
			}
		})

		return {
			formData,
			initData,
			tree,
		}
	},
	render() {
		return (
			<NCard>
				<NTabs>
					<NTabPane tab={'表单'} name='form'>
						<NForm model={this.formData} labelPlacement={'left'}>
							<NFormItem label='名称'>
								<NInput v-model:value={this.formData.name} placeholder={'请输入npm包名称'}></NInput>
							</NFormItem>
							<NFormItem label='registry'>
								<NInput
									v-model:value={this.formData.registry}
									placeholder={'请输入npm包注册域'}
								></NInput>
							</NFormItem>
							<NFormItem label='npmrc'>
								<NInput
									v-model:value={this.formData.npmrc}
									type={'textarea'}
									placeholder={'请输入相关auth信息'}
								></NInput>
							</NFormItem>
							<NCard title='Api接口列表'>
								<NDynamicInput
									v-model:value={this.formData.apiList}
									onCreate={() => ({ name: '', url: '' })}
									min={1}
								>
									{{
										default: ({ value }) => (
											<div style={'width:100%;display:flex;gap:8px'}>
												<NFormItem label='名称' labelPlacement={'left'} style={'width:400px'}>
													<NInput
														v-model:value={value.name}
														placeholder={'生成的文件名，例如auth.ts'}
													></NInput>
												</NFormItem>
												<NFormItem label='URL' labelPlacement={'left'} style={'width:100%'}>
													<NInput
														v-model:value={value.url}
														placeholder={'swagger生成的文档json地址'}
													></NInput>
												</NFormItem>
											</div>
										),
									}}
								</NDynamicInput>
							</NCard>
						</NForm>
					</NTabPane>
					{this.isEdit && (
						<NTabPane tab={'api方法'} name='method'>
							{this.tree && (
								<NTree
									blockLine
									data={this.tree}
									expandOnClick
									defaultExpandedKeys={[getCamelCase(this.formData.name)]}
								></NTree>
							)}
						</NTabPane>
					)}
				</NTabs>
			</NCard>
		)
	},
})
