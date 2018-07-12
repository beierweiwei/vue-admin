import axios from 'axios'
import defaultConfig from './config'
import {REQ_CONFIG, CODE_MSG} from '@/config'
import VueRouter from 'vue-router'

const Http = axios.create({...defaultConfig, ...REQ_CONFIG})

export const HandleResponse = (res) => {
  if (res.data.code === 200) {
    return res.data.data
  } else {
    switch (res.data.code) {
      case 201:
        VueRouter.push('/login')
        break
    }
    return handleError(res.data)
  }
}

export const handleError = (res) => {
  if (Http.defaults.prompt) {
    Http.defaults.prompt(CODE_MSG[res.code])
  }
  return Promise.reject(res)
}

// axios.interceptors.request.use(function (config) {
//
// })
/* disable no-unused-vars */
Http.interceptors.response.use(HandleResponse, (err) => {
  console.log('app_error', err)
  return Promise.reject('error')
})
export default Http
