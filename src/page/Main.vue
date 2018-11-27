<template>
  <div id="main">
    <Layout style="height: 100%;">
      <Sider hide-trigger v-model="isShow"  collapsible :collapsed-width="40" width="160">
        <SiderCop @check-menu="checkMenu"  :curtPage="curtPage"></SiderCop>
      </Sider>
      <Layout class="page">
        
        <TopBanner :pages-map="pagesMap" :curt-page="curtPage" :user="user" ></TopBanner>
        <div style="margin-bottom: 6px; margin-top: 6px;">
          <LabelColumn :pages="pages" :curt-page-idx.sync="curtPageIdx" :pages-map="pagesMap" @closePage="closePage"></LabelColumn>
        </div>
        <Content>
          <keep-alive>
            <router-view/>
          </keep-alive>
        </Content>
        <Footer>footer</Footer>
      </Layout>
    </Layout>
  </div>
</template>
<script>
import {SiderCop, TopBanner, LabelColumn} from '@/components/Layout'
// import Login from '@/page/login/Login'
import {pagesMap} from '@/util/constants'
import {appRoutes} from '@/router/router'
export default {
  name: 'Main',
  components: {
    SiderCop,
    TopBanner,
    LabelColumn
  },
  data () {
    return {
      isShow: false,
      pages: [],
      curtPageIdx: 0,
      deleteIdx: 0,
      pagesMap: pagesMap,
      isLogin: true,
      appRoutes,
      user: {
        nickname: 'awang'
      }
    }
  },
  computed: {
    curtPage () {
      return this.pages[this.curtPageIdx]
    }
  },
  methods: {
    checkMenu (page) {
      console.log('chekMemu')
    },
    closePage (idx) {
      this.pages.splice(idx, 1)
      // this.deleteIdx = idx
      if (idx <= this.curtPageIdx) {
        if (this.curtPageIdx === this.pages.length) this.curtPageIdx--
      }
    },
    async getLoginStatue () {
      setTimeout(this.isLogin = true, 400)
    }
  },
  watch: {
    $route (val) {
      if (!this.pages) return 
      
      let curtPageIdx = this.pages.findIndex((page) => page.name === val.name)
        
      if (!~curtPageIdx) {
        this.pages.push(val)
        this.curtPageIdx = this.pages.length - 1
      } else {
        this.curtPageIdx = curtPageIdx
        this.pages.splice(curtPageIdx, 1, val)
      }
    },
    curtPageIdx (val) {
      // todo 增加商品页面和此处有冲突，新打开商品页面，保留的是add的route，到编辑的时候编辑的参数会传步过去，考虑更改跳转模式
      if (val !== undefined && this.pages[val]) {
        let route = this.pages[val]
        let routeObj = {name: route.name, query: route.query, params: route.params}
        this.$router.push(routeObj)
      }
    }
  },
  mounted () {
    // window.SHOP_ADMIN_GLOBAL.pages = this.pages
    this.pages.push({name: 'home_index', meta: {title: '首页'}})
    if (!~this.pages.map(item => item.name).indexOf(this.$route.name)){
      this.pages.push(this.$route)
    }
    this.curtPageIdx = this.pages.length - 1
    this.getLoginStatue().then()
  }
}
</script>

<style lang="less">
  @import url(~@/assets/style/main.less);
  html, body, #main {
    height: 100%;
  }
  #app {
    height: 100%;
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    color: #2c3e50;
    /*margin-top: 60px;*/
  }
</style>
