import Http from './Http'
// import axios from 'axios'

// 接口

export function getUser(id) {
  return Http.get('/user/' + id)
}
export function getUserList () {
  return Http.get('/user/list')
}

export function updateUser (id, data) {
  return Http.post('/user/' + id, data)
}
export function updateUsers (ids, modify) {
  return Http.post('/user/update', {ids, modify})
}
export function deleteUsers (ids) {
  if (!ids) return 
  ids = Array.isArray(ids) ? ids : [ids]
  return Http.post('/user/delete', {ids})
}
export function getOrderList (pageConfig) {
  return Http.get('/order', {params: pageConfig})
}

export function getOrder (id) {
  return Http.get('/order/' + id)
}

export function deleteOrder (id) {
  return Http.post('/order/delete/' + id)
}

export function deleteOrders(ids) {
  return Http.post('/order/delete/', {ids})
}

export function updateOrders (ids, modify) {
  return Http.post('/order/update', {ids, modify})
}

export function updateOrder (id, modify) {
  return Http.post('/order/update/' + id, modify)
} 

export function postLogin (data) {
  return Http.post('/login/admin/login', data)
}

export function postRegister (data) {
  return Http.post('/login/admin/regist', data)
}

export function editProduct (data, id) {
  id = id || 'add'
  return Http.post('/product/' + id, data)
}

export function getProduct (id) {
  return Http.get('/product/' + id )
}

export function getProductList ({pageNum=1, pageSize=10, sort=""} =  {}) {
  return Http.get('/product/list', {params: {pageNum, pageSize, sort}})
}

export function deleteProduct (id) {
  return Http.post('/product/delete/' + id)
}

export function getAddressById(id) {
  return Http.get('/address/' + id)
}
export function getAddressList(userId) {
  return Http.get('/address/list?userId='+ userId)
}
export function addAddress(data) {
  return Http.post('/address', data)
}

export function updateAddress (id, modify) {
  return Http.post('/address/' + id, modify)
}
export function getAreaList (code) {
  if (code) {
    return Http.get('/area/' + code)
  } else {
    return Http.get('/area/100000')
  }
}

export function deleteAddress(addressId, data) {
  return Http.post('/address/delete/' + addressId, data)
}

export function getProductCateList (listReq) {
  return Http.get('/product/cate' + (listReq ? `?${listReq}` : ''))
}

export function postEditCate (data, id) {
  if (id === 'add') {
    return Http.post('/product/cate/add', data)
  }else {
    return Http.post('/product/cate/' + id, data)
  }
}

export function getProductPropList() {
  return Http.get('/product/prop')
}

export function deleteProductCate(data) {
  return Http.post('/product/cate/remove', data)
}

export function getProductCate(id) {
  return Http.get('/product/cate/' + id)
}

export function getPropList() {
  return Http.get('/product/prop')
}

export function getProductProp(id) {
  return Http.get('/product/prop/' + id)
}

export function deleteProductProp(data) {
  return Http.post('/product/prop/remove', data)
}

export function eidtProductProp(data, id) {
  if (id === 'add') {
    return Http.post('/product/prop/add', data)
  }else {
    return Http.post('/product/prop/' + id, data)
  }
}

export function getPropListByCateId(id) {
  if (!id) return
  return Http.get('/product/cate/:id/props')
}
