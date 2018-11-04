<template>
  <div class="product-page">
    <div class="container">运费列表</div>
    <div class="container">
      <!-- <div class="produt-tool">
        <Button @click="isBatch = !isBatch">批量编辑</Button>
        <div class="batch-group" v-show="isBatch">
          <Button @click="handleSelectAll(true)">全选</Button>
          <Button @click="handleSelectAll(false)">全不选</Button>
          <Button type="warning" @click="batchAction('delete', selectedIds)">编辑</Button>
        </div>
      </div> -->
      <div class="product-list">
        <Table border :columns="columns" :data="list" ref="table"></Table>
      </div>
    </div>
    <editor :editor="editor"  @update:list="getPostageList"></editor>
  </div>
</template>

<script>
import { getPostageList, updatePostage } from '../../services/Api/index'
import Editor from './Edit.vue'
export default {
  name: 'postage',
  components: {
    Editor
  },
  data () {
    return {
      editor: {
        isShow: false,
        form: {
          company: [],

        }
      },
      isBatch: false,
      selectedIds: [],
      list: [],
      columns: [
        {
          title: 'id',
          key: '_id'
        },
        {
          title: '地区',
          key: 'name'
        },
        {
          title: '快递公司',
          key: 'user',
          render (h, params) {
           let companys = params.row.company || []
           let renderRes =  companys.map((company, i) => {
              return  h('div', [
                company.name, 
                ': 起步价:', 
                company.price,
                ',续重:', 
                company.increacePrice, 
                params.row.default === i ? '默认' : ''])
            })
            return h('div', renderRes)
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
                  type: params.row.status ? 'error' : 'primary',
                  size: 'small'
                },
                on: {
                  click: () => {
                    this.updatePostage({
                      _id: params.row._id,
                      status: params.row.status ? 0 : 1
                    }, params.row)
                  }
                }
              }, params.row.status ? '禁用' : '启用')
            ])
          }
        }
      ],
      test: 1
    }
  },
  methods: {
    // handleSelectAll (status) {
    //   this.$refs.table.selectAll(status)
    // },
    // handleSelectChange (selection) {
    //   this.selectedIds = selection.map(row => row._id)
    // },
    getPostageList () {
      return getPostageList().then(data => {
        this.list = data
      })
    },
    updatePostage (data, oldData) {
      return updatePostage(data).then(res => {
        this.$Message.success('编辑成功！')
        if (oldData) {
          for (let i in data) {
            oldData[i] = data[i]
          }
        }
      })
    },
    edit (idx) {
      let item = this.list[idx]
      if (item && item._id) {
        this.test = 0
        this.editor.isShow = true
        this.editor.form = item
      }
    },
    // batchAction (actionType, ids, modify) {
    //   ids = ids || this.selectedIds
    //   const isBatch = Array.isArray(ids)
    //   //todo
    //   switch (actionType) {
    //     case 'edit':
    //       this.updateOrders(ids, modify)
    //       break
    //     case 'delete':
    //       this.deleteOrders(ids)
    //       break
    //     default:
    //   }
    // }
  },
  // watch: {
  //   isBatch (val) {
  //     let item = {
  //       type: 'selection',
  //       width: 60,
  //       align: 'center'
  //     }
  //     if (val) {
  //       this.columns.unshift(item)
  //     }else {
  //       this.columns.shift()
  //     }
  //     this.$refs.table.selectAll(false)
  //   }
  // },
  created () {
    this.getPostageList()
  }
}
</script>

<style lang="less">

</style>
