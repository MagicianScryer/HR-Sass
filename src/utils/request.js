import axios from 'axios'
import { Message } from 'element-ui'
import store from '@/store'
import { getTimeStamp } from '@/utils/auth'
import router from '@/router'

const TimeOut = 3600 * 24 // 定义超时时间

const serve = axios.create({
  // 如果执行 npm run dev  值为 /api 正确  /api 这个代理只是给开发环境配置的代理
  // 如果执行 npm run build 值为 /prod-api  没关系  运维应该在上线的时候 给你配置上 /prod-api的代理
  baseURL: process.env.VUE_APP_BASE_API, // 设置axios请求的基础的基础地址
  timeout: 5000 // 定义5秒超时
})

// 请求拦截器
serve.interceptors.request.use(
  (config) => {
    // Do something before request is sent
    if (store.getters.token) {
      // token超时判断
      if (IsCheckTimeOut()) {
        // 如果它为true表示 过期了
        // token没用了 因为超时了
        store.dispatch('user/logout') // 登出操作
        // 跳转到登录页
        router.push('/login')
        return Promise.reject(new Error('token超时了'))
      }
      config.headers['Authorization'] = `Bearer ${store.getters.token}`
    }
    return config
  },
  (error) => {
    // Do something with request error
    return Promise.reject(error)
  }
)

// 响应拦截器
serve.interceptors.response.use(
  (response) => {
    // Do something before response is sent
    const { success, message } = response.data
    if (!success) {
      // 业务已经错误了 还能进then ? 不能 ！ 应该进catch
      Message.error(message) // 提示错误消息
      return Promise.reject(new Error(message))
    }
    return response.data
  },
  (error) => {
    // Do something with response error
    // error 信息 里面 response的对象
    if (error.response && error.response.data && error.response.data.code === 10002) {
      // 当等于10002的时候 表示 后端告诉我token超时了
      store.dispatch('user/logout') // 登出action 删除token
      router.push('/login')
    } else {
      Message.error(error.message) // 提示错误信息
    }
    return Promise.reject(error)
  }
)

// 是否超时
// 超时逻辑  (当前时间  - 缓存中的时间) 是否大于 时间差
function IsCheckTimeOut() {
  var currentTime = Date.now() // 当前时间戳
  var timeStamp = getTimeStamp() // 缓存时间戳
  return (currentTime - timeStamp) / 1000 > TimeOut
}

export default serve
