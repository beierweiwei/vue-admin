<template>
  <div class="top-banner">
    <Row>
      <Col span="10">
        <Breadcrumb>
          <BreadcrumbItem to="/home">首页</BreadcrumbItem>
          <template v-if="curtPage && curtPage.meta &&  curtPage.meta.ptitle">
            <BreadcrumbItem >{{curtPage.meta.ptitle}} </BreadcrumbItem>
          </template>
          <BreadcrumbItem v-if="curtPage && curtPage.meta && curtPage.meta.title">{{curtPage.meta.title}}
          </BreadcrumbItem>
        </Breadcrumb>
      </Col>
      <Col span="10" push="4">
        <div style="text-align: right">
          <template v-if="user">
            <span>用户：</span>
            <router-link :to="'/login/admincenter'">{{user.username}}</router-link>
            <span  @click="logout">退出</span>
          </template>
          <router-link v-else to="/login/login">登陆</router-link>
        </div>
      </Col>
    </Row>
  </div>
</template>

<script>
// import {pick, isNumber} from 'lodash'
export default {
  name: 'TopBanner',
  props: {
    curtPage: {
      type: Object
    },
    pagesMap: {}
  },
  data () {
    return {
      user: null
    }
  },
  computed: {
    parentPage () {
      let pagesMap = this.pagesMap
      let curtPage = this.curtPage
      if (curtPage && pagesMap[curtPage.name]) {
        return Object.keys(pagesMap).find((key) => {
          return this.pagesMap[key].id === pagesMap[this.curtPage.name]['pid']
        })
      }
    }
  },
  methods: {
    logout () {
      this.user = null
      this.help.cookie.set('user', '')
      this.$router.push('/login/login')
    }
  },
  mounted () {
    // 获取用户信息
    let user = this.help.cookie.get('user')
    if (!user) {
      this.$router.push('/login/login')
    }else {
      this.user = JSON.parse(user)
    }
  }
}
</script>

<style lang="less">
  .top-banner {
    height: 42px;
    line-height: 42px;
    background: #fff;
    padding-left: 20px;
    padding-right: 20px;
  }
</style>
