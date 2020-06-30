<template>
  <div class="activity-graph-wrapper">
    <LoadingIndicator v-bind:loading="loading" b-bind:error="error" />
    <div v-if="responseData" class="annual-total">
      <p>
        {{ totalStatisticsFormatted }}
        <StatisticsUnitsDropdown
          v-bind:activityStatistic="activityStatistic"
          @use-statistics-units="useStatisticsUnits"
        />
        ridden in the past year
      </p>
    </div>
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
      >
        <span class="tooltip-text">
          {{ popupDistanceFormat(distance) }} on
          {{ popupDateFormat(startDateOnly) }}
        </span>
      </div>
    </div>
    <div v-if="responseData">
      <ActivityStatisticsDropdown
        v-bind:defaultOptions="[
          { _id: 'distance', name: 'distance' },
          { _id: 'elevationGain', name: 'elevation' }
        ]"
        v-bind:defaultActivityStatistic="activityStatistic"
        @use-activity-statistics="useActivityStatistics"
      />
    </div>
    <div v-if="responseData" class="activity-graph-legend">
      <p class="legend-text">Less</p>
      <div class="distance-quantile-legend-1"></div>
      <div class="distance-quantile-legend-2"></div>
      <div class="distance-quantile-legend-3"></div>
      <div class="distance-quantile-legend-4"></div>
      <div class="distance-quantile-legend-5"></div>
      <p class="legend-text">More</p>
    </div>
    <!-- <pre>{{ responseData }}</pre> -->
  </div>
</template>

<script>
import ActivityStatisticsDropdown from "./ActivityStatisticsDropdown.vue";
import StatisticsUnitsDropdown from "./StatisticsUnitsDropdown.vue";
import LoadingIndicator from "./LoadingIndicator.vue";

export default {
  components: {
    ActivityStatisticsDropdown,
    LoadingIndicator,
    StatisticsUnitsDropdown
  },

  data: () => {
    return {
      activityStatistic: "distance", // TODO: Set this up as a user preference. Maybe a cookie.
      statisticsUnits: "mi", // TODO: Set this up as some sort of user preference. Maybe a cookie.
      loading: false,
      dayNames: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      monthNames: [],
      responseData: null,
      error: null
    };
  },

  computed: {
    totalStatistics: function() {
      if (this.responseData) {
        const {
          activityStatistic,
          responseData: { data }
        } = this;

        const totalDistance = data.reduce(
          (accumulator, activity) => {
            return (
              parseFloat(accumulator) + parseFloat(activity[activityStatistic])
            );
          },
          [0]
        );
        return totalDistance;
      } else {
        return 0;
      }
    },

    totalStatisticsFormatted: function() {
      if (this.totalStatistics > 0) {
        const { statisticsUnits, totalStatistics } = this;

        let statisticsConverted = "";

        switch (statisticsUnits) {
          case "ft":
            statisticsConverted = Math.round(totalStatistics * 3.28084);
            break;
          case "m":
            statisticsConverted = Math.round(totalStatistics);
            break;
          case "mi":
            statisticsConverted = Math.round(totalStatistics * 0.000621371);
            break;
          case "km":
            statisticsConverted = Math.round(totalStatistics / 1000);
            break;
          default:
            return 0;
        }
        return statisticsConverted.toLocaleString();
      } else {
        return 0;
      }
    }
  },

  methods: {
    popupDateFormat: originalDate => {
      const dateComponents = originalDate.split("-");
      const [y, m, d] = dateComponents;
      const dtf = new Date(Date.UTC(y, m - 1, d, 12)); // TODO - 12 is a hack to fix an edge case on the first day of the month. Refactor to address timezones in the future.
      const shortMonth = dtf.toLocaleString("en-us", { month: "short" });
      const day = dtf.getUTCDate();
      const fullYear = dtf.getUTCFullYear();
      return `${shortMonth} ${day}, ${fullYear}`;
    },

    popupDistanceFormat(originalDistance) {
      let units = "";
      let convertedDistance = 0;

      switch (this.statisticsUnits) {
        case "mi":
          units = "miles";
          convertedDistance = Math.round(originalDistance * 0.000621371);
          break;
        case "km":
          units = "kilometers";
          convertedDistance = Math.round(originalDistance / 1000);
          break;
        default:
          units = "meters";
          convertedDistance = Math.round(originalDistance);
      }
      // eslint-disable-next-line prettier/prettier
      return originalDistance > 0 ? `${convertedDistance.toLocaleString()} ${units}` : "No rides ";
    },

    useActivityStatistics(activityStatistic) {
      this.activityStatistic = activityStatistic;
    },

    useStatisticsUnits(statisticsUnit) {
      this.statisticsUnits = statisticsUnit;
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
        // const sortedAscending = data.data.sort((a, b) =>
        //   a.startDateOnly > b.startDateOnly ? 1 : -1
        // );
        const dts = new Date();
        const dow = dts.getDay();
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
.annual-total {
  padding-bottom: 1rem;
}

.annual-total p {
  margin: 0px;
}

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
  grid-template-columns: var(--activity-graph-day-of-week-width) repeat(
      auto-fill,
      53,
      1fr
    );
  grid-template-rows: repeat(8, 1fr);
  gap: var(--activity-graph-gap);
  /* align-items: center; */
}

.activity-graph-legend {
  --activity-graph-legend-square-width: 11px;
  --activity-graph-legend-square-height: 11px;
}

.activity-graph-legend p {
  display: inline-block;
  margin: 0px 5px 0px 5px;
  padding: 0px;
  font-size: 11px;
  text-transform: uppercase;
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

.distance-quantile-legend-0,
.distance-quantile-legend-1,
.distance-quantile-legend-2,
.distance-quantile-legend-3,
.distance-quantile-legend-4,
.distance-quantile-legend-5 {
  display: inline-block;
  width: var(--activity-graph-legend-square-width);
  height: var(--activity-graph-legend-square-height);
  margin-left: 3px;
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

.distance-quantile-0,
.distance-quantile-legend-0 {
  background-color: #ffcc88;
  /* background-color: #f2f2f2; */
}

.distance-quantile-1,
.distance-quantile-legend-1 {
  background-color: #d0e1eb;
}

.distance-quantile-2,
.distance-quantile-legend-2 {
  background-color: #b8d2e1;
}

.distance-quantile-3,
.distance-quantile-legend-3 {
  background-color: #a1c3d7;
}

.distance-quantile-4,
.distance-quantile-legend-4 {
  background-color: #71a6c3;
}

.distance-quantile-5,
.distance-quantile-legend-5 {
  background-color: #4288af;
}
</style>
