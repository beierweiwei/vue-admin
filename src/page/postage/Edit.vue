<template>
	<Modal 
		v-model="editor.isShow"
		:loading="true"
		ref="modal"
		@on-ok="submit"
		title="运费编辑"
		
		>
		<Form 
			ref="form" 
			:label-width="80"
		>
			<FormItem label="地区编号">
				<div>{{form._id}}</div>
			</FormItem>
			<FormItem label="地区名称">
				<div>{{form.name}}</div>
			</FormItem>
			<p style="width: 70px; text-align: right;">快递公司</p>
				<div class="postage-edit">
					<FormItem v-for="(company, i) in form.company" :key="i" :label="company.name">
						<Row>
							<Col span="7"><span class="alg-top">起步价：</span>
								<validateInput
									v-model="company.price"
									:containers="validators" 
									:rules="[{validate: ['required', 'number'], trigger: ['input']}]"
									style="width: 60px; display: inline-block;" />
							</Col>
							<Col span="9">
								<span class="alg-top">续重：</span>
								<validateInput
								v-model="company.increacePrice"
								:rules="[{validate: ['required', 'number'], trigger:['input']}]"
								:containers="validators"
								style="width: 60px; display: inline-block;"/>
								<span class="alg-top">元/kg</span>
							</Col>
							<Col span="8">
								<div>
									<Button :type="company.status ? 'warning' : 'primary' " size="small" style="margin-left: 5px" @click.native="actionCompany('toggelOff', i)">{{company.status ? '禁用' : '启用'}}</Button>
									<Button type="error" size="small" style="" @click.native="actionCompany('delete', i)">删除</Button>
									<Button type="primary" size="small" :disabled="form.default === i" style="" @click.native="actionCompany('default', i)">默认</Button>
								</div>
							</Col>
						</Row>
					</FormItem>						
				</div>
	

			<Row style="line-height: 32px">
				<Col span="4">
					<validateInput
						:containers="addValidators"
						v-model="newCompany.name"								
						:rules="[{validate: ['required'], trigger:['input']}]"
						 placeholder="快递名称"
					></validateInput>
				</Col>
				<Col span="6">
					<span class="alg-top">起步价：</span>
					<validateInput 
					v-model="newCompany.price"
					:containers="addValidators"
					:rules="[{validate: ['required', 'number'], trigger: ['input']}]" 
					style="width: 60px; display: inline-block;"/>
				</Col>
				<Col span="7">
					<span class="alg-top">续重:</span>
					<validateInput 
						v-model="newCompany.increacePrice"
						:containers="addValidators"
						:rules="[{validate: ['required', 'number'], trigger: ['input']}]"
						style="width: 60px; display: inline-block;"
					/>
					<span class="alg-top">元/kg</span>
				</Col>
				<Col span="4">
						<Button 
							type="primary" 
							size="small" 
							style="margin-left: 10px;"
							@click="actionCompany('add')"
						>新增</Button>
				</Col>
			</Row>
			<FormItem label="是否启用">
				<RadioGroup v-model="form.status">
              <Radio :label="1">是</Radio>
              <Radio :label="0">否</Radio>
            </RadioGroup>
			</FormItem>
		</Form>
	</Modal>
</template>

<script>
	import { updatePostage } from '@/services/Api/'
	import validateInput from '@/components/common/validateInput'
	import help from '@/util/help'
	import Vue from 'vue'
	const defaultValidator = {
		value: '',
		rules: [{
			validate:  (val) => {
				return val
			},
			errMsg: '不能为空！'	
		}, {
			validate: (val) => {
				return !!Number(val) || Number(val) === 0
			},
			errMsg: '须为数字!'
		}],
		trigger: ['change']
	}
	const Validate = { ...defaultValidator, rules: [{
			validate: (val) => {
				return val
			},
			errMsg: '不能为空'
		}, {
			validate: (val) => {}

		}]}
	export default {
		props: {
			editor: {
				default: {
					form: {
						company: []
					},
					isShow: false
				}
			},
			test: {
				default: 0
			}
		},
		computed: {
			form () {
				// this.editor.form.companyDef = 0
				return this.editor.form
			}
		},
		components: {validateInput},
		data () {
			return {
				emit: '',
				loading: false,
				companys: [],
				newCompany: {
					name: '',
					price: '',
					increacePrice: '',
					default: 0,
					status: 0
				},
				addValidators: [],
				validators: [],
			}
		},
		methods: {
			submit () {
				//this.$refs.modal.buttonLoading = true
				if (this.validateAll()) {
					updatePostage(this.editor.form).then(res => {
						this.$refs.modal.buttonLoading = false
						this.editor.isShow = false
						this.$emit('update:list')
					}).catch((err) => {
						this.$refs.modal.buttonLoading = false
						this.$Message.error(err.message || '网络错误！')
					})
				} else {
					this.$refs.modal.buttonLoading = false
					console.log('验证失败')
				}
				
			},
			actionCompany (type, idx) {
				if(type === 'toggelOff') {
					let item = this.form.company[idx]
					item.status = !item.status ? 1 : 0
				} else if (type === 'delete') {
					this.form.company.splice(idx, 1)
				} else if (type === 'default') {
					this.form.default = idx
				} else if (type === 'add') {
					console.log('add')
					if (this.validateAdd()) {
						this.form.company.push(this.newCompany)
					}
				}
			},
			initData () {
				this.editor.form = {}
				this.newCompany = {
					name: '',
					price: '',
					increacePrice: '',
					default: 0,
					status: 0
				}
				this.addValidators = []
				this.validators = []
			},
			validateAll () {
				return this.validators.map((validator, i) => {
					return validator.validate()
				}).every(isValid => isValid)
			},
			validateAdd () {
				return this.addValidators.map(validator => {
					return validator.validate()
				}).every(isValid => isValid)
			},
			resetValidate () {
				this.validators.map(validator => {
					validator.reset()
				})
			}
		},
		created  () {
			
		},
		watch: {
			"editor.isShow" (val) {
				if (!val) {
					this.resetValidate()
					this.initData()
				} 
			}
		}
	}
</script>

<style lang="less">
	.postage-edit {
		.ivu-form-item {
			margin-bottom: 5px;
		}
	}
	
	// @import url(~@/assets/style/main.less);
</style>
