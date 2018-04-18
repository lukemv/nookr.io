<template>
  <div class="container col-md-6">
    <h2>New York Times Best Sellers
      <icon v-if="isLoading" class="fa-spin" name="sync"></icon>
    </h2>
    <hr>
    <div class="filter-options">
      <form class="form" v-on:submit.prevent>
      <button
          type="button"
          class="btn btn-secondary"
          v-on:click="toggleFilter()">{{ showHide }} Filter Options
      </button>
      <div class="accordion" v-if="showFilter === true">
        <div v-if="errors.length" class="alert alert-warning" role="alert">
          <p>
            <b>Please correct the following error(s):</b>
            <ul>
              <li v-for="error in errors">{{ error }}</li>
            </ul>
          </p>
        </div>
      <p>
        <label for="filterByDate">Best Sellers list at date:</label><br>
        <input @keyup.enter="filterBooks()"
                v-model="filterDate"
                placeholder="YYYY-MM-DD"
                :disabled="isLoading"
                class="mb-2 mr-sm-2 pt-1 col-sm-7"
                id="filterByDate"
                v-focus>
      </p>
      <p>
        <label for="filterByWeeks">Weeks on Best Sellers list: </label><br>
        <input @keyup.enter="filterBooks()"
                v-model="weeksOnList"
                placeholder="1"
                :disabled="isLoading"
                class="mb-2 mr-sm-2 pt-1 col-sm-7"
                id="filterByWeeks"
                v-focus>
      </p>
      <button
          type="button"
          class="btn btn-primary mb-2 mr-sm-2 col-sm-7"
          :disabled="isLoading"
          v-on:click="filterBooks()">Filter
      </button>
      </div>
    </form>
    </div>
    <div id="book-list container">
      <div v-for="book in books">
        <div class="book center-block row">
          <div class="book-text col-sm-7 col-md-9">
              <div class="book-title">{{book.book_details[0].title}}</div>
              <div class="book-authors">{{book.book_details[0].author}}</div>
          </div>
          <div class="book-weeks float-md-right col-sm-3">Weeks on list: {{book.weeks_on_list}}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import axios from 'axios'

  export default {
    name: 'get-books',
    data () {
      return {
        books: [],
        errors: [],
        isLoading: false,
        filterDate: '',
        weeksOnList: '',
        showFilter: false,
        showHide: 'Show'
      }
    },
    created: function () {
      this.isLoading = true
      axios.get('https://api.nytimes.com/svc/books/v3/lists.json', {
        params: {
          'api-key': '29ff6820315e44e5b7b9060c0aa39d52',
          'list': 'combined-print-and-e-book-fiction'
        }
      })
        .then((response) => {
          this.isLoading = false
          this.books = response.data.results
        }, (error) => {
          this.isLoading = false
          console.log(error)
        })
    },
    methods: {
      filterBooks: function () {
        this.isLoading = true
        if (!this.filterDate && !this.weeksOnList) {
          this.errors = []
          this.errors.push('Please enter at least one criteria to filter by')
          this.isLoading = false
          return
        }
        if (this.filterDate && !this.weeksOnList) {
          this.errors = []
          if (!this.validDate(this.filterDate)) {
            this.errors.push('Please enter a valid date (YYYY-MM-DD)')
            this.isLoading = false
            return
          }
          axios.get('https://api.nytimes.com/svc/books/v3/lists.json', {
            params: {
              'api-key': '29ff6820315e44e5b7b9060c0aa39d52',
              'list': 'combined-print-and-e-book-fiction',
              'published-date': this.filterDate
            }
          })
            .then((response) => {
              this.isLoading = false
              this.books = response.data.results
            }, (error) => {
              this.isLoading = false
              console.log(error)
            })
        }
        if (this.weeksOnList && !this.filterDate) {
          this.errors = []
          if (!this.validWeeks(this.weeksOnList) || this.weeksOnList < 0) {
            this.errors.push('Please enter a valid number (weeks on best sellers list must be zero or greater)')
            this.isLoading = false
            return
          }
          axios.get('https://api.nytimes.com/svc/books/v3/lists.json', {
            params: {
              'api-key': '29ff6820315e44e5b7b9060c0aa39d52',
              'list': 'combined-print-and-e-book-fiction',
              'weeks-on-list': this.weeksOnList
            }
          })
            .then((response) => {
              this.isLoading = false
              this.books = response.data.results
            }, (error) => {
              this.isLoading = false
              console.log(error)
            })
        }
        if (this.weeksOnList && this.filterDate) {
          this.errors = []
          if (!this.validDate(this.filterDate)) {
            this.errors.push('Please enter a valid date (YYYY-MM-DD)')
            this.isLoading = false
          }
          if (!this.validWeeks(this.weeksOnList) || this.weeksOnList < 0) {
            this.errors.push('Please enter a valid number (weeks on best sellers list must be zero or greater)')
            this.isLoading = false
          }
          if (this.errors.length) {
            return
          }

          axios.get('https://api.nytimes.com/svc/books/v3/lists.json', {
            params: {
              'api-key': '29ff6820315e44e5b7b9060c0aa39d52',
              'list': 'combined-print-and-e-book-fiction',
              'weeks-on-list': this.weeksOnList,
              'published-date': this.filterDate
            }
          })
            .then((response) => {
              this.isLoading = false
              this.books = response.data.results
            }, (error) => {
              this.isLoading = false
              console.log(error)
            })
        }
      },
      toggleFilter: function () {
        this.showFilter = !this.showFilter
        if (this.showFilter === true) {
          this.showHide = 'Hide'
        } else {
          this.showHide = 'Show'
        }
      },
      validDate: function (filterDate) {
        var re = /(?:19|20)[0-9]{2}-(?:(?:0[1-9]|1[0-2])-(?:0[1-9]|1[0-9]|2[0-9])|(?:(?!02)(?:0[1-9]|1[0-2])-(?:30))|(?:(?:0[13578]|1[02])-31))/
        return re.test(filterDate)
      },
      validWeeks: function (weeksOnList) {
        var re = /[0-9]+/
        return re.test(weeksOnList)
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
  .book-weeks{
    font-size: smaller;
    float:right;
  }
  .container{
    margin-top: 40px;
  }
  .filter-options button{
    margin-bottom: 15px;
  }
</style>
