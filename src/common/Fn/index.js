import Vue from 'vue'
import { appRoutes } from '@/router/router'
import help from '@/util/help'

let _routes = help.cloneDeep(appRoutes)
export function dynmicCreateRoutes() {
  let hasPermssion = Vue.prototype.$hasPermssion
  let defaultRoutes = ['404', 'login', 'home']
  return _routes.filter(route => {
    if (~defaultRoutes.indexOf(route.name)) return true
    // 使用的嵌套路由,先判断子路由的权限
    route.children = route.children.filter(childRoute => {
      // ps: nameArr = ['product', 'index'] || ['product', 'cate']
      let nameArr = childRoute.name.split('_')
      nameArr[1] = nameArr[1] === 'index' ?  nameArr[0] : nameArr[1] 
      return hasPermssion(nameArr.join('.'))
    })
    return !!route.children.length
  })
  
}

// TODO permission战且写死，之后会作为参数传入。
export function hasPermssion() {
  let permission = {
    product: {
      product: ['create', 'delete', 'update', 'query'],
      cate: ['create', 'delete', 'update', 'query'],
      prop: ['create', 'delete', 'update', 'query']
    },
    order: {
      order: ['create', 'delete', 'update', 'query']
    }
  }
  return function (permitStr) {
    // ps permitStr = product.prop
    if (!permitStr) return false
    let myPermit = permission
    let hasPermssion, curtPermit, permissionArr 
    let permitArr = permitStr.split('.')
    for (let i = 0; i < permitArr.length; i++) {
      let permitKey = permitArr[i]
      if (help.isObject(myPermit)) {
        myPermit = myPermit[permitKey]
        hasPermssion = !!myPermit
      } else if (Array.isArray(myPermit)) {
        hasPermssion = !!~myPermit.indexOf(permitKey)
      } else {
        hasPermssion = false
      }
    }
    return hasPermssion
  }
}