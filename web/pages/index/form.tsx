import axios from 'axios'
import { NCard, NDynamicInput, NForm, NFormItem, NInput, useMessage } from 'naive-ui'
import { defineComponent, ref } from 'vue'
import { ApiConfig } from '~/typings/data/apiGenerator'

const initForm: () => ApiConfig = () => ({
	name: '',
	npmrc: '',
	registry: '',
	list: [
		{
			name: '',
			url: '',
		},
	],
})

export const ApiForm = defineComponent({
	name: 'ApiForm',
	setup() {
		const formData = ref(initForm())
		const initData = () => {
			formData.value = initForm()
		}
		return {
			formData,
			initData,
		}
	},
	render() {
		return (
			<NCard>
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
							v-model:value={this.formData.list}
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
			</NCard>
		)
	},
})
