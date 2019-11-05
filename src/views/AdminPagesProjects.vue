<template>
  <div id="admin-pages-projects-view">
    <AdminPagesProjects></AdminPagesProjects>
  </div>
</template>

<script>
  // @ is an alias to /src
  import AdminPagesProjects from "@/components/AdminPagesProjects.vue";

  export default {
    name: "adminPagesProjects",
    components: {
      AdminPagesProjects
    }
  };
</script>
