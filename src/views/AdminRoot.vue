<template>
  <div class="container">
    <div class="admin-root">
      <div class="row">
        <div class="one columns">
          &nbsp;
        </div>
        <div class="ten columns">
          <h1>
            Administration
          </h1>
          <router-view></router-view>
        </div>
        <div class="one columns">
          &nbsp;
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "AdminRoot",

  computed: {
    ...mapGetters(["firstName"])
  }
};
</script>
