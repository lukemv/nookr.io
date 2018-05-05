// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import VueResource from 'vue-resource'
import VueCookie from 'vue-cookie'
import Vuelidate from 'vuelidate'

import Navigation from '@/components/Navigation'
import 'vue-awesome/icons'
import Icon from 'vue-awesome/components/Icon'

Vue.component('icon', Icon)
Vue.component('navigation', Navigation)

Vue.config.productionTip = false

Vue.use(VueResource)
Vue.use(Vuelidate)
Vue.use(VueCookie)

const api = window.location.host === 'localhost:8080' ? 'http://localhost:8081' : `https://nookr.io/api/v1`

const globals = new Vue({
  data: {
    api: api,
    tokenCookieKey: 'nookr-jwt',
    tokenExpiresCookieKey: 'nookr-jwt-expires',
    slidingRefreshSeconds: 300,
    user: null
  },
  methods: {
    updateProfile: function () {
      this.$http.get(`${this.$globals.api}/auth/profile`).then(function (data) {
        this.user = data.body.payload.user
      }, function (error) {
        console.error(error)
      })
    },
    startSession: function (payload) {
      // Expires is the number of seconds from now.
      var cookieOptions = { expires: payload.expires }
      this.$cookie.set(this.tokenCookieKey, payload.token, cookieOptions)
      const expires = new Date()
      expires.setSeconds(expires.getSeconds() + payload.expires)
      this.$cookie.set(this.tokenExpiresCookieKey, JSON.stringify(expires), cookieOptions)
      this.updateProfile()
    },
    endSession: function () {
      this.$http.get(`${this.$globals.api}/auth/logoff`).then(function (data) {
        this.user = null
        this.$cookie.set(this.tokenExpiresCookieKey, null)
        this.$cookie.set(this.tokenCookieKey, null)
        router.push('/session-end')
      }, function (error) {
        console.log(error)
      })
    }
  }
})

Vue.prototype.$globals = globals

Vue.http.interceptors.push(function (request) {
  const token = this.$cookie.get(this.$globals.tokenCookieKey)

  if (token !== '') {
    console.log('authenticated request')
    request.headers.set('Authorization', 'Bearer ' + token)
  } else {
    console.log('unauthenticated request')
  }
})

// Handle 401's
Vue.http.interceptors.push(function (request, next) {
  next(function (response) {
    if (response.status === 401) {
      this.$router.push('/session-end')
    }
  })
})

console.log(`API: ${Vue.prototype.$baseUrl}`)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App, Icon, Navigation }
})
