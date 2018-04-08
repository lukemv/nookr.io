<template>
  <nav class="navbar navbar-dark bg-primary">
    <span class="navbar-brand mb-0 h1">nookr.io</span>
    <span class="navbar-text">
      <ul class="nav">
        <li class="ml-1 pl-2">
          <router-link :to="{ name: 'SearchBooks' }">Search</router-link>
        </li>
        <li class="ml-1 pl-2">
          <router-link :to="{ name: 'BookList' }">Book List</router-link>
        </li>
        <li class="ml-1 pl-2">
          <router-link :to="{ name: 'NYBooks' }">NY Bestsellers</router-link>
        <li v-if="hasAuth" class="pl-2">|</li>
        <li class="ml-1 pl-2" v-if="!('Login' === $route.name) && !hasAuth">
          <router-link :to="{ name: 'Login' }">Login</router-link>
        </li>
        <li class="ml-1 pl-2" v-if="!('Register' === $route.name) && !hasAuth">
          <router-link :to="{ name: 'Register' }">Register</router-link>
        </li>
        <li class="ml-1 pl-2" v-if="hasAuth">
          {{user.local.email}}
        </li>
        <li class="ml-1 pl-2" v-if="hasAuth">
          <a href="" v-on:click="sessionEnd()"> Logoff</a>
        </li>
      </ul>
    </span>
  </nav>
</template>

<script>
export default {
  name: 'navigation',
  methods: {
    sessionEnd: function () {
      this.$globals.endSession()
    }
  },
  computed: {
    user: function () {
      return this.$globals.user
    },
    hasAuth: function () {
      return this.$globals.user !== null
    }
  },
  mounted: function () {
    this.$globals.updateProfile()
  }
}
</script>

<style>
  .navbar-brand {
    font-family: Pacifico;
    font-size: 1.8rem;
  }
</style>
