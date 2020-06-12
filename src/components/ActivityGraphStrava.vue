<template>
  <div class="activity-graph-wrapper">
    <LoadingIndicator v-bind:loading="loading" b-bind:error="error" />
    <div v-if="responseData" class="response-data">
      <div
        v-for="{
          startDateOnly,
          distanceQuantile,
          gridPosition
        } in responseData.data"
        :key="startDateOnly"
        :class="distanceQuantile"
        :style="gridPosition"
      ></div>
    </div>
    <pre>{{ responseData }}</pre>
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
        const sortedAscending = data.data.sort((a, b) =>
          a.startDateOnly > b.startDateOnly ? 1 : -1
        );
        const dts = new Date();
        dts.setDate(dts.getDate() - 368);

        const dte = new Date();

        const allDates = (startDate, endDate) => {
          const dates = [];
          for (
            dates, startDate;
            startDate <= endDate;
            startDate.setDate(startDate.getDate() + 1)
          ) {
            dates.push(new Date(startDate).toISOString().split("T")[0]);
          }
          return dates;
        };

        const prevYearDates = allDates(dts, dte);

        const noDataActivityObj = {
          distance: 0,
          elevationGain: 0,
          activites: 0,
          distanceQuantile: "distance-quantile-0",
          elevationGainQuantile: "elevation-gain-quantile-0"
        };

        let col = 1;
        let row = 1;
        const allData = prevYearDates.map(date => {
          // const gridPosition = `{ 'grid-column': '${col}', 'grid-row': '${row}' }`;
          const gridPosition = `gridColumn: ${col}; gridRow: ${row}`;
          if (row % 7 === 0) {
            row = 1;
            col++;
          } else {
            row++;
          }

          const idx = data.data.findIndex(obj => obj.startDateOnly === date);
          return idx === -1
            ? { startDateOnly: date, ...noDataActivityObj, gridPosition }
            : { ...data.data[idx], gridPosition };
        });

        this.loading = false;

        this.responseData = { data: allData };
        // this.responseData = { data: [...sortedAscending] };
        // this.responseData = { data };
      } catch (err) {
        this.error = err.toString();
        // TODO: Deal with the error
      }
    })();
  }
};
</script>

<style scoped>
.response-data {
  display: grid;
  grid-template-columns: repeat(auto-fill, 53, 1fr);
  grid-template-rows: repeat(7, 1fr);
  gap: 1px;
}

.distance-quantile-0,
.distance-quantile-1,
.distance-quantile-2,
.distance-quantile-3,
.distance-quantile-4,
.distance-quantile-5 {
  height: 0.8em;
  width: 0.8em;
  /* margin-right: 0.2em;
  margin-bottom: 0.2em; */
}

.distance-quantile-0 {
  background-color: #f2f2f2;
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
