<template>
  <div class="product-page">
    <div class="container">商品列表</div>
    <div class="container">
      <div class="produt-tool">
        <Button @click="isBatch = !isBatch">批量编辑</Button>
        <div class="batch-group" v-show="isBatch">
          <Button @click="handleSelectAll(true)">全选</Button>
          <Button @click="handleSelectAll(false)">全不选</Button>
          <Button type="error" @click="batchAction('delete',)">删除</Button>
        </div>
        <Button class="fr" type="primary" @click="action('add')">增加分类</Button>
      </div>
      <div class="product-list">
        <Table border :columns="columns" :data="cateList" @on-sort-change="changeSort" @on-selection-change="handleSelectChange" ref="table"></Table>
      </div>
    </div>
    <Modal v-model="cateEditor.isShow" @on-ok="submit">
      <Form :label-width="80">
        <FormItem label="分类名">
          <Col span="20">
            <Input v-model="cateEditor.form.name"/>
          </Col>
        </FormItem>
        <FormItem label="字段">
          <Col span="20">
            <Input v-model="cateEditor.form.field"/>
          </Col>
        </FormItem>
        <FormItem label="包含属性" prop="proProps">
          <Col span="20">
            <Select v-model="cateEditor.form.props" multiple>
              <Option v-for="prop in cateEditor.props" :key="prop._id" :value="prop._id">{{prop.name}}</Option>
            </Select>
          </Col>
        </FormItem>
        <FormItem label="分类级别">
          <Col span="20">
            <Select v-model="cateEditor.form.level">
              <Option v-for="item in 3" :key="item" :value="item">{{item}}</Option>
            </Select>
          </Col>
        </FormItem>
        <FormItem label="排序">
          <Col span="20">
            <Input v-model="cateEditor.form.sort"/>
          </Col>
        </FormItem>
        <FormItem label="父分类">
          <Col span="20">
            <Select v-model="cateEditor.form.pid">
              <Option :value="''">无</Option>
              <Option v-for="cate in cateEditor.cates" :key="cate._id" :value="cate._id">{{cate.name}}</Option>
            </Select>
          </Col>
        </FormItem>
      </Form>
    </Modal>
  </div>
</template>

<script>
import {getProductList} from "../../services/Api";
export default {
  name: 'ProductCate',
  data () {
    return {
      isBatch: false,
      cateList: [],
      columns: [
        {
          title: '分类名',
          key: 'title',
          // sortable: true,
          render: (h, params) => {
            if (params.row.editable === undefined) this.$set(params.row, 'editable', false)
            return h('SInput', {
              attrs: {
                value: params.row.name
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
          title: '字段',
          key: 'field'
        },
        {
          title: '排序',
          key: 'sort',
          sortable: 'custom'
        },
        {
          title: '包含属性',
          key: 'props',
          render: (h, params) => {
            if (!params.row.props) return
            let nodes = params.row.props.map(prop => {
              return h('li', prop.name)
            })
            return h('ul', nodes)
          }
        },
        // {
        //   title: '父级分类',
        //   key: 'pid',
        //   render: (h, params) => {
        //     if (!params.row.pid) return
        //     const pnodes = params.row.pid.map((pcate) => {
        //       return h('li', pcate.name)
        //     })
        //     return h('ul', pnodes)
        //   }
        // },
        {
          title: '操作',
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
                    this.action('edit', params.row)
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
                    this.action('delete', params.row)
                  }
                }
              }, '删除')
            ])
          }
        }
      ],
      selectedIds: [],
      data5: [],
      cateEditor: {
        isShow: false,
        props: [],
        cates: [],
        _id: '',
        form: {
          props: []
        }
      },
      listReq: {
        order: {
          key: '',
          value: ''
        },
        curtPage: 1,
        pageSize: 10,
        loading: false
      }
    }
  },
   methods: {
    initForm () {
      // this.cateEditor.cates = [{name: '无', _id: ''}]
      this.cateEditor._id = ''
      this.cateEditor.form.props = []
      this.cateEditor.form.name = ''
      this.cateEditor.form.field = ''
      this.cateEditor.form.sort = ''
      this.cateEditor.form.pid = ''
      this.cateEditor.form.level = 1

    },
    getProductCateList (listReq) {
      return this.Api.getProductCateList(listReq || '').then(res => {
        this.cateList = res
      })
    },
    submit () {
      let data = this.cateEditor.form
      let id = this.cateEditor._id || 'add'
      this.Api.postEditCate(data, id).then(res => {
        this.$Message.success('添加分类成功！')
        this.getProductCateList()
      }).catch(err => this.$Message.error(err.errMsg))
    },
    getProductPropList () {
      return this.Api.getProductPropList().then(res => {
        this.cateEditor.props = res
      })
    },
    deleProductCate (ids) {
      ids = Array.isArray(ids) ? ids : ids.split(',').filter(id => id)
      this.Api.deleteProductCate({id: ids}).then(ids => {
        this.$Message.success('删除成功！')
        this.getProductCateList()
      })
    },
    action (name, curtCate) {
      let id = curtCate ? curtCate._id : ''
      this.cateEditor._id = id
      switch (name) {
        case 'delete':
          this.deleProductCate(id)
          break
        case 'edit':
          this.cateEditor.cates = this.cateList.filter(cate => cate.level < curtCate.level)
          this.Api.getProductCate(id).then(res => {
            this.cateEditor.form = res
            this.cateEditor.form.props = this.cateEditor.props.map((prop => prop._id))
            this.cateEditor.isShow = true
          })
          break
        case 'add':
          this.initForm()
          this.cateEditor.cates = [...this.cateList]
          this.cateEditor.isShow = true
        default:
      }
    },
    batchAction(actionType, actionField, actionValue) {
      this.$Http.post('/product/cate/batch', {ids: this.selectedIds, actionType, actionField,  actionValue}).then((res)  => {
        this.$Message.success('操作成功！')
        this.getProductCateList()
        this.handleSelectAll(false)
      })
    },
    handleSelectAll (status) {
      this.$refs.table.selectAll(status)
    },
    handleSelectChange (selection) {
      this.selectedIds = selection.map(row => row._id)
    },
    changeSort ({key, order}) {
      console.log(key, order)
      let sortVals = ['asc', 'desc', 'nomal']
      let cfg = this.listReq
      if (sortVals.indexOf(order) == 1) key = '-' + key 
      let reqStr = `?sort=${key}&pageSize=${cfg.pageSize}&curtPage=${cfg.curtPage}`
      this.getProductCateList(reqStr)
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
    this.getProductCateList()
    this.getProductPropList()
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
