<template>
  <div class="login-page">
    <h3 class="site-title">
      简易商城系统123
    </h3>
    <Form ref="formCustom" :model="formCustom" :rules="ruleCustom" :label-width="80">
      <FormItem label="用户名" prop="username">
        <Input type="text" v-model="formCustom.username" autofocus/>
      </FormItem>
      <FormItem label="密码" prop="password">
        <Input type="password" v-model="formCustom.password"/>
      </FormItem>
      <FormItem>
        <Button type="primary" size="small" style="margin-top: -15px;" @click="handleSubmit('formCustom')">登陆</Button>
        <router-link to="/login/register" class="text-to-register">未注册>></router-link>
      </FormItem>
    </Form>
  </div>
</template>
<script>
import {postLogin} from '@/services/Api'
export default {
  name: 'Login',
  data () {
    return {
      formCustom: {
        username: '',
        password: ''
      },
      ruleCustom: {
        password: [
          {required: true, message: '请输入密码', trigger: 'blur'}
          // { validator: validatePass, trigger: 'blur' }
        ],
        username: [
          {required: true, message: '请输入用户名', trigger: 'blur'}
        ]
      }
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
    postLogin () {
      postLogin(this.formCustom).then((res) => {
        this.$Message.success('登陆成功！')
        this.help.cookie.set('user', res)
        this.$router.push({name: 'home'})
      }).catch((err) => {
        this.$Message.error('登陆失败！')
      })
    }
  }
}
</script>
<style lang="less">
.login-page {
  position: absolute;
  width: 100%;
  height: 100%;
  background: url('../../assets/imgs/login-bg.jpg') 100% 100%;
  form {
    width: 300px;
    position: absolute;
    right: 20px;
    top: 20%;
    padding: 25px 20px 10px 15px;
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
    position: absolute;
    top: 10%;
    right: 20px;
    font-size: 22px;
    width: 300px;
    text-align: left;

  }
}
</style>
