<template>

	<div class="activity-editor">
		<Modal v-model="editor.isShow" @on-ok="submit">
			<Form :label-width="80">
				<FormItem label="活动名称:">
					<Input v-model="form.title"></Input>
				</FormItem>
				<FormItem label="活动内容">
					<Input v-model="form.desc"></Input>
				</FormItem>
				<FormItem label="活动规则">
					<span>满</span><Input v-model="form.rule.full" style="width: 98px; margin-left: 10px; margin-right: 20px;"/><span>减</span><Input v-model="form.rule.reduce" style="width: 98px; margin-left: 10px"/>
				</FormItem>
				<FormItem label="活动图片:">
					<div class="demo-upload-list" v-for="(item, idx) in uploadList" :key="idx">
					  <template v-if="item.status === 'finished'">
					    <img :src="item.url">
					    <div class="demo-upload-list-cover">
					      <Icon type="ios-eye-outline" @click.native="handleView(item.name)"></Icon>
					      <Icon type="ios-trash-outline" @click.native="handleRemove(item)"></Icon>
					    </div>
					  </template>
					  <template v-else>
					    <Progress v-if="item.showProgress" :percent="item.percentage" hide-info></Progress>
					  </template>
					</div>
					<Upload
					  ref="upload"
					  :show-upload-list="false"
					  :default-file-list="defaultList"
					  :on-success="handleSuccess"
					  :format="['jpg','jpeg','png']"
					  :max-size="2048"
					  :on-format-error="handleFormatError"
					  :on-exceeded-size="handleMaxSize"
					  :before-upload="handleBeforeUpload"
					  multiple
					  type="drag"
					  action="/api/upload"
					  style="display: inline-block;width:58px;">
					  <div style="width: 58px;height:58px;line-height: 58px;">
					    <Icon type="camera" size="20"></Icon>
					  </div>
					</Upload>
					<Modal title="View Image" v-model="imgViewVisible">
					  <img :src="baseUrl + '/upload/' + imgName " v-if="imgViewVisible" style="width: 100%">
					</Modal>
				</FormItem>
				<FormItem label="开始时间:">
					<DatePicker v-model="form.startTime" @on-change="validateFor('time')"  	format="yyyy年MM月dd日" type="date" placeholder="Select date" style="width: 200px">
					</DatePicker>
				</FormItem>
				<FormItem label="结束时间:">
					<DatePicker v-model="form.endTime" @on-change="validateFor('time')" format="yyyy年MM月dd日" type="date" placeholder="Select date" style="width: 200px">
					</DatePicker>
				</FormItem>
				<FormItem label="活动商品:">
					<Row>
						<Col><Button @click="clickSelectProduct">选择商品</Button></Col>
					</Row>
					<div style="max-height: 300px; overflow-y: scroll; ">
						<productSelector
							:list="activityProds" 
							@on-selection-change="handleSelect"
						>
						<!-- <Col span="8"><Button type="warning"	>取消选择</Button></Col>
						<Col span="8"><Input style=""></Input></Col>
						<Col span="8" style="text-align: right;">
						<Button type="primary" @click="handleFind">查询</Button></Col> -->
					</productSelector>
				</div>
				</FormItem>
				<FormItem label="活动状态:">
					<Select v-model="form.status">
						<Option :value="1">上线</Option>
						<Option :value="0">下线</Option>
					</Select>
				</FormItem>
			</Form>
		</Modal>
		<Modal v-model="productListEditor.isShow" @on-ok="submitSelect">
			<productSelector
				v-if="productListEditor.isShow"
				:list="productListEditor.list" 
				:total="productListEditor.count" 
				@on-selection-change="handleSelectReduce"
				@on-change="selectorChangePage"
				:showPage="true"

				>
				<Col span="8">
					<span>分类：</span>
					<Select v-model="productListEditor.search.cateId" style="display: inline-block; width: 100px;">
						<Option v-for="item in productListEditor.cateList" :value="item._id" :key="item._id">
						{{item.name}}
						</Option>
					</Select>
				</Col>
				<span>关键字：</span>
				<Input v-model="productListEditor.search.searchText" style="width: 86px;"></Input>
				<Button type="primary" @click="handelSearchProducts">查询</Button>
			</productSelector>
		</Modal>
	</div>
</template>

<script>
	import { getProductList, searchProduct, getProductCateList, getActivity, updateActivity, createActivity } from '@/services/Api/'
	import { upload } from '@/mixin'
	import productSelector from './productSelector'
	export default {
		mixins: [ upload ],
		props: {
			editor: {
				default: {
					form: {
						products: []
					}
				}
			}
		},
		components: {
			productSelector
		},
		data () {
			return {
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
			clickSelectProduct () {
				this.productListEditor.isShow = true
				this.handleFind()
			},
			handleSelect (selection) {
				console.log(selection)
				this.form.products = selection

			},
			handleSelectReduce (selection) {
				let selectedIds = this.productListEditor.selected.map(prod => prod._id)
				this.productListEditor.selected = selection.filter(prod => !~selectedIds.indexOf(prod._id)).concat(this.productListEditor.selected)
			},
			submit () {
				let form = {...this.form}
				form.thumb = this.uploadList[0] && this.uploadList[0].url
				form.products = this.form.products.map(prod => prod._id)
				// if (form.products && !form.products.length) form.products = '\[\]'
				if (form._id) {
					form.id = form._id
					updateActivity(form).then(res => {
						this.$emit('on-ok')
						this.$Message.success('编辑成功！')
					}).catch(err => {
						this.$Message.error('编辑失败！')
					})
				} else {
					createActivity(form).then(res => {
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
			submitSearch () {
				this.searchProduct()
			},
			changeSort () {

			},
			selectorChangePage () {

			},
			handleFind () {
				getProductList().then(res => {
					res.list = res.list || []
					res.list = res.list.map(prod => {
						if (~this.activityProdIds.indexOf(prod._id)) {
							prod._checked = true 
						}
						return prod
					})
					this.initProductListEditor()
					this.productListEditor.isShow = true
					this.productListEditor.list = res.list || []
					this.productListEditor.count = res.count || 0
					getProductCateList().then(res => this.productListEditor.cateList = res)
				})
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
			},
			handelSearchProducts () {
				searchProduct(this.productListEditor.search).then(res => {
					res.list = res.list.map(prod => {
						if (~this.activityProdIds.indexOf(prod._id)) {
							prod._checked = true 
						}
						return prod
					})
					this.productListEditor.list = res.list || []
					this.productListEditor.count = res.count || 0
				})
			},
			submitSelect () {
				this.productListEditor.isShow = false
				let productIds = this.editor.form.products.map(prod => prod._id)
				this.editor.form.products = this.activityProds.concat(this.productListEditor.selected.filter(prod => !~productIds.indexOf(prod._id))).map(prod => {
					prod._checked = true 
					return prod
				})
				// updateActivity({products: this.productListEditor.selected, id: this.form._id})
			}
		},
		mounted () {
			let thumb = this.form.thumb 
			if (thumb)this.defaultList = [{
				'name': thumb.split('/upload/')[1],
        'url': thumb
			}]
			
			this.uploadList = this.$refs.upload.fileList 

		}
	}
</script>

<style type="text/css">

</style>
