<template>
  <div id="book-page" class="row">
    <div class="book-image col-xs-12 col-sm-3">
      <img v-bind:src="book.volumeInfo.imageLinks.thumbnail" alt="book thumbnail">
    </div>
    <div class="col-xs-12 col-sm-9">
      <div class="book-title">{{book.volumeInfo.title}}</div>
      <div class="book-google-rating">{{book.volumeInfo.averageRating}} stars from {{book.volumeInfo.ratingsCount}} readers.</div>
      <div class="book-authors" v-for="author in book.volumeInfo.authors">{{author}}</div>
      <div class="book-publisher-and-date-and-pages"> {{book.volumeInfo.publisher}}, {{book.volumeInfo.publishedDate.match(/\d{4}/).toString()}} - {{book.volumeInfo.pageCount}} pages.</div>
      <div class="book-categories" v-for="category in book.volumeInfo.categories">{{category}}</div>
      <p class="book-description">{{book.volumeInfo.description}}</p>
      <div class="book-isbns" v-for="isbn in book.volumeInfo.industryIdentifiers">{{isbn}}</div>
    </div>
  </div>
</template>

<script>
  import axios from 'axios'

  export default {
    name: 'single-book',
    data () {
      return {
        bookID: this.$route.query.id,
        book: []

      }
    },
    methods: {
      searchBooks: function () {
        this.loading = true
        axios.get('https://www.googleapis.com/books/v1/volumes?q=' + this.bookID)
          .then((response) => {
            this.loading = false
            // check if it has returned a valid book
            if (response.data.totalItems === 0) {
              this.$router.push('book-not-found')
            } else {
              this.book = response.data.items[0]
              console.log(response.data.items[0])
            }
          }, (error) => {
            this.loading = false
            console.log(error)
            this.$router.push('book-not-found')
          })
      }
    },
    created: function () {
      // Checks if a bookID has been sent, if not, user is sent to error page
      if (typeof this.$route.query.id !== 'undefined') {
        this.searchBooks()
      } else {
        this.$router.push('book-not-found')
      }
    }
  }
</script>

<style scoped>

  #book-page{
    margin-top: 60px;
    max-width: 900px;
    margin-left: auto;
    margin-right: auto;
  }
  .book-image img{
    height: auto;
  }
  .book-title{
    font-size: x-large;
  }
  .book-authors{
    font-size: larger;
    color: #5f5b5f;
  }
  .book-categories, .book-google-rating, .book-publisher-and-date-and-pages, book-isbns {
    padding-top: 10px;
    color: #8a848a;
  }
  .book-description{
    margin-top: 30px;
  }
</style>
