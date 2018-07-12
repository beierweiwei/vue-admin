<template>
  <div class="layout-siderbar">
      <div class="layout-logo">vue-admin></div>
      <Menu theme="dark" width="auto"  @on-select="go" :active-name="curtPage && curtPage.name">
        <!--<MenuItem name="product_index" >-->
          <!--<Icon type="home"></Icon>-->
          <!--<span>{{pagesMap.product_index.name}}</span>-->


        <!--&lt;!&ndash;</MenuItem>&ndash;&gt;-->
        <!--<MenuItem name="order_index">-->
          <!--<Icon type="flag"></Icon>-->
          <!--<span>{{pagesMap.order_index.name}}</span>-->
        <!--</MenuItem>-->
        <!--<MenuItem name="delivery_index">-->
          <!--<Icon type="edit"></Icon>-->
          <!--<span>{{pagesMap.delivery_index.name}}</span>-->
        <!--</MenuItem>-->
        <!--<MenuItem name="user_index">-->
          <!--<Icon type="edit"></Icon>-->
          <!--<span>{{pagesMap.user_index.name}}</span>-->
        <!--</MenuItem>-->
        <!--<MenuItem name="pay_index">-->
          <!--<Icon type="edit"></Icon>-->
          <!--<span>{{pagesMap.pay_index.name}}</span>-->
        <!--</MenuItem>-->
        <!--<Submenu name="components">-->
          <!--<template slot="title">-->
            <!--<Icon type="ios-paper"></Icon>-->
            <!--<span>{{pagesMap.components.name}}</span>-->
          <!--</template>-->
          <!--&lt;!&ndash;eslint-disable&ndash;&gt;-->
          <!--<MenuItem name="richEditor">-->
            <!--<Icon type="home"></Icon>-->
            <!--<span>{{pagesMap.richEditor.name}}</span>-->
          <!--</MenuItem>-->
          <!--<MenuItem name="markdownEditor">-->
            <!--<Icon type="flag"></Icon>-->
            <!--<span>{{pagesMap.markdownEditor.name}}</span>-->
          <!--</MenuItem>-->
        <!--</Submenu>-->
        <template v-for="page in pagesMap">
          <Submenu  v-if="page.child" :name="page.field">
            <template slot="title">
              <Icon type="ios-paper"></Icon>
              {{page.name}}
            </template>
              <MenuItem v-for="subPage in pagesMap"
                        v-if="subPage.pid === page.id"
                        :key="subPage.field"
                        :name="subPage.field">
                {{subPage.name}}
              </MenuItem>
          </Submenu>

          <MenuItem v-else-if="page.pid === 0 && !page.child" :name="page.field">
            <Icon type="document-text"></Icon>
            {{page.name}}
          </MenuItem>

        </template>
      </Menu>
    </div>
</template>

<script>
import {pagesMap} from '@/util/constants'
export default {
  name: 'SiderCop',
  // data () {
  //   return {
  //
  //   }
  // },
  props: {
    curtPage: {},
    // pagesMap: {}
  },
  data () {
    return {
      pagesMap
    }
  },
  methods: {
    triggerSider: function () {
      console.log('click', this.isShow)
      this.isShow = !this.isShow
    },
    go (name) {
      // let path = name.split('_').join('/')
      console.log(name)
      this.$router.push({name})
      this.$emit('check-menu', name + '_index')
    }
  }
}
</script>
<style lang="less">
  .layout-siderbar {
    height: 100%;
    overflow: scroll;
  }
  .ivu-layout-sider-collapsed {
    .ivu-icon {
      font-size: 24px;
      transition: font-size .5s;
    }
    .ivu-menu-item, .ivu-menu-submenu-title,
    li.ivu-menu-item.ivu-menu-item-active.ivu-menu-item-selected{
      padding-left: 10px!important;
      padding-right: 10px!important;
      span {
        display: none;
      }
    }
  }

</style>
