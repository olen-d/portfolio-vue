<template>
  <div class="skills-wrapper">
    <div v-if="loading || error" class="loading-indicator-wrapper">
      <LoadingIndicator v-bind:loading="loading" v-bind:error="error" />
    </div>
    <div v-if="results" class="skills">
      <div
        v-for="{ _id, name, description, icon } in results.skills"
        :key="_id"
        class="card-skinny"
      >
        <div class="card-title">
          <i :class="icon" class="card-icon"></i>
          <h2>
            {{ name }}
          </h2>
          <p>
            {{ description }}
          </p>
        </div>
      </div>
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
      results: null,
      error: null
    };
  },

  created() {
    this.loading = true;
    fetch(`${process.env.VUE_APP_API_BASE_URL}/api/skills/top/3`)
      .then(response => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error("Network response was not ok. Unable to fetch. ");
        }
      })
      .then(json => {
        this.loading = false;
        this.results = json;
      })
      .catch(err => {
        this.loading = false;
        this.error = err.toString();
      });
  }
};
</script>

<style scoped>
.skills-wrapper {
  margin: 0rem;
  padding: 0rem;
}

.loading-indicator-wrapper {
  margin-bottom: 10rem;
}

.skills {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  justify-items: center;
  column-gap: 1rem;
}

@media (min-width: 780px) {
  .skills {
    justify-items: start;
  }
}
</style>
