// 表单验证，超出最大输入值提示信息
const createMaxValidate = function(max, idx, objectName) {
	const _this = this
		return function (rule, value, callback, source, options) {
			let form = objectName ? _this[objectName] : _this.form
			if (value.length > max) {
				callback(ERROR_MESSAG.OVERFLOW)
				setTimeout(() => {
					if (typeof idx === 'number') {
						let tempFieldArr = rule.field.split('.')
						form[tempFieldArr[0]].splice(idx, 1, value.slice(0, max))
					} else {
						form[rule.field] = value.slice(0, max)
					}
				}, 200)
			} else {
				callback()
			}
		}
	}
	const createRegValidate = function (regType, errMsg) {
		return function (rule, value, callback, source, options) {
			if (!reg[regType] || !value) return callback()
			if (!reg[regType].test(value)) {
				callback(errMsg || ERROR_MESSAG.INVALID )
			}
			callback()

		}
	}
//获取QueryString的数组
const getQueryStr = function(){
	var result = location.search.match(new RegExp("[\?\&][^\?\&]+=[^\?\&#]+","g"))
	if(result == null){
		return ""
	}
	for(var i = 0; i < result.length; i++){
		result[i] = result[i].substring(1)
	}
	return result
}

//根据QueryString参数名称获取值

const getQueryStrgByName = function(name){
	var result = location.search.match(new RegExp("[\?\&]" + name+ "=([^\&#]+)","i"))
	if(result == null || result.length < 1){
		return ""
	}
	return result[1]
}