<template>
  <div id="front-end">
    <Header></Header>
    <div id="about" class="container">
      <div class="row">
        <div class="one column">
          &nbsp;
        </div>
        <div class="ten columns">
          Doritos
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

  created() {
    const stravaAuthorizeURI = process.env.VUE_APP_STRAVA_AUTHORIZE_URI;
    const stravaClientId = process.env.VUE_APP_STRAVA_CLIENT_ID;
    const stravaRedirectURI = process.env.VUE_APP_STRAVA_REDIRECT_URI;

    window.location = `${stravaAuthorizeURI}?client_id=${stravaClientId}&redirect_uri=${stravaRedirectURI}&response_type=code&scope=activity:read`;
  }
};
</script>
