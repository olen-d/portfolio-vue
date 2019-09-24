<template>
  <div id="home" class="container">
    <div class="row">
      <div class="one column">
        &nbsp;
      </div>
      <div class="ten columns">
        <h1>
          Olen Daelhousen
        </h1>
        <h5>
          {{welcome.headline}}
        </h5>
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
        <h1>
          Skills
        </h1>
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
        <SkillsTop :msg="message" />
      </div>
      <div class="one column">
        &nbsp;
      </div>
    </div>
  </div>
</template>

<script>
  import SkillsTop from "./SkillsTop.vue";

  export default {

    components: {
      SkillsTop
    },

    data: () => {
      return {
        welcome: [],
      }
    },

    created() {
      fetch("https://www.olen.dev/api/welcome")
        .then((response) => {
          return response.json();
        })
        .then((json) => {
          this.welcome = json.welcome[0];
      });
    }
  }

</script>
