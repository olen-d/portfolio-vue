<script setup>
  import { computed, onMounted, ref, watch } from 'vue'

  const emits = defineEmits(['useStatisticsUnits'])
  const props = defineProps({
    activityStatistic: {
      type: String
    },
    defaultStatisticUnit: {
      type: String
    }
  })

  const statisticsUnit = ref('')

  onMounted(() => {
    statisticsUnit.value = props.defaultStatisticUnit
  })

  const statisticsUnitsOptions = computed(() => {
    if (props.activityStatistic === "distance") {
      return [
        { _id: "mi", name: "miles" },
        { _id: "km", name: "kilometers" }
      ];
    } else if (props.activityStatistic === "movingTime") {
      return [{ _id: "elapsedTime", name: "elapsed time " }];
    } else if (props.activityStatistic === "elevationGain") {
      return [{ _id: "ft", name: "feet" }, { _id: "m", name: "meters" }];
    } else if (props.activityStatistic === "sufferScore") {
      return [{ _id: "suffering", name: "suffering units" }];
    } else if (props.activityStatistic === "averageSpeed") {
      return [
        { _id: "mph", name: "miles per hour" },
        { _id: "kph", name: "kilometers per hour" }
      ];
    } else {
      return "error"
    }
  })

  const onChange = () => {
    emits('useStatisticsUnits', statisticsUnit.value)
  }
  watch(() => props.updatedLinkData, (newUpdatedLinkData, prevUpdatedLinkData) => {
    if (newUpdatedLinkData !== prevUpdatedLinkData) {
      updateSocial()
    }
  })

  // Force the units to change when the prop is changed in the parent.
  watch(() => props.defaultStatisticUnit, (newDefaultStatisticUnit, prevDefaultStatisticUnit) => {
    if (newDefaultStatisticUnit !== prevDefaultStatisticUnit) {
      statisticsUnit.value = props.defaultStatisticUnit
    }
  })
</script>

<template>
  <span class="statistics-units">
    &nbsp;
    <select name="statistics-units" v-model="statisticsUnit" @change="onChange">
      <option
        v-for="{ _id, name } in statisticsUnitsOptions"
        :key="_id"
        :value="_id"
      >
        {{ name }}
      </option>
    </select>
    &nbsp;
  </span>
</template>
