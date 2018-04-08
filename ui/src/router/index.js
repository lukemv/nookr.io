import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/components/Login'
import p404 from '@/components/p404'
import Register from '@/components/Register'
import BookList from '@/components/BookList/BookList'
import Proto from '@/components/Proto'
import SearchBooks from '@/components/SearchBooks'
import NYBooks from '@/components/NYBooks'
import SingleBook from '@/components/SingleBook'
import SessionEnd from '@/components/SessionEnd'

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
    { path: '*',
      name: 'p404',
      component: p404
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
    },
    {
      path: '/search',
      name: 'SearchBooks',
      component: SearchBooks
    },
    {
      path: '/NYBooks',
      name: 'NYBooks',
      component: NYBooks
    },
    {
      path: '/book',
      name: 'SingleBook',
      component: SingleBook
    },
    {
      path: '/session-end',
      name: 'SessionEnd',
      component: SessionEnd
    }

  ]
})
