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
        <div class="ten columns projects">
          <div v-for="{ _id, deployedLink, description, projectTitle, repoLink, screenshot } in displayProjects" :key="_id" class="card u-pull-left">
            <div class="card-title">
              <img :src="`${publicPath}assets/images/${screenshot}`" width="350" height="auto" :alt="`Screenshot of ${projectTitle}`">
              <h2>
                {{title}}
              </h2>
              <p>
                {{description}}
              </p>
              <p>
                <a :href="deployedLink">Visit the project</a>.
              </p>
              <p>
                <a :href="repoLink">See the code on Github</a>
              </p>
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

export default {
  components: {
    Header
  },

  data: () => {
    return {
      projects: [],
      publicPath: process.env.BASE_URL
    }
  },

  computed: {
    displayProjects() {
      const displayProjects = this.projects.filter(project => project.show === 1 );
      return displayProjects;
    }
  },

  created() {
    fetch(`${process.env.VUE_APP_API_BASE_URL}/api/projects`)
      .then((response) => {
        return response.json();
      })
      .then((json) => {
        this.projects = json.projects;
      });
  }
}

</script>
