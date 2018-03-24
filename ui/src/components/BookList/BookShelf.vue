<template>
    <div id="book-shelf">
      <div class="recommendation">
        <div class="recommendation-title">{{shelfTitle}}</div>
        <hr>
        <span v-for="n in books.length">
          <book-thumbnail class="book-thumbnail" v-bind:book="books[n-1]"></book-thumbnail>
        </span>

      </div>

    </div>

</template>

<script>
    import BookThumbnail from './BookThumbnail'

    export default {
      components: {BookThumbnail},
      name: 'book-shelf',
      props: ['books', 'shelfTitle']
    }
</script>

<style scoped>
  .recommendation{
    margin: 0 auto;
    margin-top: 50px;
    max-width: 1000px;
  }
  .recommendation-title{
    font-size: 1.4rem;
  }
  .book-thumbnail{
    display: inline-block;
  }

</style>
