<template>
  <div class="container" >
    <div class="row">
      <h3 class="col-sm-12 col-md-7 ">Something happened! There are no books here</h3>
      <!-- Image Author: Glaceonisice -->
      <div class="img-wrapper col-sm-12 col-md-5">
        <img class="img-responsive" src="../assets/twilight_sparkle.gif" alt="twilight sparkle">
      </div>

    </div>
  </div>
</template>

<script>
  export default {
    name: 'p404'
  }
</script>

<style scoped>

  .row{
    padding-top: 30px;
    font-size: larger;

  }
  .row h3{
    padding: 50px;
    color: #7d7d7d;
    padding-top: 20%;
    font-family: Roboto;
  }

  img{
    display: block;
    padding: 50px;
    width: 100%;
    min-width: 300px;
  }
</style>
