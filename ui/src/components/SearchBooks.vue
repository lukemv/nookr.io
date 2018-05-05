<template>
  <div class="search-wrapper">
    <div class="row mx-auto">
      <div class="col-md-8 col-lg-6 mx-auto mb-4">
        <h4>nookr search <small class="poweredby">Powered by Google Books</small>
          <icon v-if="isLoading" class="fa-spin" name="sync"></icon>
        </h4>
        <form class="form" v-on:submit.prevent>
          <div class="form-group">
            <input @keyup.enter="searchBooks()"
              type="text"
              v-model="searchInput"
              :disabled="isLoading"
              class="form-control">
          </div>
          <div class="form-group">
            <button type="button"
              class="btn btn-primary"
              :disabled="isLoading || !searchInput"
              v-on:click="searchBooks()">Search</button>
          </div>
        </form>
      </div>
    </div>

    <!-- Not Found -->
    <div class="col-md-8 col-lg-6 mx-auto">
      <p v-if="!books && isSearched">
        <b>Search returned 0 results</b>
      </p>
    </div>

    <!-- Not Found -->
    <div class="col-md-8 col-lg-6 mx-auto">
      <p v-if="books && isSearched">
        <b>Search returned {{searchResults.volumes.totalItems}} results</b>
      </p>
    </div>

    <!-- Error Messages -->
    <div class="col-md-8 col-lg-6 mx-auto">
      <div v-if="errors.length" class="alert alert-warning" role="alert">
        <p>
          <b>It looks like something has gone wrong:</b>
          <ul>
            <li v-for="error in errors">{{ error }}</li>
          </ul>
        </p>
      </div>
      <hr />
    </div>

    <!-- Book Layout -->
    <main id="search-list" class="mx-auto">
      <div id="container-fluid">
        <div class="row equal mx-0">
          <div v-if="books" class="col-xs-12 col-sm-6 col-md-4 col-lg-3 bookcard mx-auto mb-3 mt-3" v-for="book in books">
            <div class="book">

              <div class="book-text">
                <div class="thumbnail book-thumb">
                  <div v-if="book.volumeInfo.imageLinks">
                    <img class="book-image" v-bind:src="book.volumeInfo.imageLinks.thumbnail" alt="book thumbnail">
                  </div>
                  <div v-if="!book.volumeInfo.imageLinks">
                    <div class="book-image placeholder-img text-center">
                      <p >Image Not available</p>
                    </div>
                  </div>
                  <!-- Stars goes here -->
                  <div class="book-rating">
                    <div class="stars text-center">
                      <span class="star" v-bind:class="[book.nookrInfo.rating >= 1 ? 'star-gold' : 'star-silver']" v-on:click="rateBook(book, 1)">&#9733;</span>
                      <span class="star" v-bind:class="[book.nookrInfo.rating >= 2 ? 'star-gold' : 'star-silver']" v-on:click="rateBook(book, 2)">&#9733;</span>
                      <span class="star" v-bind:class="[book.nookrInfo.rating >= 3 ? 'star-gold' : 'star-silver']" v-on:click="rateBook(book, 3)">&#9733;</span>
                      <span class="star" v-bind:class="[book.nookrInfo.rating >= 4 ? 'star-gold' : 'star-silver']" v-on:click="rateBook(book, 4)">&#9733;</span>
                      <span class="star" v-bind:class="[book.nookrInfo.rating == 5 ? 'star-gold' : 'star-silver']" v-on:click="rateBook(book, 5)">&#9733;</span>
                    </div>
                  </div>

                  <div class="caption">
                    <router-link :to="{ path: 'book', query: { id: book.id }}">
                      <div class="book-title">{{book.volumeInfo.title}}</div>
                    </router-link>
                    <div class="mb-3">
                      <div class="book-authors" v-for="author in book.volumeInfo.authors">{{author}}</div>
                    </div>
                    <div class="book-categories" v-for="category in book.volumeInfo.categories">{{category}}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
  export default {
    name: 'search-books',
    data () {
      return {
        books: [],
        errors: [],
        searchResults: null,
        isLoading: false,
        isSearched: false,
        searchInput: '',
        searchType: '',
        // Google Volumes List
        currentPage: 0,
        maxResults: 40,
        orderBy: 'relevance',
        projection: 'full'
      }
    },
    mounted: function () {
      console.log('mounted was called')
      console.log(this.$route.query)
    },
    methods: {
      searchBooks: function () {
        this.books = []
        this.errors = []
        this.isLoading = true

        const startIndex = this.currentPage * this.maxResults

        let queryString = `?q=${this.searchInput}`
        queryString += `&maxResults=${this.maxResults}`
        queryString += `&projection=${this.projection}`

        if (startIndex > 0) {
          queryString += `&startIndex=${startIndex}`
        }

        let url = `${this.$globals.api}/books/search${queryString}`

        this.$http.get(url)
          .then(function (res) {
            this.isLoading = false
            // Message type sanity check.
            if (res.body.messageType !== 'googleVolumeList') {
              this.errors.push('An error has occured, please try again.')
              return
            }

            var payload = res.body.payload
            if (payload.volumes.totalItems > 0) {
              this.books = payload.volumes.items
            }
          }, function (error) {
            this.isLoading = false
            this.errors.push('An error has occured, please try again.')
            console.log(error)
          })
        // Timeout will display a generic error
        // if the HTTP request takes too long.
        setTimeout(this.timeoutBooks, 10000)
      },
      timeoutBooks: function () {
        if (this.isLoading) {
          this.isLoading = false
          this.errors.push('The search timed out. Please try again')
        }
      },
      rateBook: function (book, rating) {
        console.log(`sending book rating for ${book.id}, ${rating}`)
        this.$http.post(`${this.$globals.api}/rating`, {
          bookID: book.id,
          rating: rating
        })
          .then((res) => {
            console.log(res)
            console.log(book)
            book.nookrInfo.rating = res.body.payload.bookRating
            // Update book rating here
          }, (error) => {
            console.log(error)
          })
      }
    },
    watch: {
      // if there has been a previous search, the results are updated if the radio buttons are changed
      searchType: function () {
        if (this.isSearched) {
          this.searchBooks()
        }
      },
      computed: {
        // This is needed because some text snippets contain HTML. - https://vuejs.org/v2/guide/computed.html
        removeHTMLTagsFromTextSnippetIfPresent (textSnippet) {
          // The patterns are needed to remove the HTML, and the test is needed because some text won't return when passed into this function. https://stackoverflow.com/questions/37623982/how-to-remove-html-tags-from-json-output
          let pattern1 = /<[^>]+>/gm
          let pattern2 = /&nbsp;/g
          let pattern3 = /&rsquo;/
          let pattern4 = /(&ldquo;)|(&rdquo;)/g
          if (pattern1.test(textSnippet) ||
            pattern2.test(textSnippet) ||
            pattern3.test(textSnippet) ||
            pattern4.test(textSnippet)) {
            return textSnippet.replace(/<[^>]+>/gm, ' ')
              .replace(/&nbsp;/g, ' ')
              .replace(/&rsquo;/, '\'')
              .replace(/(&ldquo;)|(&rdquo;)/g, '"')
              .replace(/\s+/, ' ')
          } else {
            return textSnippet
          }
        }
      }
    }
  }
</script>

<style>
  .search-wrapper {
    margin-top: 50px;
  }

  .search-types input {
    margin-left: 10px;
  }

  #search-list {
    max-width: 1000px;
  }

  .book {
    /* box-shadow: #d9d6d9 2px 2px 3px 1px; */
    padding: 8px;
    height: 100%;
    width: 100%;
    position: relative;
  }

  .bookcard {
    max-width: 220px;
  }

  .book-title {
    font-size: medium;
    font-weight: bold;
  }

  .book-authors {
    font-size: smaller;
    color: #5f5b5f;
    font-weight: bold;
  }

  .book-categories {
    color: #8a848a;
    font-size: small;
    /*position: absolute;
        bottom: 0;*/
  }

  .book-image {
    height: 250px;
    width: 175px;
  }

  .placeholder-img {
    padding-top: 100px;
    background-color: #2B948F;
    color: #FFF;
  }

  .star {
    padding-left: 3px;
    padding-right: 3px;
    display: inline-block;
    font-size: 1.5em;
    -webkit-transition: .3s;
    /* Safari */
    transition: .3s;
  }

  .star-gold {
    color: gold;
  }

  .star-grey {
    color: rgb(207, 207, 207);
  }

  .star:hover {
    transform: scale(1.5);
    cursor: pointer;
  }

  .poweredby {
    font-size: 0.5em;
    color: #999;
  }

  .stars {
    margin-bottom: 3px;
    margin-top: 3px;
  }
</style>
