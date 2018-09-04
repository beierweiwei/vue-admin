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
      <Page :total="pageConfig.count" @on-change="changePage" show-total style="margin-top: 10px"></page>
    </div>
    <Modal v-model="editor.isShow">
      <Form>
        <FormItem>
          
        </FormItem>
      </Form>
    </Modal>
  </div>
</template>

<script>
import { orderStatus } from '@/util/constants'
import { getOrderList, getOrder, deleteOrder } from '../../services/Api/index'
export default {
  name: 'order',
  data () {
    return {
      orders: [],
      pageConfig: {
        pageSize: 10,
        pageNum: 1,
        loading: false,
        count: 0
      },
      columns5: [
        {
          title: '订单编号',
          key: '_id'
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
            param.row.products.forEach((product, idx) => {
              productRenders.push(
                h('div', {
                  style: {
                    width: '100px',
                    height: '60px'
                  }
                },
                [
                  product.title + ' ',
                  product.props + ' ',
                  // h('img', {
                  //   attrs: {
                  //     src: product.thumbPic
                  //   }
                  // }),
                  h('span', [
                    product.price + '元/' + product.unit + 'x' + param.row.nums[idx]
                  ])
                ])
              )
            })
            return h('div', {
              style: {
                height: '120px',
                width: '250px'
              }
            },productRenders)
          }
        },
        {
          title: '总金额',
          key: 'total'
        },
        {
          title: '购买用户',
          key: 'user',
          render (h, param) {
            return h('div', [
              param.row.user.username + '\n' + param.row.address.areaName + param.row.address.detail +  param.row.address.tel
            ])
          }
        },
        // {
        //   title: '商家',
        //   key: 'business',
        //   render (h, param) {
        //     return h('div', [
        //       param.row.business.id + '\n' + param.row.business.name

        //     ])
        //   }
        // },
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
                    this.edit(params.index)
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
      ],
      editor: {
        isShow: false,
        form: {

        }
      }
    }
  },
  methods: {
    remove (idx) {
      let order = this.orders[idx]
      if (order) {
        deleteOrder(order._id).then((data) => {
          this.getOrderList()
        })
      }
    },
    getOrderList () {
      let {pageSize, pageNum } = this.pageConfig
      return getOrderList({pageSize, pageNum}).then(data => {
        this.orders = data.list
        this.pageConfig.count = data.count
      })
    },
    edit (idx) {
      let order = this.orders[idx]
      if (order && order._id) {
        this.editor.isShow = true
        getOrder(order._id).then(data => {
          this.editor.form = data
        })
      }
    },
    changePage (page) {
      this.pageConfig.pageNum = page
      this.getOrderList()
    }
  },
  created () {
    this.getOrderList()
  }
}
</script>

<style lang="less">

</style>
