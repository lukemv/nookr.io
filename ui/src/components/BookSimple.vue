<template>
  <div class="book-text">
    <div class="thumbnail book-thumb">
      <router-link :to="{ path: 'book-detail', query: { id: book.id }}">
        <div v-if="book.volumeInfo.imageLinks">
          <img class="book-image" v-bind:src="book.volumeInfo.imageLinks.thumbnail" alt="book thumbnail">
        </div>
      </router-link>
      <div v-if="!book.volumeInfo.imageLinks">
        <div class="book-image placeholder-img text-center">
          <p>Image Not available</p>
        </div>
      </div>
      <book-rating v-bind:book="book"></book-rating>
      <div class="caption">
        <router-link :to="{ path: 'book-detail', query: { id: book.id }}">
          <div class="book-title">{{book.volumeInfo.title}}</div>
        </router-link>
        <div class="mb-3">
          <div class="book-authors" v-for="author in book.volumeInfo.authors">{{author}}</div>
          <div v-if="book.volumeInfo.industryIdentifiers">
            <div v-if="book.volumeInfo.industryIdentifiers.length > 0">
              <small>{{book.volumeInfo.industryIdentifiers[0].type}}:
                {{book.volumeInfo.industryIdentifiers[0].identifier}}</small>
            </div>
            <div v-if="book.volumeInfo.industryIdentifiers.length > 1">
              <small>{{book.volumeInfo.industryIdentifiers[1].type}}:
                {{book.volumeInfo.industryIdentifiers[1].identifier}}</small>
            </div>
            <div v-if="book.volumeInfo.industryIdentifiers.length > 2">
              <small>{{book.volumeInfo.industryIdentifiers[2].type}}:
                {{book.volumeInfo.industryIdentifiers[2].identifier}}</small>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import BookRating from './BookRating'
  export default {
    name: 'book-simple',
    props: ['book'],
    components: {BookRating}
  }
</script>