<template>
	<div class="activity-editor">
		<Modal v-model="editor.isShow" @on-ok="submit">
			<Form :label-width="80">
				<FormItem label="ID:" v-if="form._id">
					<Input :value="form._id" disabled></Input>
				</FormItem>
				<FormItem label="优惠券内容">
					<Input v-model="form.title"></Input>
				</FormItem>
				<FormItem label="优惠券规则">
					<span>满</span><Input v-model="form.full" style="width: 98px; margin-left: 10px; margin-right: 20px;"/><span>减</span><Input v-model="form.reduce" style="width: 98px; margin-left: 10px"/>
				</FormItem>
				<FormItem label="开始时间:">
					<DatePicker v-model="form.startTime" @on-change="validateFor('time')"  	format="yyyy年MM月dd日" type="date" placeholder="Select date" style="width: 200px">
					</DatePicker>
				</FormItem>
				<FormItem label="结束时间:">
					<DatePicker v-model="form.endTime" @on-change="validateFor('time')" format="yyyy年MM月dd日" type="date" placeholder="Select date" style="width: 200px">
					</DatePicker>
				</FormItem>
				<FormItem label="总数:">
					<Input v-model="form.total"/>
				</FormItem>
				<FormItem label="限领:">
					<Input v-model="form.perMax"/>
				</FormItem>
				<FormItem label="优惠券类型:">
					<Select v-model="form.type">
						<Option :value="1">{{couponTypeMap[1]}}</Option>
						<Option :value="2">{{couponTypeMap[2]}}</Option>
					</Select>
				</FormItem>
				<FormItem label="优惠券状态:">
					<Select v-model="form.status">
						<Option :value="1">上线</Option>
						<Option :value="0">下线</Option>
					</Select>
				</FormItem>
			</Form>
		</Modal>

	</div>
</template>

<script>
	import { updateCoupon, createCoupon } from '@/services/Api/'
	import { couponTypeMap } from '@/util/constants'
	export default {
		props: {
			editor: {
				default: {
					form: {
						products: []
					}
				}
			}
		},
		data () {
			return {
				couponTypeMap,
				uploadList: [],
				defaultList: [],
				productListEditor: {
					isShow: false,
					search: {
						searchText: '',
						cateId: '',
						pageSize: 10,
						pageNum: 1
					},
					list: [],
					count: 0,
					cateList: [],
					selected: []
				}
			}
		},
		computed: {
			form () {
				return this.editor.form
			},
			activityProds () {
				return this.form.products
			},
			activityProdIds () {
				return this.activityProds.map(prod => prod._id)
			}
		},
		methods: {
			submit () {
				let form = {...this.form}
				form.thumb = this.uploadList[0] && this.uploadList[0].url
				form.products = this.form.products.map(prod => prod._id)
				// if (form.products && !form.products.length) form.products = '\[\]'
				if (form._id) {
					form.id = form._id
					updateCoupon(form).then(res => {
						this.$emit('on-ok')
						this.$Message.success('编辑成功！')
					}).catch(err => {
						this.$Message.error('编辑失败！')
					})
				} else {
					createCoupon(form).then(res => {
						this.$emit('on-ok')
						this.$Message.success('新增成功！')
					}).catch(err => this.$Message.error('新增失败！'))
				}
			},
			validateFor(field) {
				switch (field) {
					case 'time': 
						this.form.startTime <= this.form.endTime
					default:
						return true		
				}
			},
			initProductListEditor () {
				this.productListEditor.list = []
				this.productListEditor.count = 0 
				this.productListEditor.search = {
					searchText: '',
					cateId: '',
					pageSize: 10,
					pageNum: 1
				}
				this.productListEditor.cateList = []
				this.productListEditor.selected = []
			}
		},
		mounted () {
	
		}
	}
</script>

<style type="text/css">

</style>
