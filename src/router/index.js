import Vue from 'vue'
import Router from 'vue-router'
import routes from './router.js'
Vue.use(Router)
export const router = new Router({
  mode: 'history',
  routes
})

// router.beforeEach((from, to, next) => {
//   if (window.$VUE_ADMIN.$hasPermit(to.field)) {
//   	Router.push('/')
//   } else {
//   	next()
//   }
// })
