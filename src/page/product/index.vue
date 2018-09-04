<template>
  <div class="product-page">
    <div class="container">商品列表</div>
    <div class="container">
      <div class="produt-tool">
        <Button>批量编辑</Button>
        <Button @click="$router.push('edit/add')">增加商品</Button>
      </div>
      <div class="product-list">
        <Table border :columns="columns5" :data="data5"></Table>
      </div>
    </div>
  </div>
</template>

<script>
import {getProductList} from "../../services/Api"
export default {
  name: 'product',
  data () {
    return {
      prodList: [],
      columns5: [
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
                'update:isEdit': function (val) {
                  params.row.editable = val
                },
                'input': function (val) {
                  params.row.name = val
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
            if (params.row.isOnsell) {
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
                      this.show(params.index)
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
                    this.remove(params.index)
                  }
                }
              }, '删除')
            ])
          }
        }
      ],
      data5: [],
      propList: [],
      cateList: []
    }
  },
  mounted () {
    getProductList().then((res) => {
      this.data5 = res.list
    })

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
