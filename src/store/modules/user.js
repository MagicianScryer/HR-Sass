// 导入处理token的方法
import { getToken, setToken, removeToken, setTimeStamp } from '@/utils/auth'
// 导入登入api
import { login, getUserInfo, getUserDetailById } from '@/api/user'
// 导入重置路由函数
import { resetRouter } from '@/router'

// 状态
const state = {
  token: getToken(),
  userInfo: {}
}
// 修改状态
const mutations = {
  setToken(state, token) {
    state.token = token
    setToken(token)
    setTimeStamp()
  },
  removeToken(state) {
    state.token = null
    removeToken()
  },
  setUserInfo(state, user) {
    state.userInfo = user
  },
  removeUserInfo(state) {
    state.userInfo = {}
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
  },
  // 封装获取用户信息的action
  async getUserInfo(context) {
    const result = await getUserInfo() // 获取返回值
    const detile = await getUserDetailById(result.data.userId)
    context.commit('setUserInfo', { ...result.data, ...detile.data }) // 将整个的个人信息设置到用户的vuex数据中
    return result // 这里为什么要返回 为后面埋下伏笔
  },
  // 退出功能
  logout(context) {
    context.commit('removeToken')
    context.commit('removeUserInfo')
    resetRouter()
    context.commit('permission/setRoutes', [], { root: true })
    // 子模块调用子模块的action 可以 将 commit的第三个参数 设置成  { root: true } 就表示当前的context不是子模块了 而是父模块
  }
}
export default {
  namespaced: true,
  state,
  mutations,
  actions
}
