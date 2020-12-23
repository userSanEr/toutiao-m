import axios from 'axios'

/**
 * 在非组件模块中获取store必须通过这种方式
 * 在这里单独加载store，在和组件中this.$store一个东西
 */
import store from '@/store'

//
import JSONbig from 'json-bigint'

const request = axios.create({
  baseURL: 'http://ttapi.research.itcast.cn/',
  // transformResponse 允许自定义原始的响应数据（字符串）
  /**
   * 后端返回的数据可能不是json格式字符串
   * 如果不是直接使用jsonBig.parse就会报错
   * 所以需要使用try catch来处理异常
   */
  transformResponse: [function (data) {
    try {
      // 如果转换成功则返回转换的数据结果
      return JSONbig.parse(data)
    } catch (err) {
      // 如果转换失败，则包装为统一数据格式并返回
      return {
        data
      }
    }
  }]
})

// 请求拦截器
request.interceptors.request.use(function (config) {
  const { user } = store.state
  if (user) {
    config.headers.Authorization = `Bearer ${user.token}`
  }
  // 处理完之后一定要把config返回，否则请求就会停在这里
  return config
}, function (error) {
  return Promise.reject(error)
})

// 响应拦截器

export default request
