// 导入处理token的方法
import { getToken, setToken, removeToken } from '@/utils/auth'
// 导入登入api
import { login } from '@/api/user'

// 状态
const state = {
  token: getToken()
}
// 修改状态
const mutations = {
  setToken(state, token) {
    state.token = token
    setToken(token)
  },
  removeToken(state) {
    state.token = null
    removeToken()
  }
}
// 执行异步
const actions = {
  // 分装登录的actions
  async goLogin(context, data) {
    var res = await login(data)
    // 处理请求数据
    if (res.success) {
      // 表示登录接口调用成功 也就是意味着你的用户名和密码是正确的
      // 现在有用户tokenx
      // actions 修改state 必须通过mutations
      context.commit('setToken', res.data)
    }
  }
}
export default {
  namespaced: true,
  state,
  mutations,
  actions
}
