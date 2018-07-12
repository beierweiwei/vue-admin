import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/page/Home'
import Product from '@/page/product'
import ProductEdit from '@/page/product/ProductEdit'
import ProductCate from '@/page/product/ProductCate'
import ProductProp from '@/page/product/ProductProp'

import Delivery from '@/page/delivery'
import Order from '@/page/order'
import User from '@/page/user/user'
import Pay from '@/page/pay/pay'
import Trade from '@/page/trade/trade'
import Login from '@/page/login/Login'
import Register from '@/page/login/Register'
import Page404 from '@/page/error/404'
import Page500 from '@/page/error/500'
import Main from '@/page/Main'
import AdminCenter from '@/page/login/User'
const loginRoute = [
  {
    path: '/login/login',
    name: 'login',
    component: Login,
    title: '登陆'
  },
  {
    path: '/login/register',
    name: 'register',
    component: Register
  },
  {
    path: '/login/admincenter',
    name: 'admincenter',
    component: AdminCenter
  }
]
const errorRoutes = [
  {
    path: '*',
    name: '404',
    component: Page404,
    title: '错误页'
  },
  {
    path: '/500',
    name: '500',
    component: Page500
  }
]

export const appRoutes = [
  {
    path: '/',
    redirect: '/home/index',
    title: '首页'
  },
  {
    path: '/home',
    name: 'home',
    component: Main,
    redirect: '/home/index',
    children: [
      {
        path: 'index',
        component: Home,
        name: 'home_index',
        title: '首页'
      }
    ]
  },
  {
    path: '/order',
    name: 'order',
    component: Main,
    children: [
      {
        path: 'index',
        component: Order,
        name: 'order_index',
        meta: {
          title: '订单管理'
        }
      }
    ]

  },
  {
    path: '/delivery',
    name: 'delivery',
    component: Main,
    children: [
      {
        path: 'index',
        component: Delivery,
        name: 'delivery_index',
        meta: {
          title: '配送管理'
        }
      }
    ]
  },
  {
    path: '/user',
    name: 'user',
    component: Main,
    children: [{
      path: 'index',
      component: User,
      name: 'user_index',
      meta: {
        title: '用户管理'
      }
    }
      // {
      //   path: 'edit',
      //   component: UserEditor,
      //   name: 'user_editor'
      // }
    ]
  },
  {
    path: '/pay',
    name: 'pay',
    component: Main,
    children: [
      {
        path: 'index',
        component: Pay,
        name: 'pay_index',
        meta: {
          title: '支付管理'
        }
      }
    ]
  },
  {
    path: '/trade',
    name: 'trade',
    component: Main,
    children: [
      {
        path: 'index',
        component: Trade,
        name: 'trade_index'
      }
    ]
  },
  {
    path: '/product',
    name: 'product',
    component: Main,
    children: [
      {
        path: 'index',
        component: Product,
        name: 'product_index',
        meta: {
          title: '商品列表',
          ptitle: '商品管理'
        }
      },
      {
        path: 'edit/:id',
        component: ProductEdit,
        name: 'product_edit',
        meta: {
          title: '新增/编辑商品',
          ptitle: '商品管理'
        }
      },
      {
        path: 'cate',
        component: ProductCate,
        name: 'product_cate',
        meta: {
          title: '商品分类',
          ptitle: '商品管理'
        }
      },
      {
        path: 'prop',
        component: ProductProp,
        name: 'product_prop',
        meta: {
          title: '商品属性',
          ptitle: '商品管理'
        }
      }
    ]
  }
]
export default [
  ...appRoutes,
  ...loginRoute,
  ...errorRoutes
]
