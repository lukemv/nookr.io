<template>
  <div class="search-wrapper">
    <div class="row mx-auto">
      <div class="col-md-8 col-lg-6 mx-auto mb-4">
        <h3>Book Search <icon v-if="isLoading" class="fa-spin" name="sync"></icon></h3>
        <form class="form" v-on:submit.prevent>
          <input @keyup.enter="searchBooks()"
          v-model="searchInput"
          :disabled="isLoading"
          class="form-control mb-2 mr-sm-2"
          placeholder="e.g. Harry Potter">
          <div class="search-types">
            <input type="radio"  id="keyword" value="" v-model="searchType">
            <label for="keyword">Search by Keyword</label>
            <input type="radio" id="title" value="intitle:" v-model="searchType">
            <label for="title">Search by Title</label>
            <input type="radio" id="author" value="inauthor:" v-model="searchType">
            <label for="author">Search by Author</label>
          </div>
          <button
            type="button"
            class="btn btn-primary"
            :disabled="isLoading"
            v-on:click="searchBooks()">Search</button>
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

    <!-- Book Layout -->
    <main id="search-list" class="mx-auto">
    <div id="container-fluid">
      <div class="row equal mx-0">
        <div class="col-xs-12 col-sm-6 col-md-4 col-lg-3 bookcard mx-auto mb-3 mt-3" v-for="book in books">
          <div class="book">
            <div class="book-text">
              <!--To Single Book Page-->
              <!--THUMBNAIL-->
              <div class="thumbnail">
                <img class="book-image" v-bind:src="book.volumeInfo.imageLinks.thumbnail" alt="book thumbnail">
                <!--CAPTION-->
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
          isLoading: false,
          isSearched: false,
          searchInput: '',
          searchType: ''
        }
      },
      methods: {
        searchBooks: function () {
          this.errors = []
          this.isLoading = true
          this.$http.get(`${this.$globals.api}/googleVolumeSearch?q=${this.searchType}${this.searchInput}`)
            .then((res) => {
              this.books = res.body.payload.volumes.items
              this.isLoading = false
              this.isSearched = true
            }, (error) => {
              this.isLoading = false
              this.errors = []
              this.errors.push('An error has occured, please try again.')
              console.log(error)
            })
          setTimeout(this.timeoutBooks, 10000)
        },
        // Checks that there are no book objects after 10s & no other errors are already being displayed
        timeoutBooks: function () {
          if (!this.books.length && !this.errors.length) {
            this.isLoading = false
            this.errors.push('Search returned no books within the allowed timeframe.')
          }
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
     .search-types input{
       margin-left: 10px;
     }
     #search-list{
       max-width: 1000px;
     }
     .book{
        /* box-shadow: #d9d6d9 2px 2px 3px 1px; */
        padding: 8px;
        height: 100%;
        width: 100%;
        position: relative;
      }
      .bookcard{
        max-width: 220px;
      }
      .book-title{
        font-size: medium;
        font-weight: bold;
      }
      .book-authors{
        font-size: smaller;
        color: #5f5b5f;
        font-weight: bold;
      }
      .book-categories{
        color: #8a848a;
        font-size: small;
        /*position: absolute;
        bottom: 0;*/
      }
      .book-image{
        height: 250px;
        width: 175px;
      }
</style>
