<template>
  <div id="front-end">
    <HeaderFrontEnd />
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
import HeaderFrontEnd from "./HeaderFrontEnd.vue";

export default {
  components: {
    HeaderFrontEnd
  },

  created() {
    const stravaAuthorizeURI = import.meta.env.VITE_STRAVA_AUTHORIZE_URI;
    const stravaClientId = import.meta.env.VITE_STRAVA_CLIENT_ID;
    const stravaRedirectURI = import.meta.env.VITE_STRAVA_REDIRECT_URI;

    window.location = `${stravaAuthorizeURI}?client_id=${stravaClientId}&redirect_uri=${stravaRedirectURI}&response_type=code&scope=activity:read`;
  }
};
</script>
