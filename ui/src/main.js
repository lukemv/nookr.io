// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import VueResource from 'vue-resource'
import VueCookie from 'vue-cookie'
import Vuelidate from 'vuelidate'

import 'vue-awesome/icons'
import Icon from 'vue-awesome/components/Icon'
Vue.component('icon', Icon)

Vue.config.productionTip = false

Vue.use(VueResource)
Vue.use(Vuelidate)
Vue.use(VueCookie)

const api = window.location.host === 'localhost:8080' ? 'http://localhost:8081' : `https://nookr.io/api/v1`

const globals = new Vue({
  data: {
    api: api,
    tokenCookieName: 'nookr-jwt'
  }
})

Vue.prototype.$globals = globals

Vue.http.interceptors.push(function (request) {
  const token = this.$cookie.get(this.$globals.tokenCookieName)

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

console.log(Vue.prototype.$baseUrl)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App, Icon }
})
