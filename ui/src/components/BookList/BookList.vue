<template>
  <div id="#book-list">
    <book-shelf v-bind:books="recommended" v-bind:shelf-title="'Just For You'"></book-shelf>
    <book-shelf v-bind:books="trending" v-bind:shelf-title="'Trending'"></book-shelf>
    <book-shelf v-bind:books="newRelease" v-bind:shelf-title="'New Releases'"></book-shelf>
  </div>
</template>

<script>
    import BookShelf from './BookShelf'

    export default {
      components: {BookShelf},
      name: 'book-list',
      data () {
        return {
          recommended: [
            {title: 'Harry Potter', coverImage: 'harry-potter.jpg'},
            {title: 'Game of Thrones', coverImage: 'game-of-thrones.jpg'}],
          trending: [
            {title: 'Hunger Games', coverImage: 'hunger-games.jpg'},
            {title: 'Lord of the Flies', coverImage: 'lord-of-the-flies.png'}],
          newRelease: [
            {title: 'Animal Farm', coverImage: 'animal-farm.jpg'},
            {title: 'To Kill a Mockingbird', coverImage: 'mockingbird.jpg'}]
        }
      }
    }
</script>

<style scoped>

</style>
