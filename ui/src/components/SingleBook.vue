<template>
  <div id="book-page" class="row">
    
    <div class="col-xs-12 col-sm-9">
      <div class="book-title">{{book.volumeInfo.title}}</div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'book',
    data () {
      return {
        bookID: this.$route.query.id,
        book: []
      }
    },
    methods: {
      searchBooks: function () {
        this.$http.get(`${this.$globals.api}/singleBook?id=` + this.bookID)
          .then((res) => {
            this.book = res.body.payload.book
          }, (error) => {
            console.log(error)
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
  .book-categories{
    padding-top: 10px;
    color: #8a848a;
  }
  .book-description{
    margin-top: 30px;
  }
</style>
