<template>
  <div class="book-rating">
    <div class="stars text-center">
      <span class="star" v-bind:class="[book.nookrInfo.rating >= 1 ? 'star-gold' : 'star-silver']" v-on:click="rateBook(book, 1)">&#9733;</span>
      <span class="star" v-bind:class="[book.nookrInfo.rating >= 2 ? 'star-gold' : 'star-silver']" v-on:click="rateBook(book, 2)">&#9733;</span>
      <span class="star" v-bind:class="[book.nookrInfo.rating >= 3 ? 'star-gold' : 'star-silver']" v-on:click="rateBook(book, 3)">&#9733;</span>
      <span class="star" v-bind:class="[book.nookrInfo.rating >= 4 ? 'star-gold' : 'star-silver']" v-on:click="rateBook(book, 4)">&#9733;</span>
      <span class="star" v-bind:class="[book.nookrInfo.rating == 5 ? 'star-gold' : 'star-silver']" v-on:click="rateBook(book, 5)">&#9733;</span>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'book-rating',
    props: ['book'],
    methods: {
      rateBook: function (book, rating) {
        console.log(`sending book rating for ${book.id}, ${rating}`)
        this.$http.post(`${this.$globals.api}/rating`, {
          bookID: book.id,
          rating: rating
        }).then((res) => {
          console.log(res)
          console.log(book)
          book.nookrInfo.rating = res.body.payload.bookRating
          // Update book rating here
        }, (error) => {
          console.log(error)
        })
      }
    }
  }
</script>

<style>
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
</style>