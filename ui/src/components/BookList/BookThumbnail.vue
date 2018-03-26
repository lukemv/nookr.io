<template>
  <div >
    <img class="book-img" v-bind:src="require('../../assets/' + book.coverImage)" alt="Book Cover">
    <div class="book-title"> {{book.title}}</div>
  </div>
</template>

<script>
    export default {
      name: 'book-thumbnail',
      props: ['book']
    }
</script>

<style scoped>
  .book-img{
    height: 200px;
    width: auto;
  }
  .book-title{
    padding-top: 5px;
    font-size: 1.1rem;
    width: 200px;
  }
</style>
