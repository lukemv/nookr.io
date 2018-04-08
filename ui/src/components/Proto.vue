<template>
  <div class="container mt-4">
    <form>
      <div class="form-row">
        <div class="form-group col-md-8">
          <select class="form-control" v-model="selected">
            <option :value="null"></option>
            <option v-for="option in options" v-bind:value="option">{{ option.name }}</option>
          </select>
        </div>
        <div class="form-group col-md-4">
          <button v-on:click="makeRequest()" class="btn btn-primary">Submit</button>
        </div>
      </div>
      <div class="form-row">
      </div>
    </form>
    <div v-if="response" class="col-md-12">
      <strong>Request output:</strong>
      <pre><code>{{response}}</code></pre>
    </div>
  </div>
</template>

<script>
export default {
  name: 'proto',
  data () {
    return {
      response: '',
      options: [{name: 'profile', method: 'get', path: '/profile'}],
      selected: null
    }
  },
  methods: {
    makeRequest: function () {
      this.$http[this.selected.method](`${this.$globals.api}${this.selected.path}`).then(function (data) {
        console.log(data)
        this.response = data
      }, function (error) {
        console.log(error)
        // ignore 401's and all other errors
      })
    }
  }
}
</script>

