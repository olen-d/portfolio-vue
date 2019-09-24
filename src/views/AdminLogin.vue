<template>
  <div class="adminLogin">
    <AdminLogin/>
  </div>
</template>

<script>
  // @ is an alias to /src
  import AdminLogin from "@/components/AdminLogin.vue";

  export default {
    name: "adminLogin",
    components: {
      AdminLogin
    }
  };
</script>
