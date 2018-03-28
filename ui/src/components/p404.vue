<template>
  <div class="content">
    <div class="container" >
      <div class="row">
        <h3 class="col-sm-12 align-content-center">Something happened! There are no books here</h3>
        <div class="img-wrapper col-sm-12">
          <img class="img-responsive" src="../assets/404-error.png" alt="404 error image">
        </div>
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
  .content{
    background-color: #e7e7e7;
  }

  .row{
    padding-top: 30px;
    font-size: larger;
  }
  .row h3{
    padding: 50px;
    color: #7d7d7d;
    font-family: Roboto;
  }

  img{
    display: block;
    padding: 50px;
    width: 100%;
    min-width: 300px;
  }
</style>
