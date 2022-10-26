<template>
  <div class="social-wrapper">
    <div v-if="loading || error" class="loading-indicator-wrapper">
      <LoadingIndicator v-bind:loading="loading" v-bind:error="error" />
    </div>
    <div v-if="social" id="social">
      <span
        v-for="{ _id, anchor, uri, icon } in social"
        :key="_id"
        class="social-items"
      >
        <a :href="uri" :title="`Olen Daelhousen on ${anchor}`">
          <i :class="icon"></i>
        </a>&nbsp;
      </span>
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
      social: null,
      error: null
    };
  },

  created() {
    this.loading = true;
    fetch(`${import.meta.env.VITE_API_BASE_URL}/api/social/user/olen.d`)
      .then(response => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error("Network response was not ok. Unable to fetch. ");
        }
      })
      .then(json => {
        this.loading = false;
        this.social = json.social;
      })
      .catch(err => {
        this.loading = false;
        this.error = err.toString();
      });
  }
};
</script>

<style scoped>
.loading-indicator-wrapper {
  width: 60%;
  margin: 2.225rem auto 2.225rem auto;
}

.social-wrapper {
  padding-top: 1rem;
  padding-bottom: 1rem;
  background-color: #136a9b;
  color: #fcc914;
  text-align: center;
}

.social-items {
  font-size: 4rem;
}

.social-wrapper a:link {
  color: #ffffff;
}

.social-wrapper a:visited {
  color: #ffffff;
}

.social-wrapper a:hover {
  color: #fcc914;
}
</style>
