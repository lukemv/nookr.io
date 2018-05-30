<template>
  <div class="search-wrapper">
    <div class="row mx-auto">
      <!-- Padding column -->
      <div class="col-md-3"></div>
      <div class="col-md-6 col-lg-6 col-sm-12 mb-4">
        <h4>nookr search <small class="poweredby">Powered by Google Books</small>
          <icon v-if="isLoading" class="fa-spin" name="sync"></icon>
        </h4>
        <form class="form" v-on:submit.prevent>
          <div class="form-group">
            <input @keyup.enter="searchFromInput()"
              tabindex="1"
              type="text"
              v-model="searchInput"
              :disabled="isLoading"
              class="form-control">
          </div>
          <div class="form-group">
            <button type="button"
              class="btn btn-primary"
              :disabled="isLoading || !searchInput"
              v-on:click="searchFromInput()">Search</button>
          </div>
        </form>
      </div>
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
    </div>

    <main v-if="books.length > 0 && !isLoading" id="search-list" class="mx-auto">
      <div id="container-fluid">
        <div class="row">
          <div class="col-lg-12 ml-4">
            <strong>Showing {{startIndex + 1}} to {{startIndex + maxResults}} of {{totalItems}} Results</strong>
          </div>
        </div>
        <div class="row equal mx-0">
          <div class="col-xs-12 col-sm-6 col-md-4 col-lg-3 bookcard mx-auto mb-3 mt-3" v-for="book in books">
            <book-simple v-bind:book="book"></book-simple>
          </div>
        </div>
      </div>
      <div class="page-controls-wrapper">
        <div class="page-controls text-center pagination-centered">
          <button v-if="!startIndex == 0" @click="loadPrevious()">Previous Page</button>
          <button @click="loadNext()">Next Page</button>
          </div>
      </div>
    </main>
  </div>  
</template>

<script>
  import BookSimple from './BookSimple'
  export default {
    name: 'search-books',
    components: {BookSimple},
    data () {
      return {
        books: [],
        errors: [],
        isLoading: false,
        searchInput: '',
        startIndex: 0,
        totalItems: 0,
        maxResults: 40,
        orderBy: 'relevance',
        projection: 'full'
      }
    },
    methods: {
      searchFromQuery: function (queryString) {
        clearTimeout(this.timeout)

        this.books = []
        this.errors = []
        this.totalItems = 0
        this.isLoading = true

        let url = `${this.$globals.api}/books/search?${queryString}`

        this.$http.get(url)
          .then(function (res) {
            this.isLoading = false
            // Message type sanity check.
            if (res.body.messageType !== 'googleVolumeList') {
              this.errors.push('An error has occured, please try again.')
              return
            }

            var payload = res.body.payload
            this.totalItems = payload.volumes.totalItems
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
        this.timeout = setTimeout(this.timeoutBooks, 10000)
      },
      searchFromInput: function () {
        let queryString = `q=${this.searchInput}`
        queryString += `&maxResults=${this.maxResults}`
        queryString += `&projection=${this.projection}`
        queryString += `&startIndex=${this.startIndex}`

        console.log('pushing URL: ' + '/search' + queryString)
        this.$router.push(`/search?${queryString}`)
      },
      timeoutBooks: function () {
        if (this.isLoading) {
          this.isLoading = false
          this.errors.push('The search timed out. Please try again')
        }
      },
      loadNext: function () {
        this.startIndex += this.maxResults
        this.searchFromInput()
      },
      loadPrevious: function () {
        this.startIndex -= this.maxResults
        this.searchFromInput()
      }
    },
    mounted: function () {
      var queryString = this.$route.fullPath.split('?')[1]
      if (typeof queryString === 'string') {
        this.searchFromQuery(queryString)
        this.searchInput = this.$route.query.q
      }
    },
    watch: {
      // Todo: Make this DRY
      '$route': function (newPath) {
        var queryString = newPath.fullPath.split('?')[1]
        if (typeof queryString === 'string') {
          this.searchInput = newPath.query.q
          this.searchFromQuery(queryString)
        } else {
          this.books = []
        }
      }
    }
  }
</script>

<style>
  .search-wrapper {
    margin-top: 20px;
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

  .poweredby {
    font-size: 0.5em;
    color: #999;
  }

  .stars {
    margin-bottom: 3px;
    margin-top: 3px;
  }
  .page-controls{
    margin-bottom: 70px;
  }
  .page-controls button{
    padding: 5px;
    margin: 20px;
  }
</style>
