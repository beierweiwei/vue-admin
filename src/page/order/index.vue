<template>
  <div class="product-page">
    <div class="container">订单列表</div>
    <div class="container">
      <div class="produt-tool">
        <div class="produt-tool">
        <Button @click="isBatch = !isBatch">批量编辑</Button>
        <div class="batch-group" v-show="isBatch">
          <Button @click="handleSelectAll(true)">全选</Button>
          <Button @click="handleSelectAll(false)">全不选</Button>
          <Button type="error" @click="batchAction('delete', selectedIds)">删除</Button>
        </div>
      </div>
      </div>
      <div class="product-list">
        <Table border :columns="columns" :data="orders" on-sort-change="changeSort" @on-selection-change="handleSelectChange" ref="table"></Table>
      </div>
      <Page :total="pageConfig.count" @on-change="changePage" show-total style="margin-top: 10px"></page>
    </div>
    <orderEditor :editor=editor @update:list="getOrderList"></orderEditor>
  </div>
</template>

<script>
import { orderStatus } from '@/util/constants'
import { getOrderList, getOrder, deleteOrders } from '../../services/Api/index'
import orderEditor from './Edit.vue'
export default {
  name: 'order',
  components: {
    orderEditor
  },
  data () {
    return {
      editor: {
        isShow: false,
        id: '',
        form: {
          orderNo: '',
          address: {}

        }
      },
      isBatch: false,
      selectedIds: [],
      orders: [],
      pageConfig: {
        pageSize: 10,
        pageNum: 1,
        loading: false,
        count: 0
      },
      columns: [
        {
          title: '订单编号',
          key: 'orderNo'
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
                  product.props.map((prop,i) => prop + ':' + product.propItems.split(',')[i])
                    .join(','),
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
                    this.deleteOrders(params.row._id)
                  }
                }
              }, '删除')
            ])
          }
        }
      ]
    }
  },
  methods: {
    handleSelectAll (status) {
      this.$refs.table.selectAll(status)
    },
    handleSelectChange (selection) {
      this.selectedIds = selection.map(row => row._id)
    },
    changeSort ({column, key, order}) {
      let mapSort = {asc: '', desc: '-', nomal: ''}
      this.getProdConfig.sort = order !== 'normal' ? mapSort[order] + key : ''
      this.getUserList()
    },
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
    deleteOrders (ids) {
      ids = ids || this.selectedIds 
      if (!ids) return 
      return deleteOrders(ids).then(res => {
        this.$Message.success('删除成功！')
        this.getOrderList()
      })
    },
    updateOrders (ids) {
      ids = ids  || this.selectedIds 
      if (!ids) return 
      return updateOrders(ids).then(res => {
        this.$Message.success('编辑成功！')
        this.getUserList()
      })
    },
    edit (idx) {
      let order = this.orders[idx]
      if (order && order._id) {
        console.log(idx)
        this.editor.isShow = true
        this.editor.id = order._id
      }
    },
    changePage (page) {
      this.pageConfig.pageNum = page
      this.getOrderList()
    },
    batchAction (actionType, ids, modify) {
      ids = ids || this.selectedIds 
      const isBatch = Array.isArray(ids)
      //todo
      switch (actionType) {
        case 'edit':
          this.updateOrders(ids, modify)
          break
        case 'delete':
          this.deleteOrders(ids)
          break
        default:
      }
    },
    initList () {

    }
  },
  watch: {
    isBatch (val) {
      let item = {
        type: 'selection',
        width: 60,
        align: 'center'
      }
      if (val) {
        this.columns.unshift(item)
      }else {
        this.columns.shift()
      }
      this.$refs.table.selectAll(false)
    }
  },
  created () {
    this.getOrderList()
  }
}
</script>

<style lang="less">

</style>
