// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import VueResource from 'vue-resource'
import Vuelidate from 'vuelidate'

Vue.config.productionTip = false
Vue.use(VueResource)
Vue.use(Vuelidate)

Vue.prototype.$api = window.location.host === 'localhost:8080' ? 'http://localhost:8081' : `https://nookr.io/api/v1`

console.log(Vue.prototype.$baseUrl)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App }
})
