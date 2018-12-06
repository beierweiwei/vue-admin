// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import vueRouter from 'vue-router'
import { baseRoutes, appRoutes } from './router/router'
import Iview from 'iview'
import 'iview/dist/styles/iview.css'
import './assets/style/main.less'
import VueComponents from './components/common'
import * as Api from '@/services/Api'
import Http from '@/services/Api/Http'
import help from '@/util/help'
import { dynmicCreateRoutes, hasPermission} from '@/common/Fn'

Vue.use(Iview)

Object.keys(VueComponents).forEach((key) => Vue.component(key, VueComponents[key]))

Vue.config.productionTip = false
Vue.prototype.Api = Api
Vue.prototype.$Http = Http
Vue.prototype.$help = help
initApp()
getAdminInfo()



/* eslint-disable no-new */

function initApp (routes) {
  Vue.use(vueRouter)
  let router = new vueRouter ({
    mode: 'history',
    routes: baseRoutes
  })
  window.$VUE_ADMIN = new Vue({
    el: '#app',
    router: router,
    components: { App },
    template: '<App/>'
  })
}


function getAdminInfo() {
  Http.post('/admin/info')
  .then(res => {
    Vue.prototype.$hasPermission = hasPermission(res.permission)
    // 生成动态路由一定要在给vue原型绑定hasPermission后
    console.log(appRoutes)
    let allowedRoutes = res.level < 2 ? appRoutes : dynmicCreateRoutes()
    Vue.prototype.$allowedRoutes = allowedRoutes
    window.$VUE_ADMIN.$router.addRoutes(allowedRoutes)
  })
  .catch(err => {
    console.log('net error')
    Vue.prototype.$hasPermission = hasPermission({})
    // initApp(dynmicCreateRoutes())
    window.$VUE_ADMIN.$router.push({name: 'login'})
  })

}
