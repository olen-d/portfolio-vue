<script setup>
  import { computed, onMounted, ref } from 'vue'

  import ActivityStatisticsDropdown from '@/components/ActivityStatisticsDropdown.vue'
  import StatisticsUnitsDropdown from '@/components/StatisticsUnitsDropdown.vue'
  import LoadingIndicator from '@/components/LoadingIndicator.vue'

  const activityStatistic = ref('distance') // TODO: Set this up as a user preference. Maybe a cookie.
  const activityStatisticPastTense = ref('ridden')
  const statisticsUnits = ref({
    distance: 'mi',
    movingTime: 'elapsedTime',
    elevationGain: 'ft',
    sufferScore: 'suffering',
    averageSpeed: 'mph'
  }) // TODO: Set this up as some sort of user preference. Maybe a cookie.
  const loading = ref(false)
  const dayNames = ref(['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'])
  const monthNames = ref([])
  const responseData = ref(null)
  const error = ref (null)

  // Computed
  const averageOrTotalStatistics = computed(() => {
    return activityStatistic.value === 'averageSpeed' ? statisticValueFormat(averageSpeed.value, true) : statisticValueFormat(totalStatistics.value, true)
  })

  const showStatisticsDropdown = computed (() => {
    return activityStatistic.value !== 'movingTime' && activityStatistic.value !== 'sufferScore' ? true : false
  })

  const statistics = computed(() => {
    if (responseData.value.data) {
      if (activityStatistic.value === 'distance') {
        const statistics = responseData.value.data.map(item => {
          const {
            startDateOnly,
            distance,
            activities,
            distanceQuantile,
            gridPosition
          } = item
          const quantile = distanceQuantile.split('-')[2]
          return {
            startDateOnly,
            statisticValue: distance,
            activities,
            quantile,
            gridPosition
          }
        })
        return statistics
      } else if (activityStatistic.value === 'movingTime') {
        const statistics = responseData.value.data.map(item => {
          const {
            startDateOnly,
            movingTime,
            activities,
            movingTimeQuantile,
            gridPosition
          } = item
          const quantile = movingTimeQuantile.split('-')[3]
          return {
            startDateOnly,
            statisticValue: movingTime,
            activities,
            quantile,
            gridPosition
          }
        })
        return statistics
      } else if (activityStatistic.value === 'elevationGain') {
        const statistics = responseData.value.data.map(item => {
          const {
            startDateOnly,
            elevationGain,
            activities,
            elevationGainQuantile,
            gridPosition
          } = item
          const quantile = elevationGainQuantile.split('-')[3]
          return {
            startDateOnly,
            statisticValue: elevationGain,
            activities,
            quantile,
            gridPosition
          }
        })
        return statistics
      } else if (activityStatistic.value === 'sufferScore') {
        const statistics = responseData.value.data.map(item => {
          const {
            startDateOnly,
            sufferScore,
            activities,
            sufferScoreQuantile,
            gridPosition
          } = item
          const quantile = sufferScoreQuantile.split('-')[3]
          return {
            startDateOnly,
            statisticValue: sufferScore,
            activities,
            quantile,
            gridPosition
          }
        })
        return statistics
      } else if (activityStatistic.value === 'averageSpeed') {
        const statistics = responseData.value.data.map(item => {
          const {
            startDateOnly,
            averageSpeed,
            activities,
            averageSpeedQuantile,
            gridPosition
          } = item
          const quantile = averageSpeedQuantile.split('-')[3]
          return {
            startDateOnly,
            statisticValue: averageSpeed,
            activities,
            quantile,
            gridPosition
          }
        })
        return statistics
      }
      return 0
    } else {
      return 0
    }
  })

  const totalStatistics = computed(() => {
    if (responseData.value.data) {
      const totalStatistic = responseData.value.data.reduce(
        (accumulator, activity) => {
          return (
            parseFloat(accumulator) + parseFloat(activity[activityStatistic.value])
          )
        },
        [0]
      )
      return totalStatistic
    } else {
      return 0
    }
  })

  const averageSpeed = computed(() => {
    if (responseData.value.data) {
      const totals = responseData.value.data.reduce((accumulator, activity) => {
        accumulator['totalDistance'] =
          parseFloat(accumulator['totalDistance'] || 0) +
          parseFloat(activity['distance'])
        accumulator['totalMovingTime'] =
          parseFloat(accumulator['totalMovingTime'] || 0) +
          parseFloat(activity['movingTime'])
        return accumulator
      }, {})

      const { totalDistance, totalMovingTime } = totals

      return totalDistance / totalMovingTime
    } else {
      return 0
    }
  })

  // Functions
  const popupDateFormat = originalDate => {
    const dateComponents = originalDate.split('-')
    const [y, m, d] = dateComponents
    const dtf = new Date(Date.UTC(y, m - 1, d, 12)) // TODO - 12 is a hack to fix an edge case on the first day of the month. Refactor to address timezones in the future.
    const shortMonth = dtf.toLocaleString('en-us', { month: 'short' })
    const day = dtf.getUTCDate()
    const fullYear = dtf.getUTCFullYear()
    return `${shortMonth} ${day}, ${fullYear}`
  }

  const statisticValueFormat = (originalStatisticValue, valueOnly) => {
    let units = ''
    let statisticsConverted = 0

    const statisticsUnitsToConvert = statisticsUnits.value[activityStatistic.value]
    switch (statisticsUnitsToConvert) {
      case 'ft':
        units = 'feet'
        statisticsConverted = Math.round(originalStatisticValue * 3.28084)
        break
      case 'mi':
        units = 'miles'
        statisticsConverted = Math.round(
          originalStatisticValue * 0.000621371
        )
        break
      case 'km':
        units = 'kilometers'
        statisticsConverted = Math.round(originalStatisticValue / 1000)
        break
      case 'elapsedTime': {
        const decimalHours = originalStatisticValue / 3600
        if (decimalHours >= 1) {
          const hours = Math.floor(decimalHours)
          const hoursText = hours !== 1 ? 'hours' : 'hour'
          const minutes = Math.round((decimalHours - hours) * 60)
          const minutesFormatted = minutes > 0 ? `and ${minutes} minutes` : null
          statisticsConverted = `${hours} ${hoursText} ${minutesFormatted}`
        } else {
          statisticsConverted = Math.round(originalStatisticValue / 60) + ' minutes'
        }
        break
      }
      case 'suffering':
        units = 'suffering units'
        statisticsConverted = Math.round(originalStatisticValue)
        break
      case 'mph':
        units = 'miles per hour'
        statisticsConverted = Math.round(originalStatisticValue * 2.23694 * 10) / 10
        break
      case 'kph':
        units = 'kilometers per hour'
        statisticsConverted =
          Math.round(originalStatisticValue * 3.6 * 10) / 10
        break
      default:
        units = 'meters'
        statisticsConverted = Math.round(originalStatisticValue)
    }
    if (valueOnly) {
      units = ''
    }
    return originalStatisticValue > 0
      ? `${statisticsConverted.toLocaleString()} ${units}`
      : 'No rides'
  }

  const useActivityStatistics = eventValues => {
    [activityStatistic.value, activityStatisticPastTense.value ] = eventValues
  }

  const useStatisticsUnits = statisticsUnit => {
    statisticsUnits.value[activityStatistic.value] = statisticsUnit
  }

 onMounted(() => {
  loading.value = true;
  (async () => {
    try {
      const response = await fetch(
        `${
          import.meta.env.VITE_API_BASE_URL
        }/api/strava/process/activities/rides`
      )
      const { data } = await response.json()

      if (data.length === undefined || data.length < 1) {
        error.value = 'No rides were found. '
        loading.value = false
        return
      }

      // const sortedAscending = data.data.sort((a, b) =>
      //   a.startDateOnly > b.startDateOnly ? 1 : -1
      // );
      const dts = new Date()
      const dow = dts.getDay()
      const futureDays = 7 - dow
      const totalDays = 370 - futureDays

      dts.setDate(dts.getDate() - totalDays)

      const dte = new Date()

      const allDates = (startDate, endDate) => {
        const dates = []

        for (
          dates, startDate;
          startDate <= endDate;
          startDate.setDate(startDate.getDate() + 1)
        ) {
          dates.push(
            startDate.getFullYear() +
              '-' +
              ('0' + (startDate.getMonth() + 1)).slice(-2) +
              '-' +
              ('0' + startDate.getDate()).slice(-2)
          )
        }
        return dates
      }

      const prevYearDates = allDates(dts, dte)

      const noDataActivityObj = {
        distance: 0,
        movingTime: 0,
        elevationGain: 0,
        sufferScore: 0,
        averageSpeed: 0,
        activities: 0,
        distanceQuantile: 'distance-quantile-0',
        movingTimeQuantile: 'moving-time-quantile-0',
        elevationGainQuantile: 'elevation-gain-quantile-0',
        sufferScoreQuantile: 'suffer-score-quantile-0',
        averageSpeedQuantile: 'average-speed-quantile-0'
      };

      let col = 2
      let row = 2
      let lastMonthShort = dts.toLocaleString('en-us', { month: 'short' })
      monthNames.value.push({
        id: 0,
        monthShortName: lastMonthShort,
        gridPosition: 'grid-column: 2 / 4; grid-row: 1'
      })
      const allData = prevYearDates.map(date => {
        const gridPosition = `grid-column: ${col}; grid-row: ${row}`
        const currentMonthShort = new Date(date).toLocaleString('en-us', {
          month: 'short'
        })
        if (lastMonthShort !== currentMonthShort) {
          const nextMonthId = monthNames.value.length
          monthNames.value.push({
            id: nextMonthId,
            monthShortName: currentMonthShort,
            gridPosition: `grid-column: ${col} / ${col + 2}; grid-row: 1`
          })
          lastMonthShort = currentMonthShort;
        }
        if (row % 8 === 0) {
          row = 2
          col++
        } else {
          row++
        }

        const idx = data.findIndex(obj => obj.startDateOnly === date)
        return idx === -1
          ? { startDateOnly: date, ...noDataActivityObj, gridPosition }
          : { ...data[idx], gridPosition }
      });

      loading.value = false;

      responseData.value = { data: allData }
      // this.responseData = { data: [...sortedAscending] }
      // this.responseData = { data }
    } catch (err) {
      error.value = err.toString()
      loading.value = false
      // TODO: Deal with the error
    }
  })();
})
</script>

<template>
  <div class="activity-graph-strava">
    <div class="row">
      <div class="one column">
        &nbsp;
      </div>
      <div class="ten columns">
        <div class="activity-graph-wrapper">
          <LoadingIndicator :loading="loading" :error="error" />
          <div v-if="responseData" class="annual-total">
            <p>
              <span class="emphasis">
                {{ averageOrTotalStatistics }}
              </span>
              <StatisticsUnitsDropdown
                v-if="showStatisticsDropdown"
                :activityStatistic="activityStatistic"
                :defaultStatisticUnit="statisticsUnits[activityStatistic]"
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
            <div class="activity-graph-legend">
              <p class="legend-text">Less</p>
              <div class="distance-quantile-legend-1"></div>
              <div class="distance-quantile-legend-2"></div>
              <div class="distance-quantile-legend-3"></div>
              <div class="distance-quantile-legend-4"></div>
              <div class="distance-quantile-legend-5"></div>
              <p class="legend-text">More</p>
            </div>
          </div>
          <div v-if="responseData" class="activity-statistics-dropdown">
            Show:&nbsp;
            <ActivityStatisticsDropdown
              :defaultOptions="[
                { _id: 'distance', name: 'distance' },
                { _id: 'movingTime', name: 'moving time' },
                { _id: 'elevationGain', name: 'elevation' },
                { _id: 'sufferScore', name: 'suffer score' },
                { _id: 'averageSpeed', name: 'average speed' }
              ]"
              :defaultActivityStatisticPastTenses="{
                distance: 'ridden',
                movingTime: 'riding',
                elevationGain: 'climbed',
                sufferScore: 'total suffering',
                averageSpeed: 'average speed'
              }"
              :defaultActivityStatistic="activityStatistic"
              @use-activity-statistics="useActivityStatistics"
            />
          </div>
        </div>
      </div>
      <div class="one column">
        &nbsp;
      </div>
    </div>
  </div>
</template>

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
}

.activity-graph-legend {
  --activity-graph-legend-square-width: 11px;
  --activity-graph-legend-square-height: 11px;
  padding-top: 0.5rem;
  grid-column: 42 / 55;
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

.activity-graph-strava {
  padding-bottom: 8rem;
}
</style>
