import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/page/home/index'
import Product from '@/page/product'
import ProductEdit from '@/page/product/ProductEdit'
import ProductCate from '@/page/product/ProductCate'
import ProductProp from '@/page/product/ProductProp'

import Postage from '@/page/postage'
import Order from '@/page/order'
import User from '@/page/user/user'
import Pay from '@/page/pay/pay'
import Trade from '@/page/trade/trade'
import Shop from '@/page/shop'
import Login from '@/page/login/Login'
// import Register from '@/page/login/Register'
import Page404 from '@/page/error/404'
import Page500 from '@/page/error/500'
import Main from '@/page/Main'
import AdminCenter from '@/page/login/User'
import Article from '@/page/article/index'
import ArticleCate from '@/page/article/cate'
import ArticleEdit from '@/page/article/Edit'
import Permission from '@/page/permission/Permission'
import PermissionEdit from '@/page/permission/edit'
import Role from '@/page/permission/Role'
import Activity from '@/page/activity/index'
import Coupon from '@/page/activity/coupon/index'
const loginRoute = [{
    path: '/login/login',
    name: 'login',
    component: Login,
    title: '登陆'
  },
  //  {
  //    path: '/login/register',
  //    name: 'register',
  //    component: Register
  //  },
  {
    path: '/login/admincenter',
    name: 'admincenter',
    component: AdminCenter
  }
]
const errorRoutes = [
// {
//     path: '*',
//     name: '404',
//     component: Page404,
//     title: '错误页'
//   },
  {
    path: '/500',
    name: '500',
    component: Page500
  }
]

export const appRoutes = [{
    path: '/',
    redirect: '/home/index',
    title: '首页',
    name: 'index'
  },
  {
    path: '/home',
    name: 'home',
    component: Main,
    redirect: '/home/index',
    children: [{
      path: 'index',
      component: Home,
      name: 'home_index',
      meta: {
        title: '首页'
      }
    }]
  },
  {
    path: '/order',
    name: 'order',
    component: Main,
    children: [{
      path: 'index',
      component: Order,
      name: 'order_index',
      meta: {
        title: '订单管理'
      }
    }]
  },
  {
    path: '/postage',
    name: 'postage',
    component: Main,
    children: [{
      path: 'index',
      component: Postage,
      name: 'postage_index',
      meta: {
        title: '运费管理'
      }
    }]
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
    children: [{
      path: 'index',
      component: Pay,
      name: 'pay_index',
      meta: {
        title: '支付管理'
      }
    }]
  },
  {
    path: '/shop',
    name: 'shop',
    component: Main,
    children: [{
      path: 'index',
      component: Shop,
      name: 'shop_index',
      meta: {
        title: '店铺管理'
      }
    }]
  },
  {
    path: '/trade',
    name: 'trade',
    component: Main,
    children: [{
      path: 'index',
      component: Trade,
      name: 'trade_index'
    }]
  },
  {
    path: '/product',
    name: 'product',
    component: Main,
    children: [{
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
  },
  {
    path: '/article',
    name: 'article',
    component: Main,
    children: [{
        path: 'index',
        component: Article,
        name: 'article_index',
        meta: {
          title: '文章列表',
          ptitle: '文章管理'
        }
      },
      {
        path: 'edit/:id',
        component: ArticleEdit,
        name: 'article_edit',
        meta: {
          title: '新增/编辑文章',
          ptitle: '文章管理'
        }
      },
      {
        path: 'cate',
        component: ArticleCate,
        name: 'article_cate',
        meta: {
          title: '文章分类',
          ptitle: '文章分类'
        }
      }
    ]
  },
  {
    path: '/permission',
    name: 'permission',
    component: Main,
    children: [{
        path: 'index',
        component: Permission,
        name: 'permission_index',
        meta: {
          title: '账号列表',
          ptitle: '权限管理'
        }
      },
      {
        path: 'edit/:id',
        component: PermissionEdit,
        name: 'permission_edit',
        meta: {
          title: '新增/编辑权限',
          ptitle: '权限管理'
        }
      },
      {
        path: 'role',
        component: Role,
        name: 'permission_role',
        meta: {
          title: '角色编辑',
          ptitle: '权限管理'
        }
      }
    ]
  },
  {
    path: '/activity',
    name: 'activity',
    component: Main,
    children: [{
        path: 'index',
        component: Activity,
        name: 'activity_index',
        meta: {
          title: '活动列表',
          ptitle: '活动管理'
        }
      },
      {
        path: 'coupon',
        component: Coupon,
        name: 'activity_coupon',
        meta: {
          title: '优惠券列表',
          ptitle: '活动管理'
        }
      }
    ]
  }
]

export const baseRoutes = [
  ...loginRoute,
  ...errorRoutes
]
export const routes =  [
  ...appRoutes,
  ...baseRoutes
]


