<template>
  <div class="product-page">
    <div class="container">用户列表</div>
    <div class="container">
      <div class="produt-tool">
        <Button @click="isBatch = !isBatch">批量编辑</Button>
        <div class="batch-group" v-show="isBatch">
          <Button @click="handleSelectAll(true)">全选</Button>
          <Button @click="handleSelectAll(false)">全不选</Button>
          <Button type="primary" @click="batchAction('edit',selectedIds, {block: false})">启用</Button>
          <Button type="warning" @click="batchAction('edit', selectedIds, {block: true})">禁用</Button>
          <Button type="error" @click="batchAction('delete', selectedIds)">删除</Button>
        </div>
      </div>
      <div class="product-list">
        <Table border :columns="columns" :data="list" on-sort-change="changeSort" @on-selection-change="handleSelectChange" ref="table"></Table>
        <Page style="margin-top: 10px" :total="count" :page-size="reqConfig.pageSize" @on-change="changePage" show-total></Page>
      </div>
    </div>
    <Modal v-model="editData.isShow" @on-ok="updateUser ">
      <Edit :editData="editData"></Edit>
    </Modal>
    <Modal class="address-editor-modal"
           v-model="editData.addressEditor.isShow"
           @on-ok="submitAddress">
      <AddressEditor :addressData="editData.addressEditor" v-if="editData.addressEditor.isShow"></AddressEditor>
    </Modal>
  </div>
</template>
<script>
import {getUserList, getUser} from '@/services/Api'
import Edit from './edit'
export default {
  name: 'user',
  data () {
    return {
      isBatch: false,
      selectedIds: [],
      count: 0,
      reqConfig: {
        loading: true,
        pageNum: 1,
        pageSize: 10,
        sort: '' 
      },
      list: [],
      columns: [
        {
          title: '用户id',
          key: '_id'
        },
        {
          title: '昵称',
          key: 'username'
        },
        {
          title: '性别',
          key: 'sex',
          render (h, param) {
            return h('span', ['男', '女'][param.row.sex])
          }
        },
        {
          title: '手机号',
          key: 'tel'
        },
        {
          title: '生日',
          key: 'birth'
        },
        {
          title: '注册时间',
          key: 'ctime'
        },
        {
          title: '禁用',
          key: 'block',
          render: (h, param) => {
            let btnRender = null
            let self = this
            if (!param.row.block) {
              btnRender = h('Button', {
                props: {
                  type: 'error',
                  size: 'small'
                },
                on: {
                  click: () => {
                    self.Api.updateUser(param.row._id, {block: true})
                    .then(res => {
                      self.getUserList()
                      self.$Message.success('更新成功！')
                    })
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
                    self.Api.updateUser(param.row._id, {block: false})
                    .then(res => {
                      self.getUserList()
                      self.$Message.success('更新成功！')
                    })
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
                  click: () => {
                    this.editData.isShow = true
                    this.editData.userId = params.row._id
                    this.editData.idx = params.index
                    this.getUser(params.row._id)
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
      editData: {
        isShow: false,
        userId: '',
        idx: 0,
        editor: {

        },
        addressList: [],
        addressId: 0,
        addressEditor: {
          name: '',
          tel: '',
          address: {
            prince: '',
            city: '',
            area: ''
          },
          detail: '',
          areaSelector: {
            prince: [],
            city: [],
            area: []
          },
          isShow: false
        }
      }
    }
  },
  components: {
    Edit
  },
  methods: {
    initData () {
      this.getUserList()
      this.selectedIds = []
    },
    handleSelectAll (status) {
      this.$refs.table.selectAll(status)
    },
    handleSelectChange (selection) {
      this.selectedIds = selection.map(row => row._id)
    },
    changePage (page) {
      this.getProdConfig.pageNum = page
      this.getUserList()
    },
    changeSort ({column, key, order}) {
      console.log(order)
      let mapSort = {asc: '', desc: '-', nomal: ''}
      this.getProdConfig.sort = order !== 'normal' ? mapSort[order] + key : ''
      this.getUserList()
    },
    getUser (userId) {
      getUser(userId).then((user) => {
        this.editData.editor = user
      })
      this.getAddressList(userId)
    },
    getAddressList(userId) {
      this.Api.getAddressList(userId).then(res => {
        this.editData.addressList = res
      })
    },
    updateUser () {
      this.Api.updateUser(this.editData.userId, this.editData.editor)
        .then(res => {
          this.getUserList()
          this.$Message.success('更新成功！')
        })
    },
    submitAddress () {
      let id = this.editData.addressId || 0 
      const addressData = this.editData.addressEditor
      const areaData = Object.keys(addressData.address).map((key) => {
        let code = addressData.address[key]
        let curtIdx = this.editData.addressEditor.areaSelector[key].findIndex(area => area.code === code)
        return {
          name: addressData.areaSelector[key][curtIdx].name,
          code: code
        }
      })
      const data = {
        name: addressData.name,
        tel: addressData.tel,
        detail: addressData.detail,
        areaCode: areaData,
        userId: this.editData.userId

      }
      if (id) {
        this.Api.updateAddress(id, data).then(res => {
          this.getAddressList(this.editData.userId)
          this.editData.addressEditor.isShow = false
          id = 0
        })
      } else {
         // todo const areaCode = addressData
        this.Api.addAddress(data)
        .then(res => {
          this.getAddressList(this.editData.userId)
          this.editData.addressEditor.isShow = false
          id = 0
        })
      }
     
    },
    getUserList() {
      return getUserList().then(res => {
        this.list = res.list
      })
    },
    batchAction (actionType, ids, modify) {
      if (!ids) return
      const isBatch = Array.isArray(ids)
      //todo
      switch (actionType) {
        case 'edit':
          let updateAct = isBatch ? this.Api.updateUsers : this.Api.updateUser
          updateAct(ids, modify).then(() => this.$Message.success('编辑成功') && this.initData())
          .catch(err => this.$Message.err('编辑失败！'))
          break
        case 'delete':
          this.Api.deleteUser(ids).then(() => this.$Message.success('删除成功！') && this.initData())
            .catch(err => this.$Message.err('删除失败！'))
          break
        default:
      }
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
    this.getUserList()
  }
}
</script>
<style>

</style>
