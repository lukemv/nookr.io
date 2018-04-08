<template>
  <div class="container">
    <form class="form-horizontal" v-on:submit.prevent>
      <div class="row">
        <div class="col-md-3"></div>
        <div class="col-md-6">
          <h2>Register Here <icon v-if="isLoading" class="fa-spin" name="sync"></icon></h2>
          <hr>
          <div v-if="errorMessage" class="alert alert-warning" role="alert">
          {{errorMessage}}
          </div>
          <div v-if="successMessage" class="alert alert-success" role="alert">
          {{successMessage}}
          </div>
        </div>
      </div>
      <div class="row">
        <div class="col-md-3"></div>
        <div class="col-md-6">
          <div class="form-group mb-2">
            <label
              v-bind:class="{
              'text-invalid': $v.email.$error,
              'text-success': !$v.email.$invalid }"
            for="email">Email:</label>
            <input type="email"
            v-bind:class="{
              'is-invalid': $v.email.$error,
              'is-valid': !$v.email.$invalid }"
            ref="email"
            v-model.trim="email"
            @input="$v.email.$touch()"
            :disabled="isLoading"
            class="form-control"
            id="email"
            autocomplete="username email"
            autofocus>
            <small
              v-if="!$v.email.required && $v.email.$dirty"
              class="form-text text-danger">Email is required</small>
            <small
              v-if="!$v.email.email && $v.email.$dirty"
              class="form-text text-danger">Please enter a valid email address</small>
            <small
              v-if="!$v.email.unique && $v.email.$dirty"
              class="form-text text-danger">{{email}} is already in use</small>
          </div>
        </div>
        <div class="col-md-3"></div>
      </div>
      <div class="row">
        <div class="col-md-3"></div>
        <div class="col-md-6">
          <div class="form-group mb-2">
            <label
              v-bind:class="{
              'text-invalid': $v.password.$error,
              'text-success': !$v.password.$invalid }"
              for="password_new">Password:</label>
            <input type="password"
              v-model="password"
              @input="$v.password.$touch()"
              :disabled="isLoading"
              v-bind:class="{
              'is-invalid': $v.password.$error,
              'is-valid': !$v.password.$invalid }"
              name="password_new"
              id="password_new"
              autocomplete="new-password"
              class="form-control">
            <small
              v-if="!$v.password.required && $v.password.$dirty" class="form-text text-danger">Password is required</small>
          </div>
        </div>
        <div class="col-md-3"></div>
      </div>
      <div class="row">
        <div class="col-md-3"></div>
        <div class="col-md-6">
          <div class="form-group mb-2">
            <label
               v-bind:class="{
              'text-invalid': $v.passwordRepeat.$error,
              'text-success': !$v.passwordRepeat.$invalid }"
              for="password_repeat">Confirm:</label>
            <input type="password"
              v-model="passwordRepeat"
              v-bind:class="{
              'is-invalid': $v.passwordRepeat.$error,
              'is-valid': !$v.passwordRepeat.$invalid }"
              @input="$v.passwordRepeat.$touch()"
              :disabled="isLoading"
              name="password_repeat"
              id="password_repeat"
              autocomplete="new-password"
              class="form-control">
            <small
              v-if="!$v.passwordRepeat.required && $v.passwordRepeat.$dirty"
              class="form-text text-danger">Password confirmation is required</small>
            <small
              v-if="!$v.passwordRepeat.same && $v.passwordRepeat.$dirty"
              class="form-text text-danger">Passwords must match</small>
          </div>
        </div>
        <div class="col-md-3"></div>
      </div>
      <div class="row" style="padding-top: 1rem">
        <div class="col-md-3"></div>
        <div class="col-md-6">
          <button
            type="submit"
            class="btn btn-block btn-primary"
            v-on:click.prevent="submit"
            :disabled="$v.$invalid || isLoading"
            >Register</button>
        </div>
        <div class="col-md-3"></div>
      </div>
    </form>
    <!-- Lukem: Here's an example of quick
        and dirty form debugging -->
    <!--<pre>{{$v}}</pre>-->
  </div>
</template>

<script>
import { required, email, sameAs } from 'vuelidate/lib/validators'

export default {
  name: 'register',
  data () {
    return {
      email: '',
      password: '',
      passwordRepeat: '',
      usedEmails: [],
      errorMessage: '',
      successMessage: '',
      isLoading: false
    }
  },
  validations: {
    email: {
      required,
      email,
      unique () {
        return this.usedEmails.indexOf(this.email) === -1
      }
    },
    password: {
      required
    },
    passwordRepeat: {
      required: required,
      same: sameAs('password')
    }
  },
  methods: {
    redirect: function () {
      this.$router.push('/book-list')
    },
    submit: function (event) {
      this.isLoading = true
      this.errorMessage = this.successMessage = ''
      this.$http.post(`${this.$globals.api}/register`, {email: this.email, password: this.password}).then(function (res) {
        if (res.body.messageType === 'signupSuccess') {
          this.successMessage = res.body.payload.message
          this.$globals.saveAuthToken(res.body.payload)
          window.setTimeout(this.redirect, 1600)
        } else if (res.body.messageType === 'signupFailed') {
          this.isLoading = false
          this.usedEmails.push(this.email)
          this.$refs.email.focus()
        }
      })
    }
  }
}
</script>

<style>
  .navbar {
    margin-bottom: 40px;
  }
</style>