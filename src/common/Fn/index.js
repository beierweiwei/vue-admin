import Vue from 'vue'
import { appRoutes } from '@/router/router'
import help from '@/util/help'
export const dynmicCreateRoutes = () => {
  let _routes = help.cloneDeep(appRoutes)
  let hasPermission = Vue.prototype.$hasPermission
  let defaultRoutes = ['404', 'login', 'home', 'index']
  return _routes.filter(route => {
    if (~defaultRoutes.indexOf(route.name)) return true
    // 使用的嵌套路由,先判断子路由的权限
    route.children = route.children.filter(childRoute => {
      // ps: nameArr = ['product', 'index'] || ['product', 'cate']
      let nameArr = childRoute.name.split('_')
      nameArr[1] = nameArr[1] === 'index' ?  nameArr[0] : nameArr[1] 
      return hasPermission(nameArr.join('.'))
    })
    return !!route.children.length
  })
  
}

// TODO permission战且写死，之后会作为参数传入。
export const hasPermission = (permission) => {
  return function (permitStr) {
    // ps permitStr = product.prop
    if (!permitStr) return false
    let myPermit = permission
    let res, curtPermit, permissionArr 
    let permitArr = permitStr.split('.')
    for (let i = 0; i < permitArr.length; i++) {
      let permitKey = permitArr[i]
      if (help.isObject(myPermit)) {
        myPermit = myPermit[permitKey]
        res = !!myPermit
      } else if (Array.isArray(myPermit)) {
        res = !!~myPermit.indexOf(permitKey)
      } else {
        res = false
      }
    }
    return res
  }
}