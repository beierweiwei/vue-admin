export const pagesMap = [{
    pid: 0,
    id: 12,
    name: '首页',
    field: 'home_index'
  },
  {
    name: '商品管理',
    pid: 0,
    id: 1,
    field: 'product_index',
    child: true,
  },
  {
    name: '商品列表',
    pid: 1,
    id: 101,
    field: 'product_index'
  },
  {
    name: '商品分类',
    pid: 1,
    id: 102,
    field: 'product_cate'
  },
  {
    name: '商品属性',
    pid: 1,
    id: 103,
    field: 'product_prop'
  },
  {
    pid: 0,
    name: '用户管理',
    id: 4,
    field: 'user_index',
    child: false
  },
  {
    pid: 0,
    name: '活动管理',
    id: 5,
    field: 'activity',
    child: true
  },
  {
    pid: 5,
    name: '活动列表',
    id: 501,
    field: 'activity_index'
  },
  {
    pid: 5,
    name: '优惠券列表',
    id: 502,
    field: 'activity_coupon',
  },
  {
    pid: 0,
    name: '订单管理',
    id: 6,
    field: 'order_index',
    child: false
  },
  {
    pid: 0,
    id: 8,
    name: '运费管理',
    field: 'postage_index',
    child: false
  },
 
  // {
  //   pid: 3,
  //   name: '库存管理',
  //   id: 9,
  //   field: 'stock_index',
  //   child: false
  // },
  // {
  //   pid: 0,
  //   name: '店铺管理',
  //   id: 13,
  //   field: 'shop_index',
  //   child: false
  // },
  // {
  //   pid: 0,
  //   name: '支付管理',
  //   id: 16,
  //   field: 'pay_index',
  //   child: false
  // },
  // {
  //   pid: 0,
  //   name: '活动管理',
  //   id: 17,
  //   field: 'activity_index',
  //   child: true
  // },
  // {
  //   pid: 17,
  //   name: '活动列表',
  //   id: 1701,
  //   field: 'activity_list',
  //   child: false
  // },
  {
    pid: 0,
    name: '文章管理',
    id: 18,
    field: 'article',
    child: true
  },
  {
    pid: 18,
    name: '文章列表',
    id: 1801,
    field: 'article_index',
    child: false
  },
  {
    pid: 18,
    name: '分类管理',
    id: 1802,
    field: 'article_cate',
    child: false
  },
  {
    pid: 0,
    name: '权限管理',
    id: 19,
    field: 'permission',
    child: true
  },
  {
    pid: 19,
    name: '账号列表',
    id: 1901,
    field: 'permission_index',
    child: false
  },
  {
    pid: 19,
    name: '角色编辑',
    id: 1902,
    field: 'permission_role',
    child: false
  },

  // tabel: '表格',
  // editalbeTabel: '可编辑表格',
  // searchableTabel: '可搜索表格',
  // tabelExport: '表格导出',
  // tabelToPic: '表格转图片',
  // advanceRoute: '高级路由',
  // dymicRoute: '动态路由',
  // errorPage: '错误页面',
  // chart: '图表',
  // form: '表单编辑'
]
export const productCates = [{
    name: 'cloth',
    id: 0,
    zn: '服饰'
  },
  {
    name: 'digit',
    id: 1,
    zn: '数码'
  },
  {
    name: 'house',
    id: 2,
    zn: '家居'
  },
  {
    name: 'food',
    id: 3,
    zn: '食品/饮料'
  },
  {
    name: 'baby',
    id: 4,
    zn: '母婴'
  }
]
export const orderStatus = ['未支付', '待发货', '待收货', '已完成']

// super 可以编辑所有管理员账号权限，
// nomal 可以编辑管理员以下账号权限，和新增角色，但是不能编辑admin权限
export const permission = {
  product: {
    product: ['update', 'delete', 'add', 'query'],
    cate: ['update', 'delete', 'add', 'query'],
    prop: ['update', 'delete', 'add', 'query']
  },
  user: {
    user: ['update', 'delete', 'add', 'query']
  },
  order: {
    order: ['update', 'delete', 'add', 'query']
  },
  postage: {
    postage: ['update', 'delete', 'add', 'query']
  },
  article: {
    article: ['update', 'delete', 'add', 'query'],
    cate: ['update', 'delete', 'add', 'query'],
  },
  admin: {
    role: ['update', 'delete', 'add', 'query'],
  }
}

export const trancelate = {
  'add': '增',
  'delete': '删',
  'update': '改',
  'query': '查',
  'product': '商品',
  'productManage': '商品管理',
  'postage': '运费',
  'postageManage': '运费管理',
  'user': '用户',
  'userManage': '用户管理',
  'order': '订单',
  'orderManage': '订单管理',
  'article': '文章',
  'articleManage': '文章管理',
  'cate': '分类',
  'productCate': '商品分类',
  'articleCate': '文章分类',
  'prop': '属性',
  'productProp': '商品属性',
  'admin': '账号权限',
  'role': '角色'
}

export const couponTypeMap = {
  "1": '平台通用',
  "2": '活动优惠'
}
