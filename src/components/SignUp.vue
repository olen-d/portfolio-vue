<template>
  <div class="row">
    <div class="three columns">
      &nbsp;
    </div>
    <div class="six columns">
      <SignUpForm v-on="$listeners" />
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
    }
  }
</script>
