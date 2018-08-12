<template>
  <div class="register-page">

    <Form ref="formCustom" :model="formCustom" :rules="ruleCustom" :label-width="80">
      <FormItem label="用户名" prop="username">
        <Input v-model="formCustom.username"/>
      </FormItem>
      <FormItem label="密码" prop="password">
        <Input v-model="formCustom.password" type="password"/>
      </FormItem>
      <FormItem label="确认密码" prop="passwordCheck">
        <Input v-model="formCustom.passwordCheck" type="password"/>
      </FormItem>
      <FormItem label="手机号" prop="tel">
        <Input v-model="formCustom.tel"/>
      </FormItem>
      <FormItem label="性别" prop="sex">
        <RadioGroup v-model="formCustom.sex">
          <Radio label="0">男</Radio>
          <Radio label="1">女</Radio>
        </RadioGroup>
      </FormItem>
      <FormItem label="生日" prop="birth">
        <Col span="11">
          <DatePicker type="date" placeholder="选择生日" v-model="formCustom.birth"></DatePicker>
        </Col>
      </FormItem>
      <FormItem>
        <Button type="primary" size="small" @click="submit">注册</Button>
        <span class="text-to-login">已有账号，去登陆>>></span>
      </FormItem>
    </Form>
  </div>
</template>
<script>
import {postRegister, getUserList} from '@/services/Api'
import {validate} from '@/util/validate'
export default {
  name: 'admincenter',
  data () {
    return {
      formCustom: {
        username: 'wangjunjie',
        password: 'wjj123',
        passwordCheck: 'wjj123',
        tel: '13268132987',
        sex: '0',
        birth: '1991-06-27'
      },
      ruleCustom: {
        password: [
          {required: true, message: '请输入密码', trigger: 'blur'},
          { type: 'string', min: 6, max: 16, message: '密码长度6-16位', trigger: 'blur' }
        ],
        passwordCheck: [
          {required: true, message: '请确认密码', trigger: 'blur'},
          {validator: this.validatePassCheck, trigger: 'blur'}
        ],
        username: [
          {required: true, message: '请输入用户名', trigger: 'blur'}
        ],
        tel: [
          {required: true, message: '请输入手机号', trigger: 'blur'},
          {validator: this.validateTel, trigger: 'blur'}
        ]
      }
    }
  },
  methods: {
    handleSubmit (name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          if (this.formCustom.username === 'wangjunjie' && this.formCustom.passwd === 'wjj123') {
            this.$router.push('/')
          } else {
            this.$Message.error('账号或密码错误！')
          }
        } else {
          this.$Message.error('Fail!')
        }
      })
    },
    postLogin () {
      postLogin()
    },
    validateTel (rule, value, callback) {
      if (!validate(value, 'tel')) {
        callback(new Error('起输入正确的电话号码'))
      } else {
        callback()
      }
    },
    validatePassCheck (rule, value, callback) {
      if (value !== this.formCustom.password) {
        callback(new Error('两次密码不一样'))
      } else {
        callback()
      }
    },
    submit () {
      this.$refs.formCustom.validate((val) => {
        if (val) {
          this.$Message.success('正在注册，请稍后！')
          postRegister(this.formCustom).then((res) => {

            this.$router.push({name: 'home'})
          }).catch((err) => {
            console.log('register error')
          })
        } else {
          this.$Message.error('填写有误，请重新填写表单！')
        }
      })

    }
  },
  mounted () {

  }
}
</script>
<style lang="less">
  .register-page {
    position: absolute;
    width: 100%;
    height: 100%;
    form {
      width: 300px;
      position: absolute;
      right: 20px;
      top: 20%;
      padding: 25px 20px 10px 15px;
      /*border: 1px solid #ccc;*/
      border-radius: 5px;
      background: rgba(255, 255, 255, .2);
      .text-to-login {
        margin-left: 20px;
        vertical-align: bottom;
        color: #569dff;
      }
    }
    .site-title {
      position: absolute;
      top: 10%;
      right: 20px;
      font-size: 22px;
      width: 300px;
      text-align: left;

    }
  }
</style>
