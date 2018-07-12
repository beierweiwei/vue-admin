import cookie from 'js-cookie'
export function combine (array) {
  let all = []
  if (!(array && array.length > 0)) return
  function travel (idx, push) {
    push = [...push]
    let arr = array[idx]
    for (let i = 0; i < arr.length; i ++) {
      (function (i) {
        push[idx] = arr[i]
        if (array[idx + 1]) {travel(idx+1, push)}
        else {all.push([...push])}
      })(i)
    }
  }
  travel(0, [])
  return all
}

export default {
  cookie,
  combine
}
