<template>
  <div id="login-form">
    <form v-on:submit.prevent="submitLoginForm(form)" id="loginForm">
      <label for="name">Username</label>
      <input v-model="form.userName" type="text" class="u-full-width" id="name" placeholder="Your Username" required>
      <label for="password">Password</label>
      <input v-model="form.password" type="password" class="u-full-width" id="password" placeholder="Your Password" required>
      <button class="button-primary" id="signIn">Sign In</button>
    </form>
  </div>
</template>

<script>

export default {
  data: () => {
    return {
      form: {
        userName: "",
        password: ""
      }
    }
  },
  
  methods: {
    submitLoginForm (form) {
      console.log(form);
    } 
  }
}

</script>