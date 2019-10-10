<template>
  <div id="admin-pages-view">
    <AdminPages />
  </div>
</template>

<script>
  // @ is an alias to /src
  import AdminPages from "@/components/AdminPages.vue";

  export default {
    name: "adminPages",
    components: {
      AdminPages
    }
  };
</script>
