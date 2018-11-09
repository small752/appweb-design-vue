import Vue from 'vue'
import Router from 'vue-router'

import {checkDDAuthLogin} from '@/util/ddutil.js'

const DdLogin = () => import('@/components/jhszf-dd/common/dd-login/Index.vue').then(m => m.default)

/**
 * 公文待办事项
 */
const DocListIndex = () => import('@/components/jhszf-dd/doc/list/Index.vue').then(m => m.default)

Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '/',
      name: 'DdLogin',
      component: DdLogin
    },
    {
      path: '/doc/list',
      name: 'DocListIndex',
      component: DocListIndex
    },
    //  重定向路由，重定向到系统首页
    {
      path: '/*',
      redirect: '/doc/list'
    }
  ]
})

router.beforeEach((to, from, next) => {
  //  路由拦截 判断是否经过钉钉免登
  let ddOauthLogin = checkDDAuthLogin()

  if (ddOauthLogin) {
    if (to.path === '/') {
      next('/default')
    } else {
      next()
    }
  } else {
    if (to.path !== '/') {
      next('/')
    } else {
      next()
    }
  }
})

export default router
