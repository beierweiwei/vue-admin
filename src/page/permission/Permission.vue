<template>
  <div class="product-page">
    <div class="page-title">用户列表</div>
    <div class="container">
      <div class="produt-tool">
        <Button @click="isBatch = !isBatch">批量编辑</Button>
        <div class="batch-group" v-show="isBatch">
          <Button @click="handleSelectAll(true)">全选</Button>
          <Button @click="handleSelectAll(false)">全不选</Button>
          <Button type="primary" @click="updateAdmin(selectedIds, {block: 1})">启用</Button>
          <Button type="warning" @click="updateAdmin(selectedIds, {block: 0})">禁用</Button>
          <Button type="error" @click="deleteAdmin(selectedIds)">删除</Button>
        </div>
        <Button class="fr" type="primary" @click="openModal">新增</Button>
      </div>
      <div class="product-list">
        <Table border :columns="columns" :data="list" on-sort-change="changeSort" @on-selection-change="handleSelectChange" ref="table"></Table>
        <Page style="margin-top: 10px" :total="count" :page-size="reqConfig.pageSize" @on-change="changePage" show-total></Page>
      </div>
    </div>
    <Modal v-model="editData.isShow" @on-ok="submit ">
      <Edit :editData="editData"></Edit>
    </Modal>
  </div>
</template>
<script>
import { getAdminList, getAdmin, createAdmin, updateAdmin, deleteAdmin } from '@/services/Api'
import Edit from './edit'
export default {
  name: 'Permisson',
  data() {
    return {
      isBatch: false,
      selectedIds: [],
      count: 0,
      reqConfig: {
        pageNum: 1,
        pageSize: 2,
        sort: ''
      },
      list: [],
      columns: [{
          title: '用户名',
          key: 'username'
        },
        {
          title: '手机号',
          key: 'tel'
        },
        {
          title: '角色',
          key: 'role',
          render: (h, params) => {
            return h('span', [params.row.role && params.row.role.roleName])
          }
        },
        // {
        //   title: '注册时间',
        //   key: 'ctime'
        // },
        {
          title: '禁用',
          key: 'block',
          render: (h, params) => {
            let btnRender = null
            let self = this
            if (params.row.block) {
              btnRender = h('Button', {
                props: {
                  type: 'warning',
                  size: 'small'
                },
                on: {
                  click: () => {
                    self.updateAdmin(params.row._id, { block: 0 }).then(res => { if (res) self.list[params.index].block = 0 })
                  }
                }
              }, '禁用')
            } else {
              btnRender = h('Button', {
                props: {
                  type: 'primary',
                  size: 'small'
                },
                on: {
                  click: () => {
                    self.updateAdmin(params.row._id, { block: 1 }).then(res => { if (res) self.list[params.index].block = 1 })
                  }
                }
              }, '启用')
            }
            return btnRender
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
                  click: (e) => {
                    this.openModal(e, params.index)
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
                    this.deleteAdmin(params.row._id)
                  }
                }
              }, '删除')
            ])
          }
        }
      ],
      editData: {
        isShow: false,
        editor: {

        }
      }
    }
  },
  components: {
    Edit
  },
  methods: {
    initBatch() {
      this.getAdminList()
      this.selectedIds = []
    },
    handleSelectAll(status) {
      this.$refs.table.selectAll(status)
    },
    handleSelectChange(selection) {
      this.selectedIds = selection.map(row => row._id)
    },
    changePage(page) {
      this.reqConfig.curtPage = page
      this.getList()
    },
    changeSort({ column, key, order }) {
      console.log(order)
      let mapSort = { asc: '', desc: '-', nomal: '' }
      this.getProdConfig.sort = order !== 'normal' ? mapSort[order] + key : ''
      this.getUserList()
    },
    getAdmin(id) {
      getAdmin(id).then((admin) => {
        this.editData.editor = admin
      })
    },
    updateAdmin(id, data) {
      data = data || this.editData.editor
      return updateAdmin({ id, ...data })
        .then(res => {
          this.$Message.success('更新成功！')
          this.getList()
        }).catch(err => {
          this.$Message.error('更新失败！')
        })
    },
    createAdmin() {
      return createAdmin(this.editData.editor).then(res => {
        this.$Message.success('新增成功！')
        return true
      }).catch(err => {
        this.$Message.error('新增失败！')
      })
    },
    deleteAdmin(id) {
      deleteAdmin({ id }).then(res => {
        this.$Message.success('删除成功！')
        this.getList()
      }).catch(err => {
        this.$Message.error('删除失败！')
      })
    },
    submit() {

      let id = this.editData.editor._id
      this.editData.editor.id = id
      let res
      if (this.editData.editor.password === undefined) delete this.editData.editor.password
      if (id) {
        res = this.updateAdmin(this.editData.editor)
      } else {
        res = this.createAdmin(this.editData.editor)
      }
      res.then(success => {
        if (success) this.closeModal && this.getList()
      })
    },
    getList() {
      return getAdminList(this.reqConfig).then(res => {
        this.list = res.list
        this.count = res.count
      })
    },
    closeModal() {
      this.initEditData()
    },
    openModal(e, idx) {
      this.editData.isShow = true
      let isEdit = idx !== undefined
      if (isEdit) {
        let item = this.list[idx]
        let role = item.role || {}
        item.role = role._id
        this.editData.editor = item
      } else {
        this.initEditData()
      }
    },
    initEditData() {
      this.editData.editor = {}
      this.editData.editor.block = 1
    }
  },
  watch: {
    isBatch(val) {
      let item = {
        type: 'selection',
        width: 60,
        align: 'center'
      }
      if (val) {
        this.columns.unshift(item)
      } else {
        this.columns.shift()
      }
      this.$refs.table.selectAll(false)
    }
  },
  mounted() {
    this.getList()
  }
}

</script>
<style>
</style>
