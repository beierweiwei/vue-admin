<template>
<div>
  <Tag v-for="(item, idx) in pages" type="dot"
       :key="idx" :closable="item.name !== 'home_index'" checkable
       :color="curtPageIdx === idx ? 'blue' : ''"
       @on-close="close(idx)"
       @click.native="checkPage(idx)"
  >
    {{item.meta.title}}
  </Tag>
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
    },
    curtIdx: this.curtPageIdx,
    pagesMap: {}
  },
  methods: {
    close (idx) {
      this.$emit('closePage', idx)
    },
    checkPage (idx) {
      this.$emit('update:curtPageIdx', idx)
    }
  },
  created () {

  }
}
</script>

<style scoped>

</style>
