<template>
  <div id="app">
    <nav class="navbar navbar-dark bg-primary">
      <span class="navbar-brand mb-0 h1">nookr.io</span>
      <span class="navbar-text">
        <ul class="nav">
          <!--Named views - https://router.vuejs.org/en/essentials/named-views.html-->
          <li class="ml-1" v-if="!('Login' === $route.name)">
            <!--Router links - https://router.vuejs.org/en/api/router-link.html-->
            <router-link :to="{ name: 'Login' }">Login</router-link>
          </li>
          <li class="ml-1" v-if="!('Register' === $route.name)">
            <router-link :to="{ name: 'Register' }">Register</router-link>
          </li>
          <li class="ml-1">
            <router-link :to="{ name: 'SearchBooks' }">Search</router-link>
          </li>
          <li class="ml-1">
            <router-link :to="{ name: 'BookList' }">Book List</router-link>
          </li>
        </ul>
      </span>
    </nav>
    <main>
      <router-view></router-view>
    </main>
  </div>
</template>

<script>
export default {
  name: 'app'
}
</script>

<style lang="sass">
@import '../bootstrap/scss/bootstrap'
</style>
