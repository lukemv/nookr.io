<template>
  <div class="book-list">
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
          recommended: [],
          trending: [],
          newRelease: [],
          trendingBooks: []
        }
      },
      methods: {
        getBook: function (bookshelf, isbn10) {
          var book = {title: '', coverImage: ''}
          this.loading = true
          this.$http.get(`${this.$globals.api}/singleBook?id=` + isbn10)
            .then((response) => {
              this.loading = false
              // The same issue will arrive here with books that share the same ID - see https://www.googleapis.com/books/v1/volumes?q=UNtUPwAACAAJ as an example
              // console.log(response.body.payload.book)
              console.log(response.body.payload)
              book['title'] = (response.body.payload.book.googleInfo.volumeInfo.title)
              book['coverImage'] = (response.body.payload.book.googleInfo.volumeInfo.imageLinks.thumbnail)
              bookshelf.push({title: book.title, coverImage: book.googleInfo.coverImage, isbn10: isbn10})
            }, (error) => {
              this.loading = false
              console.log(error)
            })
        },
        loadBookshelf (bookshelf) {
          console.log('i is : ')
          for (var i = 0; i < this.trendingBooks.length; i++) {
            console.log('i is : ' + i)
          }
        },
        // Gets id's of all trending books from api, sends them to getList method to display them to view
        getTrendingBooks: function () {
          this.loading = true
          this.$http.get(`${this.$globals.api}/trending`)
            .then((response) => {
              this.loading = false
              this.trendingBooks = (response.body.payload.bookList)
            }, (error) => {
              this.loading = false
              console.log(error)
            })
        }
      },
      created: function () {
        // Populate  Recommended list
        // this.getBook(this.recommended, 'UdDlN_35JZIC') // Changed from isbn 1781100233 to ID, otherwise the book view breaks since we don't search on isbn yet.
        // this.getBook(this.recommended, '7HgwCgAAQBAJ')
        this.getTrendingBooks()
        // populate Trending List
        // this.getBook(this.trending, 'ar4j52mEdLoC')
        // this.getBook(this.trending, '6pImDwAAQBAJ')
        // this.getBook(this.trending, 'TiFSMQAACAAJ')
        // this.getBook(this.trending, 'XZKvDgAAQBAJ')
        // this.getBook(this.trending, 'uUNKAAAAQBAJ')

        // populate new releases list
        // this.getBook(this.newRelease, 'J8ahqXjUhAAC')
        // this.getBook(this.newRelease, 'X_ZDtAEACAAJ')
        // this.getBook(this.newRelease, 'YJFRDwAAQBAJ')
        // this.getBook(this.newRelease, 'vgsyDwAAQBAJ')
        // this.getBook(this.newRelease, 'H8YrDwAAQBAJ')
      }
    }
</script>

<style scoped>
.book-list{
  margin-bottom: 100px;
}
</style>
