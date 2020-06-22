<template>
  <div class="activity-graph-wrapper">
    <LoadingIndicator v-bind:loading="loading" b-bind:error="error" />
    <div v-if="responseData" class="response-data">
      <div
        v-for="{ id, monthShortName, gridPosition } in monthNames"
        :key="id"
        class="month-name-text"
        :style="gridPosition"
      >
        {{ monthShortName }}
      </div>
      <div
        v-for="(day, index) in dayNames"
        :key="day"
        class="day-name-text"
        :style="`grid-column: 1; grid-row: ${index + 2}`"
      >
        <p>
          {{ day }}
        </p>
      </div>
      <div
        v-for="{
          activities,
          distance,
          startDateOnly,
          distanceQuantile,
          gridPosition
        } in responseData.data"
        :key="startDateOnly"
        :class="[distanceQuantile, 'tooltip']"
        :style="gridPosition"
        :data-activities="activities"
        :data-date="popupDateFormat(startDateOnly)"
        :data-distance="distance"
      >
        <span class="tooltip-text">{{ distance }} on {{ popupDateFormat(startDateOnly) }}</span>
      </div>
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
      dayNames: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      monthNames: [],
      responseData: null,
      error: null
    };
  },

  methods: {
    popupDateFormat: originalDate => {
      const dtf = new Date(originalDate);
      const shortMonth = dtf.toLocaleString("en-us", { month: "short" });
      const day = dtf.getUTCDate();
      const fullYear = dtf.getFullYear();
      return `${shortMonth} ${day}, ${fullYear}`;
    }
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
        const dow = dts.getUTCDay();
        const futureDays = 7 - dow;
        const totalDays = 370 - futureDays;

        dts.setDate(dts.getDate() - totalDays);

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
          activities: 0,
          distanceQuantile: "distance-quantile-0",
          elevationGainQuantile: "elevation-gain-quantile-0"
        };

        let col = 2;
        let row = 2;
        let lastMonthShort = dts.toLocaleString("en-us", { month: "short" });
        this.monthNames.push({
          id: 0,
          monthShortName: lastMonthShort,
          gridPosition: "gridColumn: 2 / 4; gridRow: 1"
        });
        const allData = prevYearDates.map(date => {
          const gridPosition = `gridColumn: ${col}; gridRow: ${row}`;
          const currentMonthShort = new Date(date).toLocaleString("en-us", {
            month: "short"
          });
          if (lastMonthShort !== currentMonthShort) {
            const nextMonthId = this.monthNames.length;
            this.monthNames.push({
              id: nextMonthId,
              monthShortName: currentMonthShort,
              gridPosition: `gridColumn: ${col} / ${col + 2}; gridRow: 1`
            });
            lastMonthShort = currentMonthShort;
          }
          if (row % 8 === 0) {
            row = 2;
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
  --activity-graph-day-of-week-width: 22px;
  --activity-graph-square-width: 11px;
  --activity-graph-square-height: 11px;
  --activity-graph-gap: 1px;
  --activity-graph-squares-width: calc(var(--activity-graph-square-width) * 53);
  --activity-graph-gaps: calc(var(--activity-graph-gap) * 52);
  width: calc(
    var(--activity-graph-day-of-week-width) +
      var(--activity-graph-squares-width) + var(--activity-graph-gaps)
  );
  display: grid;
  grid-template-columns: var(--activity-graph-day-of-week-width) repeat(auto-fill, 53, 1fr);
  grid-template-rows: repeat(8, 1fr);
  gap: var(--activity-graph-gap);
  /* align-items: center; */
}

.distance-quantile-0,
.distance-quantile-1,
.distance-quantile-2,
.distance-quantile-3,
.distance-quantile-4,
.distance-quantile-5 {
  width: var(--activity-graph-square-width);
  height: var(--activity-graph-square-height);
  /* margin-right: 0.2em;
  margin-bottom: 0.2em; */
}

.day-name-text {
  width: var(--activity-graph-day-of-week-width);
  margin: 0px;
  padding: 0px;
  /* background-color: #f00; */
}

.month-name-text {
  margin: 0px;
  padding: 0px;
}

.day-name-text p,
.month-name-text {
  margin: 0px;
  padding: 0px;
  font-size: 8px;
  text-transform: uppercase;
}

.distance-quantile-0 {
  background-color: #ffcc88;
  /* background-color: #f2f2f2; */
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
