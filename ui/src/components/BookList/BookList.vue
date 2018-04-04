<template>
  <div class="book-list">
    <book-shelf v-bind:books="recommended" v-bind:shelf-title="'Just For You'"></book-shelf>
    <book-shelf v-bind:books="trending" v-bind:shelf-title="'Trending'"></book-shelf>
    <book-shelf v-bind:books="newRelease" v-bind:shelf-title="'New Releases'"></book-shelf>
  </div>
</template>

<script>
    import BookShelf from './BookShelf'
    import axios from 'axios'

    export default {
      components: {BookShelf},
      name: 'book-list',
      data () {
        return {
          recommended: [],
          trending: [],
          newRelease: []
        }
      },
      methods: {
        getBook: function (bookshelf, isbn10) {
          var book = {title: '', coverImage: ''}
          this.loading = true
          axios.get('https://www.googleapis.com/books/v1/volumes?q=' + isbn10)
            .then((response) => {
              this.loading = false
              book['title'] = (response.data.items[0].volumeInfo.title)
              book['coverImage'] = (response.data.items[0].volumeInfo.imageLinks.thumbnail)
              bookshelf.push({title: book.title, coverImage: book.coverImage, isbn10: isbn10})
              console.log(book.image)
            }, (error) => {
              this.loading = false
              console.log(error)
            })
        }
      },
      created: function () {
        // Populate  Recommended list
        this.getBook(this.recommended, '1781100233')
        this.getBook(this.recommended, '39iYWTb6n6cC')
        // this.getBook(this.recommended, 'nkalO3OsoeMC')
        // this.getBook(this.recommended, 'aWZzLPhY4o0C')
        // this.getBook(this.recommended, 'DC4mYbY6bSwC')

        // populate Trending List
        this.getBook(this.trending, 'ar4j52mEdLoC')
        this.getBook(this.trending, '6pImDwAAQBAJ')
        // this.getBook(this.trending, 'TiFSMQAACAAJ')
        // this.getBook(this.trending, 'XZKvDgAAQBAJ')
        // this.getBook(this.trending, 'uUNKAAAAQBAJ')

        // populate new releases list
        this.getBook(this.newRelease, 'J8ahqXjUhAAC')
        this.getBook(this.newRelease, 'X_ZDtAEACAAJ')
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
