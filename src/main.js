/* eslint-disable */

import 'babel-polyfill'
import fastclick from 'fastclick'
import VueLazyload from 'vue-lazyload'
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'

import 'common/stylus/index.styl'

/* eslint-disable no-unused-vars */
// 移动端的console.log
// import vConsole from 'vconsole'

// console.log('test')

// 去除点击300ms延迟
fastclick.attach(document.body)

// 懒加载
Vue.use(VueLazyload, {
  preLoad: 1.3,
  loading: require('common/image/default.jpg'),
  attempt: 1
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  render: h => h(App),
  router,
  store
})
