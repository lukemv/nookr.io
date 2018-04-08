<template>
  <div id="app">
    <navigation></navigation>
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
<style>
  .navbar-brand {
    font-family: Pacifico;
    font-size: 1.8rem;
  }
</style>
