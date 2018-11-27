// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import { router } from './router'
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


function getAdminInfo() {
  Http.post('/admin/info').then(res => {
    Vue.prototype.$hasPemit = function(permitStr) {
      if (permitStr) return false
      let myPermit = res.permission
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
    window.$VUE_ADMIN = new Vue({
      el: '#app',
      router,
      components: { App },
      template: '<App/>'
    })
  })
}
