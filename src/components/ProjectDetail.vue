<script setup>
  import { computed, ref } from 'vue'

  const props = defineProps({
    projectData: {
      type: Object,
      required: true
    },
    projectSkills: {
      type: Array,
      required: true
    }
  })

  const publicPath = ref(`${import.meta.env.VITE_ASSETS_HOST}`)

  const projectSkillNames = computed(() => {
    return props.projectSkills.map(element => element.name)
  })
</script>
<template>
  <div class="project-detail">
    <div class="title">
      <h1>
        {{ projectData.data.title }}
      </h1>
    </div> 
    <div class="project-introduction">
      <div class="description">
        {{  projectData.data.description }}
      </div>
      <div class="overview">
        {{ projectData.data.overview }}
      </div>
      <div class="skills-list">
        <h2>
          Skills Used
        </h2>
        <ul>
          <li v-for="skill in projectSkillNames" :key="skill">
            {{ skill }}
          </li>
        </ul>
      </div>
    </div>
    <div class="links">
      <div class="links-container">
        <div class="right">
          <a :href="projectData.data.deployedLink"><button class="button-primary">Open Project</button></a>
        </div>
        <div class="left">
          <a :href="projectData.data.repoLink"><button>Source Code</button></a>
        </div>
      </div>
    </div>
    <div class="screenshot">
      <img
        class="screenshot-image"
        :src="`${publicPath}/assets/images/${projectData.data.screenshot}`"
        :alt="`Screenshot of ${projectData.data.title}`"
      />
    </div>
  </div>
</template>

<style scoped>
  .description {

  }
  .links {
    margin-top: 5rem;
    margin-bottom: 5rem;
  }
  .links-container {
    display: grid;
    grid-template-columns: 1fr 1fr;
    column-gap: 2rem;
  }
  .left {
    justify-self: left;
  }
  .right {
    justify-self: right;
  }
  .overview {
    grid-column-start: 1;
  }
  .project-detail {
    margin-bottom: 10rem;
  }
  .project-introduction {
    display: grid;
    grid-template-columns: 3fr 1fr;
    column-gap: 4rem;
  }
  .screenshot {
    width: 100%;
  }
  .screenshot-image {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
  .skills-list {
    grid-row-start: 1;
    grid-column-start: 2;
  }
  .skills-list h2 {
    margin-bottom: 1rem;
    font-size: 2rem;
    font-weight: 400;
    padding-top: 1rem;
    border-top: solid 1px;
  }
  .skills-list ul {
    list-style-type: none;
  }
  .skills-list li {
    line-height: 1;
  }
</style>