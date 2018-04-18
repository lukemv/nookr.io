<template>
  <div class="search-wrapper">
    <div class="row">
      <div class="col-md-3"></div>
      <div class="col-md-6">
        <h3>Book Search
          <icon v-if="isLoading" class="fa-spin" name="sync"></icon>
        </h3>
        <form class="form" v-on:submit.prevent>
          <input @keyup.enter="searchBooks()"
                 v-model="searchInput"
                 :disabled="isLoading"
                 class="form-control mb-2 mr-sm-2"
                 placeholder="e.g. Harry Potter"
                 v-focus>
          <button
              type="button"
              class="btn btn-primary"
              :disabled="isLoading"
              v-on:click="searchBooks()">Search
          </button>
        </form>
      </div>
      <div class="col-md-3"></div>
    </div>
    <main id="search-list">
      <div id="book-list container ">
        <div v-for="book in books">
          <div class="book center-block row">
            <div class="book-text col-sm-7 col-md-9">
              <!--To Single Book Page-->
              <!--The title needs to be sent as sometimes an array containing many books sharing the same ID is returned. It will be used to cross reference this book displayed here.-->
              <router-link :to="{
                path: 'book',
                query: {
                  id: book.id,
                  title: book.volumeInfo.title
                }
              }">
                <div class="book-title">{{book.volumeInfo.title}}</div>
              </router-link>
              <div class="book-authors" v-for="author in book.volumeInfo.authors">{{author}}</div>
              <div class="book-categories" v-for="category in book.volumeInfo.categories">{{category}}</div>
              <div class="book-categories">{{book.searchInfo.textSnippet}}</div>
            </div>
            <!--To Single Book Page-->
            <div class="book-image col-sm-5 col-md-3">
              <router-link :to="{ path: 'book', query: { id: book.id, title: book.volumeInfo.title }}">
                <img v-bind:src="book.volumeInfo.imageLinks.smallThumbnail" alt="book thumbnail">
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
  import axios from 'axios'

  export default {
    name: 'search-books',
    data () {
      return {
        books: [],
        isLoading: false,
        searchInput: ''
      }
    },
    methods: {
      searchBooks: function () {
        this.isLoading = true
        axios.get('https://www.googleapis.com/books/v1/volumes?q=' + this.searchInput)
          .then((response) => {
            this.isLoading = false
            this.books = response.data.items
          }, (error) => {
            this.isLoading = false
            console.log(error)
          })
      }
    },
    // https://vuejs.org/v2/guide/custom-directive.html
    directives: {
      focus: {
        // directive definition
        inserted: function (el) {
          el.focus()
        }
      }
    }
  }
</script>

<style>
  .search-wrapper {
    margin-top: 50px;
  }

  .book {
    box-shadow: #d9d6d9 2px 2px 3px 1px;
    max-width: 700px;
    padding: 20px;
    margin-top: 40px;
    margin-right: auto;
    margin-left: auto;
  }

  .book-title {
    font-size: x-large;
  }

  .book-authors {
    font-size: larger;
    color: #5f5b5f;
  }

  .book-categories {
    padding-top: 10px;
    color: #8a848a;
  }

  .book-image img {
    height: 150px;
    width: auto;
  }
</style>
