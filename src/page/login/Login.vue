<template>
  <div class="login-page">
    <Card class="login-box" title="MY SHOP">
      <Form ref="formCustom" :model="formCustom" :rules="ruleCustom" :label-width="80">
        <FormItem label="用户名" prop="username">
          <Input type="text" v-model="formCustom.username" autofocus/>
        </FormItem>
        <FormItem label="密码" prop="password">
          <Input type="password" v-model="formCustom.password"/>
        </FormItem>
        <FormItem label="验证码" prop="validateCode">
          <Input type="text" v-model="formCustom.validateCode" style="width:100px"/>
          <span class="captcha-box" @click="getValidateCode"><img    :src="validateCodeUrl"/></span>
        </FormItem>
        <FormItem>
          <Button type="primary" @click="handleSubmit('formCustom')">登陆</Button>
        </FormItem>
      </Form>
    </Card>
  </div>
</template>
<script>
import Vue from 'vue'
import { postLogin } from '@/services/Api'
import { dynmicCreateRoutes, hasPermission } from '@/common/Fn'
import help from '@/util/help'
export default {
  name: 'Login',
  data () {
    return {
      validateCodeUrl: '/api/admin/captcha',
      formCustom: {
        username: '',
        password: '',
        validateCode: ''
      },
      ruleCustom: {
        password: [
          {required: true, message: '请输入密码', trigger: 'blur'}
          // { validator: validatePass, trigger: 'blur' }
        ],
        username: [
          {required: true, message: '请输入用户名', trigger: 'blur'}
        ],
        validateCode: [
          {required: true, message: '请输入验证码', trigger: 'blur'}
        ]
      },
      permission: {}
    }
  },
  methods: {
    handleSubmit (name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          this.postLogin()
        } else {
          this.$Message.error('Fail!')
        }
      })
    },
    getValidateCode () {
      this.validateCodeUrl = '/api/admin/captcha?' + Date.now()
    },
    postLogin () {
      postLogin(this.formCustom).then((res) => {
        this.$Message.success('登陆成功！')
        this.$help.cookie.set('user', res)
        // this.reInitApp(res)
        location.href = '/'
      }).catch(err => {
        this.$Message.error(err.errMsg)
        this.getValidateCode()
      })
    },
    reInitApp (user) {
      
      Vue.prototype.$hasPermission = hasPermission(user.permission)
      this.addRoutes()
      this.$router.push({name: 'home'})
    },
    addRoutes () {
      this.$router.addRoutes(dynmicCreateRoutes())
    }
  }
}
</script>
<style lang="less">
.login-page {
  padding-top: 10px;
  background: #3498DB;
  height: 100%;
  .login-box {
    width: 320px;
    margin: 100px auto 0;
  }
  .captcha-box {
    img {
      // width: 25px;
      height: 32px;
      vertical-align: middle;
    }
  }
  form {
    /*border: 1px solid #ccc;*/
    border-radius: 5px;
    background: rgba(255, 255, 255, .2);
    .text-to-register {
      margin-left: 20px;
      vertical-align: bottom;
      color: #569dff;
    }
  }
  .site-title {
   text-align: center;

  }
}
</style>
