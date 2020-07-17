<template>
  <div class="activity-graph-wrapper">
    <LoadingIndicator v-bind:loading="loading" b-bind:error="error" />
    <div v-if="responseData" class="annual-total">
      <p>
        <span class="emphasis">
          {{ averageOrTotalStatistics }}
        </span>
        <StatisticsUnitsDropdown
          v-if="showStatisticsDropdown"
          v-bind:activityStatistic="activityStatistic"
          v-bind:defaultStatisticUnit="statisticsUnits[activityStatistic]"
          @use-statistics-units="useStatisticsUnits"
        />
        {{ activityStatisticPastTense }} in the past year
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
          gridPosition,
          quantile,
          startDateOnly,
          statisticValue
        } in statistics"
        :key="startDateOnly"
        :class="[`quantile-${quantile}`, 'tooltip']"
        :style="gridPosition"
      >
        <span class="tooltip-text">
          {{ statisticValueFormat(statisticValue, false) }} on
          {{ popupDateFormat(startDateOnly) }}
        </span>
      </div>
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
    <div v-if="responseData" class="activity-statistics-dropdown">
      Show:&nbsp;
      <ActivityStatisticsDropdown
        v-bind:defaultOptions="[
          { _id: 'distance', name: 'distance' },
          { _id: 'movingTime', name: 'moving time' },
          { _id: 'elevationGain', name: 'elevation' },
          { _id: 'sufferScore', name: 'suffer score' },
          { _id: 'averageSpeed', name: 'average speed' }
        ]"
        v-bind:defaultActivityStatisticPastTenses="{
          distance: 'ridden',
          movingTime: 'riding',
          elevationGain: 'climbed',
          sufferScore: 'total suffering',
          averageSpeed: 'average speed'
        }"
        v-bind:defaultActivityStatistic="activityStatistic"
        @use-activity-statistics="useActivityStatistics"
      />
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
      activityStatisticPastTense: "ridden",
      statisticsUnits: {
        distance: "mi",
        movingTime: "elapsedTime",
        elevationGain: "ft",
        sufferScore: "suffering",
        averageSpeed: "mph"
      }, // TODO: Set this up as some sort of user preference. Maybe a cookie.
      loading: false,
      dayNames: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      monthNames: [],
      responseData: null,
      error: null
    };
  },

  computed: {
    averageOrTotalStatistics: function() {
      const { averageSpeed, activityStatistic, statisticValueFormat, totalStatistics } = this;

      return activityStatistic === "averageSpeed" ? statisticValueFormat(averageSpeed, true) : statisticValueFormat(totalStatistics, true) ;
    },

    showStatisticsDropdown: function() {
      const { activityStatistic } = this;

      // eslint-disable-next-line prettier/prettier
      return activityStatistic !== "movingTime" && activityStatistic !== "sufferScore" ? true : false;
    },

    statistics: function() {
      if (this.responseData) {
        const {
          activityStatistic,
          responseData: { data }
        } = this;
        if (activityStatistic === "distance") {
          const statistics = data.map(item => {
            const {
              startDateOnly,
              distance,
              activities,
              distanceQuantile,
              gridPosition
            } = item;
            const quantile = distanceQuantile.split("-")[2];
            return {
              startDateOnly,
              statisticValue: distance,
              activities,
              quantile,
              gridPosition
            };
          });
          return statistics;
        } else if (activityStatistic === "movingTime") {
          const statistics = data.map(item => {
            const {
              startDateOnly,
              movingTime,
              activities,
              movingTimeQuantile,
              gridPosition
            } = item;
            const quantile = movingTimeQuantile.split("-")[3];
            return {
              startDateOnly,
              statisticValue: movingTime,
              activities,
              quantile,
              gridPosition
            };
          });
          return statistics;
        } else if (activityStatistic === "elevationGain") {
          const statistics = data.map(item => {
            const {
              startDateOnly,
              elevationGain,
              activities,
              elevationGainQuantile,
              gridPosition
            } = item;
            const quantile = elevationGainQuantile.split("-")[3];
            return {
              startDateOnly,
              statisticValue: elevationGain,
              activities,
              quantile,
              gridPosition
            };
          });
          return statistics;
        } else if (activityStatistic === "sufferScore") {
          const statistics = data.map(item => {
            const {
              startDateOnly,
              sufferScore,
              activities,
              sufferScoreQuantile,
              gridPosition
            } = item;
            const quantile = sufferScoreQuantile.split("-")[3];
            return {
              startDateOnly,
              statisticValue: sufferScore,
              activities,
              quantile,
              gridPosition
            };
          });
          return statistics;
        } else if (activityStatistic === "averageSpeed") {
          const statistics = data.map(item => {
            const {
              startDateOnly,
              averageSpeed,
              activities,
              averageSpeedQuantile,
              gridPosition
            } = item;
            const quantile = averageSpeedQuantile.split("-")[3];
            return {
              startDateOnly,
              statisticValue: averageSpeed,
              activities,
              quantile,
              gridPosition
            };
          });
          return statistics;
        }
        return 0;
      } else {
        return 0;
      }
    },

    totalStatistics: function() {
      if (this.responseData) {
        const {
          activityStatistic,
          responseData: { data }
        } = this;

        const totalStatistic = data.reduce(
          (accumulator, activity) => {
            return (
              parseFloat(accumulator) + parseFloat(activity[activityStatistic])
            );
          },
          [0]
        );
        return totalStatistic;
      } else {
        return 0;
      }
    },

    averageSpeed: function() {
      if (this.responseData) {
        const {
          responseData: { data }
        } = this;

        const totals = data.reduce((accumulator, activity) => {
          accumulator["totalDistance"] =
            parseFloat(accumulator["totalDistance"] || 0) +
            parseFloat(activity["distance"]);
          accumulator["totalMovingTime"] =
            parseFloat(accumulator["totalMovingTime"] || 0) +
            parseFloat(activity["movingTime"]);
          return accumulator;
        }, {});

        const { totalDistance, totalMovingTime } = totals;

        return totalDistance / totalMovingTime;
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

    statisticValueFormat(originalStatisticValue, valueOnly) {
      let units = "";
      let statisticsConverted = 0;

      const { activityStatistic, statisticsUnits } = this;
      const statisticsUnitsToConvert = statisticsUnits[activityStatistic];

      switch (statisticsUnitsToConvert) {
        case "ft":
          units = "feet";
          statisticsConverted = Math.round(originalStatisticValue * 3.28084);
          break;
        case "mi":
          units = "miles";
          statisticsConverted = Math.round(
            originalStatisticValue * 0.000621371
          );
          break;
        case "km":
          units = "kilometers";
          statisticsConverted = Math.round(originalStatisticValue / 1000);
          break;
        case "elapsedTime": {
          const decimalHours = originalStatisticValue / 3600;
          if (decimalHours >= 1) {
            const hours = Math.floor(decimalHours);
            const hoursText = hours !== 1 ? "hours" : "hour";
            const minutes = Math.round((decimalHours - hours) * 60)
            const minutesFormatted = minutes > 0 ? `and ${minutes} minutes` : null;
            statisticsConverted = `${hours} ${hoursText} ${minutesFormatted}`;
          } else {
            statisticsConverted = Math.round(originalStatisticValue / 60) + " minutes";
          }
          break;
        }
        case "suffering":
          units = "suffering units";
          statisticsConverted = Math.round(originalStatisticValue);
          break;
        case "mph":
          units = "miles per hour";
          statisticsConverted = Math.round(originalStatisticValue * 2.23694 * 10) / 10;
          break;
        case "kph":
          units = "kilometers per hour";
          statisticsConverted =
            Math.round(originalStatisticValue * 3.6 * 10) / 10;
          break;
        default:
          units = "meters";
          statisticsConverted = Math.round(originalStatisticValue);
      }
      if (valueOnly) {
        units = "";
      }
      return originalStatisticValue > 0
        ? `${statisticsConverted.toLocaleString()} ${units}`
        : "No rides ";
    },

    useActivityStatistics(eventValues) {
      [this.activityStatistic, this.activityStatisticPastTense] = eventValues;
    },

    useStatisticsUnits(statisticsUnit) {
      const { activityStatistic } = this;
      this.statisticsUnits[activityStatistic] = statisticsUnit;
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
            dates.push(
              startDate.getFullYear() +
                "-" +
                ("0" + (startDate.getMonth() + 1)).slice(-2) +
                "-" +
                ("0" + startDate.getDate()).slice(-2)
            );
          }
          return dates;
        };

        const prevYearDates = allDates(dts, dte);

        const noDataActivityObj = {
          distance: 0,
          movingTime: 0,
          elevationGain: 0,
          sufferScore: 0,
          averageSpeed: 0,
          activities: 0,
          distanceQuantile: "distance-quantile-0",
          movingTimeQuantile: "moving-time-quantile-0",
          elevationGainQuantile: "elevation-gain-quantile-0",
          sufferScoreQuantile: "suffer-score-quantile-0",
          averageSpeedQuantile: "average-speed-quantile-0"
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
  --activity-graph-legend-items: calc(var(--activity-graph-legend-square-width) * 5);
  width: calc(var(--activity-graph-legend-items) + 100px);
  padding-top: 1rem;
  display: grid;
  justify-items: end;
  grid-template-columns: 2fr repeat(5, 1fr) 2fr;
  grid-template-rows: 1fr;
  /* background-color: #ff0; */
}

.activity-graph-legend p {
  display: inline-block;
  margin: 0px 5px 0px 5px;
  padding: 0px;
  font-size: 11px;
  text-transform: uppercase;
}

.activity-statistics-dropdown {
  padding-top: 2rem;
}

.emphasis {
  font-size: 120%;
  /* font-weight: 600; */
  /* letter-spacing: 0.1rem; */
}

.quantile-0,
.quantile-1,
.quantile-2,
.quantile-3,
.quantile-4,
.quantile-5 {
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

.quantile-0,
.distance-quantile-legend-0 {
  /* background-color: #ffffff; */
  /* background-color: #f2f2f2; */
  background-color: #fef4d0;
}

.quantile-1,
.distance-quantile-legend-1 {
  background-color: #d0e1eb;
}

.quantile-2,
.distance-quantile-legend-2 {
  background-color: #b8d2e1;
}

.quantile-3,
.distance-quantile-legend-3 {
  background-color: #a1c3d7;
}

.quantile-4,
.distance-quantile-legend-4 {
  background-color: #71a6c3;
}

.quantile-5,
.distance-quantile-legend-5 {
  background-color: #4288af;
}
</style>
