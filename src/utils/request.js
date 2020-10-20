/*
请求模块
 */

import axios from 'axios'

// 在非组件模块中获取 store 必须通过这种方式
// 这里单独加载 store，和在组件中 this.$store 一个东西
import store from '@/store/'
const request = axios.create({
  baseURL: 'http://ttapi.research.itcast.cn/' // 基础路径
})

// 请求拦截器
request.interceptors.request.use(config => {
  const { user } = store.state
  // 如果用户已经登录，统一设置接口的token信息
  if (user) {
    config.headers.Authorization = `Bearer ${user.token}`
  }
  // 处理完之后要把config返回
  return config
}, err => {
  return Promise.reject(err)
})

// 响应拦截器

// 导出

export default request
