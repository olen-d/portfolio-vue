<template>
  <div id="admin-pages-welcome-view">
    <AdminPagesWelcome></AdminPagesWelcome>
  </div>
</template>

<script>
  // @ is an alias to /src
  import AdminPagesWelcome from "@/components/AdminPagesWelcome.vue";

  export default {
    name: "adminPagesWelcome",
    components: {
      AdminPagesWelcome
    }
  };
</script>
