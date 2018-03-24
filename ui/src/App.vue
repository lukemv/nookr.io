<template>
  <div id="app">
    <nav class="navbar navbar-dark bg-primary">
      <span class="navbar-brand mb-0 h1">nookr.io</span>
      <span class="navbar-text">
        <ul class="nav">
          <li class="ml-1" v-if="!('Login' === $route.name)">
            <router-link :to="{ name: 'Login' }">Login</router-link>
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
@import '../bootstrap/scss/bootstrap';
</style>
