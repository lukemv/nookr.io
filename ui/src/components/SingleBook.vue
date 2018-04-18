<template>
  <div id="book-page" class="row">
    <div class="book-image col-xs-12 col-sm-3">
      <img v-bind:src="book.volumeInfo.imageLinks.thumbnail" alt="book thumbnail">
    </div>
    <div class="col-xs-12 col-sm-9">
      <div class="book-title">{{book.volumeInfo.title}}</div>
      <div class="book-authors" v-for="author in book.volumeInfo.authors">{{author}}</div>
      <div class="book-categories" v-for="category in book.volumeInfo.categories">{{category}}</div>
       <!-- A check is needed here as not all books have ratings, this will probably need an additional function -->
      <div class="book-google-rating">
          <span v-for="star in nookrInfo.rating">
            <div class="star">&#9733;</div>
          </span>
            
      </div>

      <!-- Addtional Book information needs to be added when Database content includes detailed book views -->
    </div>
  </div>
</template>

<script>
  export default {
    name: 'book',
    data () {
      return {
        bookID: this.$route.query.id,
        book: [],
        nookrInfo: []
      }
    },
    methods: {
      searchBooks: function () {
        this.$http.get(`${this.$globals.api}/singleBook?id=` + this.bookID)
          .then((res) => {
            console.log(res.body.payload)
            this.book = res.body.payload.book.googleInfo
            this.nookrInfo = res.body.payload.book.nookrInfo
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
  .star{
   color: gold;
   display: inline;
   font-size: 1.5em;
  }
</style>
