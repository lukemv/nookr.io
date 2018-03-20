<template>
  <div id="app">
    <header>
      <span>Vue.js PWA</span>
    </header>
    <main>
      <img src="./assets/logo.png" alt="Vue.js PWA">
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
  $icon-font-path: "../node_modules/bootstrap-sass/assets/fonts/bootstrap/";
  @import '../node_modules/bootstrap-sass/assets/stylesheets/_bootstrap';
</style>
