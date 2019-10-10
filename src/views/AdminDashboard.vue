<template>
  <div class="adminDashboard">
    <AdminDashboard></AdminDashboard>
  </div>
</template>

<script>
  // @ is an alias to /src
  import AdminDashboard from "@/components/AdminDashboard.vue";

  export default {
    name: "adminDashboard",
    components: {
      AdminDashboard
    }
  };
</script>
