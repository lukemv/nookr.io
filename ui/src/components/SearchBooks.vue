<template>
  <div class="search-wrapper">
    <div class="row">
      <div class="col-md-3"></div>
      <div class="col-md-6">
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
      <div class="col-md-3"></div>
    </div>
    <main id="search-list">
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
            <div v-if="book.volumeInfo.imageLinks" class="book-image col-sm-5 col-md-3">
              <img  v-bind:src="book.volumeInfo.imageLinks.smallThumbnail" alt="book thumbnail">
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
      isLoading: false,
      isSearched: false,
      searchInput: '',
      searchType: ''
    }
  },
  methods: {
    searchBooks: function () {
      this.isLoading = true
      this.$http.get(`${this.$globals.api}/googleVolumeSearch?q=${this.searchType}${this.searchInput}`)
        .then((res) => {
          this.books = res.body.payload.volumes.items
          this.isLoading = false
          this.isSearched = true
        }, (error) => {
          this.isLoading = false
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
