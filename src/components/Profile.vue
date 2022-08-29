<template>
  <div class="profile-wrapper">
    <LoadingIndicator v-bind:loading="loading" v-bind:error="error" />
    <div v-if="profile" class="profile">
      <h4 class="title">
        {{ profile.title }}
      </h4>
      <span v-html="profile.bio"></span>
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
      profile: null,
      error: null
    };
  },

  created() {
    this.loading = true;
    fetch(`${import.meta.env.VITE_API_BASE_URL}/api/profiles/olen.d`)
      .then(response => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error("Network response was not ok. Unable to fetch. ");
        }
      })
      .then(json => {
        this.loading = false;
        this.profile = json.profile;
      })
      .catch(err => {
        this.loading = false;
        this.error = err.toString();
      });
  }
};
</script>

<style scoped>
.profile-wrapper {
  margin: 0rem;
  padding: 0rem;
}

.profile { 
  margin-bottom: 0rem;
  padding-bottom: 0rem;
}
</style>
