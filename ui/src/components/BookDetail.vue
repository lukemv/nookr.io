<template>
  <div v-if="book" class="container-fluid">
    <div class="mt-3">
      <div class="back-link" @click="goBack()">Back to Search Results</div>
    </div>
    <header class="row">
      <!-- Padding column -->
      <div class="col-md-2"></div>
      <h2 class="col-md-8">{{book.volumeInfo.title}}</h2>
    </header>
    <div class="row">
      <!-- Padding column -->
      <div class="col-md-2"></div>
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
      <div class="col-xs-12 col-sm-12 col-md-5">
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
  </div>
</template>

<script>
  import BookRating from './BookRating'
  export default {
    name: 'book-detail',
    components: {BookRating},
    data () {
      return {
        bookID: this.$route.query.id,
        book: null
      }
    },
    methods: {
      goBack: function () {
        window.history.back()
      },
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
  .container-fluid {
    padding-left: 30px;
    padding-right: 30px;
  }
  header {
    margin-bottom: 50px;
  }

  .back-link{
    color: #2B948F;
  }
  .back-link:hover{
    text-decoration: underline;
    cursor:pointer;
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
