<template>
  <div class="row">
    <div class="three columns">
      &nbsp;
    </div>
    <div class="six columns">
      <LoginForm />
    </div>
    <div class="three columns">
      &nbsp;
    </div>
  </div>
</template>

<script>
  import LoginForm from "./LoginForm";

  export default {
    components: {
      LoginForm
    },

    mounted() {
      this.$store.commit("setLoginPage", true);
    }

  }
</script>
