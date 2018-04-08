<template>
  <div class="content">
    <div class="container" >
      <div class="d-flex justify-content-center mt-5">
        <h3>You have been Logged Out</h3>
      </div>
      <div class="d-flex justify-content-center mt-3">
        <strong>You will be redirected in {{secondsRemaining}} seconds</strong>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'session-end',
    data () {
      return {
        secondsRemaining: 5,
        interval: null
      }
    },
    mounted: function () {
      this.interval = window.setInterval(this.countDown, 1000)
    },
    methods: {
      redirect: function () {
        this.$router.push('/')
      },
      countDown: function () {
        if (this.secondsRemaining === 1) {
          window.clearInterval(this.interval)
          this.redirect()
        }
        this.secondsRemaining -= 1
      }
    }
  }
</script>

