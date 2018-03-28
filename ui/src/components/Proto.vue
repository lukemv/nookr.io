<template>
  <div class="container mt-2">
    <div class="mt-6">
      <button v-on:click.prevent="get">Do API Call</button>
    </div>
    <div>
      <pre class="pre-scrollable">
        <code>
        {{ msg }}
        </code>
      </pre>
    </div>
  </div>
</template>

<script>
export default {
  name: 'proto',
  data () {
    return {
      msg: 'Static Message'
    }
  },
  methods: {
    get: function () {
      this.$http.get(`${this.$api}/`).then(function (data) {
        this.msg = data
      })
    }
  }
}
</script>

