<template>
  <div class="row">
    <div class="three columns">
      &nbsp;
    </div>
    <div class="six columns">
      <SignUpForm />
    </div>
    <div class="three columns">
      &nbsp;
    </div>
  </div>
</template>

<script>
  import SignUpForm from "./SignUpForm";

  export default {
    components: {
      SignUpForm
    },

    methods: {
      submitForm: () => {
        fetch("http://localhost:5000/api/survey/submit", {
        method: "post",
        headers: {
          "Content-Type": "application/json"
        },
          body: JSON.stringify(formData)
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
