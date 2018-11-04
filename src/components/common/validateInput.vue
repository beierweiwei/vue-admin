<template>
	<div :class="['validate-input-wrap', this.isValid ? '' : 'ivu-form-item-error']">
		<Input
			:value="value" 
			:class="['validate-input-input', this.isValid ? '' : 'unvalid-input']" 
			:placeholder="placeholder"
			@change="trigger('change')" 
			@blur="trigger('blur')" 
			@input="emitInput"
		/>

		<div class='vaidate-input-msg'> <span v-if="!isValid">{{errMsg}}</span></div>
	</div>
</template>
<script>
	import { cloneDeep } from '@/util/help'
	export default {
		props: {
			placeholder: '',
			rules: {
				default () {
					return [{
						validate: '',
						errMsg: '',
						trigger: []
					}]
				}
			},
			value: {
				default: ''
			},
			containers: null
		},
		data () {
			return {
				triggerEventTypes: [
					'change', 'blur', 'input'
				],
				errMsg: '',
				isValid: true,
				defaultRules: { 
					required: {
						validate (val) {
							return val
						},
						errMsg: '不能为空！'
					},
					number: {
						validate (val) {
							return Number(val) || val === 0
						},
						errMsg: '必须数字！'
					}
				}
			}
			
		},
		computed: {
			_rules () {
				return this.rules.map((rule, i) => {
					rule.errMsg = rule.errMsg || []
					rule.validate.forEach((validate, j) => {
						if (typeof validate === 'string') {
							let _rule = this.defaultRules[validate]
							rule.errMsg[j] = _rule.errMsg
							rule.validate[j] = _rule.validate
						}
					})
					return rule
				})
			}
		},
		methods: {
			emitInput($evt) {
				this.$emit('input', $evt)
				this.trigger('input')
			},
			trigger (type) {
				this.$nextTick(() => {
					this._rules.forEach(rule => {
						rule.trigger.forEach((type, idx) => {
							if (!~this.triggerEventTypes.indexOf(type)) return 
							this.isValid = true
							for(let i = 0; i < rule.validate.length; i ++) {
								let validate = rule.validate[i]
								let isValid
								let errMsg =  rule.errMsg[i]
								isValid = validate(this.value)
								if (!isValid) {
									console.log(isValid)
									this.isValid = isValid
									this.errMsg = errMsg
									return
								}
							} 		
						})
						
					})
				})	
			},
			validate () {
				this.errMsg = ''
				this._rules.forEach(rule => {
					rule.validate.forEach((validate, i) => {
						this.isValid = validate(this.value)
						this.errMsg = this.errMsg || rule.errMsg[i]
					})
				})
				return this.isValid
			},
			reset () {
				this.errMsg = ''
				this.isValid = true
			}
		},
		created () {
			if (Array.isArray(this.containers)) {
				this.containers.push(this)
			}
		},
		destroy () {
			
		}
	}
</script>
<style lang="less" scoped>
	.validate-input-wrap {
		vertical-align: top;
		.vaidate-input-msg {
			line-height: 14px;
			height: 14px;
			color: #ed3f14;
			vertical-align: bottom;
		}
	}	
</style>