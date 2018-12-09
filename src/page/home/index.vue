<template>
  <div>
    <Row :gutter="20">
      <i-col :xs="12" :md="8" :lg="4" v-for="(infor, i) in inforCardData" :key="`infor-${i}`" style="height: 120px;padding-bottom: 10px;">
        <infor-card shadow :color="infor.color" :icon="infor.icon" :icon-size="36">
          <count-to :end="infor.count" count-class="count-style"/>
          <p>{{ infor.title }}</p>
        </infor-card>
      </i-col>
    </Row>

    <Row style="margin-top: 10px;">
      <Col>
        <Card shadow title="数据统计">
          <Row :gutter="8" class="data-count">
            <Col span="4">商品总数：<span>{{allStatistics[0].productNum}}</span> </Col>
            <Col span="4">商品分类：<span>{{allStatistics[0].productCateNum}}</span> </Col>
            <Col span="4">促销商品：<span>{{allStatistics[0].promotionNum}}</span> </Col>
            <Col span="4">推荐商品：<span>{{allStatistics[0].reconmendNum}}</span> </Col>
            <Col span="4">库存预警：<span>{{allStatistics[0].nearNoStockNum}}</span> </Col>
            <Col span="4">促销活动：<span>{{allStatistics[0].activityNum}}</span> </Col>
          </Row>
          <Row :gutter="8" class="data-count">
            <Col span="4">订单总数：<span>{{allStatistics[1].orderNum}}</span> </Col>
            <Col span="4">交易总额：<span>{{allStatistics[1].orderPrice}}</span> </Col>
            <Col span="4">退款总数：<span>{{allStatistics[1].returnNum}}</span> </Col>
            <Col span="4">未结订单：<span>{{allStatistics[1].notSubmitNum}}</span> </Col>
          </Row>
          <Row :gutter="8" class="data-count">
            <Col span="4">会员总数：<span>{{allStatistics[2].userNum}}</span> </Col>
            <Col span="4">访客总数：<span>{{allStatistics[2].visitedNum}}</span> </Col>
            <Col span="4">冻结会员：<span>{{allStatistics[2].blockUserNum}}</span> </Col>
          </Row>
        </Card> 
      </Col>
    </Row>

    <Row style="margin-top: 15px;">
      <Col>
        <Card title="流量统计">
          <Row :gutter="20">
           <!--  <i-col :md="24" :lg="8">
              <chart-pie style="height: 300px;" :value="pieData" text="用户访问来源"></chart-pie>
            </i-col> -->
            <i-col :md="24" :lg="24" style="margin-bottom: 20px;">
              <example style="height: 310px;"/>
            </i-col>
          </Row>
        </Card>
      </Col>
    </Row>
<!--     <Row :gutter="20" style="margin-top: 10px;">
      <i-col :md="24" :lg="8" style="margin-bottom: 20px;">
        <Card shadow>
          <chart-pie style="height: 300px;" :value="pieData" text="用户访问来源"></chart-pie>
        </Card>
      </i-col>
      <i-col :md="24" :lg="16" style="margin-bottom: 20px;">
        <Card shadow>
          <chart-bar style="height: 300px;" :value="barData" text="每周用户活跃量"/>
        </Card>
      </i-col>
    </Row>
    <Row>
      <Card shadow>
        <example style="height: 310px;"/>
      </Card> -->
    </Row>
  </div>
</template>

<script>
import InforCard from '_c/info-card'
import CountTo from '_c/count-to'
import { getTodayStatistics, getAllStatistics, getOrderStatistics } from '@/services/Api'
import { ChartPie, ChartBar } from '_c/charts'
import Example from './example.vue'
export default {
  name: 'home',
  components: {
    InforCard,
    CountTo,
    ChartPie,
    ChartBar,
    Example
  },
  data () {
    return {
      inforCardData: [
        { title: '待付款', icon: 'md-person-add', count: 0, color: '#2d8cf0' },
        { title: '待发货', icon: 'md-person-add', count: 0, color: '#2d8cf0' },
        { title: '待审核退换货', icon: 'md-help-circle', count: 142, color: '#ff9900' },
        { title: '新增用户', icon: 'md-help-circle', count: 0, color: '#ff9900' },
        { title: '今日成交', icon: 'md-person-chatbubbles', count: 0, color: '#2d8cf0' },
        { title: '今日订单', icon: 'md-map', count: 0, color: '#9A66E4' },

      ],
      pieData: [
        {value: 335, name: '直接访问'},
        {value: 310, name: '邮件营销'},
        {value: 234, name: '联盟广告'},
        {value: 135, name: '视频广告'},
        {value: 1548, name: '搜索引擎'}
      ],
      barData: {
        Mon: 13253,
        Tue: 34235,
        Wed: 26321,
        Thu: 12340,
        Fri: 24643,
        Sat: 1322,
        Sun: 1324
      },
      allStatistics: [{
        productNum: 0,
        productCateNum: 0,
        promotionNum: 0,
        reconmendNum: 0,
        nearNoStockNum: 0,
        activityNum: 0,
      }, {
        orderNum: 0,
        orderPrice: 0,
        returnNum: 0,
        notSubmitNum: 0
      }, {
        userNum: 0,
        visitedNum: 0,
        blockUserNum: 0
      }]
    }
  },
  methods: {
    getTodayStatistics () {
      getTodayStatistics().then((res) => {
        console.log(res)
        this.inforCardData[0].count = res.notPayOrderNum
        this.inforCardData[1].count = res.notBringOrderNum
        this.inforCardData[2].count = res.applyReturnOrderNum
        this.inforCardData[3].count = res.notPayOrderNum
        this.inforCardData[4].count = res.notPayOrderNum
        this.inforCardData[5].count = res.allOrderNum


      })
    },
    getAllStatistics () {
      getAllStatistics().then(res => {
        console.log(res)
        let productStatistics = this.allStatistics[0]
        let orderStatistics = this.allStatistics[1]
        let userStatistics = this.allStatistics[2]
        productStatistics.productNum = res.allProductNum
        productStatistics.productCateNum = res.allProductCateNum
        productStatistics.promotionNum = res.allActivityProductNum
        productStatistics.nearNoStockNum = res.allNearNoStockProduct
        productStatistics.recommendProductNum = res.allRecommendProductNum
        productStatistics.activityNum = res.allActivityProductNum

        orderStatistics.orderNum = res.allOrderNum 
        orderStatistics.orderPrice = res.allOrderNum 
        orderStatistics.returnNum = res.allReturnOrderNum

        orderStatistics.notSubmitNum = res.allNotSubmitOrderNum 

        userStatistics.userNum = res.allUserNum 
        userStatistics.visitedNum = res.allUserNum 
        userStatistics.blockUserNum = res.allBlockUserNum 

      })
    }
  },
  created () {
    this.getTodayStatistics()
    this.getAllStatistics()
  },
  mounted () {
    //
  }
}
</script>

<style lang="less">
.count-style{
  font-size: 50px;
}
.data-count {
  // border-bottom: 1px solid #ddd;
  line-height: 2;
  margin-bottom: 10px;
  span {
    margin-left: 20px;
  }
}
</style>

