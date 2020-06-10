<template>
  <div class="activity-graph=wrapper">
    <LoadingIndicator v-bind:loading="loading" b-bind:error="error" />
    <div v-if="responseData" class="response-data">
      <div
        v-for="{ startDateOnly, distanceQuantile } in responseData.data"
        :key="startDateOnly"
      >
        <div :class="distanceQuantile">
          &nbsp;
        </div>
      </div>
      <pre>{{ responseData }}</pre>
    </div>
  </div>
</template>

<script>
import LoadingIndicator from "./LoadingIndicator.vue";

export default {
  components: {
    LoadingIndicator
  },

  data: () => {
    return {
      loading: false,
      responseData: null,
      error: null
    };
  },

  created() {
    this.loading = true;
    (async () => {
      try {
        const response = await fetch(
          `${
            process.env.VUE_APP_API_BASE_URL
          }/api/strava/process/activities/rides`
        );
        const data = await response.json();
        this.loading = false;
        this.responseData = { ...data };
      } catch (err) {
        this.error = err.toString();
        // TODO: Deal with the error
      }
    })();
  }
};
</script>

<style scoped>
.distance-quantile-1,
.distance-quantile-2,
.distance-quantile-3,
.distance-quantile-4,
.distance-quantile-5 {
  height: 1em;
  width: 1em;
  margin-right: 0.2em;
  margin-bottom: 0.2em;
}

.distance-quantile-1 {
  background-color: #d0e1eb;
}

.distance-quantile-2 {
  background-color: #b8d2e1;
}

.distance-quantile-3 {
  background-color: #a1c3d7;
}

.distance-quantile-4 {
  background-color: #71a6c3;
}

.distance-quantile-5 {
  background-color: #4288af;
}
</style>
