<template>
    <div id="book-shelf">
      <div class="recommendation">
        <h3>{{shelfTitle}}</h3>
        <hr>
        <div class="book-thumbnail-container row">
          
          <div v-for="n in books.length" class="col-xs-12 col-sm-6 col-md-3">
            <span v-if="n < noOfBooks" v-bind="loadBtn = false" ></span>
            <book-thumbnail v-if="n <= noOfBooks" class="book-thumbnail" v-bind:book="books[n-1]"></book-thumbnail>
            <span v-if="n > noOfBooks" v-bind="loadBtn = true" ></span>
          </div>
          <div class="col-12" v-if="loadBtn" >
              <button class="btn-info btn-load" v-on:click="noOfBooks += displayQuantity">Load More</button>
            </div>
        </div>
      </div>
    </div>
</template>

<script>
    import BookThumbnail from './BookThumbnail'

    export default {
      components: {BookThumbnail},
      name: 'book-shelf',
      props: ['books', 'shelfTitle'],
      data () {
        return {
          // The amount of books to display with each load. Clicking 'load more' displays another quantity of books that match displayQuantity
          displayQuantity: 4,
          // Number of books refers to the starting amount of books displayed in a bookshelf. This number is updated by the displayQuantity
          // each time the 'load more' button is clicked
          noOfBooks: 4,
          // If there are more books in the books array than the noOfBooks, loadBtn is marked as true thus making it visible to click more books.
          // If there are no more books then the button is disabled again
          loadBtn: false
        }
      }
    }
</script>

<style scoped>
  .recommendation{
    margin: 0 auto;
    margin-top: 50px;
    max-width: 1000px;
  }
  .recommendation-title{
    font-size: 1.4rem;
  }

  .book-thumbnail{
    vertical-align:top;
    padding-right: 30px;
  }
  .btn-load{
    margin-left: auto;
    margin-right: auto;
  }

</style>
