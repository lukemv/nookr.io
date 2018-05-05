<template>
  <div class="search-wrapper">
    <div class="row mx-auto">
      <div class="col-md-8 col-lg-6 mx-auto mb-4">
        <h4>nookr browse <small class="poweredby">Powered by Google Books</small>
          <icon v-if="isLoading" class="fa-spin" name="sync"></icon>
        </h4>
        <button v-on:click="setContext('bestRated')" class="btn btn-success">Best Rated</button>
      </div>
    </div>
    <main id="browse-list" class="mx-auto">
      <div id="container-fluid">
        <div class="row equal mx-0">
          <div v-if="books" class="col-xs-12 col-sm-6 col-md-4 col-lg-3 bookcard mx-auto mb-3 mt-3" v-for="book in books">
            <book-simple v-bind:book="book"></book-simple>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
  import BookSimple from './BookSimple'
  export default {
    name: 'browse-books',
    components: {BookSimple},
    data () {
      return {
        books: [],
        isLoading: false
      }
    },
    methods: {
      getBooks: function (context) {
        const url = `${this.$globals.api}/books/${context}`
        this.$http.get(url)
          .then(function (res) {
            this.books = res.body.payload.volumes.items
          })
      },
      setContext: function (context) {
        this.getBooks(context)
      }
    },
    mounted: function () {
      this.setContext('bestRated')
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

  .poweredby {
    font-size: 0.5em;
    color: #999;
  }

  .stars {
    margin-bottom: 3px;
    margin-top: 3px;
  }
</style>
