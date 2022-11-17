<script setup>
  import { onMounted, ref } from 'vue'

  const emits = defineEmits(['useActivityStatistics'])
  const props = defineProps({
    defaultActivityStatistic: {
      type: String
    },
    defaultActivityStatisticPastTenses: {
      type: Object
    },
    defaultOptions: {
      type: Array
    }
  })

  const activityStatistic = ref('')
  const activityStatistics = ref([])
  const activityStatisticPastTenses = ref({})

  onMounted(() => {
    activityStatistic.value = props.defaultActivityStatistic
    activityStatistics.value = props.defaultOptions
    activityStatisticPastTenses.value = props.defaultActivityStatisticPastTenses
  })

  const onChange = () => {
    const eventValues = [
      activityStatistic.value,
      activityStatisticPastTenses.value[activityStatistic.value]
    ]
    emits('useActivityStatistics', eventValues)
  }
</script>

<template>
  <select
    name="activity-statistics"
    v-model="activityStatistic"
    @change="onChange"
  >
    <option v-for="{ _id, name } in activityStatistics" :key="_id" :value="_id">
      {{ name }}
    </option>
  </select>
</template>
