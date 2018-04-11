<template>
  <div id="book-page" class="row">
    <div class="book-image col-xs-12 col-sm-3">
      <img v-bind:src="book.volumeInfo.imageLinks.thumbnail" alt="book thumbnail">
    </div>
    <div class="col-xs-12 col-sm-9">
      <div class="book-title">{{book.volumeInfo.title}}</div>
      <!-- A check is needed here as not all books have ratings, this will probably need an additional function -->
      <div class="book-google-rating">{{book.volumeInfo.averageRating}} stars from {{book.volumeInfo.ratingsCount}} readers.</div>
      <div class="book-authors" v-for="author in book.volumeInfo.authors">{{author}}</div>
      <!-- Another check is needed here as not all books the metadata filled out correctly, this will probably need an additional function -->
      <div class="book-publisher-and-date-and-pages"> {{book.volumeInfo.publisher}}, {{book.volumeInfo.publishedDate.match(/\d{4}/).toString()}} - {{book.volumeInfo.pageCount}} pages.</div>
      <div class="book-categories" v-for="category in book.volumeInfo.categories">{{category}}</div>
      <p class="book-description">{{removeHTMLTagsFromDetailedDescriptionIfPresent}}</p>
      <div class="book-isbn" v-for="isbnInformation in bookDetailed.industryIdentifiers">
        <span v-for="isbnType in isbnInformation.type">{{isbnType.replace("_", " ")}}</span>:
        <span v-for="isbn in isbnInformation.identifier">{{isbn}}</span>
      </div>
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
        book: [],
        bookDetailed: []
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
            // Check for the right book displayed earlier, we need to go through the array and match the correct title to the ID, since multiple books can have the same ID...
            } else if (response.data.totalItems !== 0) {
              for (let i = 0; i < response.data.totalItems; i++) {
                // console.log(response.data.items[i])
                if (response.data.items[i].volumeInfo.title === this.$route.query.title) {
                  this.book = response.data.items[i]
                  break
                }
              }
              if (this.book === 'undefined') {
                this.$router.push('book-not-found')
              }
            }
          }, (error) => {
            this.loading = false
            console.log(error)
            this.$router.push('book-not-found')
          })
      },
      searchBookDetailed: function () {
        this.loading = true
        axios.get('https://www.googleapis.com/books/v1/volumes/' + this.bookID)
          .then((response) => {
            this.loading = false
            // check if it has returned a valid book
            if (response.data.totalItems === 0) {
              this.$router.push('book-not-found')
            } else {
              this.bookDetailed = response.data.volumeInfo
              console.log(response.data.volumeInfo)
            }
          }, (error) => {
            this.loading = false
            console.log('searchBookDetailed error: ' + error)
            this.$router.push('book-not-found')
          })
      }
    },
    created: function () {
      // Checks if a bookID has been sent, if not, user is sent to error page
      if (typeof this.$route.query.id !== 'undefined') {
        this.searchBooks()
        this.searchBookDetailed()
      } else {
        this.$router.push('book-not-found')
      }
    },
    computed: {
      // This is needed because some detailed descriptions contain HTML. - https://vuejs.org/v2/guide/computed.html
      removeHTMLTagsFromDetailedDescriptionIfPresent: function () {
        // The patterns are needed to remove the HTML, and the test is needed because some text won't return when passed into this function. https://stackoverflow.com/questions/37623982/how-to-remove-html-tags-from-json-output
        let pattern1 = /<[^>]+>/gm
        let pattern2 = /&nbsp;/g
        let pattern3 = /&rsquo;/
        let pattern4 = /(&ldquo;)|(&rdquo;)/g
        if (pattern1.test(this.bookDetailed.description) ||
          pattern2.test(this.bookDetailed.description) ||
          pattern3.test(this.bookDetailed.description) ||
          pattern4.test(this.bookDetailed.description)) {
          return this.bookDetailed.description.replace(/<[^>]+>/gm, '')
            .replace(/&nbsp;/g, ' ')
            .replace(/&rsquo;/, '\'')
            .replace(/(&ldquo;)|(&rdquo;)/g, '"')
            // Some text has no spaces after fullstops when the HTML is removed. The positive lookahead for capital letters is needed to stop '...' becoming '. . .' or '7.62' becoming '7 .62'
            .replace(/\.(?=\s*[A-Z])/g, '\. ')
        } else {
          return this.bookDetailed.description
        }
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
  .book-categories, .book-google-rating, .book-publisher-and-date-and-pages, .book-isbn {
    padding-top: 10px;
    color: #8a848a;
  }
  .book-description{
    margin-top: 30px;
  }
</style>
