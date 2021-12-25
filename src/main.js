import Vue from 'vue'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

import '@/styles/index.scss' // global css

import App from './App'
import store from './store'
import router from './router'

import '@/icons' // icon
import '@/permission' // 路由守卫

import * as directives from '@/directives' // 自定义指令
// 全局注册组件
import Component from '@/components'
import * as filters from '@/filters' // 引入工具类
import Print from 'vue-print-nb'
// 全局混入检查功能权限函数
import mixIn from '@/mixin/checkPermission'
import i18n from '@/lang'

// 注册全局的过滤器
Object.keys(filters).forEach((key) => {
  // 注册过滤器
  Vue.filter(key, filters[key])
})

/**
 * If you don't want to use mock-server
 * you want to use MockJs for mock api
 * you can execute: mockXHR()
 *
 * Currently MockJs will be used in the production environment,
 * please remove it before going online ! ! !
 */
// if (process.env.NODE_ENV === 'production') {
//   const { mockXHR } = require('../mock')
//   mockXHR()
// }

// set ElementUI lang to EN
Vue.use(ElementUI, {
  // key用来控制其语言
  i18n: (key, value) => i18n.t(key, value)
  // 改变local
})
// 如果想要中文版 element-ui，按如下方式声明
// Vue.use(ElementUI)
Vue.use(Component) // 注册自己的组件, 自己注册函数函数会值执行
// Global instruction
Vue.use(Print)
// 注册混入
Vue.mixin(mixIn)

Vue.config.productionTip = false
// 注册自定义的指令
// 遍历所有的directives对象注册为自定义组件
// 转数组在遍历
Object.keys(directives).forEach((key) => {
  // 注册自定义指令
  Vue.directive(key, directives[key])
})

new Vue({
  el: '#app',
  router,
  store,
  i18n,
  render: (h) => h(App)
})
