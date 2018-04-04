<template>
  <div class="container">
    <form class="form-horizontal" v-on:submit.prevent>
      <div class="row">
        <div class="col-md-3"></div>
        <div class="col-md-6">
          <h2>Login Here <icon v-if="isLoading" class="fa-spin" name="sync"></icon></h2>
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
              v-bind:class="{
              'is-invalid': $v.password.$error,
              'is-valid': !$v.password.$invalid }"
              name="password"
              id="password"
              autocomplete="password"
              :disabled="isLoading"
              class="form-control">
            <small
              v-if="!$v.password.required && $v.password.$dirty" class="form-text text-danger">Password is required</small>
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
            >Login </button>
        </div>
        <div class="col-md-3"></div>
      </div>
    </form>
  </div>
</template>

<script>
import { required, email } from 'vuelidate/lib/validators'

export default {
  name: 'login',
  data () {
    return {
      email: '',
      password: '',
      errorMessage: '',
      successMessage: '',
      isLoading: false
    }
  },
  validations: {
    email: {
      required,
      email
    },
    password: {
      required
    }
  },
  methods: {
    redirect: function () {
      this.$router.push('/book-list')
    },
    submit: function (event) {
      this.isLoading = true
      this.errorMessage = this.successMessage = ''
      this.$http.post(`${this.$api}/login`, {email: this.email, password: this.password}).then(function (res) {
        if (res.body.messageType === 'loginSuccess') {
          this.successMessage = res.body.payload.message
          window.setTimeout(this.redirect, 1600)
        } else if (res.body.messageType === 'loginFailed') {
          this.errorMessage = res.body.payload.message
          this.$refs.email.focus()
          this.isLoading = false
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