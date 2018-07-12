<template>
 <div>home</div>
</template>

<script>
export default {
  name: 'home',
  data: function () {
    return {
      title: 'home',
      isShow: false
    }
  },
  methods: {
    triggerSider: function () {
      console.log('click', this.isShow)
      this.isShow = !this.isShow
    }
  }
}
</script>

<style lang="less">
</style>
