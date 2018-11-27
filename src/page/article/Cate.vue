<template>
  <div class="product-page">
    <div class="page-title">商品列表</div>
    <div class="container">
      <div class="produt-tool">
        <Button @click="isBatch = !isBatch">批量编辑</Button>
        <div class="batch-group" v-show="isBatch">
          <Button @click="handleSelectAll(true)">全选</Button>
          <Button @click="handleSelectAll(false)">全不选</Button>
          <Button type="error" @click="batchAction('delete')">删除</Button>
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
        <FormItem label="排序">
          <Col span="20">
            <Input v-model="cateEditor.form.sort"/>
          </Col>
        </FormItem>
      </Form>
    </Modal>
  </div>
</template>

<script>
import { getArticleCateList, deleteArticleCate } from "../../services/Api";
export default {
  name: 'ArticleCate',
  data () {
    return {
      isBatch: false,
      cateList: [],
      columns: [
        {
          title: '分类名',
          key: 'name',
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
      reqConf: {
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
    getArticleCateList () {
      return getArticleCateList(this.reqConf).then(res => {
        this.cateList = res.list
      })
    },
    submit () {
      let data = this.cateEditor.form
      let id = this.cateEditor._id || 'add'
      this.Api.updateArticleCate({id, ...data}).then(res => {
        this.$Message.success('添加分类成功！')
        this.getArticleCateList()
      }).catch(err => this.$Message.error(err.errMsg))
    },
    deleteArticleCate (ids) {
      this.Api.deleteArticleCate({id: ids}).then(ids => {
        this.$Message.success('删除成功！')
        this.getArticleCateList()
      })
    },
    action (name, curtCate) {
      let id = curtCate ? curtCate._id : ''
      this.cateEditor._id = id
      switch (name) {
        case 'delete':
          this.deleteArticleCate(id)
          break
        case 'edit':
          this.Api.getArticleCate(id).then(res => {
            this.cateEditor.form = res
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
    batchAction(actionType, data = {}) {
      let actionMap = {
        delete: this.deleteArticleCate.bind(this),
        update: this.updateArticle.bind(this)
      }
      actionMap[actionType](data)
    },
    deleteArticleCate () {
      deleteArticleCate({id: this.selectedIds}).then(res => {
        this.$Message.success('操作成功！')
        this.getArticleCateList()
        this.handleSelectAll(false)
      })
    },
    updateArticle (data = {}) {
      updateArticle({id: this.selectedIds, ...data}).then(res => {
        this.$Message.success('操作成功！')
        this.getArticleCateList()
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
      let cfg = this.reqConf
      if (sortVals.indexOf(order) == 1) key = '-' + key 
      let reqStr = `?sort=${key}&pageSize=${cfg.pageSize}&curtPage=${cfg.curtPage}`
      this.getArticleCateList(reqStr)
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
    this.getArticleCateList()
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
