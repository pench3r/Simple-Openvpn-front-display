import Vue from 'vue'
import Router from 'vue-router'
import currentTableData from '@/components/currentdata'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/start/!',
      name: 'HelloWorld',
      component: currentTableData
    }
  ]
})
