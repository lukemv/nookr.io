import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/components/Login'
import Register from '@/components/Register'
import BookList from '@/components/BookList/BookList'
import Proto from '@/components/Proto'

Vue.use(Router)

export default new Router({
  // Named views - https://router.vuejs.org/en/essentials/named-routes.html
  // Note: One path needs to be / or when the page loads it will be blank.
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
    {
      path: '/register',
      name: 'Register',
      component: Register
    },
    {
      path: '/proto',
      name: 'Proto',
      component: Proto
    }
  ]
})
