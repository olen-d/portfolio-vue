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
          <LoadingIndicator v-bind:loading="loading" v-bind:error="error" />
          <div v-if="welcome">
            <h5>
              {{ welcome.headline }}
            </h5>
          </div>
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
import LoadingIndicator from "./LoadingIndicator.vue";
import SkillsTop from "./SkillsTop.vue";

export default {
  components: {
    Header,
    LoadingIndicator,
    SkillsTop
  },

  data: () => {
    return {
      loading: false,
      welcome: null,
      error: null
    };
  },

  created() {
    this.loading = true;
    fetch(`${process.env.VUE_APP_API_BASE_URL}/api/welcome`)
      .then(response => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error("Network response was not ok. Unable to fetch. ");
        }
      })
      .then(json => {
        this.loading = false;
        this.welcome = json.welcome[0];
      })
      .catch(err => {
        this.loading = false;
        this.error = err.toString();
      });
  }
};
</script>

<style scoped></style>
