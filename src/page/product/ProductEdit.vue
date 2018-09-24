<template>
  <Form :model="formItem" :label-width="80">
    <FormItem label="标题">
      <Col span="16"><Input type="text" v-model="formItem.title"></Input></Col>
    </FormItem>
    <FormItem label="描述">
      <Col span="16"><Input type="text" v-model="formItem.des"></Input></Col>
    </FormItem>
    <FormItem label="分类">
      <Col span="16">
        <Select v-model="formItem.cateId" @on-change="getProdCateProps">
          <Option v-for="(cate, idx) in cateList" :key="idx" :value="cate._id">{{cate.name}}</Option>
        </Select>
      </Col>
    </FormItem>
    <FormItem label="上传预览图">
      <div class="demo-upload-list" v-for="(item, idx) in uploadList" :key="idx">
        <template v-if="item.status === 'finished'">
          <img :src="item.url">
          <div class="demo-upload-list-cover">
            <Icon type="ios-eye-outline" @click.native="handleView(item.name)"></Icon>
            <Icon type="ios-trash-outline" @click.native="handleRemove(item)"></Icon>
          </div>
        </template>
        <template v-else>
          <Progress v-if="item.showProgress" :percent="item.percentage" hide-info></Progress>
        </template>
      </div>
      <Upload
        ref="upload"
        :show-upload-list="false"
        :default-file-list="defaultList"
        :on-success="handleSuccess"
        :format="['jpg','jpeg','png']"
        :max-size="2048"
        :on-format-error="handleFormatError"
        :on-exceeded-size="handleMaxSize"
        :before-upload="handleBeforeUpload"
        multiple
        type="drag"
        action="/upload"
        style="display: inline-block;width:58px;">
        <div style="width: 58px;height:58px;line-height: 58px;">
          <Icon type="camera" size="20"></Icon>
        </div>
      </Upload>
      <Modal title="View Image" v-model="visible">
        <img :src="baseUrl + '/upload/' + imgName " v-if="visible" style="width: 100%">
      </Modal>
    </FormItem>
    <FormItem label="价格/元">
        <Col span="5"><Input type="text" v-model="formItem.price"/></Col>
        <Col push="1" span="6">
          <Col span="4">单位</Col>
          <Col span="20"><Input type="text" v-model="formItem.unit"/></Col>
        </Col>
        <Col push="2" span="6">
          <Col span="4">库存</Col>
          <Col span="20"><Input type="text" v-model="formItem.stock"/></Col>
        </Col>
    </FormItem>
    <FormItem label="规格">
      <Row v-for="(prop, idx) in propList" :key="prop._id">
        <Col>{{prop.name}}</Col>
        <Col>
          <CheckboxGroup v-model="propsSelect[idx]" @on-change="getCombine">
            <Checkbox v-for="select in prop.selector" :key="select" :value="select" :label="select" ></Checkbox>
          </CheckboxGroup>
        </Col>
      </Row>
    </FormItem>
    <FormItem label="子商品">
      <Row v-for="(subProd, idx) in formItem.subProds" :key="idx">
        <Col>规格：{{subProd.propItems}}</Col>
        <Col span="4"><Col span="8">价格：</Col><Col span="16"><Input v-model="subProd.price"/></Col></Col>
        <Col push="1" span="4"><Col span="8">库存：</Col><Col span="16"><Input v-model="subProd.stock"/></Col></Col>
        <Col push="2" span="4"><Col span="8">销量：</Col><Col span="16"><Input v-model="subProd.saleNum"/></Col></Col>
        <Col push="3" span="5">
          <Col span="6">上架：</Col>
          <Col span="18">
            <RadioGroup v-model="subProd.isSale">
              <Radio :label="1">是</Radio>
              <Radio :label="0">否</Radio>
            </RadioGroup>
          </Col>
        </Col>
        <Col push="3" span="4">
          <Col  span="10">展示图：</Col>
          <Col span="12">
            <div style="position: relative">
              <Select v-model="subProd.thumbPic">
                <Option v-for="img in uploadList" :value="img.url || 'null'" :key="img.url"><img style="width: 100%;" :src="img.url"/></Option>
              </Select>
              <div style="position: absolute; left: 5px; top: 2px;">
                <img v-if ="subProd.thumbPic" style="height: 30px; width: 30px; border: none; outline: none" :src="subProd.thumbPic" alt=""/>
              </div>
            </div>
          </Col>
        </Col>
      </Row>
    </FormItem>
    <FormItem label="是否上架">
      <RadioGroup v-model="formItem.isSale">
        <Radio :label="1">是</Radio>
        <Radio :label="0">否</Radio>
      </RadioGroup>
    </FormItem>

    <FormItem label="图文详情">
      <textarea name="detail" id="detail" cols="30" rows="10"></textarea>
    </FormItem>
    <FormItem>
      <Button type="primary" @click="submit">Submit</Button>
      <Button type="ghost" style="margin-left: 8px">Cancel</Button>
    </FormItem>
  </Form>
</template>
<script>
import {combine} from '@/util/help'
import  {SITE} from '@/config'
import {editProduct, getProduct} from '@/services/Api'
import _ from 'lodash'
export default {
  name: 'product-edit',
  data () {
    return {
      formItem: {
        title: '',
        des: '',
        isSale: 'true',
        price: 200,
        detail: '',
        date: '',
        thumbPiic: [
        ],
        unit: '',
        prop: '',
        cateId: '',
        subProds: [],
        stock: 1000,
      },
      product: {},
      editor: null,
      propsSelect: [],
      propsCombine: [],
      defaultList: [
      ],
      imgName: '',
      visible: false,
      uploadList: [],
      baseUrl: SITE.origin,
      cateList: [],
      propList: []
    }
  },
  methods: {
    handleView (name) {
      this.imgName = name
      this.visible = true
    },
    handleRemove (file) {
      const fileList = this.$refs.upload.fileList
      this.$refs.upload.fileList.splice(fileList.indexOf(file), 1)
    },
    handleSuccess (res, file) {
      file.url = SITE.origin + res.data.serverPath
      file.name = res.data.fileName
    },
    handleFormatError (file) {
      this.$Notice.warning({
        title: 'The file format is incorrect',
        desc: 'File format of ' + file.name + ' is incorrect, please select jpg or png.'
      })
    },
    handleMaxSize (file) {
      this.$Notice.warning({
        title: 'Exceeding file size limit',
        desc: 'File  ' + file.name + ' is too large, no more than 2M.'
      })
    },
    handleBeforeUpload () {
      const check = this.uploadList.length < 5
      if (!check) {
        this.$Notice.warning({
          title: 'Up to five pictures can be uploaded.'
        })
      }
      return check
    },
    submit () {
      this.formItem.props = []
      // getPorp which was selected
      this.propsSelect.forEach((selector, idx) => {
        if (selector.length >>> 0) {
          this.formItem.props.push(this.propList[idx]._id)
        }
      })
      let data = {...this.formItem, thumbPic: this.uploadList.map((item) => item.url)}
      data.detail = tinymce.get('detail').getContent()
      editProduct(data, this.id).then(() => {
        this.$Message.success(this.id ? '编辑成功!' : '编辑成功!')
      })
    },
    getProduct (id) {
      return getProduct(id)
    },
    clearData () {
      this.uploadList = []
      this.cateList = []
      this.propList = []
    },
    init () {
      // this.Api.getProductPropList().then(data => {
      //   this.propList = data
      //   // this.propsSelect = _.clone(data, 'deep')
      // })
      this.Api.getProductCateList().then(data => this.cateList = data)
      this.id = this.$route.params.id || 'add'

      if (this.id !== 'add') {
        this.getProduct(this.id).then(data => {
          this.formItem = data
          this.formItem.cateId = data.cateId && data.cateId._id
          this.propsSelect = _.zip(...data.subProds.map((sub) => sub.propItems.split(','))).map(prop => _.uniq(prop))
          if (Array.isArray(data.thumbPic) && data.thumbPic.length > 0) {
            this.defaultList = data.thumbPic.map((pic) => {
              return {
                'name': pic.split('/upload/')[1],
                'url': pic
              }
            })
          }
        }).then(() => {
          this.uploadList = this.$refs.upload.fileList
        })
      }
    },
    getCombine () {
      if (this.propsSelect.length < this.propList.length) return
      let array = this.propsSelect.map(val => [...val])
      let combinProp = combine(array)
      let propsIds = array.map(prop => prop._id)
      this.formItem.subProds = combinProp.map((item, idx) => {
        let exsit = this.formItem.subProds[idx]
        return (exsit && exsit.props === item.join(',') ? exsit : {
          propItems: item.join(','),
          propsIds: propsIds,
          price: this.formItem.price,
          isSale: this.formItem.isSale,
          thumbPic: this.uploadList[0] && this.uploadList[0].url,
          saleNum: 0,
          stock: this.formItem.stock
        })
      })
    },
    getProdCateProps () {
      this.Api.getProductCate(this.formItem.cateId).then(data => {
        this.propList = data.props
      })
    }
  },
  mounted () {
    this.init()
    this.uploadList = this.$refs.upload.fileList
    this.$nextTick(() => {
      let vm = this
      // todo tinymce 初始化报错
      let height = document.body.offsetHeight - 300
      this.editor = tinymce.init({
        selector: '#detail',
        branding: false,
        elementpath: false,
        height: height,
        language: 'zh_CN.GB2312',
        menubar: 'edit insert view format table tools image',
        toolbar1: ' newnote print preview | undo redo | insert | styleselect | forecolor backcolor bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image emoticons media codesample',
        plugins: 'print preview fullpage  searchreplace  directionality  visualblocks visualchars fullscreen image link media template codesample code table charmap hr pagebreak nonbreaking anchor toc insertdatetime advlist lists textcolor wordcount imagetools  contextmenu colorpicker textpattern',
        setup: function (editor) {
          editor.on('init', function (e) {
            vm.spinShow = false
            if (localStorage.editorContent) {
              tinymce.get('detail').setContent(localStorage.editorContent)
            }
          })
          editor.on('keydown', function (e) {
            localStorage.editorContent = tinymce.get('detail').getContent()
          })
        }
      })
        .then(() => {
          tinymce.get('detail').setContent(this.formItem.detail)
        })
    })
  },
  destroyed () {
    this.clearData()
    tinymce.get('detail').destroy()
  }
}
</script>
<style>
  .demo-upload-list{
    display: inline-block;
    width: 60px;
    height: 60px;
    text-align: center;
    line-height: 60px;
    border: 1px solid transparent;
    border-radius: 4px;
    overflow: hidden;
    background: #fff;
    position: relative;
    box-shadow: 0 1px 1px rgba(0,0,0,.2);
    margin-right: 4px;
  }
  .demo-upload-list img{
    width: 100%;
    height: 100%;
  }
  .demo-upload-list-cover{
    display: none;
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background: rgba(0,0,0,.6);
  }
  .demo-upload-list:hover .demo-upload-list-cover{
    display: block;
  }
  .demo-upload-list-cover i{
    color: #fff;
    font-size: 20px;
    cursor: pointer;
    margin: 0 2px;
  }
</style>
