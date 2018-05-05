<template>
  <div v-if="book" class="container-fluid">
    <div class="mt-3">
      <a href="" @click="$router.go(-1)">Back to Search Results</a>
      <pre> ^^ This does not work, use the browser back button for now</pre>
    </div>
    <header>
      <h2>{{book.volumeInfo.title}}</h2>
    </header>
    <div class="row">
      <div class="col-xs-12 col-sm-12 col-md-3">
        <div class="book-image">
          <img v-if="book.volumeInfo.imageLinks" v-bind:src="book.volumeInfo.imageLinks.medium">
          <div v-if="!book.volumeInfo.imageLinks">
            <div class="placeholder-img text-center">
              <p>Image Not available</p>
            </div>
          </div>
          <book-rating v-bind:book="book"></book-rating>
        </div>
      </div>
      <div class="col-xs-12 col-sm-12 col-md-9">
        <div class="authors">
          <span>Writers: <strong>{{book.volumeInfo.authors.join(',')}}</strong></span><br />
          <span>Publisher: <strong>{{book.volumeInfo.publisher}}</strong></span><br />
          <span>Pages: <strong>{{book.volumeInfo.pageCount}}</strong></span><br />
          <span>Language: <strong>{{book.volumeInfo.language}}</strong></span><br />
        </div>
        <hr />
        <div v-if="book.volumeInfo.description" class="description">
          <p><strong>Description:</strong><br />
          {{book.volumeInfo.description.replace(/<\/?[^>]+(>|$)/g, "")}}
          </p>
        </div>
        <div v-if="!book.volumeInfo.description" class="description">
          <p><strong>Description:</strong><br />
          There is currently no description available for this book
          </p>
        </div>

      </div>
    </div>
    <div class="mt-5">
      <hr />
      <pre><code>{{book.volumeInfo}}</code></pre>
    </div>
  </div>
</template>

<script>
  import BookRating from './BookRating'
  export default {
    name: 'book',
    components: {BookRating},
    data () {
      return {
        bookID: this.$route.query.id,
        book: null
      }
    },
    methods: {
      getBook: function (bookId) {
        this.$http.get(`${this.$globals.api}/books/single?id=${bookId}`)
          .then((res) => {
            this.book = res.body.payload.volume
          }, (error) => {
            console.log(error)
          })
      }
    },
    mounted: function () {
      if (typeof this.$route.query.id !== 'undefined') {
        this.getBook(this.$route.query.id)
      } else {
        this.$router.push('book-not-found')
      }
    }
  }
</script>

<style>
  .book-image {
  }

  .book-image img {
    width: 100%;
  }

  .placeholder-img {
    padding-top: 100px;
    background-color: #2B948F;
    color: #FFF;
  }
</style>
