<template>
  <div id="app">
    <nav class="navbar navbar-dark bg-primary">
      <span class="navbar-brand mb-0 h1">nookr.io</span>
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

