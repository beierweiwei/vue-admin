<template>
  <div class="Activity-page">
    <div class="page-title">活动列表</div>
    <div class="container">
      <div class="produt-tool">
        <Button @click="isBatch = !isBatch">批量编辑</Button>
        <div class="batch-group" v-show="isBatch">
          <Button @click="handleSelectAll(true)">全选</Button>
          <Button @click="handleSelectAll(false)">全不选</Button>
          <Button type="primary" @click="updateActivity({id: selectedIds, status: 1})">上线</Button>
          <Button type="warning" @click="updateActivity({id: selectedIds, status: 0})">下线</Button>
          <Button type="error" @click="deleteActivity(selectedIds)">删除</Button>
        </div>
        <Button class="fr" type="primary" @click="addActivity" >增加活动</Button>
      </div>
      <div class="product-list">
        <Table border :columns="columns" :data="activityList" @on-sort-change="changeSort" @on-selection-change="handleSelectChange" ref="table"></Table>
        <Page style="margin-top: 10px" :total="count" :page-size="requestConfig.pageSize" @on-change="changePage" show-total></Page>
      </div>
    </div>
    <Editor :editor="editor" @on-ok="getActivityList"/>
  </div>
</template>

<script>
import { getActivityList, updateActivity, getActivity, deleteActivity } from "../../services/Api"
import Editor from './editActivity'
import help  from '@/util/help'
export default {
  name: 'Activity',
  components: { Editor },
  data () {
    return {
      activityList: [],
      isBatch: false,
      selectedIds: [],
      columns: [
        {
          title: 'ID',
          key: '_id',
        },
        {
          title: '广告图',
          key: 'thumb',
          render (h, params) {
            return h('img', {
              attrs: {
                src: params.row.thumb
              },
              style: {
                width: '60px',
                height: '60px'
              }
            })
          }
        },
        {
          title: '标题',
          key: 'title',
        },
        {
          title: '内容',
          key: 'desc'
        },
        {
          title: '满减',
          key: 'reduce',
          render: (h, params) => {
            let rule = params.row.rule || {}
            return h('div', ['满',rule.full,'减', rule.reduce])
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
            let {startTime, endTime} = params.row 
            return h('div', [new Date(startTime).format('yyyy-MM-dd hh:mm'), '--', new Date(endTime).format('yyyy-MM-dd hh:mm')])
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
                    this.deleteActivity(params.row._id)
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
    addActivity () {
      this.initEditorForm()
      this.editor.isShow = true
    },
    getActivityList () {
      return getActivityList(this.requestConfig).then((res) => {
        this.activityList = res.list
        this.count = res.count
      })
    },
    changePage (page) {
      this.requestConfig.curtPage = page
      this.getActivityList()
    },
    changeSort ({column, key, order}) {
      console.log(order)
      let mapSort = {asc: '', desc: '-', nomal: ''}
      this.requestConfig.sort = order !== 'normal' ? mapSort[order] + key : ''
      this.getActivityList()
    },
    deleteActivity (id) {
      id = id || this.selectedIds
      deleteActivity({id}).then(res => {
        this.$Message.success('删除成功!')
        this.getActivityList()
      }).catch(err => this.$Message.error('删除失败!'))
    },
    /**
     * [updateActivity description]
     * @param  {object} data {id: id[] || id, fiedl: value}
     * @return {Promise}      
     */
    updateActivity (data) { 
      return updateActivity(data).then((res) => {
        this.$Message.success('编辑成功！')
        this.getActivityList()
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
      getActivity(id).then(res => {
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
    this.getActivityList()
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
