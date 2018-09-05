<template>
  <div class="product-page">
    <div class="container">商品列表</div>
    <div class="container">
      <div class="produt-tool">
        <Button @click="isBatch = !isBatch">批量编辑</Button>
        <div class="batch-group" v-show="isBatch">
          <Button @click="handleSelectAll(true)">全选</Button>
          <Button @click="handleSelectAll(false)">全不选</Button>
          <Button type="primary" @click="batchAction('edit','isSale', 1)">上架</Button>
          <Button type="warning" @click="batchAction('edit', 'isSale', 0)">下架</Button>
          <Button type="error" @click="batchAction('delete',)">删除</Button>
        </div>
        <Button class="fr" type="primary" @click="$router.push('edit/add')" >增加商品</Button>
      </div>
      <div class="product-list">
        <Table border :columns="columns" :data="prodList" @on-sort-change="changeSort" @on-selection-change="handleSelectChange" ref="table"></Table>
        <Page style="margin-top: 10px" :total="count" :page-size="getProdConfig.pageSize" @on-change="changePage" show-total></Page>
      </div>
    </div>
  </div>
</template>

<script>
import { getProductList, editProduct, deleteProduct } from "../../services/Api"
export default {
  name: 'product',
  data () {
    return {
      prodList: [],
      isBatch: false,
      selectedIds: [],
      columns: [
        {
          title: '标题',
          key: 'title',
          // sortable: true,
          render: (h, params) => {
            if (params.row.editable === undefined) this.$set(params.row, 'editable', false)
            return h('SInput', {
              attrs: {
                value: params.row.title
              },
              props: {
                isEdit: params.row.editable
              },
              on: {
                'update:isEdit': (val) => {
                  params.row.editable = val
                  if (!val) {
                    console.log(val)
                    this.edit(params.index, 'title', params.row.title)
                  }
                  
                },
                'input': (val) => {
                  params.row.title = val
                }
              }
            })
          }
        },
        {
          title: '图片',
          key: 'image',
          render: (h, params) => {
            return h('img', {
              attrs: {
                src: params.row.thumbPic[0]
              },
              style: {
                width: '60px',
                height: '60px'
              }
            })
          }
        },
        {
          title: '分类',
          key: 'cateId'
        },
        {
          title: '销量',
          key: 'saleNum',
          sortable: true
        },
        {
          title: '库存',
          key: 'stock'
        },
        {
          title: '上架',
          key: 'isSale',
          render: (h, params) => {
            if (params.row.isSale) {
              return h('div', [
                h('Button', {
                  props: {
                    type: 'error',
                    size: 'small'
                  },
                  style: {
                    marginRight: '5px'
                  },
                  on: {
                    click: () => {
                      this.edit(params.index, 'isSale', 0)
                    }
                  }
                }, '下架')
              ])
            } else {
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
                      this.edit(params.index, 'isSale', 1)
                    }
                  }
                }, '上架')
              ])
            }
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
                    this.$router.push({name: 'product_edit', params: {id: params.row._id}})
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
                    this.deleteProduct(params.index)
                  }
                }
              }, '删除')
            ])
          }
        }
      ],
      count: 0,
      getProdConfig: {
        loading: true,
        pageNum: 1,
        pageSize: 2,
        sort: ''
      },
      propList: [],
      cateList: []
    }
  },
  methods: {
    getProductList () {
      return getProductList(this.getProdConfig).then((res) => {
        this.prodList = res.list
        this.count = res.count
      })
    },
    changePage (page) {
      this.getProdConfig.pageNum = page
      this.getProductList()
    },
    changeSort ({column, key, order}) {
      console.log(order)
      let mapSort = {asc: '', desc: '-', nomal: ''}
      this.getProdConfig.sort = order !== 'normal' ? mapSort[order] + key : ''
      this.getProductList()
    },
    edit (idx, field, value) {
      const product = this.prodList[idx]
      console.log(this.prodList, idx, field, value)
      let data = {}
      data[field] = value
      editProduct(data, product._id).then(res  => {
        this.getProductList()
      })
    },
    deleteProduct (idx) {
      let id = this.prodList[idx]._id
      deleteProduct(id).then(res => {
        this.$Message.success('删除成功!')
        this.getProductList()
      }).catch(err => this.$Message.error('删除失败!'))
    },
    batchAction(actionType, actionField, actionValue) {
      this.$Http.post('/product/batch', {ids: this.selectedIds, actionType, actionField,  actionValue}).then((res)  => {
        this.$Message.success('操作成功！')
        this.getProductList()
        this.handleSelectAll(false)
      })
    },
    handleSelectAll (status) {
      this.$refs.table.selectAll(status)
    },
    handleSelectChange (selection) {
      this.selectedIds = selection.map(row => row._id)
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
  mounted () {
    this.getProductList()
  }
}
</script>

<style lang="less">
  .product-page {
    .product-list {
      margin-top: 20px;
    }
  }
</style>
