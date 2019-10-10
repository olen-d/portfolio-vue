<template>
  <div class="skills">
    <div v-for="skill in results.skills" :key="skill._id" class="card-skinny u-pull-left">
      <div class="card-title">
        <i :class="skill.icon" class="card-icon"></i>
        <h2>
          {{skill.name}}
        </h2>
        <p>
          {{skill.description}}
        </p>
      </div>
    </div>
  </div>
</template>

<script>

  export default {

    data: () => {
      return {
        results: []
      }
    },

    created() {
      fetch("https://www.olen.dev/api/skills/top/3")
        .then((response) => {
          return response.json();
        })
        .then((json) => {
          this.results = json;
      });
    }
  }

</script>
