<template>
  <div class="user-wrapper">
    <div v-if="loading || error" class="loading-indicator-wrapper">
      <LoadingIndicator v-bind:loading="loading" v-bind:error="error" />
    </div>
    <div v-if="user" class="user">
      <h1>{{ user.firstName }}&nbsp;{{ user.lastName }}</h1>
    </div>
  </div>
</template>

<script>
import LoadingIndicator from "./LoadingIndicator.vue";

export default {
  components: {
    LoadingIndicator
  },

  data: () => {
    return {
      loading: false,
      user: null,
      error: null
    };
  },

  created() {
    this.loading = true;
    fetch(`${process.env.VUE_APP_API_BASE_URL}/api/users/olen.d`)
      .then(response => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error("Network response was not ok. Unable to fetch. ");
        }
      })
      .then(json => {
        this.loading = false;
        this.user = json.user;
      })
      .catch(err => {
        this.loading = false;
        this.error = err.toString();
      });
  }
};
</script>

<style scoped>
.user-wrapper,
.user {
  margin: 0rem;
  padding: 0rem;
}

.loading-indicator-wrapper {
  margin-top: 6rem;
  margin-bottom: 2rem;
}
</style>
