// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import routes from './router'
import vueRouter from 'vue-router'
import Iview from 'iview'
import 'iview/dist/styles/iview.css'
import './assets/style/main.less'
import VueComponents from './components/common'
import * as Api from '@/services/Api'
import Http from '@/services/Api/Http'
import help from '@/util/help'

Vue.use(Iview)

Object.keys(VueComponents).forEach((key) => Vue.component(key, VueComponents[key]))

Vue.config.productionTip = false
Vue.prototype.Api = Api
Vue.prototype.$Http = Http
Vue.prototype.$help = help


getAdminInfo()


/* eslint-disable no-new */

function initApp (routes) {
  Vue.use(vueRouter)
  let router = new vueRouter ({
    mode: 'history',
    routes
  })
  window.$VUE_ADMIN = new Vue({
    el: '#app',
    router: router,
    components: { App },
    template: '<App/>'
  })
}

function dynmicCreateRoutes() {
  let hasPermit = Vue.prototype.$hasPermit
  let defaultRoutes = ['404', 'login']
  return routes.filter(route => {
    if (~defaultRoutes.indexOf(route.name)) return true
    return hasPermit(route.name)
  })
}

function hasPermssion(permission) {
  return function (permitStr) {
    if (!permitStr) return false
    let myPermit = permission
    let hasPemit, curtPermit
    let permitArr = permitStr.split('.')
    permitArr.forEach(permit => {
      if (help.isObject(myPermit)) {
        myPermit = myPermit[permit]
        hasPemit = !!myPermit
      }
      if (Array.isArray(myPermit)) {
        hasPemit = ~myPermit.indexof(permit)
      } else {
        hasPemit = false
      }
    })
    return hasPemit
  }
}
function getAdminInfo() {
  Http.post('/admin/info')
  .then(res => {
    Vue.prototype.$hasPermit = hasPermssion(res.permission)
    initApp(dynmicCreateRoutes())

  })
  .catch(err => {
    console.log('neterror')
    Vue.prototype.$hasPermit = hasPermssion({})
    initApp(dynmicCreateRoutes())
    window.$VUE_ADMIN.$router.push({name: 'login'})
  })

}
