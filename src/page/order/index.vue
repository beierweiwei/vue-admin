<template>
  <div class="product-page">
    <div class="container">订单列表</div>
    <div class="container">
      <div class="produt-tool">
        <Button>批量编辑</Button>
        <!--<Button @click="$router.push('product/detail/2')">增加商品</Button>-->
      </div>
      <div class="product-list">
        <Table border :columns="columns5" :data="orders"></Table>
      </div>
    </div>
  </div>
</template>

<script>
import {orderStatus} from '@/util/constants'
export default {
  name: 'order',
  data () {
    return {
      orders: [
        {
          ctime: '2018-6-28 19:10:22',
          id: '123123123123123',
          status: '0', // 0为支付 1待发货 2待收货 3已完成
          pay: {
            id: '123213123123123',
            platform: 'alipay',
            money: '22',
            ctime: '2018-6-28 19:09:12'
          },
          product: [
            {
              name: '小短裙 2019年新款 小清新小短裙',
              unit: '件',
              num: 2,
              price: 55,
              count: 110,
              discount: 0,
              image: null
            },
            {
              name: '小短裙 2019年新款 小清新小短裙',
              unit: '件',
              num: 2,
              price: 55,
              count: 110,
              discount: 0,
              image: null
            }
          ],
          user: {
            id: '123',
            name: 'awang',
            tel: '12368132987',
            address: '湖北省武汉市关南小区'
          },
          business: {
            id: '123213',
            name: '微商城旗舰店'
          }
        },
        {
          ctime: '2018-6-28 19:10:22',
          id: '123123123123123',
          status: '0', // 0为支付 1待发货 2待收货 3已完成
          pay: {
            id: '123213123123123',
            platform: 'alipay',
            money: '22',
            ctime: '2018-6-28 19:09:12'
          },
          product: [
            {
              name: '小短裙 2019年新款 小清新小短裙',
              unit: '件',
              num: 2,
              price: 55,
              count: 110,
              discount: 0,
              image: null
            },
            {
              name: '小短裙 2019年新款 小清新小短裙',
              unit: '件',
              num: 2,
              price: 55,
              count: 110,
              discount: 0,
              image: null
            }
          ],
          user: {
            id: '123',
            name: 'awang',
            tel: '12368132987',
            address: '湖北省武汉市关南小区'
          },
          business: {
            id: '123213',
            name: '微商城旗舰店'
          }
        },
        {
          ctime: '2018-6-28 19:10:22',
          id: '123123123123123',
          status: '0', // 0为支付 1待发货 2待收货 3已完成
          pay: {
            id: '123213123123123',
            platform: 'alipay',
            money: '22',
            ctime: '2018-6-28 19:09:12'
          },
          product: [
            {
              name: '小短裙 2019年新款 小清新小短裙',
              unit: '件',
              num: 2,
              price: 55,
              count: 110,
              discount: 0,
              image: null
            },
            {
              name: '小短裙 2019年新款 小清新小短裙',
              unit: '件',
              num: 2,
              price: 55,
              count: 110,
              discount: 0,
              image: null
            }
          ],
          user: {
            id: '123',
            name: 'awang',
            tel: '12368132987',
            address: '湖北省武汉市关南小区'
          },
          business: {
            id: '123213',
            name: '微商城旗舰店'
          }
        },
        {
          ctime: '2018-6-28 19:10:22',
          id: '123123123123123',
          status: '0', // 0为支付 1待发货 2待收货 3已完成
          pay: {
            id: '123213123123123',
            platform: 'alipay',
            money: '22',
            ctime: '2018-6-28 19:09:12'
          },
          product: [
            {
              name: '小短裙 2019年新款 小清新小短裙',
              unit: '件',
              num: 2,
              price: 55,
              count: 110,
              discount: 0,
              image: null
            },
            {
              name: '小短裙 2019年新款 小清新小短裙',
              unit: '件',
              num: 2,
              price: 55,
              count: 110,
              discount: 0,
              image: null
            }
          ],
          user: {
            id: '123',
            name: 'awang',
            tel: '12368132987',
            address: '湖北省武汉市关南小区'
          },
          business: {
            id: '123213',
            name: '微商城旗舰店'
          }
        },
        {
          ctime: '2018-6-28 19:10:22',
          id: '123123123123123',
          status: '0', // 0为支付 1待发货 2待收货 3已完成
          pay: {
            id: '123213123123123',
            platform: 'alipay',
            money: '22',
            ctime: '2018-6-28 19:09:12'
          },
          product: [
            {
              name: '小短裙 2019年新款 小清新小短裙',
              unit: '件',
              num: 2,
              price: 55,
              count: 110,
              discount: 0,
              image: null
            },
            {
              name: '小短裙 2019年新款 小清新小短裙',
              unit: '件',
              num: 2,
              price: 55,
              count: 110,
              discount: 0,
              image: null
            }
          ],
          user: {
            id: '123',
            name: 'awang',
            tel: '12368132987',
            address: '湖北省武汉市关南小区'
          },
          business: {
            id: '123213',
            name: '微商城旗舰店'
          }
        },
        {
          ctime: '2018-6-28 19:10:22',
          id: '123123123123123',
          status: '0', // 0为支付 1待发货 2待收货 3已完成
          pay: {
            id: '123213123123123',
            platform: 'alipay',
            money: '22',
            ctime: '2018-6-28 19:09:12'
          },
          product: [
            {
              name: '小短裙 2019年新款 小清新小短裙',
              unit: '件',
              num: 2,
              price: 55,
              count: 110,
              discount: 0,
              image: null
            },
            {
              name: '小短裙 2019年新款 小清新小短裙',
              unit: '件',
              num: 2,
              price: 55,
              count: 110,
              discount: 0,
              image: null
            }
          ],
          user: {
            id: '123',
            name: 'awang',
            tel: '12368132987',
            address: '湖北省武汉市关南小区'
          },
          business: {
            id: '123213',
            name: '微商城旗舰店'
          }
        }
      ],
      columns5: [
        {
          title: '订单编号',
          key: 'id'
        },
        {
          title: '时间',
          key: 'ctime'
        },
        {
          title: '商品',
          key: 'product',
          render: (h, param) => {
            let productRenders = []
            param.row.product.forEach(product => {
              productRenders.push(
                h('div', {
                  style: {
                    width: '100px',
                    height: '60px'
                  }
                },
                [
                  product.name,
                  h('img', {
                    attrs: {
                      src: product.image
                    }
                  }),
                  h('span', [
                    product.price + '元/' + product.unit + 'x' + product.num
                  ])
                ])
              )
            })
            return h('div', {
              attrs: {

              },
              style: {
                height: '120px',
                width: '200px'
              }
            },
            productRenders
            )
          }
        },
        {
          title: '支付',
          key: 'pay',
          render: (h, param) => {
            return h('div', [
              param.row.pay.id + '\n' + param.row.pay.platform + '\n' + param.row.pay.money + '元'
            ])
          }
        },
        {
          title: '用户',
          key: 'user',
          render (h, param) {
            return h('div', [
              param.row.id + '\n' + param.row.user.name + '\n' + param.row.user.address + '\n' + param.row.user.tel
            ])
          }
        },
        {
          title: '商家',
          key: 'business',
          render (h, param) {
            return h('div', [
              param.row.business.id + '\n' + param.row.business.name

            ])
          }
        },
        {
          title: '订单状态',
          key: 'status',
          render (h, param) {
            return h('div', [
              orderStatus[param.row.status]
            ])
          }
        },
        {
          title: 'Action',
          key: 'action',
          width: 150,
          align: 'center',
          render: (h, params) => {
            return h('div', [
              h('Button', {
                props: {
                  type: 'primary',
                  size: 'small'
                },
                style: {
                  marginRight: '5px'
                },
                on: {
                  click: () => {
                    this.show(params.index)
                  }
                }
              }, '编辑'),
              h('Button', {
                props: {
                  type: 'error',
                  size: 'small'
                },
                on: {
                  click: () => {
                    this.remove(params.index)
                  }
                }
              }, '删除')
            ])
          }
        }
      ]
    }
  }
}
</script>

<style lang="less">

</style>
