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
  import SignUpForm from "./SignUpForm.vue";

  export default {
    components: {
      SignUpForm
    },

    mounted() {
      this.$store.commit("setSignupPage", true);
    }
  }
</script>
