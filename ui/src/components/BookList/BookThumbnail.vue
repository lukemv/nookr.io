 <template class="col-xs-3">
   <!--Title is needed here so we can get around the issue of books having the same ID-->
   <router-link :to="{
     path: 'book',
     query: {
       id: book.bookID,
       /* title: book.title, */
       isbn10: book.isbn10,
       isbn13: book.isbn13,
     }
   }">
    <div class="book-thumb col-3" >
      <img class="book-img" v-bind:src="book.coverImage" alt="Book Cover">
      <div class="book-title"> {{book.title}}</div>
    </div>
   </router-link>
</template>

<script>
    export default {
      name: 'book-thumbnail',
      props: ['book']
    }
</script>

<style scoped>

  .book-img{
    height: 200px;
    width: auto;
  }
  .book-title{
    padding-top: 5px;
    font-size: 1rem;
    width: 200px;
    color: #666666;
  }
</style>
