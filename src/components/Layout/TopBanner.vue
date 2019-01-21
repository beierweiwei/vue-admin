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
            <Dropdown @on-click="handleClick" style="text-align: left">
                <Badge dot count="4">
                   <Avatar  :src="user.avatar"  icon="ios-person" size="small"/>
                </Badge>
                <Icon type="arrow-down-b" ></Icon>
                <DropdownMenu slot="list">
                    <DropdownItem>通知</DropdownItem>
                    <DropdownItem name="/admin/info">我的信息</DropdownItem>
                    <DropdownItem name="logout">退出</DropdownItem>
                </DropdownMenu>
            </Dropdown>

           <!--  <router-link to="/admin/info">{{user.username}}</router-link> -->
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
      this.$help.cookie.set('user', '')
      this.$router.push('/login/login')
    },
    handleClick (name) {
      console.log(name)
      switch (name) {
        case 'logout':
          this.logout()
          break;
        default:
          this.$router.push(name)
      }
    }
  },
  mounted () {
    // 获取用户信息
    let user = this.$help.cookie.get('user')
    this.user = JSON.parse(user)
    // if (!user) {
    //   this.$router.push('/login/login')
    // }else {
    //   this.user = JSON.parse(user)
    // }
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
