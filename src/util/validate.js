export const regexp = {
  tel: /^[1][3,4,5,7,8][0-9]{9}$/
}

export const validate = function (val, type) {
  if (val && type && regexp[type]) {
    return regexp[type].test(val)
  }
}
