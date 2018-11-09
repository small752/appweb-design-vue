import Vue from 'vue'
import Router from 'vue-router'

/**
 * H5报名页面
 */
const EnrollPage = () => import('@/components/lovers-mapping/h5/enroll-page/Index.vue').then(m => m.default)

Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '/enroll',
      name: 'EnrollPage',
      component: EnrollPage
    },
    //  重定向路由，重定向到系统首页
    {
      path: '/*',
      redirect: '/enroll'
    }
  ]
})

export default router
