<template>
  <div class="coupon-page">
    <div class="page-title">优惠券列表</div>
    <div class="container">
      <div class="produt-tool">
        <Button @click="isBatch = !isBatch">批量编辑</Button>
        <div class="batch-group" v-show="isBatch">
          <Button @click="handleSelectAll(true)">全选</Button>
          <Button @click="handleSelectAll(false)">全不选</Button>
          <Button type="primary" @click="updateCoupon({id: selectedIds, status: 1})">上线</Button>
          <Button type="warning" @click="updateCoupon({id: selectedIds, status: 0})">下线</Button>
          <Button type="error" @click="deleteCoupon(selectedIds)">删除</Button>
        </div>
        <Button class="fr" type="primary" @click="addCoupon" >增加优惠券</Button>
      </div>
      <div class="product-list">
        <Table border :columns="columns" :data="couponList" @on-sort-change="changeSort" @on-selection-change="handleSelectChange" ref="table"></Table>
        <Page style="margin-top: 10px" :total="count" :page-size="requestConfig.pageSize" @on-change="changePage" show-total></Page>
      </div>
    </div>
    <Editor :editor="editor" @on-ok="getCouponList"/>
  </div>
</template>

<script>
import { getCouponList, updateCoupon, getCoupon, deleteCoupon } from "@/services/Api"
import Editor from './editor'
import help  from '@/util/help'
const statusMap = {
  '0': '未开始',
  '1': '可使用',
  '2': '已过期'
}
export default {
  name: 'coupon',
  components: { Editor },
  data () {
    return {
      couponList: [],
      isBatch: false,
      selectedIds: [],
      columns: [
        {
          title: 'ID',
          key: '_id',
        },
        {
          title: '标题',
          key: 'title'
        },
        {
          title: '规则',
          key: 'thumb',
          render (h, params) {
            return h('span', {
    
            },
            [
              '满', params.row.full, '减', params.row.reduce  
            ])
          }
        },
        {
          title: '总数',
          key: 'total',
        },
        {
          title: '有效时间',
          key: 'time',
          render (h, params) {
            return h('span', [
              new Date(params.row.startTime).format('yyyy-MM-dd hh:mm:ss'),
              '--',
              new Date(params.row.endTime).format('yyyy-MM-dd hh:mm:ss')
            ])
          }
        },
        {
          title: '状态',
          key: 'isPublic',
          render: (h, params) => {
            let { status, startTime, endTime } = params.row
            let statusText = '已下线'
            let now = new Date().getTime()
            startTime = new Date(startTime).getTime()
            endTime = new Date(endTime).getTime()

            if (status) {
              if (now < startTime ) {
                statusText = '未开始'
              } else if (now > endTime) {
                statusText = '已结束'
              } else {
                statusText = '进行中'
              }
            } 
            return h('div', [statusText])
          }
        },
        {
          title: '时间',
          key: 'time',
          render: (h, params) => {
            const {startTime, endTime} = params.row 
            return h('div', [new Date(startTime).format('yyyy-MM-dd hh:mm'), '--', new Date(endTime).format('yyyy-MM-dd hh:mm')])
          }
        },
        {
          title: '限领',
          key: 'perMax'
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
                    this.handleEdit(params.row._id)
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
                    this.deleteCoupon(params.row._id)
                  }
                }
              }, '删除')
            ])
          }
        }
      ],
      count: 0,
      editor: {
        isShow: false,
        id: '',
        form: {
          rule: {

          },
          products: []
        }
      },
      requestConfig: {
        loading: true,
        curtPage: 1,
        pageSize: 2,
        sort: ''
      }
    }
  },
  methods: {
    addCoupon () {
      this.initEditorForm()
      this.editor.isShow = true
    },
    getCouponList () {
      return getCouponList(this.requestConfig).then((res) => {
        this.couponList = res.list
        this.count = res.count
      })
    },
    changePage (page) {
      this.requestConfig.curtPage = page
      this.getCouponList()
    },
    changeSort ({column, key, order}) {
      console.log(order)
      let mapSort = {asc: '', desc: '-', nomal: ''}
      this.requestConfig.sort = order !== 'normal' ? mapSort[order] + key : ''
      this.getCouponList()
    },
    deleteCoupon (id) {
      id = id || this.selectedIds
      deleteCoupon({id}).then(res => {
        this.$Message.success('删除成功!')
        this.getCouponList()
      }).catch(err => this.$Message.error('删除失败!'))
    },
    /**
     * [updatecoupon description]
     * @param  {object} data {id: id[] || id, fiedl: value}
     * @return {Promise}      
     */
    updateCoupon (data) { 
      return updateCoupon(data).then((res) => {
        this.$Message.success('编辑成功！')
        this.getCouponList()
        this.selectedIds = []
      }).catch(err => {
        this.$Message.error('编辑失败！')
      })
    },
    handleSelectAll (status) {
      this.$refs.table.selectAll(status)
    },
    handleSelectChange (selection) {
      this.selectedIds = selection.map(row => row._id)
    },
    initEditorForm () {
      this.editor.form = {
        title: '',
        desc: '',
        thumb: '',
        status: 1,
        startTime: '',
        endTime: '',
        rule: {
          full: '',
          reduce: ''
        },
        products: []
      }
    },
    handleEdit (id) {
      getCoupon(id).then(res => {
        res.products = res.products || []
        res.products = res.products.map((prod) => {
          prod._checked = true 
          return prod
        })
        this.editor.isShow = true 
        this.editor.form = res
      })
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
    this.getCouponList()
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
