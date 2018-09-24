<template>
  <div>
    <Row :style="{padding: '10 0'}">
      <Col span="3">收货地址</Col>
      <Col><Button type="primary" size="small" span="3" @click="editData.addressEditor.isShow = true">新增</Button></Col>
    </Row>
    <Table border :columns="columns7" :data="editData.addressList"></Table>
  </div>

</template>
<script>
import {getAddressById} from '../../services/Api'
import AddressEditor from '@/components/common/AddressEditor'
export default {
  name: 'Address',
  props: {
    editData: {}
    // editor: {
    //   name: '',
    //   data: [],
    //   isShow: '',
    //   curtId: ''
    // }
  },
  components: {
    AddressEditor
  },
  data () {
    return {
      editor: {
        name: '',
        data: [],
        isShow: '',
        curtId: '',
        isShow: false
      },
      addressData: {
        name: '',
        tel: '',
        address: {
          prince: '',
          city: '',
          area: ''
        },
        areaSelector: {
          prince: [],
          city: [],
          area: []
        }
      },
      columns7: [
        {
          title: '姓名',
          key: 'name'
        },
        {
          title: '电话',
          key: 'tel'
        },
        {
          title: '地址',
          key: 'detail',
          render: (h, params) => {
            return h('span', [
              params.row.areaName + ',' + params.row.detail
            ])
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
                    this.showAddressEdit(params.row._id || '0')
                  }
                }
              }, 'View'),
              h('Button', {
                props: {
                  type: 'error',
                  size: 'small'
                },
                on: {
                  click: () => {
                    this.remove(params.row._id)
                  }
                }
              }, 'Delete')
            ]);
          }
        }
      ],
      data6: [
        {
          tel: '12360132987',
          name: 'awang',
          area: '湖北省武汉市关南街道'
        }
      ]
    }
  },
  methods: {
    showEditor () {

    },
    showAddressEdit(id) {
      this.editData.addressId = id 
      // req addres by id
      getAddressById(id).then(res => {
        this.editData.addressEditor.name = res.name
        this.editData.addressEditor.tel = res.tel 
        this.editData.addressEditor.detail = res.detail
        this.editData.addressEditor.address.prince = res.areaCode[0].code
        this.editData.addressEditor.address.city = res.areaCode[1].code
        this.editData.addressEditor.address.area = res.areaCode[2].code
        this.editData.addressEditor.isShow = true
      })
    },
    remove (addressId) {
      this.Api.deleteAddress(addressId, {userId: this.editData.userId})
        .then((res) => {
          this.$Message.success('删除成功！')
          this.editData.addressList = this.editData.addressList.filter(address => address._id !== addressId)
        })
    }
  }
}
</script>

<style lang="less">
.address-editor-modal {
  .ivu-modal-wrap {
    z-index: 10000
  }
}
</style>
