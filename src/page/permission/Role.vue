<template>
  <div class="role-page">
    <div class="page-title">角色编辑</div>
    <div class="container">
      <Form :label-width="60">
        <FormItem :label="status ==='add' ? '新增角色' :'选择角色'" style="margin-bottom: 0">
          <Col>
          <Input v-if="status === 'add'" v-model="editor.roleName" style="width: 200px" key="add"></Input>
          <Select v-if="status !== 'add'" v-model="editor.roleName" style="width:200px" @on-change="getRolePermission" :disabled="!!this.status">
            <Option v-for="item in roleList" :value="item.roleName" :key="item.roleName">{{ item.roleName }}</Option>
          </Select>
          <Button v-show="!status" type="primary" @click="edit('edit')" style="margin-left: 10px;">编辑</Button>
          <Button v-show="!status" type="error" @click="deleteRole " style="margin-left: 10px;">删除</Button>
          <Button v-show="!status" type="primary" @click="edit('add')" style="margin-left: 10px;">新增</Button>
          <Button v-show="status" type="primary" style="margin-left: 10px;" @click="submit">确认</Button>
          <Button v-show="status" type="primary" style="margin-left: 10px;" @click="cancel">取消</Button>
          </Col>
        </FormItem>
      </Form>
    </div>
    <div class="page-title">权限编辑</div>
    <Card v-for="permissionkey in Object.keys(permissionEditor)" class="permission-card" :key="permissionkey" shadow>
      <slot name="title">
        <!-- <Checkbox></Checkbox> --><span>{{trancelate[permissionkey] + '管理'}}</span></slot>
      <Row>
        <Col span="12" v-for="(subpermission, subKey) in permissionEditor[permissionkey]" :key="subKey">
        <p>{{trancelate[subKey]}}</p>
        <p>
          <CheckboxGroup v-model="editor.permission[permissionkey][subKey]">
            <Checkbox v-for="action in subpermission" :label="action" :disabled="!status" :key="action">{{trancelate[action]}}</Checkbox>
          </CheckboxGroup>
        </p>
        </Col>
      </Row>
    </Card>
  </div>
</template>
<script>
import { getRole, getRoleList, createRole, updateRole, deleteRole } from '@/services/Api'
import { permission, trancelate } from '@/util/constants'

let editor = {
  roleName: '',
  permission: {
    product: {
      product: [],
      cate: [],
      prop: []
    },
    user: {
      user: []
    },
    order: {
      order: []
    },
    postage: {
      postage: []
    },
    article: {
      article: [],
      cate: [],
    },
    admin: {
      role: []
    }
  },
  level: 3
}

export default {
  name: 'Role',
  props: {
    editData: {}
  },
  data() {
    return {
      status: '',
      permissionEditor: permission,
      trancelate,
      roleCount: 0,
      roleList: [],
      editor: this.$help.cloneDeep(editor),
      _editor: null,
      user: null,
      reqConfig: {
        pageSize: 10,
        curtPage: 1
      }
    }
  },
  components: {

  },
  methods: {
    getRoleList() {
      return getRoleList(this.reqConfig).then(res => {
        this.roleList = res.list
        this.roleCount = res.count
      })
    },
    edit(status) {
      this._editor = this.$help.cloneDeep(this.editor)
      
      if (status === 'add') {
        this.status = status
        this.editor = this.$help.cloneDeep(editor)
      } else if (status === 'edit') {
        if (!this.editor.roleName) return
        this.status = status
      }
    },
    cancel() {
      this.status = ''
      this.editor = this._editor
    },
    submit(status) {
      if (this.status === 'add') {
        this.addRole()
      } else if (this.status === 'edit') {
        this.updateRole()
      }
      this.status = ''

    },
    getRolePermission(val) {
      getRole(val).then(res => {
        let permission = this.$help.cloneDeep(editor.permission)
        this.editor.permission = this.$help.merge(permission, res.permission)
        this.edit.roleName = res.roleName

      })
    },
    addRole() {
      return createRole(this.editor).then(res => {
        this.$Message.success('新增成功')
        this.getRoleList()
      }).catch(err => this.$Message.error('新增失败！'))
    },
    updateRole() {
      if (!this.editor.roleName) return 
      return updateRole(this.editor).then(res => {
        this.$Message.success('编辑成功')
        this.getRoleList()
      }).catch(err => this.$Message.error('编辑失败！'))
    },
    deleteRole() {
      if (!this.editor.roleName) return
      return deleteRole({ roleName: this.editor.roleName }).then(res => {
        this.$Message.success('删除成功')
        this.getRoleList().then(() => {
          this.editor = this.$help.cloneDeep(editor)
        })
      }).catch(err => {
        this.$Message.error('删除失败！')
      })
    }

  },
  created() {
    let user = JSON.parse(this.$help.cookie.get('user')) || {}
    if (!user.level && user.level !== 0) user.level = 3
    // 0 super 1 admin 2 normal
    if (user.level > 1) {
      delete this.permissionEditor.admin
    }
    this.getRoleList().then(() => {
      if (this.roleList.length > 0) this.editor.roleName = this.roleList[0].roleName
    })
  },
  mounted() {

  }
}

</script>
<style scoped>
.permission-card {
  margin-bottom: 12px;
}

</style>
