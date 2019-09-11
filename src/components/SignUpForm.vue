<template>
  <form id="signUpForm">
    <label for="firstName">First Name</label>
    <input type="text" class="u-full-width" id="firstName" placeholder="Your First Name" required>
    <label for="lastName">Last Name</label>
    <input type="text" class="u-full-width" id="lastName" placeholder="Your Last Name" required>
    <label for="email">Email Address</label>
    <input type="email" class="u-full-width" id="email" placeholder="Your Email Address" required>
    <label for="userName">Username</label>
    <input type="text" class="u-full-width" id="userName" placeholder="Your Username" required>
    <label for="password">Password</label>
    <input type="password" class="u-full-width" id="password" placeholder="Your Password" required>
    <button v-on:click.prevent="submitSignUpForm" type="submit" class="button-primary" id="signIn">Sign Up</button>
  </form>
</template>

<script>
  export default {
    methods: {
      submitSignUpForm: () => {

        const firstName = document.getElementById("firstName").value;
        const lastName = document.getElementById("lastName").value;
        const email = document.getElementById("email").value;
        const userName = document.getElementById("userName").value;
        const password = document.getElementById("password").value;
 
        // TODO: Validate this mess
    
        let data = {
          firstName: firstName,
          lastName: lastName,
          email: email,
          userName: userName,
          password: password
        }

        fetch("http://localhost:3031/api/user/create", {
        method: "post",
        headers: {
          "Content-Type": "application/json"
        },
          body: JSON.stringify(data)
        }).then(response => {
          return response.json();
        }).then(data => {
          console.log("Doritos\n", data);
          // Redirect to the matches page
        }).catch(error => {
          return ({
            errorCode: 500,
            errorMsg: "Internal Server Error",
            errorDetail: error
          })
        });
      }
    }
  }
</script>
