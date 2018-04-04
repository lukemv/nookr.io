<template>
    <main class="container">
      <div id="book-list container ">
        <div v-for="book in books">
          <div class="book center-block row">
            <div class="book-text col-sm-7 col-md-9">
                <div class="book-title">{{book.book_details[0].title}}</div>
                <div class="book-authors">{{book.book_details[0].author}}</div>
            </div>
          </div>
        </div>
      </div>
    </main>
</template>

<script>
  import axios from 'axios'

export default {
    name: 'get-books',
    data () {
      return {
        books: []
      }
    },
    created: function () {
      axios.get('https://api.nytimes.com/svc/books/v3/lists.json', {
        params: {
          'api-key': '29ff6820315e44e5b7b9060c0aa39d52',
          'list': 'combined-print-and-e-book-fiction'
        }
      })
        .then((response) => {
          this.books = response.data.results
        }, (error) => {
          console.log(error)
        })
    }
  }
</script>

<style>
  #get-books{
    max-width: 1080px;
    margin: 0 auto;
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
</style>