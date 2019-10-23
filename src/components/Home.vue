<template>
  <div id="front-end">
    <Header></Header>
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
          <SkillsTop />
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
  import SkillsTop from "./SkillsTop.vue";

  export default {

    components: {
      Header,
      SkillsTop
    },

    data: () => {
      return {
        welcome: [],
      }
    },

    created() {
      fetch(`${process.env.VUE_APP_API_BASE_URL}/api/welcome`)
        .then((response) => {
          return response.json();
        })
        .then((json) => {
          this.welcome = json.welcome[0];
      });
    }
  }

</script>
