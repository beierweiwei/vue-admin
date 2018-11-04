export const pagesMap = [
  {
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
    field: 'artic_index',
    child: true
  },
  {
    pid: 18,
    name: '文章列表',
    id: 1801,
    field: 'artic_list',
    child: false
  },
  {
    pid: 18,
    name: '分类管理',
    id: 1802,
    field: 'artic_cate',
    child: false
  },
  {
    pid: 0,
    name: '权限管理',
    id: 19,
    field: 'permit_index',
    child: true
  },
  {
    pid: 19,
    name: '角色列表',
    id: 1901,
    field: 'permit_role',
    child: false
  },
  {
    pid: 19,
    name: '权限设置',
    id: 1902,
    field: 'permit_permit',
    child: false
  }
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
export const productCates = [
  {
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
