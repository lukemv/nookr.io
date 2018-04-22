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
      <div class="book-google-rating row">
          <div class="stars col-3" >
            <span v-for="star in nookrInfo.rating">
              <div class="star">&#9733;</div>
            </span>
          </div>
          <div class="user-rating col-6">
            <div class="rating-message">Rate This Book</div>
            <select>
              <option value="null" selected>-</option>
              <option value="1">1 Star</option>
              <option value="2">2 Star</option>
              <option value="3">3 Star</option>
              <option value="4">4 Star</option>
              <option value="5">5 Star</option>
            </select>
          </div>
      </div>
      <div class="description">
        {{getBookDescription()}}
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
        isbn10: this.$route.query.isbn10,
        isbn13: this.$route.query.isbn13,
        book: [],
        nookrInfo: []
      }
    },
    methods: {
      searchBooks: function () {
        this.$http.get(`${this.$globals.api}/singleBook?id=` + this.bookID)
          .then((res) => {
            this.book = res.body.payload.book.googleInfo
            this.nookrInfo = res.body.payload.book.nookrInfo
          }, (error) => {
            console.log(error)
          })
      },
      // Returns a book description if there is one present, otherwise just returns a "no description" message
      getBookDescription: function () {
        if (this.book.volumeInfo.description) {
          return this.book.volumeInfo.description
        } else {
          return 'Unfortunately no description is available for this book'
        }
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
   display: inline-block;
   font-size: 1.5em;
  }
  .rating-message{
    display: inline-block;
    margin-right: 10px;
    margin-top: 8px;
  }
  .description{
    margin-top: 50px;
  }
</style>
