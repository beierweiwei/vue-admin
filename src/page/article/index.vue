<template>
  <div class="article-page">
    <div class="page-title">文章列表</div>
    <div class="container">
      <div class="produt-tool">
        <Button @click="isBatch = !isBatch">批量编辑</Button>
        <div class="batch-group" v-show="isBatch">
          <Button @click="handleSelectAll(true)">全选</Button>
          <Button @click="handleSelectAll(false)">全不选</Button>
          <Button type="primary" @click="updateArticle({id: selectedIds, isPublic: 1})">公开</Button>
          <Button type="warning" @click="updateArticle({id: selectedIds, isPublic: 0})">私有</Button>
          <Button type="error" @click="deleteArticle(selectedIds)">删除</Button>
        </div>
        <Button class="fr" type="primary" @click="addArticle" >增加文章</Button>
      </div>
      <div class="product-list">
        <Table border :columns="columns" :data="prodList" @on-sort-change="changeSort" @on-selection-change="handleSelectChange" ref="table"></Table>
        <Page style="margin-top: 10px" :total="count" :page-size="getProdConfig.pageSize" @on-change="changePage" show-total></Page>
      </div>
    </div>
  </div>
</template>

<script>
import { getArticleList, updateArticle, getArticle, deleteArticle } from "../../services/Api"
export default {
  name: 'Article',
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
          title: '分类',
          key: 'cate',
          render: (h, params) => {
            return h('span', [params.row.cate && params.row.cate.name])
          }
        },
        {
          title: '公开',
          key: 'isPublic',
          render: (h, params) => {
            if (params.row.isPublic) {
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
                      this.updateArticle({id: params.row._id, isPublic: 0})
                    }
                  }
                }, '私有')
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
                      this.updateArticle({id: params.row._id, isPublic: 1})
                    }
                  }
                }, '公开')
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
                    this.$router.push({name: 'article_edit', params: {id: params.row._id}})
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
                    this.deleteArticle(params.row._id)
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
        curtPage: 1,
        pageSize: 2,
        sort: ''
      }
    }
  },
  methods: {
    addArticle () {
      let rd =  Math.random().toString().substr(2, 10)
      this.$router.push({name: 'article_edit',query: {r: rd}, params: {id: 'add'}})
    },
    getArticleList () {
      return getArticleList(this.getProdConfig).then((res) => {
        this.prodList = res.list
        this.count = res.count
      })
    },
    changePage (page) {
      this.getProdConfig.curtPage = page
      this.getArticleList()
    },
    changeSort ({column, key, order}) {
      console.log(order)
      let mapSort = {asc: '', desc: '-', nomal: ''}
      this.getProdConfig.sort = order !== 'normal' ? mapSort[order] + key : ''
      this.getArticleList()
    },
    edit (idx, field, value) {
      const product = this.prodList[idx]
      let data = {}
      data[field] = value
      editProduct(data, product._id).then(res  => {
        this.getArticleList()
      })
    },
    deleteArticle (id) {
      id = id || this.selectedIds
      deleteArticle({id}).then(res => {
        this.$Message.success('删除成功!')
        this.getArticleList()
      }).catch(err => this.$Message.error('删除失败!'))
    },
    batchAction(actionType, actionField, actionValue) {
      this.$Http.post('/product/batch', {ids: this.selectedIds, actionType, actionField,  actionValue}).then((res)  => {
        this.$Message.success('操作成功！')
        this.getArticleList()
        this.handleSelectAll(false)
      })
    },
    /**
     * [updateArticle description]
     * @param  {object} data {id: id[] || id, fiedl: value}
     * @return {Promise}      
     */
    updateArticle (data) { 
      return updateArticle(data).then((res) => {
        this.$Message.success('编辑成功！')
        this.getArticleList()
      }).catch(err => {
        this.$Message.error('编辑失败！')
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
    this.getArticleList()
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
