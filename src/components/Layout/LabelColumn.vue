<template>
<div :class="['label-colmun', containerStyle]" >
  <div class="label-container" ref="container">
    <div class="laber-column-list" ref="list">
      <Tag v-for="(item, idx) in pages" type="dot"
        class="laber-column-page-label"
        :key="idx" 
        :closable="item.name !== 'home_index'" checkable
        :color="curtPageIdx === idx ? 'blue' : ''"
        @on-close="close(idx)"
        @click.native="checkPage(idx)"
      >
      {{item.meta.title}}
      </Tag>
    </div>
  </div>
  <Button class="arrow arrow-left" @click="scrollLabelContainer('left')"><</Button>
  <Button class="arrow arrow-right" @click="scrollLabelContainer('right')">></Button>
</div>
</template>

<script>
export default {
  name: 'LabelColumn',
  props: {
    pages: {
      type: Array
    },
    curtPage: {
      type: Object
    },
    curtPageIdx: {
      type: Number,
      default: 0
    }
  },
  data () {
    return {
      containerStyle: '',
    }
  },
  methods: {
    close (idx) {
      this.$emit('closePage', idx)
    },
    checkPage (idx) {
      this.$emit('update:curtPageIdx', idx)
    },
    computedContainerStyle () {
      let ListWidth = this.$refs.list.offsetWidth
      let containerWidth = this.$refs.container.offsetWidth
      let isOverflow = ListWidth - containerWidth > 0
      this.containerStyle = isOverflow ? 'overflow' : 'no-overflow'
      console.log('xxxxxxxxxxxxxxx')
    },
    scrollLabelContainer (direction) {
      let container = this.$refs.container
      let step = direction === 'left' ? -100 : 100
      container.scrollLeft += step
    }
  },
  mounted () {
    this.$nextTick(() => {
      setTimeout(() => {
        this.computedContainerStyle && this.computedContainerStyle()
      }, 500)
      // window.onresize('', () => {
      //   this.computedContainerStyle && this.computedContainerStyle()
      // })
      window.addEventListener('resize', this.computedContainerStyle.bind(this))
    })
  },
  watch: {
    pages () {
      setTimeout(() => {
        this.computedContainerStyle && this.computedContainerStyle()
      }, 500)
    }
  },
  destroy () {
    console.log('destroy')
    removeEventListener('resize', this.computedContainerStyle) 
  }
}
</script>

<style lang="less" scoped>
  .label-colmun {
    position: relative;
    .arrow {
      display: none;
      padding-right: 6px;
      padding-left: 6px;
      position: absolute;
      top: 2px;
      &-left {
        left: 0;
      }
      &-right {
        right: 0;
      }
    }
    &.overflow {
      padding: 0 23px;
      .arrow {
        display: block;
      }
    }
    .laber-column-list {
      display: inline-block;
      white-space: nowrap;
    }
  }
  .label-container {
    overflow-x: auto;
    /*隐藏滚动条*/
    -ms-overflow-style: none;
    overflow: -moz-scrollbars-none;
    &::-webkit-scrollbar {
      width: 0 !important;
    }
  }
</style>
