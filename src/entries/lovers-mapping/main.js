// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import { AjaxPlugin, ToastPlugin, LoadingPlugin, ConfirmPlugin } from 'vux'
import infiniteScroll from 'vue-infinite-scroll'

Vue.config.productionTip = false

const FastClick = require('fastclick')
FastClick.attach(document.body)

Vue.use(AjaxPlugin)
Vue.use(ToastPlugin, {position: 'top'})
Vue.use(infiniteScroll)
Vue.use(LoadingPlugin)
Vue.use(ConfirmPlugin)

//  引入全局方法
require('@/util/request.js')

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
