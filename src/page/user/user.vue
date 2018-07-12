<template>
  <div class="product-page">
    <div class="container">用户列表</div>
    <div class="container">
      <div class="produt-tool">
        <Button>批量编辑</Button>
        <!--<Button @click="$router.push('product/detail/2')">增加商品</Button>-->
      </div>
      <div class="product-list">
        <Table border :columns="columns5" :data="datas.list"></Table>
      </div>
    </div>
    <Modal v-model="editData.isShow" @on-ok="updateUser ">
      <Edit :editData="editData"></Edit>
    </Modal>
    <Modal class="address-editor-modal"
           v-model="editData.addressEditor.isShow"
           @on-ok="AddAddress">
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
      datas: {
        count: 10,
        page: 1,
        perPages: 10,
        list: [
          {
            _id: 10,
            openid: '12312',
            nickname: 'awang',
            avatar: '',
            sex: 0, // 性别 0 男 1 女
            tel: '13268132987',
            address: '湖北武汉',
            birth: '1991-06-27',
            ctime: '1999-12-12',
            block: false
          }
        ]
      },
      columns5: [
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
          render (h, param) {
            let btnRender = null
            if (!param.row.block) {
              btnRender = h('Button', {
                props: {
                  type: 'error',
                  size: 'small'
                }
              }, '禁用')
            } else {
              btnRender = h('Button', {
                props: {
                  type: 'primary',
                  size: 'small'
                }
              }, '恢复')
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
          console.log(res)
          this.getUserList()
          this.$Message.success('更新成功！')
        })
    },
    AddAddress () {
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
      // todo const areaCode = addressData
      this.Api.addAddress(data)
        .then(res => {
          this.getAddressList(this.editData.userId)
          this.editData.addressEditor.isShow = false
        })
    },
    getUserList() {
      return getUserList().then(res => {
        console.log(res)
        this.datas.list = res.list
      })
    }
  },
  mounted () {
    this.getUserList()
  }
}
</script>
<style>

</style>
