<template>
  <Form :label-width="60">
    <FormItem label="用户名">
      <Col span="20">
        <Input v-model="editData.editor.username"/>
      </Col>
    </FormItem>
    <FormItem :label="editData.editor._id ? '更新密码' : '密码'">
      <Col span="20">
        <Input v-model="editData.editor.password"/>
      </Col>
    </FormItem>
    <FormItem label="角色">
      <Col span="20">
        <Select v-model="editData.editor.role">
          <Option v-for="role in roleList" :value="role._id" :key="role.roleName">{{role.roleName}}</Option>
        </Select>
      </Col>
    </FormItem>
    <FormItem label="手机号">
      <Col span="20">
        <Input v-model="editData.editor.tel"/>
      </Col>
    </FormItem>
   
    <FormItem label="是否禁用">
      <RadioGroup v-model="editData.editor.block">
        <Radio :label="0">启用</Radio>
        <Radio :label="1">禁用</Radio>
      </RadioGroup>
    </FormItem>
  </Form>
</template>

<script>
import { getRoleList } from '@/services/Api'
export default {
  name: 'PermissionEdit',
  props: {
    editData: {
      default: {
        editor: {}
      }
    }
  },
  data () {
    return {
      roleList: []
    }
  },
  components: {
    
  },
  mounted () {
    getRoleList().then((res)=> {
      this.roleList = res.list 
    })
  },
}
</script>

<style scoped>

</style>
