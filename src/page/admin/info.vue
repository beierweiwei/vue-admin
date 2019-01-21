<template>
	<div class="page-main admin-center-page">
		<div class="page-title">管理员信息</div>
		<div class="container">
			<Form :label-width="80">
				<FormItem label="角色">
					<Input :value="form.role" disabled/>
				</FormItem>

				<FormItem label="用户名">
					<Input :value="form.username" disabled/>
				</FormItem>

				<FormItem label="昵称">
					<Input v-model="form.nickname"/>
				</FormItem>

				<FormItem label="性别">
					<RadioGroup v-model="form.sex">
						<Radio :label="1">男</Radio>
						<Radio :label="0">女</Radio>
					</RadioGroup>
				</FormItem>

				<FormItem label="上传头像">
				  <div class="demo-upload-list" v-for="(item, idx) in uploadList.slice(-1)" :key="idx">
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

				<FormItem label="手机">
					<Input v-model="form.tel"/>
				</FormItem>

				<FormItem label="邮箱">
					<Input v-model="form.mail"/>
				</FormItem>

				<FormItem >
					<Button type="primary" @click="unpdateAdminInfo">确认修改</Button>
				</FormItem>
			</Form>

		</div>
	</div>
</template>

<script>
import upload from '@/mixin/upload'
import { getAdminInfo, updateAdminInfo } from '@/services/Api'
export default {
	name: 'admin-info',
	mixins: [upload],
	data () {
		return {
			form: {
				role: '',
				username: '',
				nickname: '',
				sex: 0,
				avatar: '',
				tel: '',
				mail: ''
			}
		}
	},
	methods: {
		getAdminInfo () {
			return getAdminInfo().then(res => {
				this.form = res || {}
			})
		},
		unpdateAdminInfo () {
			const avatarUrlObj = [...this.uploadList].pop() || {}
			updateAdminInfo({...this.form, avatar: avatarUrlObj.url})
			.then(res => {
				this.$Message.success('更新管理员信息成功！')
			})
			.catch(err => this.$Message.error('更新管理元信息失败！'))
		}
	},
	created () {
		this.getAdminInfo().then(() => {
			let avatar = this.form.avatar
			console.log(avatar)
			if (avatar) this.defaultList = [{
				'name': avatar.split(/(\/|\\)upload\1/)[2],
	      'url': avatar
			}]
			this.$nextTick(() => {
				this.uploadList = this.$refs.upload.fileList
			})})
	},
	mounted () {

	}
}
</script>

<style lang="less">

</style>