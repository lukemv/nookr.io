<template>
  <div id="book-page" class="row">
    <div class="book-image col-xs-12 col-sm-3">
      <img v-bind:src="book.volumeInfo.imageLinks.thumbnail" alt="book thumbnail">
    </div>
    <div class="col-xs-12 col-sm-9">
      <div class="book-title">{{book.volumeInfo.title}}</div>
      <div class="book-authors" v-for="author in book.volumeInfo.authors">{{author}}</div>
      <div class="book-categories" v-for="category in book.volumeInfo.categories">{{category}}</div>
      <div v-if="" class="book-rating row">
          <div class="col-6" >
            <div class='rating-message'>Rate this book</div>
            <div class="stars">
              <span v-for="i in goldStars">
              <div class="star star-gold" v-on:click="rateBook(i)" v-bind:id="i">&#9733;</div>
            </span>
            <span v-for="i in greyStars">
              <div class="star star-grey" v-on:click="rateBook(i + goldStars)">&#9733;</div>
            </span>
            </div>
          </div>
          
          <!-- <div v-else class="user-rating col-6">
            <router-link :to="{ name: 'Login' }">Login</router-link> or
            <router-link :to="{ name: 'Register' }">Register</router-link> to Rate a Book</div> -->
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
        nookrInfo: [],
        rating: '',
        greyStars: 5,
        goldStars: 0,
        ratingMessage: 'Rate This Book'
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
          .then(
            this.getUserRating()
          )
      },
      getUserRating: function () {
        var id = this.user.id
        this.$http.get(`${this.$globals.api}/getRating?userID=` + id + `&bookID=` + this.bookID)
          .then((res) => {
            this.goldStars = res.body.payload.bookRating
            if (this.goldStars !== 0) {
              this.ratingMessage = 'Your Current Rating'
            }
            this.greyStars = 5 - this.goldStars
          }, (error) => {
            console.log(error)
          })
      },
      rateBook: function (rating) {
        var id = this.user.id
        this.$http.get(`${this.$globals.api}/addRating?userID=` + id + `&bookID=` + this.bookID + `&rating=` + rating)
          .then((res) => {
            // Get the rating back from the database
            this.getUserRating()
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
    computed: {
      user: function () {
        return this.$globals.user
      },
      hasAuth: function () {
        return this.$globals.user !== null
      }
    },
    mounted: function () {
      this.searchBooks()
    },
    created: function () {
      // Checks if a bookID has been sent, if not, user is sent to error page
      if (typeof this.$route.query.id !== 'undefined') {
        console.log('book-found')
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
  .book-rating{
    margin-top: 10px;
  }
  .star{
    padding-left: 3px;
    padding-right: 3px;
    display: inline-block;
    font-size: 1.5em;
    -webkit-transition: .3s; /* Safari */
    transition: .3s;
  }
  .star-gold{
    color: gold;
  }
  .star-grey{
    color: rgb(207, 207, 207);
  }
  .star:hover{
    transform: scale(1.5);
    cursor:pointer;
  }
  .rating-message{
    display: inline-block;
    margin-right: 10px;
    margin-top: 8px;
  }
 
  .description{
    margin-top: 30px;
  }
</style>
