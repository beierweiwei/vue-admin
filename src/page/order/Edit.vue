<template>
	<Modal v-model="editor.isShow" @on-ok="submit">
		<Form :label-width="80">
			<FormItem label="订单编号:">
				<Input :value="editor.form.orderNo" disabled></Input>		
			</FormItem>
			<FormItem label="订单状态:">
				<Select v-model="editor.form.status">
					<Option v-for="(status, idx) in orderStatus" :value="idx" :key="idx">{{status}}</Option>
				</Select>		
			</FormItem>
			<Row v-for="(prod, i) in editor.form.products" key="prod._id">
				<Col span="4"><img src="prod.thubImg"></Col>
				<Col span="4">{{prod.title}}</Col>
				<Col span="4">
					<Row><Col v-for="(prop, idx) in prod.props" :key="idx">{{prop}}: {{prod.propItems.split(',')[idx]}}</Col>
				</Row>
				</Col>
				<Col span="4"> x {{editor.form.nums[i]}}</Col>
				<Col span="4">单价: {{prod.price}}</Col>
			</Row>
			<FormItem label="收货人">
				<Input v-model="editor.form.address.name"></Input>		
			</FormItem>
			<FormItem label="地址">
				<Input v-model="editor.form.address.areaName"></Input>		
			</FormItem>
			<FormItem label="电话">
				<Input v-model="editor.form.address.tel"></Input>		
			</FormItem>
			<FormItem label="改价">
				<Input v-model="editor.form.change"></Input>		
			</FormItem>
		</Form>
	</Modal>
</template>

<script>
	import { orderStatus } from '@/util/constants'
	import { getOrder, updateOrder } from '@/services/Api/'
	export default {
		props: {
			editor: {
				default: {}
			}
		},
		data () {
			return {
				orderStatus
			}
		},
		methods: {
			submit () {
				updateOrder(this.editor.id, this.editor.form).then(res => {
						this.editor.isShow = false
						this.$emit('update:list')
				})
			},
			initData () {
				// this.editor.form = {}
			},
			getOrder () {
				if (this.editor.id) {
					getOrder(this.editor.id).then(data => {
						// this.editor.form = data 
	          this.editor.form.orderNo = data.orderNo 
	          this.editor.form.status = data.status
	          this.editor.form.products = data.products 
	          this.editor.form.address = data.address
	          this.editor.form.nums = data.nums
	        })
				}
			}
		},
		watch: {
			"editor.isShow" (val) {
				if (!val) {
					this.$nextTick(() => {
						this.initData()
					})
				} else {
					this.getOrder()
				}
			}
		}
	}
</script>

<style type="text/css">
	
</style>