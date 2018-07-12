<template>
  <span @click="handleClick">
    <Input v-if="isEdit" :value="value" :type="type"
           @on-enter="setEditable"
           @on-change="$emit('input', $event.target.value)"
           @on-blur="setEditable"
           :size="size" :maxlength="maxlength" :number="number"
    />
    <span v-else>{{value}}</span>
  </span>
</template>
<script>
export default {
  name: 'SInput',
  props: {
    type: 'text',
    value: '',
    size: '',
    maxlength: '',
    number: false,
    isEdit: false
  },
  methods: {
    setEditable () {
      this.$emit('update:isEdit', false)
    },
    handleClick () {
      this.$emit('update:isEdit', true)
      this.$nextTick(() => this.$el.getElementsByTagName('input')[0].focus())
    }
  }
}
</script>
<style lang="less">

</style>
