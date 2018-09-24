<template>
  <Form :label-width="60">
    <FormItem label="昵称">
      <Col span="20">
        <Input v-model="editData.editor.username"/>
      </Col>
    </FormItem>
    <FormItem label="手机号">
      <Col span="20">
        <Input v-model="editData.editor.tel"/>
      </Col>
    </FormItem>
    <FormItem label="金额">
      <Col span="20">
        <Input v-model="editData.editor.money"/>
      </Col>
    </FormItem>
    <FormItem label="性别">
      <RadioGroup v-model="editData.editor.sex">
        <Radio :label="0">男</Radio>
        <Radio :label="1">女</Radio>
      </RadioGroup>
    </FormItem>
    <FormItem label="生日" prop="birth">
      <Col span="24">
        <DatePicker type="date" placeholder="选择生日" v-model="editData.editor.birth"></DatePicker>
      </Col>
    </FormItem>
    <Address :editData="editData"></Address>
  </Form>
</template>

<script>
import Address from './address'
import { getUser } from '@/services/Api'
export default {
  name: 'Edit',
  props: {
    editData: {}
  },
  data () {
    return {

    }
  },
  components: {
    Address
  },
  mounted () {
  }
}
</script>

<style scoped>

</style>
