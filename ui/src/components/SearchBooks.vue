<template>
  <div id="search-books">
    <main id="search-list" class="container">
      <div id="search-panel" class="col-xs-12 col-sm-8 col-md-5 ">
        <h4>Enter A Book Title</h4>
        <input @keyup.enter="searchBooks()" v-model="searchInput" placeholder="Search">
        <button id="btn" type="button" class="btn btn-primary" v-on:click="searchBooks()">Search</button>
        <div v-if="loading">
          <div class="progress">
            <div class="indeterminate"></div>
          </div>
        </div>
      </div>
      <div id="book-list container ">
        <div v-for="book in books">
          <div class="book center-block row">
            <div class="book-text col-sm-7 col-md-9">
              <!--To Single Book Page-->
                <router-link :to="{ path: 'book', query: { id: book.id }}">
                  <div class="book-title">{{book.volumeInfo.title}}</div>
                </router-link>
              <div class="book-authors" v-for="author in book.volumeInfo.authors">{{author}}</div>
              <div class="book-categories" v-for="category in book.volumeInfo.categories">{{category}}</div>
            </div>
            <div class="book-image col-sm-5 col-md-3">
              <img  v-bind:src="book.volumeInfo.imageLinks.smallThumbnail" alt="book thumbnail">
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
        loading: false,
        searchInput: ''
      }
    },
    methods: {
      searchBooks: function () {
        this.loading = true
        axios.get('https://www.googleapis.com/books/v1/volumes?q=' + this.searchInput)
          .then((response) => {
            this.loading = false
            this.books = response.data.items
          }, (error) => {
            this.loading = false
            console.log(error)
          })
      }
    }
  }
</script>

<style>

  #search-list{
    max-width: 1080px;
    margin: 0 auto;
  }
  #search-panel{
    padding: 50px;
    margin: 0 auto;

  }
  #search-panel h4{
    padding-bottom: 10px;
    font-weight: normal;
  }
  #search-panel button{
    margin-left: 15px;
  }
  .book{
    box-shadow: #d9d6d9 2px 2px 3px 1px;
    max-width: 700px;
    padding: 20px;
    margin-top: 40px;
    margin-right: auto;
    margin-left: auto;
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
  .book-image img{
    height: 150px;
    width: auto;
  }

</style>
