<template>
  <div id="admin-view">
    <Admin />
  </div>
</template>

<script>
  // @ is an alias to /src
  import Admin from "@/components/Admin.vue";

  export default {
    name: "admin",
    components: {
      Admin
    }
  };
</script>
