// https://vuejs.org/v2/guide/syntax.html#ad
<template>
  <div class="container">
    <!-- Tried this, couldn't get it working. https://vuejs.org/v2/guide/events.html#Event-Modifiers -->
    <form class="form-horizontal" role="form" action="/register-processing" method="POST">
      <div class="row">
        <div class="col-md-3"></div>
        <div class="col-md-6">
          <h2>Registration Form</h2>
          <hr>
        </div>
      </div>
      <div class="row">
        <div class="col-md-3"></div>
        <div class="col-md-6">
          <div class="form-group has-danger">
            <label class="sr-only" for="email">E-Mail Address</label>
            <div class="input-group mb-2 mr-sm-2 mb-sm-0">
              <div class="input-group-addon" style="width: 2.6rem"><i class="fa fa-at"></i></div>
              <input type="email" name="email" class="form-control" id="email"
                     placeholder="you@example.com" required autofocus>
            </div>
          </div>
        </div>
        <div class="col-md-3">
          <div class="form-control-feedback">
                      <span class="text-danger align-middle">
                          <i class="fa fa-close"></i> Email Validation Message
                      </span>
          </div>
        </div>
      </div>
      <div class="row">
        <div class="col-md-3"></div>
        <div class="col-md-6">
          <div class="form-group">
            <label class="sr-only" for="password1">Password</label>
            <div class="input-group mb-2 mr-sm-2 mb-sm-0">
              <div class="input-group-addon" style="width: 2.6rem"><i class="fa fa-key"></i></div>
              <input type="password" name="password1" class="form-control" id="password1"
                     placeholder="Password" required>
            </div>
          </div>
        </div>
        <div class="col-md-3">
          <div class="form-control-feedback">
            <span class="text-danger align-middle" id="password-error-message"> Password Validation Message</span>
          </div>
        </div>
      </div>
      <div class="row">
        <div class="col-md-3"></div>
        <div class="col-md-6">
          <div class="form-group">
            <label class="sr-only" for="password2">Password</label>
            <div class="input-group mb-2 mr-sm-2 mb-sm-0">
              <div class="input-group-addon" style="width: 2.6rem"><i class="fa fa-key"></i></div>
              <input type="password" name="password2" class="form-control" id="password2"
                     placeholder="Repeat Your Password" required>
            </div>
          </div>
        </div>
      </div>
      <div class="row" style="padding-top: 1rem">
        <div class="col-md-3"></div>
        <div class="col-md-6">
          <button type="submit" class="btn btn-success"><i class="fa fa-sign-in"></i> Register</button>
        </div>
      </div>
    </form>
<!--    <div class="row" style="padding-top: 1rem">
      <div class="col-md-3"></div>
      <div class="col-md-6">
        <button type="button" class="btn btn-success" v-on:click="displayLogin"><i class="fa fa-sign-in"></i> Login
        </button>
        <a class="btn btn-link" href="/password/reset">Forgot Your Password?</a>
      </div>
    </div>-->
  </div>
</template>

<script>
  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/export
  export default {
    name: 'register',
    // https://vuejs.org/v2/api/#data
    data () {
      return {
        email: '',
        password1: '',
        password2: '',
        persist: false,
        formValidated: false
      }
    },
    methods: {
      onSubmit: function (event) {
        this.alert('You shall not pass.')
        return false
        /*
        if (this.getElementById('password1') !== this.getElementById('password2')) {
          this.getElementById('password-error-message').innerText("Your passwords don't match, they must match.")
          return false
        } else {
          this.getElementById('password-error-message').innerText('Nothing went wrong, just testing the message display.')
          return false
        }
        */
      }
    }
  }
</script>

<style>
  .navbar {
    margin-bottom: 40px;
  }
</style>