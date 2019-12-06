<template>
  <div class="skills">
    <div v-for="{ _id, name, description, icon } in results.skills" :key="_id" class="card-skinny">
      <div class="card-title">
        <i :class="icon" class="card-icon"></i>
        <h2>
          {{name}}
        </h2>
        <p>
          {{description}}
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
      fetch(`${process.env.VUE_APP_API_BASE_URL}/api/skills/top/3`)
        .then((response) => {
          return response.json();
        })
        .then((json) => {
          this.results = json;
      });
    }
  }

</script>

<style scoped>

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
