<template>
  <div class="admin-projects-card">
    <div class="screenshot">
      <img :src="`${publicPath}${screenshot}`" width="200" height="auto" :alt="`Screenshot of ${projectTitle}`">
    </div>
    <div class="title">
      {{ projectTitle }}
    </div>
    <div class="description">
      {{ description }}
    </div>
    <div class="links">
      <p>
        Deployed at:<br />
        {{ deployedLink }}
      </p>
      <p>
        Code Repository: <br />
        {{ repoLink }}
      </p>
    </div>
    <div class="meta">
      <p>
        Sort Priority: {{ priority }}
      </p>
      <p>
        Display: {{ formatShow(show) }}
      </p>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    _id: String, 
    deployedLink: String, 
    description: String, 
    projectTitle: String, 
    repoLink: String, 
    screenshot: String,
    priority: Number, 
    show: Number
  },

  data: () => {
    return {
      publicPath: process.env.BASE_URL,
    }
  },

  methods: {
    formatShow: show => {
      if (show == 1) {
        return "Yes";
      } else {
        return "No";
      }
    }
  }
}
</script>

<style scoped>

</style>