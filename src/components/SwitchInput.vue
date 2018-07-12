<template>
  <div @click="isEdit = true">
    <Input v-if="isEdit" v-model="value" :type="type" @enter="isEdit = false" @blur="isEdit=false"
           :size="size" :maxlength="maxlength" :number="number"
    />
    <span v-else>{{value}}</span>
  </div>
</template>
<script>
export default {
  name: 'sinput',
  props: {
    type: 'text',
    value: '',
    size: '',
    maxlength: '',
    number: false
  }
}
</script>
<style lang="less">

</style>
