<template>
  <div>
    <div class="tool-column">
	    <Row>
					<slot></slot>
	    </Row>
    </div>
    <div class="product-list">
      <Table border 
      :columns="prdColumns" 
      :data="list" 
      @on-sort-change="changeSort"
      @on-selection-change="handleSelectChange"
      :height="height"
       ref="table"></Table>
      <Page v-if="showPage" style="margin-top: 10px" :total="total" :page-size="pageSize" @on-change="changePage" show-total></Page>
    </div>
  </div>
</template>
<script>
export default {
  props: ['list', 'total', 'page-size', 'listFilter', 'height', 'showPage'],
  data () {
    return {
      prdColumns: [
      {
      	type: 'selection',
      	width: 60,
      	align: 'center'
      },
      {
          title: '标题',
          key: 'title',
          // sortable: true,
        },
        {
          title: '图片',
          key: 'image',
          render: (h, params) => {
            return h('img', {
              attrs: {
                src: params.row.thumbPic[0]
              },
              style: {
                width: '60px',
                height: '60px'
              }
            })
          }
        },
        {
          title: '分类',
          key: 'cateId',
          render: (h, params) => {
            return h('span', [params.row.cateId && params.row.cateId.name])
          }
        },
        {
          title: '销量',
          key: 'saleNum',
          sortable: true
        },
        {
          title: '库存',
          key: 'stock'
        },
      ]
    }
  },
  methods: {
  	handleSelectAll (status) {
  	  this.$refs.table.selectAll(status)
  	},
    handleSelectChange (selection) {
      this.$emit('on-selection-change', selection)
    },
  	changePage (curtPage) {
  		this.$emit('on-change', curtPage)
  	},
  	submitSearch () {
  		this.$emit('on-submit')
  	},
  	changeSort () {

  	}
  }

}

</script>
<style lang="less">
</style>
