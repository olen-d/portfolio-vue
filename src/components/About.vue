<template>
  <div id="front-end">
    <Header></Header>
    <div id="about" class="container">
      <div class="row">
        <div class="twelve columns">
          <div class="hexa">
            <div class="hex1">
              <div class="hex2">
                <img
                  src="./../assets/images/headshot_01.jpg"
                  alt="Olen Daelhousen's Headshot"
                  width="100%"
                  height="auto"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="row">
        <div class="one column">
          &nbsp;
        </div>
        <div class="ten columns">
          <div class="user-wrapper">
            <div v-if="loading || error" class="loading-indicator-wrapper">
              <LoadingIndicator v-bind:loading="loading" v-bind:error="error" />
            </div>
            <div v-if="user" class="user">
              <h1>{{ user.firstName }}&nbsp;{{ user.lastName }}</h1>
            </div>
          </div>
          <Profile />
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
import Profile from "./Profile.vue";

export default {
  components: {
    Header,
    LoadingIndicator,
    Profile
  },

  data: () => {
    return {
      loading: false,
      user: null,
      error: null
    };
  },

  created() {
    this.loading = true;
    fetch(`${process.env.VUE_APP_API_BASE_URL}/api/users/olen.d`)
      .then(response => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error("Network response was not ok. Unable to fetch. ");
        }
      })
      .then(json => {
        this.loading = false;
        this.user = json.user;
      })
      .catch(err => {
        this.loading = false;
        this.error = err.toString();
      });
  }
};
</script>

<style scoped>
.user-wrapper {
  margin: 0rem;
  padding: 0rem;
}

.loading-indicator-wrapper {
  margin-top: 6rem;
  margin-bottom: 2rem;
}

.user {
  margin: 0rem;
  padding: 0rem;
}

@media (min-width: 880px) {
  .user-wrapper {
    /* display: inline-block;
    position: relative;
    top: 0rem;
    left: 24rem; */
  }

  .user {
    /* display: inline-block;
    position: absolute;
    bottom: 0px; */
  }
}
</style>
