<template>
  <div class="book-list">
    <book-shelf v-bind:books="recommended" v-bind:shelf-title="'Recommended'"></book-shelf>
    <book-shelf v-bind:books="trending" v-bind:shelf-title="'Trending'"></book-shelf>
    <book-shelf v-bind:books="bestSellers" v-bind:shelf-title="'New York Best Sellers'"></book-shelf>
  </div>
</template>

<script>
    import BookShelf from './BookShelf'

    export default {
      components: {BookShelf},
      name: 'book-list',
      data () {
        return {
          // Recommended, Trending, and bestsellers are all bookshelves, they need to be populated with books in the following format:
          //    bookshelf.push({title: book.title, coverImage: book.coverImage, bookID: bookID})
          //  Each bookshelf takes at least 1 book, handles long lists automatically by provided a 'load more' button
          recommended: [],
          trending: [],
          bestSellers: [],
          // Trending books is a list of books taken from the DB based on the api/trending results. The TITLE, COVERIMAGE, and BOOKID are used from
          // this list to pass into the 'trending' bookshelf
          trendingBooks: []
        }
      },
      methods: {
        // Gets a single book by the bookID, and places it in the passed bookshelf. Call this function in a loop with all books that you want to
        // add to a particular bookshelf
        getBook: function (bookshelf, bookID) {
          var book = {title: '', coverImage: ''}
          this.loading = true
          // Hit our API and get a single book object.
          this.$http.get(`${this.$globals.api}/singleBook?id=` + bookID)
            .then((response) => {
              this.loading = false
              book['title'] = (response.body.payload.book.googleInfo.volumeInfo.title)
              book['coverImage'] = (response.body.payload.book.googleInfo.volumeInfo.imageLinks.thumbnail)
              // Place the single book into the desired bookshelf
              bookshelf.push({title: book.title, coverImage: book.coverImage, bookID: bookID})
            }, (error) => {
              this.loading = false
              console.log(error)
            })
        },
        // Gets id's of all trending books from api, sends them to getList method to display them to view
        getTrendingBooks: function (response) {
          this.trendingBooks = (response)
          return response
        }
      },
      created: function () {
        // Hard coded Recommended list.
        this.getBook(this.recommended, 'vWCqCVvluioC')
        this.getBook(this.recommended, 'ttuJAgAAQBAJ')
        // Populate  trending list, currently selects max 12 random trending books each time
        this.$http.get(`${this.$globals.api}/trending`)
          .then(this.getTrendingBooks)
          .then((output) => {
            return this.$http.get(`${this.$globals.api}/trending`)
          })
          .then((output) => {
            // Randomly selects a number of trending books, TODO, sort by date or some other variable
            this.trendingBooks = output.body.payload.bookList
            var trendingQuantity = Math.min(12, this.trendingBooks.length)
            // Get random numbers for selectin withing trendingBooks, cant be more than the amound of books in trendingBooks
            var randomNumbers = []
            while (randomNumbers.length < trendingQuantity) {
              var rand = Math.floor(Math.random() * trendingQuantity)
              if (!randomNumbers.includes(rand)) {
                randomNumbers.push(rand)
              }
            }
            for (var i = 0; i < trendingQuantity; i++) {
              // Random reference to a trendingBook
              var randomReference = randomNumbers[i]
              this.getBook(this.trending, this.trendingBooks[randomReference].id)
            }
          })
        // NY Times List goes here (bestSellers), currently hard coded. TODO: Load books in from API and loop into the bookshelves
        this.getBook(this.bestSellers, 'I6_ofHiH69sC')
        this.getBook(this.bestSellers, 'TpY-IOUsjrMC')
      }
    }
</script>

<style scoped>
.book-list{
  margin-bottom: 100px;
}
</style>
