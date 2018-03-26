import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/components/Login'
import BookList from '@/components/BookList/BookList'
import p404 from '@/components/p404'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Login',
      component: Login
    },
    {
      path: '/book-list',
      name: 'BookList',
      component: BookList
    },
    { path: '*',
      name: 'p404',
      component: p404
    }
  ]
})
