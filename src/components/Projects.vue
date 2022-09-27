<template>
  <div id="front-end">
    <Header></Header>
    <div id="projects" class="container">
      <div class="row">
        <div class="one column">
          &nbsp;
        </div>
        <div class="ten columns">
          <h1>Projects</h1>
        </div>
        <div class="one column">
          &nbsp;
        </div>
      </div>
      <div class="row">
        <div class="one column">
          &nbsp;
        </div>
        <div class="ten columns">
          <div class="loading-indicator-wrapper">
            <LoadingIndicator v-bind:loading="loading" v-bind:error="error" />
          </div>
          <div v-if="projects" class="projects">
            <div
              v-for="{
                _id,
                deployedLink,
                description,
                title,
                repoLink,
                screenshot
              } in sortedProjects"
              :key="_id"
              class="card u-pull-left"
            >
              <div class="card-title">
                <img
                  class="screenshot"
                  :src="`${publicPath}/assets/images/${screenshot}`"
                  :alt="`Screenshot of ${title}`"
                />
                <h2>
                  {{ title }}
                </h2>
                <p>
                  {{ description }}
                </p>
                <p><a :href="deployedLink">Visit the project</a>.</p>
                <p>
                  <a :href="repoLink">See the code on Github</a>
                </p>
              </div>
            </div>
          </div>
        </div>
        <div class="one column">
          &nbsp;
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Header from "./Header.vue";
import LoadingIndicator from "./LoadingIndicator.vue";

export default {
  components: {
    Header,
    LoadingIndicator
  },

  data: () => {
    return {
      loading: false,
      projects: null,
      error: null,
      publicPath: import.meta.env.VITE_ASSETS_HOST
    };
  },

  computed: {
    displayProjects() {
      const displayProjects = this.projects.filter(
        project => project.show === 1
      );
      return displayProjects;
    },
    sortedProjects() {
      const sortedProjects = [...this.displayProjects].sort((a, b) => {
        return a.priority - b.priority;
      });
      return sortedProjects;
    }
  },

  created() {
    this.loading = true;
    fetch(`${import.meta.env.VITE_API_BASE_URL}/api/projects`)
      .then(response => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error("Network response was not ok. Unable to fetch. ");
        }
      })
      .then(json => {
        this.loading = false;
        this.projects = json.projects;
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
  margin-bottom: 10rem;
}

.screenshot {
  width: 350px;
  height: auto;
}
</style>
