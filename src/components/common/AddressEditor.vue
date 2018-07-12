<template>
   <Form :label-width="60" class="address-editor-form">
     <FormItem label="姓名">
       <Col span="20">
         <Input v-model="addressData.name"/>
       </Col>
     </FormItem>
     <FormItem label="手机号">
       <Col span="20">
         <Input v-model="addressData.tel"/>
       </Col>
     </FormItem>
     <FormItem label="地址" prop="password">
       <Col span="8">
         <Select v-model="addressData.address.prince" @on-change="selectArea('prince')">
           <Option v-for="(area, idx) in addressData.areaSelector.prince"  :value="area.code" :key="area.code">{{area.name}}</Option>
         </Select>
       </Col>
       <Col span="8">
         <Select v-model="addressData.address.city" @on-change="selectArea('city')">
           <Option v-for="(area, idx) in addressData.areaSelector.city" :value="area.code" :key="area.code">{{area.name}}</Option>
         </Select>
       </Col>
       <Col span="8">
         <Select v-model="addressData.address.area" @on-change="selectArea('area')" >
           <Option v-for="(area, idx) in addressData.areaSelector.area" :value="area.code" :key="area.code">{{area.name}}</Option>
         </Select>
       </Col>
     </FormItem>
     <FormItem label="详细地址">
       <Input type="text" v-model="addressData.detail"/>
     </FormItem>
 </Form>
</template>

<script>
import {getAreaList} from '../../services/Api';
export default {
  name: 'AddressEditor',
  props: {
    addressData: {}
  },
  data () {
    return {
      // addressData: {
      //   name: '',
      //   tel: '',
      //   address: {
      //     prince: '',
      //     city: '',
      //     area: ''
      //   },
      //   areaSelector: {
      //     prince: [],
      //     city: [],
      //     area: []
      //   }
      // }
    }
  },
  methods: {
    selectArea (type) {
      type = type || 'prince'
      let types = ['prince', 'city', 'area']
      let idx = types.indexOf(type)
      let code
      // get curt area code
      code = this.addressData.address[type]
      // clear children data
      if (idx <= 2) {
        for (let i = idx + 1; i > idx && i < 2; i++) {
          this.addressData.areaSelector[types[i]] = []
        }
        // get and set child list
        getAreaList(code).then((list) => {
          this.addressData.areaSelector[types[idx + 1]] = this.rebuild(list.children)
          // set child first one is select
          // this.addressData.address[types[idx + 1]] = this.addressData.areaSelector[types[idx + 1]][0].code
        })
      }
    },
    rebuild (list) {
      return Object.keys(list).map((key) => {
        return {
          name: list[key],
          code: key
        }
      })
    }
  },
  mounted () {
    getAreaList().then((list) => {
      let resData = this.rebuild(list.children)
      this.addressData.areaSelector.prince = resData
    }).catch(err => console.log(err))
  }
}
</script>

<style scoped>

</style>
