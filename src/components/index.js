// 该文件负责所有的公共的组件的全局注册   Vue.use
import PageTools from './PageTools'
import UploadExcel from './UploadExcel'
import imageUpload from './ImageUpload'
// 全屏插件
import ScreenFull from './ScreenFull'
// 主题选择插件
import ThemePiker from './ThemePiker'
import TagsView from './TagsView'
// 国际化
import lang from './lang'
export default {
  install(Vue) {
    Vue.component('PageTools', PageTools) // 注册工具栏组件
    Vue.component('UploadExcel', UploadExcel) // 注册导入excel组件
    Vue.component('imageUpload', imageUpload)
    Vue.component('screenFull', ScreenFull)
    Vue.component('themePiker', ThemePiker)
    Vue.component('lang', lang)
    Vue.component('TagsView', TagsView)
  }
}
