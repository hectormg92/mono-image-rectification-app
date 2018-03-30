import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'main-controller',
      component: require('@/components/MainController').default
    },
    {
      path: '*',
      redirect: '/'
    }
  ]
})
