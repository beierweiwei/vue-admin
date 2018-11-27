<template>
  <div class="edit-page">
    <div class="page-title">新增/编辑文章</div>
    <div class="container">
      <Form :model="formItem" :label-width="80">
        <FormItem label="标题">
          <Col span="16"><Input type="text" v-model="formItem.title"></Input></Col>
        </FormItem>
        <FormItem label="描述">
          <Col span="16"><Input type="text" v-model="formItem.des"></Input></Col>
        </FormItem>
        <FormItem label="分类">
          <Col span="16">
          <Select v-model="formItem.cate">
            <Option v-for="(cate, idx) in cateList" :key="idx" :value="cate._id">{{cate.name}}</Option>
          </Select>
          </Col>
        </FormItem>
        <FormItem label="是否公开">
          <RadioGroup v-model="formItem.isPublic">
            <Radio :label="1">是</Radio>
            <Radio :label="0">否</Radio>
          </RadioGroup>
        </FormItem>
        <FormItem label="内容">
          <textarea name="content" id="content" cols="30" rows="10"></textarea>
        </FormItem>
        <FormItem>
          <Button type="primary" @click="submit">Submit</Button>
          <Button type="ghost" style="margin-left: 8px">Cancel</Button>
        </FormItem>
      </Form>
    </div>
  </div>
</template>
<script>
import { SITE } from '@/config'
import { updateArticle, getArticle, getArticleCateList } from '@/services/Api'
import _ from 'lodash'
export default {
  name: 'product-edit',
  data() {
    return {
      random: '',
      formItem: {
        title: '',
        des: '',
        isSale: 1,
        price: '',
        content: '',
        date: '',
        thumbPiic: [],
        unit: '',
        prop: '',
        cate: '',
        subProds: [],
        stock: 1000,
      },
      product: {},
      editor: null,
      propsSelect: [],
      propsCombine: [],
      defaultList: [],
      imgName: '',
      visible: false,
      uploadList: [],
      baseUrl: SITE.origin,
      cateList: [],
      propList: []
    }
  },
  methods: {
    submit() {
      let data = { ...this.formItem, thumbPic: this.uploadList.map((item) => item.url), id: this.id }
      data.content = tinymce.get('content').getContent()
      updateArticle(data).then(() => {
        this.$Message.success(this.id ? '编辑成功!' : '编辑成功!')
      })
    },
    getArticle(id) {
      return getArticle(id)
    },
    initData() {
      this.formItem = {
        title: '',
        des: '',
        isPublic: 1,
        content: '',
        cate: ''
      }
      this.product = {}
      this.visible = false
      this.uploadList = []
      this.baseUrl = SITE.origin
      this.cateList = []
    },
    init() {
      // 初始化数据
      this.initData()
      this.Api.getArticleCateList().then(data => this.cateList = data.list)
      this.id = this.$route.params.id || 'add'

      if (this.id !== 'add') {
        return this.getArticle(this.id).then(data => {
          this.formItem = data
          this.formItem.cate = data.cate && data.cate
          console.log(this.formItem.content)
          tinymce.get('content').setContent(this.formItem.content)
        })
      }
    }

  },
  watch: {


  },
  mounted() {
    let vm = this
    // todo tinymce 初始化报错
    let height = document.body.offsetHeight - 300
    tinymce.init({
      selector: '#content',
      branding: false,
      elementpath: false,
      height: height,
      language: 'zh_CN.GB2312',
      menubar: 'edit insert view format table tools image',
      toolbar1: ' newnote print preview | undo redo | insert | styleselect | forecolor backcolor bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image emoticons media codesample',
      plugins: 'print preview fullpage  searchreplace  directionality  visualblocks visualchars fullscreen image link media template codesample code table charmap hr pagebreak nonbreaking anchor toc insertdatetime advlist lists textcolor wordcount imagetools  contextmenu colorpicker textpattern',
      setup: function(editor) {
        editor.on('init', function(e) {
          console.log('inited')
          // if (localStorage.editorContent) {
          //   tinymce.get('content').setContent(localStorage.editorContent)
          // }
        })
        editor.on('keydown', function(e) {
          localStorage.editorContent = tinymce.get('content').getContent()
        })
      }
    }).then(() => {
      this.init()
    })
  },
  deactivated() {
    // tinymce.get('content').destroy()
  },
  activated() {


  }
}

</script>
<style>
.demo-upload-list {
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
  box-shadow: 0 1px 1px rgba(0, 0, 0, .2);
  margin-right: 4px;
}

.demo-upload-list img {
  width: 100%;
  height: 100%;
}

.demo-upload-list-cover {
  display: none;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, .6);
}

.demo-upload-list:hover .demo-upload-list-cover {
  display: block;
}

.demo-upload-list-cover i {
  color: #fff;
  font-size: 20px;
  cursor: pointer;
  margin: 0 2px;
}

</style>
