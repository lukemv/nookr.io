<template>
  <div class="hello">
    <div>{{ msg }}</div>
    <button v-on:click.prevent="get">GET request</button>
    <pre>{{ serverData }}</pre>
  </div>
</template>

<script>
export default {
  name: 'hello',
  data () {
    return {
      msg: 'Welcome to nookr.io'
    }
  },
  methods: {
    get: function () {
      this.$http.get('http://localhost:8081/').then(function (data) {
        this.msg = data.body.payload.message
      })

      console.log('get was called')
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
h1, h2 {
  font-weight: normal;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: inline-block;
  margin: 0 10px;
}

a {
  color: #35495E;
}
</style>
