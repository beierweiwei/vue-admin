<template>
    <div ref="dom"></div>
</template>

<script>
import echarts from 'echarts'
import { on, off } from '@/libs/tools'
import { getOrderStatistics } from '@/services/Api'
export default {
  name: 'serviceRequests',
  data () {
    return {
      dom: null,
      dayOrderMap: {}
    }
  },
  methods: {
    resize () {
      this.dom.resize()
    },
    getOrderNumEveryDay (startTime = Date.now(), endTime = Date.now()) {

      return getOrderStatistics({startTime, endTime}).then(res => {
        if (res && typeof res === 'object') {
          this.dayOrderMap = { ...this.dayOrderMap, ...res}
          return true
        }
      }).catch(err => {
        this.$Message.error('获取七天订单信息失败！')
      })
    },
    initData () {
      let now = Date.now()
      let today = now - 8 * 3600000 - now % 24 * 3600000
      for (let i = 0; i < 7; i ++) {
        this.dayOrderMap[today - 24 * 3600000 * i] = 0 
      }

      // Object.keys(this.dayOrderMap).forEach(daytime => {
      //   console.log(daytime)
      //   let time = new Date(Number(daytime)).format('yyyy-MM-dd')
      //   console.log(time)
      // }) 
    }
  },
  mounted () {
    this.initData()
    const option = {
      title: {
        text: '七日订单量'
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross',
          label: {
            backgroundColor: '#6a7985'
          }
        }
      },
      grid: {
        top: '10%',
        left: '1.2%',
        right: '1%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: [
        {
          type: 'category',
          boundaryGap: false,
          data: Object.keys(this.dayOrderMap).map(time => {return new Date(Number(time)).format('MM-dd')})
        }],
      yAxis: [
        {
          type: 'value'
        }
      ],
      series: [
        {
          name: '订单量',
          type: 'line',
          stack: '总量',
          areaStyle: {normal: {
            color: '#2d8cf0'
          }},
          data: [120, 132, 101, 134, 90, 230, 210]
        },
        // {
        //   name: '银行/证券',
        //   type: 'line',
        //   stack: '总量',
        //   areaStyle: {normal: {
        //     color: '#10A6FF'
        //   }},
        //   data: [257, 358, 278, 234, 290, 330, 310]
        // },
        // {
        //   name: '游戏/视频',
        //   type: 'line',
        //   stack: '总量',
        //   areaStyle: {normal: {
        //     color: '#0C17A6'
        //   }},
        //   data: [379, 268, 354, 269, 310, 478, 358]
        // },
        // {
        //   name: '餐饮/外卖',
        //   type: 'line',
        //   stack: '总量',
        //   areaStyle: {normal: {
        //     color: '#4608A6'
        //   }},
        //   data: [320, 332, 301, 334, 390, 330, 320]
        // },
        // {
        //   name: '快递/电商',
        //   type: 'line',
        //   stack: '总量',
        //   label: {
        //     normal: {
        //       show: true,
        //       position: 'top'
        //     }
        //   },
        //   areaStyle: {normal: {
        //     color: '#398DBF'
        //   }},
        //   data: [820, 645, 546, 745, 872, 624, 258]
        // }
      ]
    }
    this.$nextTick(() => {
      this.dom = echarts.init(this.$refs.dom)
      this.getOrderNumEveryDay().then(res => {
        if (res) {
          option.series[0].data = Object.values(this.dayOrderMap)
          this.dom.setOption(option)
          on(window, 'resize', this.resize)
        }
      })
      
    })
  },
  beforeDestroy () {
    off(window, 'resize', this.resize)
  }
}
</script>
