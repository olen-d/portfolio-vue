<template>
  <div class="adminLogin">
    <Login />
  </div>
</template>

<script>
  // @ is an alias to /src
  import Login from "@/components/Login.vue";

  export default {
    name: "adminLogin",
    components: {
      Login
    },
    
    beforeRouteLeave (to, from, next) {
      this.$store.commit("setLoginPage", false);
      next();
    }
  };
</script>
