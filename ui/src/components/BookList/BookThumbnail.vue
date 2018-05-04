 <template class="col-xs-3">
   <!--Title is needed here so we can get around the issue of books having the same ID-->
   <div class="book">
     <div class="book-text">
   <router-link :to="{
     path: 'book',
     query: {
       id: book.bookID,
       /* title: book.title, */
       isbn10: book.isbn10,
       isbn13: book.isbn13,
     }
   }">
      <img class="book-img" v-bind:src="book.coverImage" alt="Book Cover">
      <div class="book-title"> {{book.title}}</div>
      </router-link>
      <div class="mb-3">
      <div class="book-authors" v-for="author in book.authors"> {{author}}</div>
    </div>
    <div class="book-categories" v-for="category in book.categories"> {{category}}</div>
    </div>
 </div>
</template>

<script>
    export default {
      name: 'book-thumbnail',
      props: ['book']
    }
</script>

<style scoped>

  .book-img{
    height: 250px;
    width: 175px;
  }
  .book-title{
    font-size: medium;
    font-weight: bold;
  }
  .book{
     /* box-shadow: #d9d6d9 2px 2px 3px 1px; */
     padding: 8px;
     height: 100%;
     width: 100%;
     position: relative;
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
</style>
