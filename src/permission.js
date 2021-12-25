import router from '@/router'
import store from '@/store'
// 在导航守卫的位置，我们添加了NProgress的插件，可以完成进入时的进度条效果
import NProgress from 'nprogress' // 引入一份进度条插件
import 'nprogress/nprogress.css' // 引入进度条样式
// 导入获取用户信息的action

// 定义白名单
const whiteList = ['/login', '/404']

// 前置守卫
router.beforeEach(async (to, from, next) => {
  NProgress.start() // 开启进度条
  if (store.getters.token) {
    if (to.path === '/login') {
      next('/')
    } else {
      if (!store.getters.userId) {
        const { data: res } = await store.dispatch('user/getUserInfo')
        const routes = await store.dispatch('permission/filterRoutes', res.roles.menus)
        console.log(routes)
        router.addRoutes([...routes, { path: '*', redirect: '/404', hidden: true }]) // 添加动态路由到路由表  铺路
        next(to.path) // 相当于跳到对应的地址  相当于多做一次跳转 为什么要多做一次跳转
      } else {
        next()
      }
    }
  } else {
    whiteList.indexOf(to.path) > -1 ? next() : next('/login')
  }
  return NProgress.done()
})

// 后置守卫
router.afterEach((to, from) => {
  NProgress.done()
})
