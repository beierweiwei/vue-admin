<template>
  <div class="product-page">
    <div class="page-title">商品列表</div>
    <div class="container">
      <div class="produt-tool">
        <Button @click="isBatch = !isBatch">批量编辑</Button>
        <div class="batch-group" v-show="isBatch">
          <Button @click="handleSelectAll(true)">全选</Button>
          <Button @click="handleSelectAll(false)">全不选</Button>
          <Button type="error" @click="batchAction('delete',)">删除</Button>
        </div>
        <Button class="fr" type="primary" @click="editor.isShow = true">增加属性</Button>
      </div>
      <div class="product-list">
        <Table border :columns="columns" :data="list" on-sort-change="changeSort" @on-selection-change="handleSelectChange"></Table>
      </div>
    </div>
    <Modal v-model="editor.isShow" @on-ok="submit">
      <Form :label-width="80">
        <FormItem label="属性名">
          <Col span="20">
            <Input v-model="editor.form.name"/>
          </Col>
        </FormItem>
        <FormItem label="字段">
          <Col span="20">
            <Input v-model="editor.form.field"/>
          </Col>
        </FormItem>
        <FormItem label="是否多选" prop="proProps">
          <Col span="20">
            <RadioGroup v-model="editor.form.isMulit">
              <Radio :label="1">是</Radio>
              <Radio :label="0">否</Radio>
            </RadioGroup>
          </Col>
        </FormItem>
        <FormItem label="排序">
          <Col span="20">
            <Input v-model="editor.form.sort"/>
          </Col>
        </FormItem>
        <FormItem label="选择项">
          <Row v-for="(item, idx) in editor.form.selector" :key="idx">
            <Col span="20"><Input  v-model="editor.form.selector[idx]" /></Col>
            <Col v-if="idx === editor.form.selector.length - 1 " span="4" push="2"><Icon size="22" type="plus-circled" @click.native="addInput"></Icon></Col>
            <Col v-else span="4" push="2"><Icon size="22" type="minus-circled" @click.native="deleteInput(idx)"></Icon> </Col>
          </Row>
        </FormItem>
      </Form>
    </Modal>
  </div>
</template>

<script>
export default {
  name: 'ProductCate',
  data () {
    return {
      list: [],
      selectedIds: [],
      isBatch: false,
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
          sortable: true
        },
        {
          title: '是否多选',
          key: 'isMulit',
          render: (h, params) => {
            let value = params.row.isMulit ? '是' : '否'
            return h('span', value)
          }
        },
        {
          title: '选项',
          key: 'selector',
          render: (h, params) => {
            if (!params.row.selector) return
            const propSelect = params.row.selector.map((select) => {
              return h('li', select)
            })
            return h('ul', propSelect)
          }
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
                    this.action('edit', params.row._id)
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
                    this.action('delete', params.row._id)
                  }
                }
              }, '删除')
            ])
          }
        }
      ],
      data5: [],
      editor: {
        isShow: false,
        props: [],
        cates: [{name: '无', _id: ''}],
        _id: '',
        form: {
          selector: ['']
        }
      }
    }
  },
  methods: {
    getProductCateList () {
      return this.Api.getProductCateList().then(res => {
        this.editor.cates = res
      })
    },
    submit () {
      let data = this.editor.form
      let id = this.editor._id || 'add'
      this.Api.eidtProductProp(data, id).then(res => {
        this.$Message.success('编辑成功！')
        this.clearForm()
        this.getProductPropList()
      }).catch(err => this.$Message.error(err.errMsg))
    },
    getProductPropList () {
      this.Api.getProductPropList().then(res => {
        this.list = res
      })
    },
    deleteProductProp (ids) {
      ids = Array.isArray(ids) ? ids : ids.split(',').filter(id => id)
      this.Api.deleteProductProp({id: ids}).then(ids => {
        this.$Message.success('删除成功！')
        this.getProductPropList()
      })
    },
    action (name, id) {
      switch (name) {
        case 'delete':
          this.deleteProductProp(id)
          break
        case 'edit':
          this.Api.getProductProp(id).then(res => {
            this.editor.form = res
            this.editor._id = id
            this.editor.isShow = true
          })
        default:
      }
    },
    addInput () {
      this.editor.form.selector.push('')
    },
    deleteInput (idx) {
      this.editor.form.selector.splice(idx, 1)
    },
    init () {
      this.editor.form.selector = ['']
    },
    clearForm () {
      this.editor.form.field = ''
      this.editor.form.isMulit = 1,
      this.editor.form.name = ''
      this.editor.form.selector = ['']
      this.editor.form.sort = 0
    },
    batchAction(actionType, actionField, actionValue) {
      this.$Http.post('/product/prop/batch', {ids: this.selectedIds, actionType, actionField,  actionValue}).then((res)  => {
        this.$Message.success('操作成功！')
        this.getProductPropList()
        this.handleSelectAll(false)
      })
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
      console.log(val)
      if (val) {
        this.columns.unshift(item)
      }else {
        this.columns.shift()
      }
    }
  },
  mounted () {
    this.getProductPropList()
    this.init()
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
